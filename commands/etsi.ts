import { SlashCommandBuilder } from '@discordjs/builders';
import { add, format, isWeekend, startOfWeek } from 'date-fns';
import { CacheType, CommandInteraction } from 'discord.js';
import { getFood } from '../store/InMemoryStore';
import { fi } from 'date-fns/locale';

export const data = new SlashCommandBuilder()
  .setName("etsi")
  .setDescription("Etsi jotain tiettyä ruokaa")
  .addStringOption((option) => option
    .setName("hakusana")
    .setDescription("Millä hakusanalla ruokaa etsitään")
    .setRequired(true)
  );

export const handle = async (interaction: CommandInteraction<CacheType>) => {
  const keyword = interaction.options.getString("hakusana") || "";
  const lines: string[] = [];
  const startWeek = startOfWeek(new Date(), { weekStartsOn: 1 });
  let i = 0;

  console.log(keyword);

  await interaction.reply("Etsitään...");

  while (true) {
    const date = add(startWeek, { days: i });
    if (!isWeekend(date)) {
      const food = await getFood(date);
      if (!food) {
        break;
      }
      const d = format(date, "EEEE d.L.y", { locale: fi });
      const start = d[0].toLocaleUpperCase() + d.slice(1);
      if (food && food.menu && food.menu["Lounas"] && food.menu["Lounas"].toLowerCase().includes(keyword)) {
        lines.push(`${start}: **${food.menu["Lounas"]}**`);
      }
    }
    i++
  }

  const msg = lines.length === 0 ? `Ei tuloksia hakusanalla "${keyword}"` : lines.join("\n");
  await interaction.editReply(msg.length <= 2000 ? msg : msg.slice(0, 1994) + "**...");
}