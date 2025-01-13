// import moment from "moment-timezone";
import { TGFamilyEvents } from "../models";
import { Events } from "../models/types";
// import { format, zonedTimeToUtc } from "date-fns";

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
  const dateOld = new Date();
  dateOld.setHours(dateOld.getHours() + 3);
  console.log("dateOld", dateOld);
  return await TGFamilyEvents.find({
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
  const date = new Date();
  const resultsArray = await TGFamilyEvents.find({
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
  resultsArray.sort((a, b) => {
    if (a.date.getMonth() < b.date.getMonth()) return -1;
    if (a.date.getMonth() > b.date.getMonth()) return 1;
    if (a.date.getMonth() === b.date.getMonth()) {
      if (a.date.getDate() < b.date.getDate()) return -1;
      if (a.date.getDate() > b.date.getDate()) return 1;
      return 0;
    }
  });
  console.log("resultsArray", resultsArray);
  const findDate = resultsArray[0].date;
  return resultsArray.reduce((acc, item) => {
    if (item.date.getTime() === findDate.getTime()) {
      acc.push(item);
    }
    return acc;
  }, []);
};

export const getAllEvents = async () => {
  const resultsArray = await TGFamilyEvents.find();
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
