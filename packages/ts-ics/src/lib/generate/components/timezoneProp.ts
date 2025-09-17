import { VTIMEZONE_PROP_TO_KEYS } from "@/constants/keys/timezoneProp";
import type { IcsDateObject, IcsRecurrenceRule } from "@/types";
import type { IcsTimezoneProp } from "@/types/timezoneProp";

import { generateIcsUtcDateTime } from "../values/date";
import { generateIcsRecurrenceRule } from "../values/recurrenceRule";
import { generateIcsTimeStamp } from "../values/timeStamp";
import {
  generateIcsLine,
  getIcsEndLine,
  getIcsStartLine,
} from "../utils/addLine";
import { getKeys } from "../utils/getKeys";
import { generateNonStandardValues } from "../nonStandard/nonStandardValues";
import type {
  GenerateNonStandardValues,
  NonStandardValuesGeneric,
} from "@/types/nonStandardValues";

export const generateIcsTimezoneProp = <T extends NonStandardValuesGeneric>(
  timezoneProp: IcsTimezoneProp,
  options?: { nonStandard?: GenerateNonStandardValues<T> }
) => {
  const timezonePropKeys = getKeys(timezoneProp);

  let icsString = "";

  icsString += getIcsStartLine(timezoneProp.type);

  timezonePropKeys.forEach((key) => {
    if (key === "type") return;

    if (key === "nonStandard") {
      icsString += generateNonStandardValues(
        timezoneProp[key],
        options?.nonStandard
      );
      return;
    }

    const icsKey = VTIMEZONE_PROP_TO_KEYS[key];

    if (!icsKey) return;

    const value = timezoneProp[key];

    if (key === "start") {
      icsString += generateIcsLine(
        icsKey,
        generateIcsUtcDateTime(value as Date)
      );
      return;
    }

    if (key === "recurrenceRule") {
      icsString += generateIcsRecurrenceRule(value as IcsRecurrenceRule);
      return;
    }

    if (key === "recurrenceDate") {
      icsString += generateIcsTimeStamp(icsKey, value as IcsDateObject);
      return;
    }

    icsString += generateIcsLine(icsKey, String(value));
  });

  icsString += getIcsEndLine(timezoneProp.type);

  return icsString;
};
