import mongoose from "mongoose";
import { Events } from "./types";
import { TGFamilyUsers } from "./Users";

const Schema = mongoose.Schema;

const TGFamilyEventsSchema = new Schema<Events>({
  name: String,
  date: Date,
  isActive: Boolean,
  id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: TGFamilyUsers.modelName,
  },
});

export const TGFamilyEvents = mongoose.model(
  "TGFamilyEvents",
  TGFamilyEventsSchema
);
