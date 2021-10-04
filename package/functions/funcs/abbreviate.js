module.exports = async (d) => {
  const { code } = d.command;
  const r = code.split("$abbreviate").length - 1;
  const inside = code.split("$abbreviate")[r].after();

  const err = d.inside(inside);

  if (err) return d.error(err);

  const [num, dec = "1"] = inside.splits;

  const n = Number(num);
  const de = Number(dec);

  if (isNaN(n))
    return d.error(`:x: Invalid number in \`$abbreviate${inside.total}\``);

  if (isNaN(de))
    return d.error(`:x: Invalid decimal in \`$abbreviate${inside.total}\``);

  let a;

  try {
    a = abbreviate(n, de);
  } catch {
    return d.error(
      `:x: There's an error while abbreviating \`$abbreviate${inside.total}\``
    );
  }

  return {
    code: code.replaceLast(`$abbreviate${inside.total}`, a),
  };
};

const SI_SYMBOL = [
  "",
  "K",
  "M",
  "B",
  "T",
  "Qa",
  "Qi",
  "Sx",
  "Sp",
  "O",
  "N",
  "D",
  "UD",
  "UD",
  "DD",
  "TD",
  "QaD",
  "QiD",
  "SxD",
  "SpD",
  "OD",
  "ND",
  "V",
  "UV",
  "DV",
  "TV",
  "QaV",
  "QiV",
  "SxV",
  "SpV",
  "OV",
  "NV",
  "DT",
  "UDT",
  "DDT",
  "TDT",
  "QaDT",
  "QiDT",
  "SxDT",
  "SpDT",
  "ODT",
  "NDT",
  "DQa",
  "UDQa",
  "DDQa",
  "TDQa",
  "QaDQa",
  "QiDQa",
  "SxDQa",
  "SpDQa",
  "ODQa",
  "NDQa",
  "DQi",
  "UDQi",
  "DDQi",
  "TDQi",
  "QaDQi",
  "QiDQi",
  "SxDQi",
  "SpDQi",
  "ODQi",
  "NDQi",
  "DSx",
  "UDSx",
  "DDSx",
  "TDSx",
  "QaDSx",
  "QiDSx",
  "SxDSx",
  "SpDSx",
  "ODSx",
  "NDSx",
  "DSp",
  "UDSp",
  "DDSp",
  "TDSp",
  "QaDSp",
  "QiDSp",
  "SxDSp",
  "SpDSp",
  "ODSp",
  "NDSp",
  "DO",
  "UDO",
  "DDO",
  "TDO",
  "QaDO",
  "QiDO",
  "SxDO",
  "SpDO",
  "ODO",
  "NDO",
  "DN",
  "UDN",
  "DDN",
  "TDN",
  "QaDN",
  "QiDN",
  "SxDN",
  "SpDN",
  "ODN",
  "NDN",
  "C",
  "UC",
];

function abbreviate(number, decimal) {
  const tier = Math.floor(Math.log10(Math.abs(number || 1)) / 3);

  if (tier === 0) return number;

  const suffix = SI_SYMBOL[tier];
  const scale = Math.pow(10, tier * 3);
  const scaled = number / scale;

  return scaled.toFixed(decimal) + suffix;
}
