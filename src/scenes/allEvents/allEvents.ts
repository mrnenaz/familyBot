import { Scenes } from "telegraf";
import { SCENE_NAMES } from "../../constants";
import { getAllEvents } from "../../db/controllers/Events";
import { getDateDDMMYYYY } from "../../utils";
import { getAllPersonalEvents } from "../../db";

export const allEventsScene: any = new Scenes.BaseScene(SCENE_NAMES.ALL);

allEventsScene.enter(async (ctx) => {
  console.log("allEventsScene");
  const { isPersonal, userInfo } = ctx.session.params;

  const result = isPersonal
    ? await getAllPersonalEvents(userInfo.id)
    : await getAllEvents();
  if (result.length === 0) {
    const emptyTest = isPersonal
      ? "ПЕРСОНАЛЬНЫЕ события не найдены"
      : "События не найдены";
    await ctx.sendMessage(emptyTest, { parse_mode: "HTML" });
    return allEventsScene.leave(ctx);
  }
  let str = isPersonal
    ? `<u>Все <b>ПЕРСОНАЛЬНЫЕ</b> события:</u>`
    : `<u><b>Все события:</b></u>`;
  result.forEach((item: any) => {
    str += `\n${getDateDDMMYYYY(item.date)} - <i>${item.name}</i>`;
  });
  await ctx.sendMessage(str, { parse_mode: "HTML" });
  return allEventsScene.leave(ctx);
});

allEventsScene.leave = async (ctx) => {
  return ctx.scene.leave();
};
