import { Context, Markup, Scenes } from "telegraf";
import { BTN_ACTION_CAPTIONS, EVENT_NAMES, SCENE_NAMES } from "../../constants";
import { stepOne, stepTwo } from "./steps";
import { insertNewEvent, insertNewPersonalEvent } from "../../db";

export const createScene = new Scenes.WizardScene(
  SCENE_NAMES.CREATE,
  stepOne,
  stepTwo
);

createScene.enter(async (ctx: any) => {
  ctx.reply("Добавить новое событие?", {
    reply_markup: {
      inline_keyboard: [
        [
          Markup.button.callback(BTN_ACTION_CAPTIONS.yes, EVENT_NAMES.create),
          Markup.button.callback(BTN_ACTION_CAPTIONS.no, EVENT_NAMES.cancel),
        ],
      ],
    },
  });
});

createScene.action(EVENT_NAMES.create, async (ctx: any) => {
  ctx.scene.state = {
    event: {},
    messageForDeleted: [],
  };
  await ctx.reply("<b>Введите название события</b>", {
    parse_mode: "HTML",
    reply_markup: {
      inline_keyboard: [
        [
          Markup.button.callback(
            BTN_ACTION_CAPTIONS.cancel,
            EVENT_NAMES.cancel
          ),
        ],
      ],
    },
  });
});

createScene.action(EVENT_NAMES.save, async (ctx: any) => {
  const { isPersonal, userInfo } = ctx.session.params;
  const eventData: any = ctx.scene.state.event;

  const result = isPersonal
    ? await insertNewPersonalEvent(eventData, userInfo)
    : await insertNewEvent(eventData);
  if (result) {
    ctx.reply("Добавлено!");
  } else {
    ctx.reply("Произошла ошибка. Придется начать занаво.");
  }
  return ctx.scene.leave();
});

createScene.action(EVENT_NAMES.cancel, async (ctx: any) => {
  ctx.deleteMessage(ctx.update.callback_query.message.message_id);
  ctx.scene.enter(SCENE_NAMES.WELCOME);
});

createScene.leave(async (ctx: any) => {
  return ctx.scene.leave();
});
