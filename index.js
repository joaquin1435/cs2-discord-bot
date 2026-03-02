const { Client, GatewayIntentBits } = require('discord.js');

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
    GatewayIntentBits.GuildMembers
  ]
});

client.once('ready', () => {
  console.log(`Bot listo como ${client.user.tag}`);
});

client.on('messageCreate', (message) => {
  if (message.content === "!ping") {
    message.reply("Pong 🏓");
  }
   if (message.content.startsWith("!verificar")) {

        const args = message.content.split(" ");
        const steamID = args[1];

        if (!steamID) {
            return message.reply("Tenés que poner tu SteamID. Ejemplo: !verificar 7656119XXXXXXX");
        }

        message.reply(`Verificando SteamID: ${steamID}`);
    }

});

client.login(process.env.TOKEN);
