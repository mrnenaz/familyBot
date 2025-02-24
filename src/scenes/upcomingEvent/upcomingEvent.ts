import { Scenes } from "telegraf";
import { SCENE_NAMES } from "../../constants";
import { findUpcomingEvents } from "../../db/controllers/Events";
import { getDateDDMMYYYY } from "../../utils";
import { findPersonalUpcomingEvents } from "../../db/controllers/EventsPersonal";

export const getUpcomingEvent = new Scenes.BaseScene(
  SCENE_NAMES.UPCOMING_EVENT
);

getUpcomingEvent.enter(async (ctx: any) => {
  const { isPersonal, userInfo } = ctx.session.params;
  const result = isPersonal
    ? await findPersonalUpcomingEvents(userInfo.id)
    : await findUpcomingEvents();
  if (result.length === 0) {
    const emptyTest = isPersonal
      ? "ПЕРСОНАЛЬНЫЕ события не найдены"
      : "События не найдены";
    ctx.sendMessage(emptyTest, { parse_mode: "HTML" });
    return getUpcomingEvent.leave(ctx);
  }
  let str = `<u>Ближайшие события:</u>`;
  result.forEach((item: any) => {
    str += `\n${getDateDDMMYYYY(item.date)} - <i>${item.name}</i>`;
  });
  await ctx.sendMessage(str, { parse_mode: "HTML" });
  return getUpcomingEvent.leave(ctx);
});

getUpcomingEvent.leave((ctx: any) => {
  return ctx.scene.leave();
});
