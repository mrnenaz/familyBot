import { TGFamilyUsers } from "../models/Users";

export const existUser = async (id: string) => {
  return await TGFamilyUsers.exists({ id });
};
