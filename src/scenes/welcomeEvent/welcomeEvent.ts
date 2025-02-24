import {
  BTN_ACTION_CAPTIONS,
  EVENT_NAMES,
  INLINE_KEYBOARD_TEXTS,
  SCENE_NAMES,
} from "../../constants";
import { Scenes } from "telegraf";
import {
  allEvents,
  deleteEvent,
  editEvent,
  nowEvent,
  upcomingEvent,
} from "../../commands/commands";
import { logger } from "../../utils/logger";
import { genWelcomeText } from "./utils";

export const welcomeEventScene = new Scenes.BaseScene(SCENE_NAMES.WELCOME);

welcomeEventScene.enter(async (ctx: any) => {
  const { params } = ctx.session;
  console.log("params", params);
  const { isPrivateChat, isPersonal, userInfo } = params;

  const text = genWelcomeText(isPrivateChat, isPersonal, userInfo.firstName);

  const btnToday: { text: string; callback_data: string }[] = [
    { text: INLINE_KEYBOARD_TEXTS.TODAY, callback_data: EVENT_NAMES.today },
  ];
  const btnUpcoming: { text: string; callback_data: string }[] = [
    {
      text: INLINE_KEYBOARD_TEXTS.UPCOMING,
      callback_data: EVENT_NAMES.upcoming,
    },
  ];
  const btnAll: { text: string; callback_data: string }[] = [
    { text: INLINE_KEYBOARD_TEXTS.ALL, callback_data: EVENT_NAMES.all },
  ];
  const btnBack: { text: string; callback_data: string }[] = [
    { text: BTN_ACTION_CAPTIONS.cancel, callback_data: EVENT_NAMES.cancel },
  ];
  const inlineKeyboard: { text: string; callback_data: string }[][] = [
    btnToday,
    btnUpcoming,
  ];

  if (isPrivateChat) {
    inlineKeyboard.push(btnAll);
    inlineKeyboard.push([
      {
        text: INLINE_KEYBOARD_TEXTS.CREATE,
        callback_data: EVENT_NAMES.newEvent,
      },
      // { text: INLINE_KEYBOARD_TEXTS.EDIT, callback_data: EVENT_NAMES.edit },
      { text: INLINE_KEYBOARD_TEXTS.DELETE, callback_data: EVENT_NAMES.delete },
    ]);
    inlineKeyboard.push(btnBack);
  }

  ctx.sendMessage(`<b>${text}</b>`, {
    parse_mode: "HTML",
    reply_markup: {
      inline_keyboard: inlineKeyboard,
    },
  });
});

welcomeEventScene.action(EVENT_NAMES.today, async (ctx: any) => {
  try {
    ctx.deleteMessage(ctx.update.callback_query.message.message_id);
  } catch (error) {
    logger.error("Ошибка удаления сообщения", error);
  }
  return nowEvent(ctx);
});

welcomeEventScene.action(EVENT_NAMES.upcoming, async (ctx: any) => {
  ctx.deleteMessage(ctx.update.callback_query.message.message_id);
  return upcomingEvent(ctx);
});

welcomeEventScene.action(EVENT_NAMES.all, async (ctx: any) => {
  ctx.deleteMessage(ctx.update.callback_query.message.message_id);
  return allEvents(ctx);
});

welcomeEventScene.action(EVENT_NAMES.newEvent, async (ctx: any) => {
  ctx.deleteMessage(ctx.update.callback_query.message.message_id);
  return ctx.scene.enter(SCENE_NAMES.CREATE);
});

welcomeEventScene.action(EVENT_NAMES.edit, async (ctx: any) => {
  ctx.deleteMessage(ctx.update.callback_query.message.message_id);
  return editEvent(ctx);
});

welcomeEventScene.action(EVENT_NAMES.delete, async (ctx: any) => {
  ctx.deleteMessage(ctx.update.callback_query.message.message_id);
  return deleteEvent(ctx);
});

welcomeEventScene.action(EVENT_NAMES.cancel, async (ctx: any) => {
  ctx.deleteMessage(ctx.update.callback_query.message.message_id);
  return ctx.scene.leave();
});

welcomeEventScene.leave(async (ctx: any) => {
  console.log("welcomeEventScene.leave");
  return ctx.scene.leave();
});
