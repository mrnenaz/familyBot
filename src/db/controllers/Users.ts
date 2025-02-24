import { TGFamilyEvents } from "../models";
import { Users } from "../models/types";
import { TGFamilyUsers } from "../models/Users";

export const testAdd = async () => {
  const newUser = new TGFamilyUsers({
    id: "330515895",
    username: "Aleksey",
    firstName: "mrnenaz",
    uuid: "330515895",
  });
  newUser.save();

  const newEvent = new TGFamilyEvents({
    name: "String",
    date: new Date(),
    isActive: true,
    id: newUser._id, // Используем _id пользователя
  });
  newEvent.save();
};

export const testFind = async () => {
  const user = await TGFamilyUsers.findOne({ id: "330515895" }).exec();
  const test = await TGFamilyEvents.find({ id: user._id })
    .populate("id") // Заполняем поле author данными из модели User
    .exec();

  console.log("rr", test);
};

export const insertNewUser = async (data: Users) => {
  try {
    await TGFamilyUsers.insertMany([data]);
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
