import { Markup, Scenes } from "telegraf";
import { BTN_TEXTS, EVENT_NAMES, SCENE_NAMES } from "../../constants";
import { stepOne } from "./steps";
import { deleteEvent, getAllEvents } from "../../db/controllers/Events";
import { getDateDDMMYYYY } from "../../utils";

export const deleteEventScene = new Scenes.WizardScene(
  SCENE_NAMES.DELETE,
  stepOne
);

deleteEventScene.enter(async (ctx: any) => {
  console.log("deleteEventScene");
  ctx.scene.state.event = {};
  const result = await getAllEvents();
  if (result.length === 0) {
    ctx.sendMessage("События не найдены", { parse_mode: "HTML" });
    return deleteEventScene.leave(ctx);
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

deleteEventScene.action(EVENT_NAMES.delete, async (ctx: any) => {
  const result = await deleteEvent(ctx.scene.state.event.id);
  if (result) {
    ctx.reply("Удалено!");
  } else {
    ctx.reply("Произошла ошибка. Придется начать занаво.");
  }
  return ctx.scene.leave();
});

deleteEventScene.action(EVENT_NAMES.cancel, async (ctx: any) => {
  return ctx.scene.leave();
});

deleteEventScene.leave((ctx) => {
  console.log("deleteEventScene.leave");
  return ctx.scene.leave();
});
