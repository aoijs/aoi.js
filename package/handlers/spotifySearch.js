const MusicPlayer = require("./MusicPlayer")
class SpotifySearchHandler {
  constructor(DiscordClient, GuildID, Songs, SongFormat, SearchEngine, SongFilter, All, ErrorMessage) {
    // Load some Utilities
    this.client = DiscordClient;
    this.id = GuildID;
    this.songs = Songs;
    this.engine = SearchEngine;
    this.format = SongFormat;
    this.filter = SongFilter;
    this.isFirstLoaded = false
    this.aborted = false
    this.all = All 
    this.error = ErrorMessage


    for (const song of this.songs) {
      if (this.aborted) {
        break;
      }
      this.getVideo(song, this.isFirstLoaded === false ? true : false, (error, result, song) => {
        if (error) {
          console.error(error)
          return;
        } else {
          if (!result) {
            return;
          } else {
            if (this.aborted) return;
            const FormattedVideoOrSong = this.format(result, song)
            if (!this.client.servers.get(this.id)) {
              this.end()
              return;
            } else {
              const GuildConstructor = this.client.servers.get(this.id)
              if (!GuildConstructor.songs.length && GuildConstructor.songs.length !== "PLAYING") {
                GuildConstructor.songs.push(FormattedVideoOrSong)
                new Promise(async resolve => {
                  await MusicPlayer(this.all, true, this.error)
                  resolve()
                })
                return;
              } else {
                GuildConstructor.songs.push(FormattedVideoOrSong)
                return;
              }
            }
          }
        }
      })
    }
    
  }

  async getVideo(song, useAwait = false, done = (error, results, SpotifySource) => {}) {
    if (this.aborted) return done(null, null)
    // Prepare some variables to use
    const Song = song
    const query = `${Song.artists[0].name} - ${Song.name}`
    const Execute = (Results) => {
        const Videos = Results.videos;
      const VideoOrSong = this.filter(Videos, song);
      if (!VideoOrSong) {
        return done(null, null)
      } else {
        return done(null, VideoOrSong)
      }

      }

      // Configure to stop System or run in the Background
      if (useAwait) {
        // Error Handling
        try {
          // Using Await
    const SearchedVideos = await this.engine.post({ search: query });
      Execute(SearchedVideos)
        } catch (error) {
          this.aborted = true 
          return done(error)
        }

      } else {
        // Using Normal Promises Methods
        this.engine.post({ search: query })
        .then(Results => Execute(Results))
        .catch(error => {
          this.aborted = true 
          return done(error)
        })
      }
  }

  end() {
    this.aborted = true
  }
};

module.exports = SpotifySearchHandler