import { hasUserInPrivilegedList, isPrivate } from "../utils";
import {
  BTN_ACTION_CAPTIONS,
  EVENT_NAMES,
  INLINE_KEYBOARD_TEXTS,
  SCENE_NAMES,
} from "../constants";
import { Scenes } from "telegraf";
import { logger } from "../utils/logger";
import { welcomeEvent } from "../commands/commands";
import { existUser } from "../db/controllers/common";
import { insertNewUser } from "../db";

export const identificationEventScene = new Scenes.BaseScene(
  SCENE_NAMES.IDENTIFICATION
);

identificationEventScene.enter(async (ctx: any) => {
  console.log("identificationEventScene.enter", ctx.update.message.from);
  const isPrivateChat = await isPrivate(ctx);
  const isUserInList = hasUserInPrivilegedList(ctx);

  const userId = String(ctx.update.message.from.id);
  const userInfo = {
    id: userId,
    uuid: userId,
    username: ctx.update.message.from.username,
    firstName: ctx.update.message.from.first_name,
    lastName: ctx.update.message.from.last_name,
  };
  const hasUser = await existUser(userId);
  const params = {
    isPrivateChat,
    isUserInList,
    hasUser,
    userInfo,
  };
  ctx.session.params = params;

  if (!isPrivateChat || !isUserInList) {
    return ctx.scene.enter(SCENE_NAMES.WELCOME);
  }
  if (isPrivate && isUserInList) {
    if (isUserInList && !hasUser) {
      await insertNewUser(userInfo);
    }
    const inlineKeyboard = [];
    const btnGotoPersonal = [
      {
        text: INLINE_KEYBOARD_TEXTS.PERSONAL,
        callback_data: EVENT_NAMES.welcomePersonal,
      },
    ];
    const btnGotoGeneral = [
      {
        text: INLINE_KEYBOARD_TEXTS.GENERAL,
        callback_data: EVENT_NAMES.welcome,
      },
    ];
    const btnBack: { text: string; callback_data: string }[] = [
      { text: BTN_ACTION_CAPTIONS.cancel, callback_data: EVENT_NAMES.cancel },
    ];
    inlineKeyboard.push(btnGotoPersonal);
    inlineKeyboard.push(btnGotoGeneral);
    inlineKeyboard.push(btnBack);
    ctx.sendMessage(`<b>Выбрать что показывать:</b>`, {
      parse_mode: "HTML",
      reply_markup: {
        inline_keyboard: inlineKeyboard,
      },
    });
  }
});

identificationEventScene.action(
  EVENT_NAMES.welcomePersonal,
  async (ctx: any) => {
    try {
      ctx.deleteMessage(ctx.update.callback_query.message.message_id);
    } catch (error) {
      logger.error("Ошибка удаления сообщения", error);
    }
    ctx.session.params.isPersonal = true;
    return welcomeEvent(ctx);
  }
);

identificationEventScene.action(EVENT_NAMES.welcome, async (ctx: any) => {
  try {
    ctx.deleteMessage(ctx.update.callback_query.message.message_id);
  } catch (error) {
    logger.error("Ошибка удаления сообщения", error);
  }
  ctx.session.params.isPersonal = false;
  return welcomeEvent(ctx);
});

identificationEventScene.action(EVENT_NAMES.cancel, async (ctx: any) => {
  ctx.deleteMessage(ctx.update.callback_query.message.message_id);
  return ctx.scene.leave();
});

identificationEventScene.leave(async (ctx: any) => {
  console.log("identificationEventScene.leave");
  return ctx.scene.leave();
});
