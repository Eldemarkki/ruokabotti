import { SlashCommandBuilder } from '@discordjs/builders';
import { add, format } from 'date-fns';
import { CacheType, CommandInteraction } from 'discord.js';
import { getFood } from '../store/InMemoryStore';
import { fi } from 'date-fns/locale';

export const data = new SlashCommandBuilder()
  .setName("ruoka")
  .setDescription("Get today's food")
  .addIntegerOption((option) => option
    .setName("päivä")
    .setDescription("Kuinka monta päivää tästä eteen-/taaksepäin")
  );

export const handle = async (interaction: CommandInteraction<CacheType>) => {
  const offset = interaction.options.getInteger("päivä", false) || 0;
  const date = add(new Date(), { days: offset });
  const food = await getFood(date);
  if (food && food.menu && food.menu["Lounas"]) {
    const d = format(date, "EEEE d.L.y", { locale: fi });
    await interaction.reply(d[0].toLocaleUpperCase() + d.slice(1) + ": **" + food.menu["Lounas"] + "**");
  }
  else {
    await interaction.reply(`Ruokaa ei löytynyt päivälle ${format(date, "d.L.y", { locale: fi })}`);
  }
}