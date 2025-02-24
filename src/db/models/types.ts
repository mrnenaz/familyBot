import mongoose from "mongoose";

export interface Events {
  name: string;
  date: Date;
  isActive: boolean;
  id: {
    type: mongoose.Schema.Types.ObjectId;
    ref: string;
  };
}

export interface Users {
  id: string;
  username: string;
  firstName: string;
  uuid: string;
}
