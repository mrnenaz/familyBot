import { SCENE_NAMES } from "../constants";

export const startNewEvent = (ctx: any) => {
  console.log("startNewEvent");
  return ctx.scene.enter(SCENE_NAMES.NEW_EVENT);
};

export const upcomingEvent = (ctx: any) => {
  return ctx.scene.enter(SCENE_NAMES.UPCOMING_EVENT);
};

export const testCommand = (ctx: any) => {
  return ctx.scene.enter(SCENE_NAMES.TEST);
};

export const nowEvent = (ctx: any) => {
  return ctx.scene.enter(SCENE_NAMES.TODAY);
};

export const allEvents = (ctx: any) => {
  return ctx.scene.enter(SCENE_NAMES.ALL);
};

export const editEvent = (ctx: any) => {
  return ctx.scene.enter(SCENE_NAMES.EDIT);
};

export const deleteEvent = (ctx: any) => {
  return ctx.scene.enter(SCENE_NAMES.DELETE);
};
