import mongoose from "mongoose";
import { Events } from "./types";

const Schema = mongoose.Schema;

const TGFamilyEventsSchema = new Schema<Events>({
  name: String,
  date: Date,
  isActive: Boolean,
});

export const TGFamilyEvents = mongoose.model(
  "TGFamilyEvents",
  TGFamilyEventsSchema
);
