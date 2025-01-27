import { GROUP_TYPES } from "./constants";

export const formatDate = (date: string): Date => {
  const dateArr = date.split(".");
  return new Date(`${dateArr[2]}-${dateArr[1]}-${dateArr[0]}`);
};

export const getDateDDMMYYYY = (date: Date) => date.toLocaleDateString("ru-RU");

const getChatType = async (ctx: any) => {
  const chatType = await ctx.chat.type;
  return chatType;
};

export const isPrivate = async (ctx: any) => {
  const chatType = await getChatType(ctx);
  return chatType === GROUP_TYPES.PRIVATE;
};
