import { findCurrentEvents } from "../../db/controllers/Events";
import { SCENE_NAMES } from "../../constants";
import { Scenes } from "telegraf";
import { getDateDDMMYYYY } from "../../utils";
import { logger } from "../../utils/logger";
import { findCurrentPersonalEvents } from "../../db";

export const todayScene = new Scenes.BaseScene(SCENE_NAMES.TODAY);

todayScene.enter(async (ctx: any) => {
  logger.info("Запуск сценария todayScene");
  const { isPersonal, userInfo } = ctx.session.params;
  const result = isPersonal
    ? await findCurrentPersonalEvents(userInfo.id)
    : await findCurrentEvents();
  if (result.length === 0) {
    const emptyTest = isPersonal
      ? "ПЕРСОНАЛЬНЫЕ события не найдены"
      : "События не найдены";
    await ctx.sendMessage(emptyTest, { parse_mode: "HTML" });
    return todayScene.leave(ctx);
  }
  let str = `События <b>сегодня</b> <u><i>${getDateDDMMYYYY(result[0].date)}</i>:</u>`;
  result.forEach((item: any) => {
    str += `\n${item.name}`;
  });
  await ctx.sendMessage(str, { parse_mode: "HTML" });
  return todayScene.leave(ctx);
});

todayScene.leave((ctx: any) => {
  return ctx.scene.leave();
});
