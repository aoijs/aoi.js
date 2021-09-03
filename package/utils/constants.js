//Abbreviation 
const SI_SYMBOL = [ "","K",  "M",  "B",  "T",  "Qa",  "Qi",  "Sx",  "Sp",  "O", "N",
  "D",  "UD",  "UD",  "DD",  "TD", "QaD","QiD",  "SxD",  "SpD",  "OD",  "ND",
  "V",  "UV",  "DV",  "TV", "QaV",  "QiV",  "SxV", "SpV", "OV","NV",
  "DT",  "UDT",  "DDT",  "TDT",  "QaDT",  "QiDT",  "SxDT",  "SpDT",  "ODT",  "NDT",
  "DQa",  "UDQa",  "DDQa",  "TDQa", "QaDQa",  "QiDQa", "SxDQa",  "SpDQa",  "ODQa", "NDQa",
  "DQi",  "UDQi",  "DDQi",  "TDQi",  "QaDQi",  "QiDQi",  "SxDQi",  "SpDQi",  "ODQi",  "NDQi",
  "DSx",  "UDSx", "DDSx",  "TDSx",  "QaDSx",  "QiDSx",  "SxDSx", "SpDSx",  "ODSx",  "NDSx",
  "DSp",  "UDSp",  "DDSp", "TDSp",  "QaDSp", "QiDSp",  "SxDSp",  "SpDSp",  "ODSp",  "NDSp",
  "DO",  "UDO",  "DDO",  "TDO",  "QaDO",  "QiDO",  "SxDO",  "SpDO",  "ODO", "NDO",
  "DN", "UDN", "DDN",  "TDN",  "QaDN",  "QiDN", "SxDN", "SpDN",  "ODN",  "NDN",
  "C","UC",
];
/* 
{@applicationCommands Callbacks options}
*/
const ApplicationCmdOptions  = {
id:"id of the slash cmd;.id",
name:"name of the slash cmd;.name",
description:"description of the slash cmd;.description",
version: "version of slash cmd;.version",
options:"options of slash cmd;.options",
guildID:"guildID of the slash cmd (returns null for global);.guildID",
applicationID:"returns Application ID",
defaultPermission : "returns default permission of the slash cmd;.defaultPermission",
timestamp:"returns timestamp of the creation of slash cmd (in ms);.timestamp",
createdAt:"returns the date of creation of slash cmd;.createdAt"
}
