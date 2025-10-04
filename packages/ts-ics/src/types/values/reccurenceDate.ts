import type { IcsDateObject } from "./date";
import type { ConvertLineType, ParseLineType } from "../parse";
import type { IcsTimezone } from "../components/timezone";

export type IcsRecurrenceDate = IcsDateObject;

export type IcsRecurrenceDates = IcsRecurrenceDate[];

export type ParseRecurrenceDatesOptions = { timezones?: IcsTimezone[] };

export type ConvertRecurrenceDates = ConvertLineType<
	IcsRecurrenceDates,
	ParseRecurrenceDatesOptions
>;

export type ParseRecurrenceDates = ParseLineType<
	IcsRecurrenceDates,
	ParseRecurrenceDatesOptions
>;
