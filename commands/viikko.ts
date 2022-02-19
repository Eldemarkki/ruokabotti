import { SlashCommandBuilder } from '@discordjs/builders';
import { add, format, startOfWeek } from 'date-fns';
import { CacheType, CommandInteraction } from 'discord.js';
import { getFood } from '../store/InMemoryStore';
import { fi } from 'date-fns/locale';

export const data = new SlashCommandBuilder()
  .setName("viikko")
  .setDescription("Hae koko viikon ruoka")
  .addIntegerOption((option) => option
    .setName("offset")
    .setDescription("Kuinka monta viikkoa tästä eteen-/taaksepäin")
  );

export const handle = async (interaction: CommandInteraction<CacheType>) => {
  const lines = [];
  const offset = interaction.options.getInteger("offset", false) || 0;

  for (let i = 0; i < 5; i++) {
    const startWeek = startOfWeek(new Date(), { weekStartsOn: 1 });
    const date = add(startWeek, { days: i + offset * 7 });
    const food = await getFood(date);
    const d = format(date, "EEEE d.L.y", { locale: fi });
    const start = d[0].toLocaleUpperCase() + d.slice(1);
    if (food && food.menu && food.menu["Lounas"]) {
      lines.push(`${start}: **${food.menu["Lounas"]}**`);
    }
    else {
      lines.push(`${start}: Ruokaa ei löytynyt`)
    }
  }

  await interaction.reply(lines.join("\n"));
}