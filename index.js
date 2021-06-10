const { token, default_prefix } = require("./config.json");
const config = require('./config.json')
const discord = require("discord.js"); 
const { Manager } = require("erela.js");
const Spotify  = require("erela.js-spotify");
const { version } = require('./package.json');
const { version: discordjsVersion } = require('discord.js');
const clientID = config.clientID; 
const clientSecret = config.clientSecret;
const client = new discord.Client({
  disableEveryone: true 
});
require('discord-buttons')(client)
const { MessageButton } = require('discord-buttons')
const db = require("quick.db")
require('./util/reply');

client.commands = new discord.Collection();
client.aliases = new discord.Collection();
client.emotes = require('./emotes.json');
client.filters = require('./filters.json');

["command"].forEach(handler => {
  require(`./handlers/${handler}`)(client);
});

client.on("message", async message => {
  
if(message.author.bot) return;
  if(!message.guild) return;
  let prefix = db.get(`prefix_${message.guild.id}`)
  if(prefix === null) prefix = default_prefix;
  client.config = {
  prefix: prefix
}
  const prefixMention = new RegExp(`^<@!?${client.user.id}>( |)$`);
  if (message.content.match(prefixMention)) {
    const pingedembed = new discord.MessageEmbed()
    .setTitle('salam dawsh')
    .setThumbnail(client.user.displayAvatarURL({ dynamic: true }))
    .setDescription(`salam man  ${client.user.username}, ye robot hagh go, tolid shode tavasote <@745766921131130991> prefixam to in server ine \`${prefix}\` donbal command ham migardi? ino bezan --> \`${prefix}help\``)
    .setColor("RANDOM");
    return message.reply(pingedembed);
  }
  
  if(!message.content.startsWith(prefix)) return;
  
     if (!message.member) message.member = await message.guild.fetchMember(message);

    const args = message.content.slice(prefix.length).trim().split(/ +/g);
    const cmd = args.shift().toLowerCase();
    
    if (cmd.length === 0) return;


  let cmdx = db.get(`cmd_${message.guild.id}`)

  if (cmdx) {
    let cmdy = cmdx.find(x => x.name === cmd)
    if (cmdy) message.channel.send(cmdy.responce)
  }
    
    // Get the command
    let command = client.commands.get(cmd);
    // If none is found, try to find it by alias
    if (!command) command = client.commands.get(client.aliases.get(cmd));

    // If a command is finally found, run the command
    if (command) 
        command.run(client, message, args);
  
return addexp(message)

 })

client.snipe = new discord.Collection();
client.on("messageDelete", function(message, channel) {
  client.snipe.set(message.channel.id, {
    content: message.content,
    author: message.author.tag,
    image: message.attachments.first()
      ? message.attachments.first().proxyURL
      : null
  });
});

client.on("message", async message => {
  if (message.author.bot) return;
  let prefix = db.get(`prefix_${message.guild.id}`)
  if(prefix === null) prefix = default_prefix;
  let words = db.get(`words_${message.guild.id}`);
  let yus = db.get(`message_${message.guild.id}`);
  if (yus === null) {
    yus = ":x: | **{user-mention}, dawsh in kalame gheyre mojaze**";
  }
  if (message.content.startsWith(prefix + "addword")) return;
  if (message.content.startsWith(prefix + "delword")) return;
  if (message.content.startsWith(prefix + "setwarnmsg")) return;
  if (message.content.startsWith(prefix + "words")) return;
  let pog = yus
    .split("{user-mention}")
    .join("<@" + message.author.id + ">")
    .split("{server-name}")
    .join(message.guild.name)
    .split("{user-tag}")
    .join(message.author.tag)
    .split("{user-username}")
    .join(message.author.username);
  if (words === null) return;
  function check(msg) {
    //is supposed to check if message includes da swear word
    return words.some(word =>
      message.content
        .toLowerCase()
        .split(" ")
        .join("")
        .includes(word.word.toLowerCase())
    );
  }
  if (check(message.content) === true) {
    message.delete();
    message.channel.send(pog).then(m=>m.delete({timeout:5000}).catch(e=>{}));
  }
});

client.on("ready", () => {
    client.user.setStatus("dnd"); // You Can Set It To dnd, online, idle. dont set it to offline plz
    console.log(`${client.user.username} online`)
});

client.on("ready", async () => {
  console.log(`Powered By pedaret 1.0.0 and DISCORDJS ${discordjsVersion}`)
  const status = [
    `mahan posty`,
    `babat khorde shod`,
    `${default_prefix}help`,
  ]
  setInterval(() => {
    client.user.setActivity(status[Math.floor(Math.random() * status.length)], { type: "WATCHING" }) //You Can Set The Type To PLAYING/WATCHING/COMPETING/LISTENING.
  }, 5000)
});

client.login(token).catch(err => {
  console.log("Invalid Token Or You're Not Putting The Token.")
})