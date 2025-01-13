export const formatDate = (date: string): Date => {
  const dateArr = date.split(".");
  return new Date(`${dateArr[2]}-${dateArr[1]}-${dateArr[0]}`);
};

export const getDateDDMMYYYY = (date: Date) => date.toLocaleDateString("ru-RU");
