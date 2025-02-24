import mongoose from "mongoose";
import { Users } from "./types";

const Schema = mongoose.Schema;

const TGFamilyUsersSchema = new Schema<Users>({
  id: String,
  username: String,
  firstName: String,
  uuid: String,
});

export const TGFamilyUsers = mongoose.model(
  "TGFamilyUsers",
  TGFamilyUsersSchema
);
