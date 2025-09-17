import { VALARM_TO_KEYS } from "@/constants/keys/alarm";
import type { IcsAlarm, IcsDuration, IcsTrigger } from "@/types";

import { generateIcsAttachment } from "../values/attachment";
import { generateIcsAttendee } from "../values/attendee";
import { generateIcsDuration } from "../values/duration";
import { generateIcsTrigger } from "../values/trigger";
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

export const generateIcsAlarm = <T extends NonStandardValuesGeneric>(
  alarm: IcsAlarm,
  options?: { nonStandard?: GenerateNonStandardValues<T> }
) => {
  const alarmKeys = getKeys(alarm);

  let icsString = "";

  icsString += getIcsStartLine("VALARM");

  alarmKeys.forEach((key) => {
    if (key === "attachments" || key === "attendees") return;

    if (key === "nonStandard") {
      icsString += generateNonStandardValues(alarm[key], options?.nonStandard);
      return;
    }

    const icsKey = VALARM_TO_KEYS[key];

    if (!icsKey) return;

    const value = alarm[key];

    if (!value) return;

    if (value === undefined || value === null) return;

    if (key === "trigger") {
      icsString += generateIcsTrigger(value as IcsTrigger);
      return;
    }

    if (key === "duration") {
      icsString += generateIcsLine(
        icsKey,
        generateIcsDuration(value as IcsDuration)
      );
      return;
    }

    if (key === "repeat") {
      icsString += generateIcsLine(icsKey, value?.toString());
      return;
    }

    icsString += generateIcsLine(icsKey, String(value));
  });

  if (alarm.attachments && alarm.attachments.length > 0) {
    alarm.attachments.forEach((attachment) => {
      icsString += generateIcsAttachment(attachment);
    });
  }

  if (alarm.attendees && alarm.attendees.length > 0) {
    alarm.attendees.forEach((attendee) => {
      icsString += generateIcsAttendee(attendee, "ATTENDEE");
    });
  }

  icsString += getIcsEndLine("VALARM");

  return icsString;
};
