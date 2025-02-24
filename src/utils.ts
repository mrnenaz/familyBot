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

export const hasUserInPrivilegedList = (ctx: any) => {
  const id = String(ctx.update.message.from.id);
  const users: string[] = process.env.PRIVILEGED_USERS?.split(",");
  return users.includes(id);
};

export const personalIdToArray = (personalId: string) => personalId.split(",");
