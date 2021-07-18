function resolveColor(red, green, blue) {
  return red * 65536 + green * 256 + blue;
}

const BASIC_COLORS = {
  WHITE: [255, 255, 255],
  BLUE: [0, 0, 255],
  LIME: [0, 255, 0],
  BLACK: [0, 0, 0],
  RED: [255, 0, 0],
  YELLOW: [255, 255, 0],
  GREEN: [0, 128, 0],
  CYAN: [0, 255, 255],
  AQUA: [0, 255, 255],
  SILVER: [192, 192, 192],
  GRAY: [128, 128, 128],
  MAROON: [128, 0, 0],
  OLIVE: [128, 128, 0],
  PURPLE: [128, 0, 128],
  TEAL: [0, 128, 128],
  NAVY: [0, 0, 128],
  DEFAULT: [0, 0, 0],
};

function check(color, inside) {
  if (isNaN(color))
    return `\`${d.func}: Invalid Number ${color} at ${
      inside.total ? inside.total : ""
    }\``;

  if (new Number(color) < 0 || new Number(color) > 255)
    return `\`${d.func}: Invalid Color ${color} at ${
      inside.total ? inside.total : ""
    }\``;
}
module.exports = (d) => {
  const code = d.command.code;
  const inside = d.unpack();
  const err = d.inside(inside);

  if (err) return d.error(err);

  const [r = "0", g = "", b = "", toHex = "yes", type = "rgb"] = inside.splits;
  const rgb = BASIC_COLORS[r.toUpperCase()]
    ? BASIC_COLORS[r.toUpperCase()]
    : [new Number(r), new Number(g), new Number(b)];
    
    if (type.toLowerCase() === "number") return {
      code: code.replaceLast(`$resolveColor${inside.total}`, "#" + rgb[0].toString(16).padStart(6, "0"))
    };

  const arr = [
    check(rgb[0], inside),
    check(rgb[1], inside),
    check(rgb[2], inside),
  ];

  if (arr[0]) return d.error(arr[0]);
  if (arr[1]) return d.error(arr[1]);
  if (arr[2]) return d.error(arr[2]);

  let n = resolveColor(...rgb);

  if (toHex.toLowerCase() === "yes") n = "#" + n.toString(16).padStart(6, "0");

  return {
    code: code.replaceLast(`$resolveColor${inside.total}`, n),
  };
};
