import type { ConvertRecurrenceDates } from "@/types/values/reccurenceDate";
import { convertIcsTimeStamp } from "./timeStamp";
import { standardValidate } from "../utils/standardValidate";

export const convertIcsRecurrenceDates: ConvertRecurrenceDates = (
  schema,
  line,
  options
) =>
  standardValidate(
    schema,
    line.value
      .split(",")
      .map((value) =>
        convertIcsTimeStamp(
          undefined,
          { value, options: line.options },
          options
        )
      )
  );
