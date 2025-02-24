import { TGFamilyUsers } from "../models/Users";

export const runUsersMigration = async () => {
  await TGFamilyUsers.init();
};
