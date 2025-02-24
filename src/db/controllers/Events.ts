import { personalIdToArray } from "../../utils";
import { TGFamilyEvents } from "../models";
import { Events } from "../models/types";
import { TGFamilyUsers } from "../models/Users";

export const insertNewEvent = async (data: Events) => {
  try {
    await TGFamilyEvents.insertMany([data]);
    return true;
  } catch (err) {
    if (err.name === "ValidationError") {
      // Обработка ошибки валидации
      console.error("Ошибка валидации:", err.message);
    } else if (err.name === "MongoError") {
      // Обработка ошибки MongoDB
      console.error("Ошибка MongoDB:", err.message);
    } else {
      // Обработка неизвестной ошибки
      console.error("Неизвестная ошибка:", err.message);
    }
    return false;
  }
};

export const findCurrentEvents = async () => {
  const users = await TGFamilyUsers.find({
    uuid: { $in: personalIdToArray(process.env.PRIVILEGED_USERS) },
  }).exec();

  const dateOld = new Date();
  dateOld.setHours(dateOld.getHours() + 3);
  return await TGFamilyEvents.find({
    id: { $nin: users.map((user) => user._id) },
    $expr: {
      $and: [
        { $eq: [{ $month: "$date" }, { $month: dateOld }] },
        {
          $eq: [{ $dayOfMonth: "$date" }, { $dayOfMonth: dateOld }],
        },
      ],
    },
  });
};

// ближайшие события (все даты по дд и мм, которые больше текущих)
export const findUpcomingEvents = async () => {
  const users = await TGFamilyUsers.find({
    uuid: { $in: personalIdToArray(process.env.PRIVILEGED_USERS) },
  }).exec();
  const date = new Date();
  const resultsArray = await TGFamilyEvents.find({
    id: { $nin: users.map((user) => user._id) },
    $expr: {
      $cond: [
        { $ne: [{ $month: "$date" }, { $month: new Date(date) }] },
        { $gt: [{ $month: "$date" }, { $month: new Date(date) }] },
        {
          $cond: [
            {
              $ne: [{ $dayOfMonth: "$date" }, { $dayOfMonth: new Date(date) }],
            },
            {
              $gt: [{ $dayOfMonth: "$date" }, { $dayOfMonth: new Date(date) }],
            },
            false,
          ],
        },
      ],
    },
  });
  console.log("resultsArray", resultsArray);
  if (resultsArray.length === 0) {
    return [];
  }
  resultsArray.sort((a, b) => {
    if (a.date.getMonth() < b.date.getMonth()) return -1;
    if (a.date.getMonth() > b.date.getMonth()) return 1;
    if (a.date.getMonth() === b.date.getMonth()) {
      if (a.date.getDate() < b.date.getDate()) return -1;
      if (a.date.getDate() > b.date.getDate()) return 1;
      return 0;
    }
  });

  const findDate = resultsArray[0].date;
  return resultsArray.reduce((acc, item) => {
    if (item.date.getTime() === findDate.getTime()) {
      acc.push(item);
    }
    return acc;
  }, []);
};

export const getAllEvents = async () => {
  const users = await TGFamilyUsers.find({
    uuid: { $in: personalIdToArray(process.env.PRIVILEGED_USERS) },
  }).exec();

  const resultsArray = await TGFamilyEvents.find({
    id: { $nin: users.map((user) => user._id) },
  }).exec();
  return resultsArray.sort((a, b) => {
    if (a.date.getMonth() < b.date.getMonth()) return -1;
    if (a.date.getMonth() > b.date.getMonth()) return 1;
    if (a.date.getMonth() === b.date.getMonth()) {
      if (a.date.getDate() < b.date.getDate()) return -1;
      if (a.date.getDate() > b.date.getDate()) return 1;
      return 0;
    }
  });
};

export const findEvent = async (name: string) => {
  return await TGFamilyEvents.findOne({ name });
};

export const updateEvent = async (id: string, data: Events) => {
  return await TGFamilyEvents.updateOne({ _id: id }, { $set: data });
};

export const deleteEvent = async (id: string) => {
  return await TGFamilyEvents.deleteOne({ _id: id });
};
