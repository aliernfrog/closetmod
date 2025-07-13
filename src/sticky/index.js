import { readdirSync } from "fs";

const SELF_PATH = "./src/sticky";
const STICKY_MESSAGES_PATH = "messages";

const messages = [];

async function initialize() {
  const files = readdirSync(`${SELF_PATH}/${STICKY_MESSAGES_PATH}`);
  
  for (const file of files) {
    const message = (await import(`./${STICKY_MESSAGES_PATH}/${file}`)).default;
    messages.push(message);
    console.log(`[StickyMessages] Initialized ${file} for channel ${message.channelId}`);
  }
  
  console.log(`[StickyMessages] Initialized ${messages.length} messages`);
}

export async function handleMessage(client, message) {
  if (message.author.id === client.user.id) return;
  const stickyIndex = messages.findIndex(msg => msg.channelId === message.channel.id);
  if (stickyIndex < 0) return;
  const sticky = messages[stickyIndex];
  if (sticky.timeout) clearTimeout(sticky.timeout);
  sticky.timeout = setTimeout(
    () => sendStickyMessage(client, message, sticky, stickyIndex),
    sticky.interval ?? 7*60*1000
  );
  messages[stickyIndex] = sticky;
}

async function sendStickyMessage(client, message, sticky, stickyIndex) {
  if (sticky.messageId) try {
    const old = await message.channel.messages.fetch(sticky.messageId);
    await old.delete();
  } catch (e) {
    console.error(`[StickyMessages] Failed to delete stickied message in ${sticky.channelId}`, e);
  }
  const stickied = await message.channel.send(await sticky.build(client));
  sticky.messageId = stickied.id;
  sticky.timeout = null;
  messages[stickyIndex] = sticky;
}

initialize();