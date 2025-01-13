import { Telegraf, Markup, Scenes, Context, session } from "telegraf";
// import { COMMANDS, COMMAND_NAMES } from "./constants";
// import { whatWeatherNotIScene } from "./scenes/create";
// import {
//   start,
//   startCreateGiveAway,
//   startGetGiveawaysInfo,
//   startGetInfo,
//   startWhatWeather,
// } from "./commands/commands";
// import {
//   handleCallbackBtnClick,
//   handleGiveAwayCallbackBtnClick,
// } from "./commands/actions";
// import { callbackScene } from "./scenes/callback";
// import { createGiveaway } from "./scenes/giveaway";
// import { giveAwayCallbackScene } from "./scenes/giveawayCallback";
// import { getGiveawaysInfo } from "./scenes/getGiveawaysInfo";
import schedule from "node-schedule";
import { COMMAND_NAMES, COMMANDS } from "./constants";
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
  bot.telegram.setMyCommands(COMMANDS);

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
