var convert = require('xml-js');
import axios from "axios";
import { format, getWeek } from "date-fns";
import { AROMI_URL } from "..";
require("dotenv").config({ path: "../.env" });

type FoodTime = "Aamupala" | "Lounas" | "Kasvislounas";

interface DayMenu {
  date: string,
  menu: Record<FoodTime, string>
}

const menuData: { [key: string]: DayMenu } = {}

const parseFood = (food: string): { time: FoodTime, food: string } => {
  let parsed = food;
  while (parsed.includes(" :")) {
    parsed = parsed.replace(" :", ":")
  }

  const [time, content] = parsed.split(": ");
  if (time === "Aamupala" || time === "Lounas" || time === "Kasvislounas") {
    return {
      time,
      food: content
    };
  }
  else {
    throw new Error(`Unknown food time ${time}`);
  }
}

export const retrieveData = async (dateMode: number) => {
  console.log("Retrieving data");
  if (dateMode <= 0) return null;

  const data = await axios.get(String(AROMI_URL), {
    params: {
      DateMode: dateMode
    }
  })

  var result = JSON.parse(convert.xml2json(data.data, { compact: true, spaces: 4 }));
  if (!(result && result.rss && result.rss.channel && result.rss.channel.item)) return null;

  const d: DayMenu[] = result.rss.channel.item.map((dayFood: any) => {
    const date = String(dayFood.title._text).substring(3);
    const menu = String(dayFood.description._cdata);
    const foods = menu.split("<br>");

    const parsedFoods = foods.reduce((prev, line) => {
      const food = parseFood(line);
      return {
        ...prev,
        [food.time]: food.food.replace(/\s{2,}/, " ")
      }
    }, {});
    return { date, menu: parsedFoods }
  });

  d.forEach(day => {
    menuData[day.date] = day
  })

  return menuData;
}

export const getFood = async (date: Date) => {
  const d = format(date, "d.L.yyyy");

  if (!Object.keys(menuData).includes(d)) {
    const currentWeek = getWeek(new Date(), { weekStartsOn: 1 });
    const dateWeek = getWeek(date, { weekStartsOn: 1 })
    const dateMode = dateWeek - currentWeek + 1;
    await retrieveData(dateMode);
  }

  return menuData[d] || null;
}