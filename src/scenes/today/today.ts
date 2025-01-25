import { findCurrentEvents } from "../../db/controllers/Events";
import { SCENE_NAMES } from "../../constants";
import { Scenes } from "telegraf";
import { getDateDDMMYYYY } from "../../utils";

export const todayScene = new Scenes.BaseScene(SCENE_NAMES.TODAY);

todayScene.enter(async (ctx: any) => {
  console.log("ctx.", ctx.chat.id);
  console.log("ctx.", ctx.message.message_id);
  const result = await findCurrentEvents();
  console.log("result", result);
  if (result.length === 0) {
    ctx.reply("Событий нет", {
      reply_to_message_id: ctx.message.message_id,
      allow_sending_without_reply: true,
    });
    return todayScene.leave(ctx);
  }
  let str = `<b>События сегодня <i>${getDateDDMMYYYY(result[0].date)}</i>:</b>`;
  result.forEach((item: any) => {
    str += `\n${item.name}`;
  });
  await ctx.sendMessage(str, { parse_mode: "HTML" });
  return todayScene.leave(ctx);
});

todayScene.leave((ctx: any) => {
  return ctx.scene.leave();
});
