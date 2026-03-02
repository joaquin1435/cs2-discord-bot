const { Client, GatewayIntentBits } = require('discord.js');
const axios = require("axios");

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent,
        GatewayIntentBits.GuildMembers
    ]
});

const VERIFICATION_CHANNEL_ID = "1477885587695603782";

client.once('ready', () => {
    console.log(`Bot listo como ${client.user.tag}`);
});

client.on('messageCreate', async (message) => {

    if (message.author.bot) return;

    // COMANDO VERIFICAR
    if (message.content.startsWith("!verificar")) {

        const args = message.content.split(" ");
        const steamID = args[1];

        if (!steamID) {
            return message.reply("Usá: !verificar TU_STEAMID");
        }

        const channel = message.guild.channels.cache.get(VERIFICATION_CHANNEL_ID);

        if (!channel) return message.reply("Canal de verificación no encontrado.");

        channel.send(`
📌 Nueva verificación

Usuario: ${message.author}
SteamID: ${steamID}
Perfil: https://steamcommunity.com/profiles/${steamID}
        `);

        return message.reply("✅ Tu solicitud fue enviada al staff.");
    }

    // COMANDO ELO (SOLO ADMIN)
    if (message.content.startsWith("!elo")) {

        if (!message.member.permissions.has("Administrator")) {
            return message.reply("No tenés permiso para usar este comando.");
        }

        const args = message.content.split(" ");
        const user = message.mentions.members.first();
        const elo = parseInt(args[2]);

        if (!user || !elo) {
            return message.reply("Usá: !elo @usuario 12000");
        }

        let roleName;

        if (elo < 5000) roleName = "1-5k elo";
        else if (elo < 10000) roleName = "5-10k elo";
        else if (elo < 15000) roleName = "10-15k elo";
        else if (elo < 20000) roleName = "15-20k elo";
        else if (elo < 25000) roleName = "20-25k elo";
        else if (elo < 30000) roleName = "25-30k elo";
        else if (elo >= 30000) roleName = "+30k elo";

        const role = message.guild.roles.cache.find(r => r.name === roleName);

        if (!role) return message.reply("Rol no encontrado.");

        await user.roles.add(role);

        return message.reply(`✅ ${user.user.username} ahora es ${roleName}`);
    }

});

client.login(process.env.TOKEN);
