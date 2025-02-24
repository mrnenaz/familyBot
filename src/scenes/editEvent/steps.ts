import { formatDate, getDateDDMMYYYY } from "../../utils";
import { findEvent } from "../../db/controllers/Events";
import { Markup, Telegraf } from "telegraf";
import { BTN_ACTION_CAPTIONS, dateMask, EVENT_NAMES } from "../../constants";

export const stepOne = Telegraf.on("message", async (ctx: any) => {
  console.log("stepOne");
  const result = await findEvent(ctx.message.text);
  console.log("result", result);
  ctx.scene.state.event.id = result._id;
  await ctx.sendMessage(
    `Событие <b>${result.name}</b> от <b>${getDateDDMMYYYY(result.date)}</b>\nБудет изменено`,
    {
      parse_mode: "HTML",
    }
  );
  ctx.sendMessage("Введите новое название события", {
    parse_mode: "HTML",
  });
  ctx.wizard.next();
});

export const stepTwo = Telegraf.on("message", async (ctx: any) => {
  console.log("stepTwo");
  ctx.scene.state.event.name = ctx.message.text;
  await ctx.sendMessage("Введите новую дату события в формате дд.мм.гггг", {
    parse_mode: "HTML",
  });
  ctx.wizard.next();
});

export const stepThree = Telegraf.on("message", async (ctx: any) => {
  console.log("stepThree");
  console.log("ctx.message.text", ctx.message.text);
  if (dateMask.test(ctx.message.text.replace(/\,/g, "."))) {
    const date = new Date(formatDate(ctx.message.text.replace(/\,/g, ".")));
    ctx.scene.state.event.date = date.toISOString();
    ctx.reply(
      `Событие <b>${ctx.scene.state.event.name}</b> от <b>${getDateDDMMYYYY(date)}</b>\nПравильно, сохраняю?`,
      {
        parse_mode: "HTML",
        reply_markup: {
          inline_keyboard: [
            [Markup.button.callback(BTN_ACTION_CAPTIONS.yes, EVENT_NAMES.save)],
            [
              Markup.button.callback(
                BTN_ACTION_CAPTIONS.no,
                EVENT_NAMES.cancel
              ),
            ],
          ],
        },
      }
    );
  } else {
    console.log("Дата не соответствует дд.мм.гггг");
    ctx.reply("Дата не соответствует дд.мм.гггг. Попробуйте еще раз");
  }
});
