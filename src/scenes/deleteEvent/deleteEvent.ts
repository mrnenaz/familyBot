import { Markup, Scenes } from "telegraf";
import { BTN_ACTION_CAPTIONS, EVENT_NAMES, SCENE_NAMES } from "../../constants";
import { stepOne } from "./steps";
import { deleteEvent, getAllEvents } from "../../db/controllers/Events";
import { getDateDDMMYYYY } from "../../utils";
import { getAllPersonalEvents } from "../../db/controllers/EventsPersonal";

export const deleteEventScene = new Scenes.WizardScene(
  SCENE_NAMES.DELETE,
  stepOne
);

deleteEventScene.enter(async (ctx: any) => {
  console.log("deleteEventScene");
  ctx.scene.state.event = {};
  const { isPersonal, userInfo } = ctx.session.params;
  const result = isPersonal
    ? await getAllPersonalEvents(userInfo.id)
    : await getAllEvents();
  if (result.length === 0) {
    ctx.sendMessage("События не найдены", { parse_mode: "HTML" });
    return deleteEventScene.leave(ctx);
  }
  let str = isPersonal
    ? `<u>Выберите <b>ПЕРСОНАЛЬНОЕ</b> событие из списка и отправьте его название в ответном сообщении</u>`
    : `<u><b>Выберите событие из списка и отправьте его название в ответном сообщении</b></u>`;
  result.forEach((item: any) => {
    str += `\n${getDateDDMMYYYY(item.date)} - <i>${item.name}</i>`;
  });
  await ctx.sendMessage(str, {
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
  ctx.deleteMessage(ctx.update.callback_query.message.message_id);
  ctx.scene.enter(SCENE_NAMES.WELCOME);
});

deleteEventScene.leave((ctx) => {
  console.log("deleteEventScene.leave");
  return ctx.scene.leave();
});
