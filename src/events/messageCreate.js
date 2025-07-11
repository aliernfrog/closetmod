import handleSpecialChannel from "./messageCreate/specialChannels.js";
import handleNavigatorChannel from "./messageCreate/navigatorChannels.js";
import handleManagerEval from "./messageCreate/managerEval.js";
import handleFAQChannels from "./messageCreate/faqChannels.js";
import { handleMessage as handleStickyMessage } from "../sticky/index.js";

export default {
  name: "messageCreate",
  execute(client, message) {
    handleSpecialChannel(client, message);
    handleNavigatorChannel(client, message);
    handleManagerEval(client, message);
    handleFAQChannels(client, message);
    handleStickyMessage(client, message);
  }
}
