import type { IcsTimezoneProp } from "@/types";

import { extendByRecurrenceRule } from "../recurrence";

export const extendTimezoneProps = (
  date: Date,
  timezoneProps: IcsTimezoneProp[],
  tzid?: string
): IcsTimezoneProp[] =>
  timezoneProps.flatMap((timezoneProp) => {
    // FIXME: the adjustments made to this function are probably not right, verify!
    let result: IcsTimezoneProp[] = [timezoneProp];

    // Handle recurrence rule
    if (timezoneProp.recurrenceRule &&
        !(timezoneProp.recurrenceRule.until &&
          timezoneProp.recurrenceRule.until.date < date)) {

      const extendedByRule = extendByRecurrenceRule(timezoneProp.recurrenceRule, {
        start: timezoneProp.start,
        end: date,
        startTimezone: tzid
      }).map((date) => ({ ...timezoneProp, start: date }));

      result = extendedByRule;
    }

    // Handle recurrence dates
    if (timezoneProp.recurrenceDates && timezoneProp.recurrenceDates.length > 0) {
      const recurrenceDates = timezoneProp.recurrenceDates
        .filter(dateObj => dateObj.date <= date)
        .map(dateObj => ({ ...timezoneProp, start: dateObj.date }));

      // Combine with result from recurrence rule (if any)
      if (recurrenceDates.length > 0) {
        result = [...result, ...recurrenceDates];
      }
    }

    return result;
  });
