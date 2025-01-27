export const COMMAND_NAMES = {
  UPCOMING_EVENT: "upcoming_event",
  NEW_EVENT: "new_event",
  EDIT_EVENT: "edit_event",
  DELETE_EVENT: "delete_event",
  ALL_EVENTS: "all_events",
  TODAY: "today",
  START: "start",
  WELCOME: "welcome",
};

export const COMMANDS = [
  {
    command: COMMAND_NAMES.WELCOME,
    description: "Добро пожаловать",
  },
  {
    command: COMMAND_NAMES.UPCOMING_EVENT,
    description: "Ближайшее событие",
  },
  {
    command: COMMAND_NAMES.TODAY,
    description: "Что на сегодня?",
  },
  {
    command: COMMAND_NAMES.NEW_EVENT,
    description: "Новое событие",
  },
  {
    command: COMMAND_NAMES.EDIT_EVENT,
    description: "Изменить событие",
  },
  {
    command: COMMAND_NAMES.DELETE_EVENT,
    description: "Удалить событие",
  },
  {
    command: COMMAND_NAMES.ALL_EVENTS,
    description: "Все события",
  },
];

export const SCENE_NAMES = {
  NEW_EVENT: "new_event",
  UPCOMING_EVENT: "upcoming_event",
  TEST: "test",
  TODAY: "today",
  ALL: "all",
  EDIT: "edit",
  DELETE: "delete",
  WELCOME: "welcome",
};

export const BTN_TEXTS = {
  no: "Нет",
  yes: "Да",
  back: "Назад",
  cancel: "Отменить",
  save: "Сохранить",
};

export const EVENT_NAMES = {
  newEvent: "newEvent",
  create: "create",
  back: "back",
  cancel: "cancel",
  save: "save",
  delete: "delete",
  edit: "edit",
  today: "today",
  upcoming: "upcoming",
  all: "all",
};

export const dateMask = /^\d{2}\.\d{2}\.\d{4}$/;

export enum ROLES {
  ADMIN = "administrator",
  MEMBER = "member",
  CREATOR = "creator",
}

export enum GROUP_TYPES {
  PRIVATE = "private",
  GROUP = "group",
  SUPERGROUP = "supergroup",
  CHANNEL = "channel",
}
