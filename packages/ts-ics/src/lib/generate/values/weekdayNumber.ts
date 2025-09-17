import type { IcsWeekdayNumber } from "@/types/weekday";

export const generateIcsWeekdayNumber = (value: IcsWeekdayNumber) => {
  if (value.occurence) {
    return `${value.occurence}${value.day}`;
  }

  return value.day;
};
