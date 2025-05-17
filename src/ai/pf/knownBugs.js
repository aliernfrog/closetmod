export default [
  {
    name: "SSL CA certificate error",
    thread: "https://discord.com/channels/752538330528481351/1032276983331180648/1032276983331180648",
    filter(_, args) {
      return args.includes("ssl") && args.includes("certificate");
    }
  },
  {
    name: "Pink guns",
    thread: "https://discord.com/channels/752538330528481351/1103054479839998072/1103054479839998072",
    filter(_, args) {
      const mentionsGuns = ["gun","guns","weapon","weapons"].some(w => args.includes(w));
      return args.includes("pink") && mentionsGuns;
    }
  },
  {
    name: "Pink snow",
    thread: "https://discord.com/channels/752538330528481351/1081999817250709664/1081999817250709664",
    filter(_, args) {
      return args.includes("pink") && args.includes("snow");
    }
  },
  {
    name: "Holding multiple guns",
    thread: "https://discord.com/channels/752538330528481351/1082640084341358673/1082640084341358673",
    filter(_, args) {
      const c1 = ["hold","holding","hand"].some(w => args.includes(w));
      const c2 = ["gun","guns","weapon","weapons"].some(w => args.includes(w));
      const c3 = ["multiple","two","three"].some(w => args.includes(w));
      return c1 && c2 && c3;
    }
  },
  {
    name: "Invisible map",
    thread: "https://discord.com/channels/752538330528481351/1373160944917807114/1373177059807072266",
    filter(_, args) {
      return args.includes("void")
        || (args.includes("invisible") && args.includes("map"))
        || (args.includes("bug") && args.includes("spawn"));
    }
  }
];