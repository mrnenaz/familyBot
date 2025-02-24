import { TGFamilyEvents } from "../models";
import { TGFamilyUsers } from "../models/Users";

export const insertNewPersonalEvent = async (eventData: any, userInfo: any) => {
  try {
    const user = await TGFamilyUsers.findOne({ uuid: userInfo.id }).exec();
    console.log("eventData", eventData);
    console.log("user", user);

    if (!user) {
      console.log("Пользователь с таким uuid не найден.");
      return;
    }

    const eventPersonal = await TGFamilyEvents.insertMany([
      {
        ...eventData,
        isActive: true,
        id: user._id,
      },
    ]);

    return eventPersonal;
  } catch (error) {
    console.error("Ошибка при поиске постов:", error);
  }
};

export const getAllPersonalEvents = async (userId: string) => {
  const user = await TGFamilyUsers.findOne({ uuid: userId }).exec();
  const resultsArray = await TGFamilyEvents.find({ id: user._id }).exec();
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

export const findCurrentPersonalEvents = async (userId: string) => {
  const user = await TGFamilyUsers.findOne({ uuid: userId }).exec();
  const dateOld = new Date();
  dateOld.setHours(dateOld.getHours() + 3);
  console.log("dateOld", dateOld);
  return await TGFamilyEvents.find({
    id: user._id,
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

export const findPersonalUpcomingEvents = async (userId: string) => {
  const user = await TGFamilyUsers.findOne({ uuid: userId }).exec();
  console.log("user", user);
  const date = new Date();
  const resultsArray = await TGFamilyEvents.find({
    id: user._id,
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
