import dotenv from "dotenv";
import { connectDB } from "./db";
import { setupBot } from "./bot";
import { scheduleJob } from "node-schedule";
import { findCurrentEvents } from "./db/controllers/Events";
import { getDateDDMMYYYY } from "./utils";

const EVERY_DAY_EVENT_TIME = "0 10 * * *";

async function sendSheduleMessage(bot: any) {
  const result = await findCurrentEvents();
  if (result.length === 0) {
    bot.telegram.sendMessage(process.env.CHAT_ID, "На сегодня событий нет");
  } else {
    let str = `<b>События на сегодня <i>${getDateDDMMYYYY(result[0].date)}</i>:</b>`;
    result.forEach((item: any) => {
      str += `\n${item.name}`;
    });
    await bot.telegram.sendMessage(process.env.CHAT_ID, str, {
      parse_mode: "HTML",
    });
  }
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
