enum WELCOME_MESSAGES {
  OTHERS_PRIVATE = "Слушаю тебя, родственничек, что хотел?",
  OTHERS = "Чего изволите-c?",
  PERSONAL = "Добро пожаловать,",
}

export const genWelcomeText = (
  isPrivateChat: boolean,
  isPersonal: boolean,
  firstName: string
) => {
  let text: string = isPrivateChat
    ? WELCOME_MESSAGES.OTHERS_PRIVATE
    : WELCOME_MESSAGES.OTHERS;
  if (isPersonal) {
    text = `${WELCOME_MESSAGES.PERSONAL} ${firstName}`;
  }

  return text;
};
