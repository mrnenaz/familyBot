import { Markup, Telegraf } from "telegraf";
import { BTN_TEXTS, dateMask, EVENT_NAMES } from "../../constants";
import { formatDate, getDateDDMMYYYY } from "../../utils";

export const stepOne = Telegraf.on("text", async (ctx: any) => {
  ctx.scene.state.event.name = ctx.message.text;
  ctx.reply(
    `Введите дату события <b>${ctx.scene.state.event.name}</b> в формате дд.мм.гггг`,
    {
      parse_mode: "HTML",
      reply_markup: {
        inline_keyboard: [
          [Markup.button.callback(BTN_TEXTS.cancel, EVENT_NAMES.cancel)],
        ],
      },
    }
  );
  return ctx.wizard.next();
});

export const stepTwo = Telegraf.on("text", async (ctx: any) => {
  if (dateMask.test(ctx.message.text.replace(/\,/g, "."))) {
    const date = new Date(formatDate(ctx.message.text.replace(/\,/g, ".")));
    ctx.scene.state.event.date = date.toISOString();
    ctx.reply(
      `Событие <b>${ctx.scene.state.event.name}</b> от <b>${getDateDDMMYYYY(date)}</b>\nПравильно, сохраняю?`,
      {
        parse_mode: "HTML",
        reply_markup: {
          inline_keyboard: [
            [Markup.button.callback(BTN_TEXTS.yes, EVENT_NAMES.save)],
            [Markup.button.callback(BTN_TEXTS.no, EVENT_NAMES.cancel)],
          ],
        },
      }
    );
  } else {
    console.log("Дата не соответствует дд.мм.гггг");
    ctx.reply("Дата не соответствует дд.мм.гггг. Попробуйте еще раз", {
      reply_markup: {
        inline_keyboard: [
          [Markup.button.callback(BTN_TEXTS.cancel, EVENT_NAMES.cancel)],
        ],
      },
    });
  }
});
