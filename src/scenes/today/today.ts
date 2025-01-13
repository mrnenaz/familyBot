import { findCurrentEvents } from "../../db/controllers/Events";
import { SCENE_NAMES } from "../../constants";
import { Scenes } from "telegraf";
import { getDateDDMMYYYY } from "../../utils";

export const todayScene = new Scenes.BaseScene(SCENE_NAMES.TODAY);

todayScene.enter(async (ctx: any) => {
  const result = await findCurrentEvents();
  console.log("result", result);
  if (result.length === 0) {
    ctx.sendMessage("Событий нет", { parse_mode: "HTML" });
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
