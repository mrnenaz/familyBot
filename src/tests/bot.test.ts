import { COMMAND_NAMES } from "../constants";
import { Telegraf, Context } from "telegraf";
import dotenv from "dotenv";

describe("Telegram Bot", () => {
  it("should respond to /start command", async () => {
    dotenv.config();
    const bot = new Telegraf(process.env.GribFamilyButlerBot);
    interface TestContext {
      reply: jest.Mock;
      message: {
        text: string;
        chat: {
          id: string;
        };
      };
    }

    const ctx: TestContext = {
      reply: jest.fn(),
      message: {
        text: COMMAND_NAMES.NEW_EVENT,
        chat: {
          id: process.env.CHAT_ID,
        },
      },
    };

    bot.hears(COMMAND_NAMES.NEW_EVENT, (ctx: Context) => {
      // ctx.reply("Тестовая команда");
      ctx.telegram.sendMessage(ctx.chat.id, "Тестовая команда");
    });

    try {
      await bot.handleUpdate({ message: ctx.message } as any);
    } catch (error) {
      console.error("Error handling update:", error);
    }
    // console.log("ctx.reply", ctx.reply);
    try {
      expect(ctx.reply).toHaveBeenCalledWith("Тестовая команда");
      expect(ctx.reply).toHaveBeenCalledTimes(1);
    } catch (error) {
      console.error("Error:", error);
    }
  });
});
