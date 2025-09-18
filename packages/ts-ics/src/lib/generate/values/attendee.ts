import type { IcsAttendee } from "@/types/values/attendee";

import { generateIcsMail } from "../values/mail";
import { generateIcsLine } from "../utils/addLine";
import { generateIcsOptions } from "../utils/generateOptions";

export const generateIcsAttendee = (attendee: IcsAttendee, key: string) => {
  const options = generateIcsOptions(
    [
      attendee.dir && { key: "DIR", value: `"${attendee.dir}"` },
      attendee.delegatedFrom && {
        key: "DELEGATED-FROM",
        value: generateIcsMail(attendee.delegatedFrom, true),
      },
      attendee.member && {
        key: "MEMBER",
        value: generateIcsMail(attendee.member, true),
      },
      attendee.role && { key: "ROLE", value: attendee.role },
      attendee.name && { key: "CN", value: attendee.name },
      attendee.partstat && { key: "PARTSTAT", value: attendee.partstat },
      attendee.sentBy && {
        key: "SENT-BY",
        value: generateIcsMail(attendee.sentBy, true),
      },
      attendee.rsvp !== undefined &&
        (attendee.rsvp === true || attendee.rsvp === false) && {
          key: "RSVP",
          value: attendee.rsvp === true ? "TRUE" : "FALSE",
        },
    ].filter((v) => !!v)
  );

  return generateIcsLine(key, generateIcsMail(attendee.email), options);
};
