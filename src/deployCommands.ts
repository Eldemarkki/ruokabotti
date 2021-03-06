import { REST } from "@discordjs/rest";
import { RESTPostAPIApplicationCommandsJSONBody, Routes } from "discord-api-types/v9";
import { data as foodCommand } from "./commands/ruoka";
import { data as searchCommand } from "./commands/etsi";

const commands: RESTPostAPIApplicationCommandsJSONBody[] = [];

const clientId = String(process.env.CLIENT_ID);

commands.push(foodCommand.toJSON());
commands.push(searchCommand.toJSON());

const rest = new REST({ version: '9' }).setToken(process.env.DISCORD_TOKEN || "");

(async () => {
	try {
		console.log('Started refreshing application (/) commands.');
		await rest.put(
			Routes.applicationCommands(clientId),
			{ body: commands },
		);

		console.log('Successfully reloaded application (/) commands.');
	} catch (error) {
		console.error(error);
	}
})();