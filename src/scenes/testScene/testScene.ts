import { Markup, Scenes } from "telegraf";
import { BTN_TEXTS, EVENT_NAMES, SCENE_NAMES } from "../../constants";
import { stepOne, stepTwo } from "./steps";
import { insertNewEvent } from "../../db";

export const testScene = new Scenes.WizardScene(
  SCENE_NAMES.TEST,
  stepOne,
  stepTwo
);

testScene.enter(async (ctx) => {
  // await ctx.sendMessage("testScene");
  ctx.reply("Добавить новое событие?", {
    reply_markup: {
      inline_keyboard: [
        [
          Markup.button.callback(BTN_TEXTS.yes, EVENT_NAMES.newEvent),
          Markup.button.callback(BTN_TEXTS.no, EVENT_NAMES.cancel),
        ],
      ],
    },
  });
});

testScene.action(EVENT_NAMES.newEvent, async (ctx: any) => {
  ctx.scene.state.event = {};
  ctx.reply("<b>Введите название события</b>", {
    parse_mode: "HTML",
    reply_markup: {
      inline_keyboard: [
        [Markup.button.callback(BTN_TEXTS.cancel, EVENT_NAMES.cancel)],
      ],
    },
  });
});

testScene.action(EVENT_NAMES.save, async (ctx: any) => {
  const eventData: any = ctx.scene.state.event;
  const result = await insertNewEvent(eventData);
  if (result) {
    ctx.reply("Добавлено!");
  } else {
    ctx.reply("Произошла ошибка. Придется начать занаво.");
  }
  return ctx.scene.leave();
});

testScene.action(EVENT_NAMES.cancel, async (ctx: any) => {
  ctx.scene.state.event = {};
  return ctx.scene.leave();
});

testScene.leave((ctx) => {
  ctx.reply("До свидания!");
  return ctx.scene.leave();
});
