import {
  findEvent,
  getAllEvents,
  updateEvent,
} from "../../db/controllers/Events";
import { BTN_TEXTS, EVENT_NAMES, SCENE_NAMES } from "../../constants";
import { Markup, Scenes } from "telegraf";
import { getDateDDMMYYYY } from "../../utils";
import { stepOne, stepThree, stepTwo } from "./steps";

export const editEventScene = new Scenes.WizardScene(
  SCENE_NAMES.EDIT,
  stepOne,
  stepTwo,
  stepThree
);

editEventScene.enter(async (ctx: any) => {
  console.log("editEventScene");
  ctx.scene.state.event = {};
  const result = await getAllEvents();
  if (result.length === 0) {
    ctx.sendMessage("События не найдены", { parse_mode: "HTML" });
    return editEventScene.leave(ctx);
  }
  let str = `<b>Выберите событие из списка и отправьте его название в ответном сообщении</b>`;
  result.forEach((item: any) => {
    str += `\n${item.name} - ${getDateDDMMYYYY(item.date)}`;
  });
  await ctx.sendMessage(str, {
    parse_mode: "HTML",
    reply_markup: {
      inline_keyboard: [
        [Markup.button.callback(BTN_TEXTS.cancel, EVENT_NAMES.cancel)],
      ],
    },
  });
});

editEventScene.action(EVENT_NAMES.save, async (ctx: any) => {
  const eventData: any = ctx.scene.state.event;
  const result = await updateEvent(ctx.scene.state.event.id, eventData);
  if (result) {
    ctx.reply("Изменения сохранены!");
  } else {
    ctx.reply("Произошла ошибка. Придется начать занаво.");
  }
  return ctx.scene.leave();
});

editEventScene.action(EVENT_NAMES.cancel, async (ctx: any) => {
  return ctx.scene.leave();
});

editEventScene.leave((ctx: any) => {
  console.log("editEventScene.leave");
  return ctx.scene.leave();
});
