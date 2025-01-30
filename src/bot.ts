import { Telegraf, Scenes, session } from "telegraf";
import { COMMAND_NAMES, COMMANDS } from "./constants";
import { upcomingEvent } from "./commands";
import {
  allEventsScene,
  deleteEventScene,
  editEventScene,
  getUpcomingEvent,
  todayScene,
} from "./scenes";
import { testScene } from "./scenes/testScene/testScene";
import { nowEvent, welcomeEvent } from "./commands/commands";
import { welcomeEventScene } from "./scenes/welcomeEvent";

export const setupBot = async () => {
  const bot = new Telegraf(process.env.GribFamilyButlerBot);
  const stage = new Scenes.Stage<any>([
    allEventsScene,
    getUpcomingEvent,
    testScene,
    todayScene,
    editEventScene,
    deleteEventScene,
    welcomeEventScene,
  ]);
  bot.telegram.setMyCommands([COMMANDS[0]]);

  bot.use(session());
  bot.use(stage.middleware());

  bot.use((ctx, next) => {
    return next();
  });

  bot.command(COMMAND_NAMES.WELCOME, async (ctx: any) => {
    return welcomeEvent(ctx);
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

  return bot;
};
