import { Client, Intents } from 'discord.js';

export const AROMI_URL = process.env.AROMI_URL;

const client = new Client({ intents: [Intents.FLAGS.GUILDS] });

client.once('ready', () => {
	console.log('Ready!');
});

client.on("interactionCreate", async interaction => {
	if (!interaction.isCommand()) return;

	const { commandName } = interaction;
	await require(`./commands/${commandName}`).handle(interaction)
})

client.login(process.env.DISCORD_TOKEN);

