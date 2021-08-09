
const passFb =[
  "YOUR_PASS",
  "YOUR_PASS",
  "YOUR_PASS",
  
  ];
const userFb=[
  "YOUR_EMAIL",
  "YOUR_EMAIL",
  "YOUR_EMAIL",
  ];

const twitchClient = "YOUR___API___CLIENT___KEY";
const twitchSecret = "YOUR___API___SECRET___KEY";


const fileLogArchive=[
  "./log/stockListArchive_0.json",
  "./log/stockListArchive_1.json",
  "./log/stockListArchive_2.json",
];
const fileLogUpload=[
  "./log/stockListUpload_0.json",
  "./log/stockListUpload_1.json",
  "./log/stockListUpload_2.json",

];
const fileLogStreamers=[
  "./log/infoForGet_0.json",
  "./log/infoForGet_1.json",
  "./log/infoForGet_2.json",
];

const modeGetTwitch=[
  "streamer",
  "game",
  "game",
]

const infoToGet=[
  [
  "michaelreeves",
  "minterly",
  "lirik",
  "kitboga",
  "mutex",
  "ludwig",
  "lilypichu",
  "healthygamer_gg",
  "justaminx",
  "pokelawls",
  "trainwreckstv",
  "nyyxxii",
  "jakenbakelive",
  "cyr",
  "mizkif",
  "adeptthebest",
  "igumdrop",
  "kyedae_",
  "thealbertchang",
  "officialevelynclaire",
  "udysof",
  "mitchjones",
  "xqcow",
  "joeykaotyk",
  "qtcinderella",
  "maya",
  "sodapoppin",
  "clintstevens",
  "truegeordie",
  ],
  [
    "Minecraft",
    "Rocket League",
    "Roblox",
    "Among Us",
  ],
  [
    "Fortnite",
    "VALORANT",
    "Fall Guys: Ultimate Knockout",
    "Among Us",
  ]

]

module.exports = {
    ok: "okay",
    user:userFb,
    pass:passFb,
	tClient:twitchClient,
	tSecret:twitchSecret,
    archive:fileLogArchive,
    upload:fileLogUpload,
    streamer:fileLogStreamers,
    mode:modeGetTwitch,
    info:infoToGet
    
  }
