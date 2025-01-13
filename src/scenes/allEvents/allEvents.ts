import { Scenes } from "telegraf";
import { SCENE_NAMES } from "../../constants";
import { getAllEvents } from "../../db/controllers/Events";
import { getDateDDMMYYYY } from "../../utils";

export const allEventsScene: any = new Scenes.BaseScene(SCENE_NAMES.ALL);

allEventsScene.enter(async (ctx) => {
  console.log("allEventsScene");
  const result = await getAllEvents();
  if (result.length === 0) {
    ctx.sendMessage("События не найдены", { parse_mode: "HTML" });
    return allEventsScene.leave(ctx);
  }
  let str = `<b>Все события:</b>`;
  result.forEach((item: any) => {
    str += `\n${item.name} - ${getDateDDMMYYYY(item.date)}`;
  });
  await ctx.sendMessage(str, { parse_mode: "HTML" });
  return allEventsScene.leave(ctx);
});

allEventsScene.leave = async (ctx) => {
  return ctx.scene.leave();
};
