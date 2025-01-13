import { Scenes } from "telegraf";
import { SCENE_NAMES } from "../../constants";
import { findUpcomingEvents } from "../../db/controllers/Events";
import { getDateDDMMYYYY } from "../../utils";

export const getUpcomingEvent = new Scenes.BaseScene(
  SCENE_NAMES.UPCOMING_EVENT
);

getUpcomingEvent.enter(async (ctx: any) => {
  const result = await findUpcomingEvents();
  if (result.length === 0) {
    ctx.sendMessage("Событий нет", { parse_mode: "HTML" });
    return getUpcomingEvent.leave(ctx);
  }
  let str = `<b>Ближайшие события:</b>`;
  result.forEach((item: any) => {
    str += `\n${item.name} - ${getDateDDMMYYYY(item.date)}`;
  });
  await ctx.sendMessage(str, { parse_mode: "HTML" });
  return getUpcomingEvent.leave(ctx);
});

getUpcomingEvent.leave((ctx: any) => {
  return ctx.scene.leave();
});
