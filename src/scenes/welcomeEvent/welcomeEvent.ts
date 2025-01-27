import { isPrivate } from "../../utils";
import { BTN_TEXTS, EVENT_NAMES, SCENE_NAMES } from "../../constants";
import { Scenes } from "telegraf";
import {
  allEvents,
  deleteEvent,
  editEvent,
  nowEvent,
  upcomingEvent,
} from "../../commands/commands";

export const welcomeEventScene = new Scenes.BaseScene(SCENE_NAMES.WELCOME);

welcomeEventScene.enter(async (ctx: any) => {
  const isPrivateChat = await isPrivate(ctx);
  const text = isPrivateChat ? "Да, мастер?" : "Чего изволите-c?";
  const btnToday = [{ text: "Сегодня", callback_data: EVENT_NAMES.today }];
  const btnUpcoming = [
    { text: "Ближайшие", callback_data: EVENT_NAMES.upcoming },
  ];
  const btnAll = [{ text: "Все", callback_data: EVENT_NAMES.all }];
  const inlineKeyboard = [btnToday, btnUpcoming];
  if (isPrivateChat) {
    inlineKeyboard.push(btnAll);
    inlineKeyboard.push([
      { text: "Создать", callback_data: EVENT_NAMES.newEvent },
      { text: "Редактировать", callback_data: EVENT_NAMES.edit },
      { text: "Удалить", callback_data: EVENT_NAMES.delete },
    ]);
  }

  ctx.sendMessage(`<b>${text}</b>`, {
    parse_mode: "HTML",
    reply_markup: {
      inline_keyboard: inlineKeyboard,
    },
  });
});

welcomeEventScene.action(EVENT_NAMES.today, async (ctx: any) => {
  ctx.deleteMessage(ctx.update.callback_query.message.message_id);
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
  return ctx.scene.enter(SCENE_NAMES.TEST);
});

welcomeEventScene.action(EVENT_NAMES.edit, async (ctx: any) => {
  ctx.deleteMessage(ctx.update.callback_query.message.message_id);
  return editEvent(ctx);
});

welcomeEventScene.action(EVENT_NAMES.delete, async (ctx: any) => {
  ctx.deleteMessage(ctx.update.callback_query.message.message_id);
  return deleteEvent(ctx);
});

welcomeEventScene.leave(async (ctx: any) => {
  console.log("welcomeEventScene.leave");
  return ctx.scene.leave();
});
