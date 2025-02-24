import { BTN_ACTION_CAPTIONS, EVENT_NAMES } from "../../constants";
import { findEvent } from "../../db/controllers/Events";
import { getDateDDMMYYYY } from "../../utils";
import { Markup, Telegraf } from "telegraf";

export const stepOne = Telegraf.on("text", async (ctx: any) => {
  console.log("stepOne");
  const result = await findEvent(ctx.message.text);
  console.log("result", result);
  ctx.scene.state.event.id = result._id;
  await ctx.sendMessage(
    `Событие <b>${result.name}</b> от <b>${getDateDDMMYYYY(result.date)}</b>\nБудет удалено`,
    {
      parse_mode: "HTML",
      reply_markup: {
        inline_keyboard: [
          [Markup.button.callback(BTN_ACTION_CAPTIONS.yes, EVENT_NAMES.delete)],
          [Markup.button.callback(BTN_ACTION_CAPTIONS.no, EVENT_NAMES.cancel)],
        ],
      },
    }
  );
});
