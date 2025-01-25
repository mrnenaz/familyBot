import { Telegraf, Markup, Scenes, Context, session } from "telegraf";
import schedule from "node-schedule";
import { COMMAND_NAMES, COMMANDS, GROUP_TYPES, ROLES } from "./constants";
import { startNewEvent, upcomingEvent } from "./commands";
import {
  allEventsScene,
  deleteEventScene,
  editEventScene,
  getUpcomingEvent,
  todayScene,
} from "./scenes";
import { testScene } from "./scenes/testScene/testScene";
import {
  allEvents,
  deleteEvent,
  editEvent,
  nowEvent,
  testCommand,
} from "./commands/commands";
import { findCurrentEvents } from "./db/controllers/Events";

export const setupBot = async () => {
  const bot = new Telegraf(process.env.GribFamilyButlerBot);
  const stage = new Scenes.Stage<any>([
    allEventsScene,
    getUpcomingEvent,
    testScene,
    todayScene,
    editEventScene,
    deleteEventScene,
  ]);
  bot.telegram.setMyCommands([COMMANDS[0]]);

  bot.use(session());
  bot.use(stage.middleware());

  bot.use((ctx, next) => {
    return next();
  });

  bot.command(COMMAND_NAMES.NEW_EVENT, async (ctx: any) => {
    // const chatId = ctx.chat.id;
    // console.log(`ID группы: ${chatId}`);
    // return startNewEvent(ctx);
    return testCommand(ctx);
  });

  bot.command(COMMAND_NAMES.UPCOMING_EVENT, async (ctx: any) => {
    return upcomingEvent(ctx);
  });

  bot.command(COMMAND_NAMES.TODAY, async (ctx: any) => {
    return nowEvent(ctx);
  });

  bot.command(COMMAND_NAMES.ALL_EVENTS, async (ctx: any) => {
    return allEvents(ctx);
  });

  bot.command(COMMAND_NAMES.EDIT_EVENT, async (ctx: any) => {
    return editEvent(ctx);
  });

  bot.command(COMMAND_NAMES.DELETE_EVENT, async (ctx: any) => {
    return deleteEvent(ctx);
  });

  bot.command(COMMAND_NAMES.START, async (ctx: any) => {
    const chatType = await ctx.chat.type;
    if (chatType === GROUP_TYPES.PRIVATE) {
      await ctx.reply("Команды добавлены! Обновление займет около минуты.");
      return bot.telegram.setMyCommands(COMMANDS.slice(1));
    } else {
      return ctx.reply("Команды доступны только в личных сообщениях боту.");
    }
  });

  bot.on("message", async (ctx: any) => {
    console.log("chat", ctx.chat.type);
    const hasNowEvent = /что на сегодня/g.test(ctx.message.text);
    const hasUpcomnigEvent =
      /ближайшее событие/g.test(ctx.message.text) ||
      /ближайшие события/g.test(ctx.message.text);
    if (hasNowEvent) {
      return nowEvent(ctx);
    }
    if (hasUpcomnigEvent) {
      return upcomingEvent(ctx);
    }
  });

  // bot.action(/send (.+)/, async (ctx) => {
  //   await handleCallbackBtnClick(ctx);
  // });

  // bot.action(/participation (.+)/, async (ctx) => {
  //   return handleGiveAwayCallbackBtnClick(ctx);
  // });

  // bot.command(COMMAND_NAMES.GET_INFO, async (ctx) => {
  //   return startGetInfo(ctx);
  // });

  // bot.command(COMMAND_NAMES.CREATE_GIVEAWAY, async (ctx: any) => {
  //   return startCreateGiveAway(ctx);
  // });

  // bot.command(COMMAND_NAMES.GET_GIVEAWAYS_INFO, async (ctx: any) => {
  //   return startGetGiveawaysInfo(ctx);
  // });

  /**
   *
   */
  // const channel = process.env.CHAT_ID;
  // // const date = new Date(2025, 0, 10, 8, 51, 0);
  // const job = schedule.scheduleJob("21 13 * * *", async () => {
  // const job = schedule.scheduleJob({ hour: "01", minute: "19" }, async () => {
  //   const result = await findCurrentEvents();
  //   console.log("result", result);
  //   if (result.length === 0) {
  //     bot.telegram.sendMessage(channel, "Событий нет", { parse_mode: "HTML" });
  //   }
  // });
  // console.log("job", job);
  /**
   *
   */

  return bot;
};
