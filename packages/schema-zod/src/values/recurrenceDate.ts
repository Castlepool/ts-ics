import { z } from "zod";
import { zIcsDateObject } from "./date";
import {
  type IcsRecurrenceDate,
  type IcsRecurrenceDates,
  convertIcsRecurrenceDates,
  type ParseReccurenceDates,
} from "ts-ics";

export const zIcsRecurrenceDate: z.ZodType<IcsRecurrenceDate, IcsRecurrenceDate> =
  zIcsDateObject;

export const zIcsRecurrenceDates: z.ZodType<
  IcsRecurrenceDates,
  IcsRecurrenceDates
> = z.array(zIcsRecurrenceDate);

export const parseIcsRecurrenceDate: ParseReccurenceDates = (...props) =>
  convertIcsRecurrenceDates(zIcsRecurrenceDates, ...props);
