const axios = require("axios");
const STEAM_API_KEY = 09CD57AC006DE306CDBEA2FC29BA6A96;
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

client.on('messageCreate', async (message) => {
  if (message.content === "!ping") {
    message.reply("Pong 🏓");
  }
 if (message.content.startsWith("!verificar")) { console.log("ENTRÓ A VERIFICAR");

    const args = message.content.split(" ");
    const steamID = args[1];

    if (!steamID) {
        return message.reply("Tenés que poner tu SteamID. Ejemplo: !verificar 7656119XXXXXXX");
    }

    try {
        message.reply("🔎 Verificando...");

        const response = await axios.get(
            "https://api.steampowered.com/IPlayerService/GetOwnedGames/v0001/",
            {
                params: {
                    key: STEAM_API_KEY,
                    steamid: steamID,
                    include_appinfo: true
                }
            }
        );

        console.log(response.data); // 👈 IMPORTANTE

        if (!response.data.response || !response.data.response.games) {
            return message.reply("❌ Perfil privado o SteamID inválido.");
        }

        const games = response.data.response.games;

        const cs2 = games.find(game => game.appid === 730);

        if (cs2) {
            return message.reply(`✅ Tenés CS2 con ${Math.floor(cs2.playtime_forever / 60)} horas.`);
        } else {
            return message.reply("❌ No tenés CS2 en tu cuenta.");
        }

    } catch (error) {
        console.log(error);
        return message.reply("❌ Error consultando Steam.");
    }
}

client.login(process.env.TOKEN);
