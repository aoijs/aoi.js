const os = require("os");
const fs = require("fs");
const ytdl = require("ytdl-core");
const prism = require("prism-media");
const scdl = require("soundcloud-downloader/dist/download-media").default;
const { Transform } = require("stream");

//Better FFmpegArgs™️
const FFMPEG_ARGS = [
  "-analyzeduration",
  "0",
  "-loglevel",
  "0",
  "-preset",
  "veryfast",
  "-f",
  "s16le",
  "-ar",
  "48000",
  "-ac",
  "2",
  "-vn",
];
const HIGHWATERMARK = 8192;

async function youtube(url, cookie, ffmpegArgs, song) {
  function filter(format) {
    return (
      format.codecs === "opus" &&
      format.container === "webm" &&
      format.audioSampleRate == 48000
    );
  }

  //Choose Medium
  function chooseFormat(sourceFormats, isLive) {
    let filter = (format) => format.audioBitrate;

    if (isLive) filter = (format) => format.audioBitrate && format.isHLS;

    const formats = sourceFormats
      .filter(filter)
      .sort((a, b) => a.audioBitrate - b.audioBitrate)
      .sort((a, b) => a.audioSampleRate - b.audioSampleRate)
      .sort((a, b) => a.audioChannels - b.audioChannels);

    const filteredFormat = formats.filter((format) => !format.bitrate);

    const format = filteredFormat.length
      ? filteredFormat[Math.floor(filteredFormat.length / 3)] ||
        filteredFormat[Math.floor(filteredFormat.length) / 2] ||
        filteredFormat[1] ||
        filteredFormat[0]
      : formats[Math.floor(formats.length / 3)] ||
        formats[Math.floor(formats.length / 2)] ||
        formats[1] ||
        formats[0];

    return format;
  }

  const options = {
    highWatermark: HIGHWATERMARK,
    dlChunkSize: 1 << 20,
    requestOptions: {
      headers: {
        cookie: cookie,
        "user-agent":
          "Mozilla/5.0 (compatible; Googlebot/2.1; +http://www.google.com/bot.html) (dbd.js; https://www.npmjs.com/package/dbd.js)",
      },
    },
  };

  let info;

  if (!song.info) {
    info = await ytdl.getInfo(url, options);

    info = {
      full: true,
      formats: info.formats,
      player_response: info.player_response,
      live_chunk_readahead: info.live_chunk_readahead,
    };
  } else info = song.info;

  const formats = info.formats
    .filter(filter)
    .sort((a, b) => a.audioBitrate - b.audioBitrate);

  let format =
    formats[Math.floor(formats.length / 3)] ||
    formats[Math.floor(formats.length / 2)] ||
    formats[1] ||
    formats[0];

  const canDemux = format && !info.player_response.videoDetails.isLiveContent;

  if (
    !info.player_response.videoDetails.isLiveContent &&
    require("os").freemem() / 1024 / 1024 > 100
  )
    song.info = info;

  if (canDemux && (ffmpegArgs ? !ffmpegArgs.filter : 1)) {
    options.format = format;

    const audio = ytdl.downloadFromInfo(info, options);
    const demuxer = new prism.opus.WebmDemuxer({
      highWaterMark: HIGHWATERMARK,
    });

    const streams = {
      input: new prism.opus.Decoder({
        rate: 48000,
        channels: 2,
        frameSize: 960,
        highWatermark: HIGHWATERMARK,
      }),
      volume: new prism.VolumeTransformer({
        type: "s16le",
        volume: 1,
        highWatermark: HIGHWATERMARK,
      }),
      opus: new prism.opus.Encoder({
        rate: 48000,
        channels: 2,
        frameSize: 960,
        highWatermark: HIGHWATERMARK,
      }),
      seek: ffmpegArgs ? ffmpegArgs.seek || 0 : 0,
    };

    audio.on("error", (error) => {
      streams.input.emit("error", error);
    });
    demuxer.on("error", (error) => {
      streams.input.emit("error", error);
    });

    const lines = [audio, demuxer, streams.input, streams.volume, streams.opus];

    if (ffmpegArgs && ffmpegArgs.seek) {
      const seekable = new Seekable({
        time: ffmpegArgs.seek,
        rate: 48000,
        depth: 16,
        channels: 2,
        highWatermark: HIGHWATERMARK,
      });

      streams.seekable = seekable;

      lines.splice(3, 0, seekable);
    }

    require("stream").pipeline(...lines, (error) => {
      if (error) {
        streams.input.emit("error", error);
      }
    });

    streams.opus.once("close", () => {
      for (const line of lines) line.destroy();
    });

    return streams;
  }

  if (!canDemux)
    format = chooseFormat(
      info.formats,
      info.player_response.videoDetails.isLiveContent
    );

  if (!format) {
    const stream = new (require("stream").Readable)({
      read: () => {},
    });

    setImmediate(() => stream.push(null));

    return {
      opus: stream,
    };
  }

  options.format = format;

  const thread = await _getThreads();
  const args = [...FFMPEG_ARGS];

  args.push("-threads", thread);

  //Custom FFmpegArgs™️
  if (ffmpegArgs && !info.player_response.videoDetails.isLiveContent) {
    _parseFFmpeg(args, ffmpegArgs);
  }

  const streams = {
    input: ytdl.downloadFromInfo(info, options),
    ffmpeg: new prism.FFmpeg({
      args,
      highWatermark: HIGHWATERMARK,
    }),
    volume: new prism.VolumeTransformer({
      type: "s16le",
      volume: 1,
      highWatermark: HIGHWATERMARK,
    }),
    opus: new prism.opus.Encoder({
      rate: 48000,
      channels: 2,
      frameSize: 960,
      highWatermark: HIGHWATERMARK,
    }),
    seek: (ffmpegArgs ? ffmpegArgs.seek : 0) || 0,
  };

  require("stream").pipeline(
    streams.input,
    streams.ffmpeg,
    streams.volume,
    streams.opus,
    (error) => {
      if (error) {
        streams.input.emit("error", error);
      }
    }
  );

  streams.opus.once("close", () => {
    streams.input.destroy();
    streams.ffmpeg.destroy();
    streams.volume.destroy();
    streams.opus.destroy();
  });

  return streams;
}

async function soundcloud(url, sdl, ffmpegArgs, song) {
  function chooseTranscoding(track) {
    const transcodings = sdl.filterMedia(track.media.transcodings, {
      protocol: "progressive",
    });

    return transcodings[0] || track.media.transcodings[0];
  }

  let info;

  if (!song.info) {
    info = await sdl.getInfo(url);

    info = {
      media: info.media,
      downloadable: info.downloadable,
      streamable: info.streamable,
    };
  } else info = song.info;

  if (!(info.downloadable || info.streamable)) {
    const stream = new (require("stream").Readable)({
      read: () => {},
    });

    setImmediate(() => stream.push(null));

    return {
      opus: stream,
    };
  }

  const transcodings = sdl.filterMedia(info.media.transcodings, {
    format: 'audio/ogg; codecs="opus"',
  });

  let transcoding =
    transcodings.find(({ format }) => format.protocol === "progressive") ||
    transcodings[0];

  if (require("os").freemem() / 1024 / 1024 > 100) song.info = info;

  if (
    transcoding &&
    transcoding.format.mime_type === 'audio/ogg; codecs="opus"' &&
    (ffmpegArgs ? !ffmpegArgs.filter : 1)
  ) {
    const audio = await scdl(transcoding, await sdl.getClientID(), sdl.axios);
    const demuxer = new prism.opus.OggDemuxer({ highWatermark: HIGHWATERMARK });

    const streams = {
      input: new prism.opus.Decoder({
        rate: 48000,
        channels: 2,
        frameSize: 960,
        highWatermark: HIGHWATERMARK,
      }),
      volume: new prism.VolumeTransformer({
        type: "s16le",
        volume: 1,
        highWatermark: HIGHWATERMARK,
      }),
      opus: new prism.opus.Encoder({
        rate: 48000,
        channels: 2,
        frameSize: 960,
        highWatermark: HIGHWATERMARK,
      }),
      seek: ffmpegArgs ? ffmpegArgs.seek || 0 : 0,
    };

    audio.on("error", (error) => {
      streams.input.emit("error", error);
    });
    demuxer.on("error", (error) => {
      streams.input.emit("error", error);
    });

    const lines = [audio, demuxer, streams.input, streams.volume, streams.opus];

    if (ffmpegArgs && ffmpegArgs.seek) {
      const seekable = new Seekable({
        time: ffmpegArgs.seek,
        rate: 48000,
        depth: 16,
        channels: 2,
        highWatermark: HIGHWATERMARK,
      });

      streams.seekable = seekable;

      lines.splice(3, 0, seekable);
    }

    require("stream").pipeline(...lines, (error) => {
      if (error) {
        streams.input.emit("error", error);
      }
    });

    streams.opus.once("close", () => {
      for (const line of lines) line.destroy();
    });

    return streams;
  }

  if (!transcoding) transcoding = chooseTranscoding(info);

  if (!transcoding) {
    const stream = new (require("stream").Readable)({
      read: () => {},
    });

    setImmediate(() => stream.push(null));

    return {
      opus: stream,
    };
  }

  const thread = await _getThreads();
  const args = [...FFMPEG_ARGS];

  args.push("-threads", thread);

  if (ffmpegArgs) {
    _parseFFmpeg(args, ffmpegArgs);
  }

  const streams = {
    input: await scdl(transcoding, await sdl.getClientID(), sdl.axios),
    ffmpeg: new prism.FFmpeg({
      args,
      highWatermark: HIGHWATERMARK,
    }),
    volume: new prism.VolumeTransformer({
      type: "s16le",
      volume: 1,
      highWatermark: HIGHWATERMARK,
    }),
    opus: new prism.opus.Encoder({
      rate: 48000,
      channels: 2,
      frameSize: 960,
      highWatermark: HIGHWATERMARK,
    }),
    seek: (ffmpegArgs ? ffmpegArgs.seek : 0) || 0,
  };

  require("stream").pipeline(
    streams.input,
    streams.ffmpeg,
    streams.volume,
    streams.opus,
    (error) => {
      if (error) {
        streams.input.emit("error", error);
      }
    }
  );

  streams.opus.once("close", () => {
    streams.input.destroy();
    streams.ffmpeg.destroy();
    streams.volume.destroy();
    streams.opus.destroy();
  });

  return streams;
}

async function local(path, ffmpegArgs) {
  const thread = await _getThreads();
  const args = [...FFMPEG_ARGS];

  args.push("-threads", thread);

  if (ffmpegArgs) {
    _parseFFmpeg(args, ffmpegArgs);
  }

  const streams = {
    input: fs.createReadStream(path, {
      highWaterMark: HIGHWATERMARK,
    }),
    ffmpeg: new prism.FFmpeg({
      args,
      highWatermark: HIGHWATERMARK,
    }),
    volume: new prism.VolumeTransformer({
      type: "s16le",
      volume: 1,
      highWatermark: HIGHWATERMARK,
    }),
    opus: new prism.opus.Encoder({
      rate: 48000,
      channels: 2,
      frameSize: 960,
      highWatermark: HIGHWATERMARK,
    }),
    seek: (ffmpegArgs ? ffmpegArgs.seek : 0) || 0,
  };

  require("stream").pipeline(
    streams.input,
    streams.ffmpeg,
    streams.volume,
    streams.opus,
    (error) => {
      if (error) {
        streams.input.emit("error", error);
      }
    }
  );

  streams.opus.once("close", () => {
    streams.input.destroy();
    streams.ffmpeg.destroy();
    streams.volume.destroy();
    streams.opus.destroy();
  });

  return streams;
}

function play(voiceConnection, streams) {
  const { player } = voiceConnection;

  player.destroyDispatcher();

  const dispatcher = player.createDispatcher(
    {
      volume: 1,
      bitrate: 64,
      fec: true,
      seek: streams.seek,
      highWaterMark: 24,
    },
    streams
  );

  streams.opus.pipe(dispatcher);

  return dispatcher;
}

/**
 * SeekableStream for PCM audio stream
 * @extends {Transform}
 */
class Seekable extends Transform {
  /**
   * @param {Object} options The option for SeekableStream
   * @param {!Number} options.time The time to seek (in seconds)
   * @param {!Number} options.rate The sampling rate of the PCMStream
   * @param {!Number} options.depth The bitdepth of the PCMStream
   * @param {!Number} options.channels The channels of the PCMStream
   */
  constructor(options) {
    if (
      !(options instanceof Object) ||
      !options.rate ||
      !options.depth ||
      !options.channels
    )
      throw new TypeError("Invalid options given");

    super(options);

    this._bps = options.rate * (options.depth / 8) * options.channels;

    this._total = this._bps * options.time;
  }

  async _transform(chunk, enc, cb) {
    if (!this._total) this.push(chunk);
    else if (this._total >= chunk.length) this._total -= chunk.length;
    else {
      this.push(chunk.slice(this._total));

      this._total = 0;
    }

    cb();
  }
}

module.exports = {
  play,
  soundcloud,
  youtube,
  local,
  Seekable,
};

async function _getThreads() {
  if (os.cpus().length < 5) return "1";

  let totalTime = global.oldCPUTime;
  let idleTime = global.oldIdleTime;

  //Get CPU usage of 100ms
  if (!totalTime || !idleTime)
    await new Promise((res) => {
      if (!totalTime) global.oldCPUTime = [];
      if (!idleTime) global.oldIdleTime = [];

      const cpus = os.cpus();

      for (let i = 0; i < cpus.length; i++) {
        const cpu = cpus[i];

        global.oldCPUTime[i] = 0;
        global.oldIdleTime[i] = 0;

        for (const type of Object.keys(cpu.times)) {
          global.oldCPUTime[i] += cpu.times[type];

          if (type === "idle") global.oldIdleTime[i] += cpu.times[type];
        }
      }

      totalTime = global.oldCPUTime;
      idleTime = global.oldIdleTime;

      setTimeout(res, 100);
    });

  const cpus = os.cpus();
  const rcmnd = Math.round(cpus.length * 0.3);

  let threads = 0;

  for (let i = 0; i < cpus.length; i++) {
    const cpu = cpus[i];

    let total = -totalTime[i];
    let idle = -idleTime[i];

    global.oldCPUTime[i] = 0;
    global.oldIdleTime[i] = 0;

    for (const type of Object.keys(cpu.times)) {
      const time = cpu.times[type];

      total += time;
      global.oldCPUTime[i] += time;

      if (type === "idle") {
        idle += time;
        global.oldIdleTime[i] += time;
      }
    }

    const percentage = Math.round((idle / total) * 100);

    //Add, if its 20% idle
    if (percentage >= 20) threads++;
  }

  const count = Math.max(Math.min(rcmnd, threads), 1);

  return `${count}`;
}

function _parseFFmpeg(ffmpeg, args) {
  if (!isNaN(args.seek)) ffmpeg.unshift("-ss", String(args.seek));

  if (args.filter && Object.keys(args.filter).length) {
    let filters = [];

    Object.entries(args.filter).map((filter) => {
      if (!filter[1].length) {
        filters.push(filter[0]);

        return;
      }

      filters.push(filter.join("="));
    });

    ffmpeg.push("-af", filters.join(","));
  }
}
