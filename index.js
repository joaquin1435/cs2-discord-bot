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

const VERIFICATION_CHANNEL_ID = "1478042027060105297";

client.once('ready', () => {
    console.log(`Bot listo como ${client.user.tag}`);
});

client.on('messageCreate', async (message) => {

    if (message.author.bot) return;

    // COMANDO VERIFICAR
   if (message.content.startsWith("!verificar")) {

    console.log("Entró al comando verificar");

    const args = message.content.split(" ");
    const steamID = args[1];

    if (!steamID) {
        return message.reply("Usá: !verificar TU_STEAMID");
    }

    console.log("Buscando canal...");
    console.log("ID configurado:", VERIFICATION_CHANNEL_ID);

    const channel = message.guild.channels.cache.get(VERIFICATION_CHANNEL_ID);

    console.log("Canal encontrado:", channel);

    if (!channel) {
        return message.reply("Canal de verificación no encontrado.");
    }

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
// EVENTO AUTOMÁTICO SOLO PARA ROLES DE LEVEL
client.on('guildMemberUpdate', async (oldMember, newMember) => {
    
    // 1. CONFIGURACIÓN: Pon aquí los IDs de tus roles de LEVEL y el prefijo que quieras
    const rolesDeLevel = {
        "1478093940610568202": "[Lvl 1]",
        "1478094129983652003": "[Lvl 2]",
        "1478094174724034713": "[Lvl 3]",
        "1478094300112879657": "[Lvl 4]",
        "1478094218957160478": "[Lvl 5]",
        "1478094357918781462": "[Lvl 6]",
        "1478094433718374450": "[Lvl 7]",
        "1478094488483266570": "[Lvl 8]",
        "1478094535086182451": "[Lvl 9]",
        "1478094587477364950": "[Lvl 10]"
    };

    // 2. Detectamos qué rol se agregó comparando la lista vieja con la nueva
    const addedRoles = newMember.roles.cache.filter(role => !oldMember.roles.cache.has(role.id));

    // 3. Si no se agregó ningún rol, o el rol agregado NO está en nuestra lista de Levels, NO HACEMOS NADA
    if (addedRoles.size === 0) return;

    // Revisamos los roles agregados
    for (const [roleId, role] of addedRoles) {
        if (rolesDeLevel[roleId]) {
            // SI EL ROL ESTÁ EN LA LISTA, PROCEDEMOS:
            const prefix = rolesDeLevel[roleId];
            const currentName = newMember.nickname || newMember.user.username;

            // Evitamos duplicar el prefijo si ya lo tiene
            if (!currentName.startsWith(prefix)) {
                try {
                    // Limpiamos cualquier prefijo de Level anterior por si subió de nivel
                    const cleanName = currentName.replace(/^\[Lvl \d+\]\s*/i, "");
                    const newNick = `${prefix} ${cleanName}`.substring(0, 32);

                    await newMember.setNickname(newNick);
                    console.log(`✅ Nombre actualizado: ${newMember.user.tag} recibió ${role.name}`);
                } catch (err) {
                    console.log(`❌ Error al cambiar nombre de ${newMember.user.username} (Jerarquía o es Owner)`);
                }
            }
            break; // Ya encontramos el rol de level, dejamos de buscar
        }
    }
});
client.login(process.env.TOKEN);
