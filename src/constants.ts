export const COMMAND_NAMES = {
  UPCOMING_EVENT: "upcoming_event",
  NEW_EVENT: "new_event",
  EDIT_EVENT: "edit_event",
  DELETE_EVENT: "delete_event",
  ALL_EVENTS: "all_events",
  TODAY: "today",
};

export const COMMANDS = [
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
  back: "back",
  cancel: "cancel",
  save: "save",
  delete: "delete",
};

export const dateMask = /^\d{2}\.\d{2}\.\d{4}$/;
