import { addYears } from "date-fns";

import type { IcsRecurrenceRule, WeekDayNumber } from "@/types";
import { weekDays } from "@/types";

import { iterateBase } from "./iterate";
import { iterateBy } from "./iterateBy";
import { getOffsetFromTimezoneId } from "../timezone/getOffsetFromTimezoneId";

export type ExtendByRecurrenceRuleOptions = {
  start: Date;
  end?: Date;
  exceptions?: Date[];
  startTimezone?: string;
};

export const DEFAULT_END_IN_YEARS = 2;

export const extendByRecurrenceRule = (
  rule: IcsRecurrenceRule,
  options: ExtendByRecurrenceRuleOptions
): Date[] => {
  const start: Date = options.start;
  const startTimezone: string | undefined = options.startTimezone;

  const end: Date =
    rule.until?.date || options?.end || addYears(start, DEFAULT_END_IN_YEARS);

  const exceptions: Date[] = options.exceptions || [];

  const weekStartsOn = ((rule.workweekStart
    ? weekDays.indexOf(rule.workweekStart)
    : 1) % 7) as WeekDayNumber;

  const dateGroups: Date[][] = [[start]];

  iterateBase(rule, { start, end }, dateGroups);

  const finalDateGroups = iterateBy(
    rule,
    { start, end, exceptions, weekStartsOn },
    dateGroups
  );

  let finalDates = rule.count
    ? finalDateGroups.flat().splice(0, rule.count)
    : finalDateGroups.flat();

  // Apply timezone adjustments if startTimezone is provided
  if (startTimezone) {
    finalDates = finalDates.map(date => {
      // Get the timezone offset for the original start date
      const startOffset = getOffsetFromTimezoneId(startTimezone, start);
      
      // Get the timezone offset for this recurrence date
      const dateOffset = getOffsetFromTimezoneId(startTimezone, date);
      
      // If the offsets are different (e.g., due to DST changes), adjust the date
      if (startOffset !== dateOffset) {
        // Calculate the difference in offsets
        const offsetDiff = startOffset - dateOffset;
        
        // Create a new date with the adjusted time
        return new Date(date.getTime() + offsetDiff);
      }
      
      return date;
    });
  }

  return finalDates;
};
