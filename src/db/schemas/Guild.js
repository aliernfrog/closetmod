import mongoose from "mongoose";
const name = "modbot_guilds";

export default mongoose.model(name, new mongoose.Schema({
  _id: String,
  maps: Array,
  faq: {
    channelId: String,
    messageId: String,
    faq: Array
  },
  counting: {
    lastCount: Number,
    lastUserId: String,
    milestones: {
      type: Map,
      of: {
        userId: String,
        channelId: String,
        messageId: String,
        additionalUsers: Array
      }
    },
    users: {
      type: Map,
      of: {
        counts: Number
      }
    }
  }
}));