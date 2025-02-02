import dotenv from "dotenv";
import { connectDB } from "./db";
import { setupBot } from "./bot";
import { scheduleJob } from "node-schedule";
import { findCurrentEvents, findUpcomingEvents } from "./db/controllers/Events";
import { getDateDDMMYYYY } from "./utils";

const EVERY_DAY_EVENT_TIME = "0 9 * * *";

async function sendSheduleMessage(bot: any) {
  const todayResult = await findCurrentEvents();
  const upComResult = await findUpcomingEvents();
  let str: string = "";
  if (todayResult.length === 0) {
    str = `<b>На сегодня событий нет</b>\n`;
  } else {
    str = `<b>События на сегодня <i>${getDateDDMMYYYY(todayResult[0].date)}</i>:</b>`;
    todayResult.forEach((item: any) => {
      str += `\n${item.name}`;
    });
  }
  if (upComResult.length !== 0) {
    str += `\n<b>Ближайшие события:</b>`;
    upComResult.forEach((item: any) => {
      str += `\n${item.name} - ${getDateDDMMYYYY(item.date)}`;
    });
  }
  await bot.telegram.sendMessage(process.env.CHAT_ID, str, {
    parse_mode: "HTML",
  });
}

(async () => {
  try {
    dotenv.config();
    await connectDB();
    const bot: any = await setupBot();
    const job = scheduleJob(EVERY_DAY_EVENT_TIME, async () => {
      try {
        sendSheduleMessage(bot);
      } catch (error) {
        console.log("Ошибка запуска: ", error);
      }
    });
    bot.launch();
    console.log("</ Бот успешно запущен >");
    process.on("SIGINT", () => {
      job.cancel();
      bot.stop();
      console.log("Бот остановлен");
      process.exit(0);
    });
  } catch (error) {
    console.log("Ошибка запуска: ", error);
  }
})();
