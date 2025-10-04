import { convertIcsEvent, convertIcsTimezone } from "@/lib";
import { extendByRecurrenceRule } from "@/utils/recurrence";
import { icsTestData } from "../utils";

describe("Timezone and Recurrence Tests", () => {
  it("should handle RDATE in VTIMEZONE components", () => {
    // Create a VTIMEZONE with RDATE
    const timezone = icsTestData([
      "BEGIN:VTIMEZONE",
      "TZID:America/New_York",
      "LAST-MODIFIED:20050809T050000Z",
      "BEGIN:DAYLIGHT",
      "DTSTART:19740106T020000",
      "RDATE:19750223T020000",
      "RDATE:19760425T020000",
      "TZOFFSETFROM:-0500",
      "TZOFFSETTO:-0400",
      "TZNAME:EDT",
      "END:DAYLIGHT",
      "BEGIN:STANDARD",
      "DTSTART:19741027T020000",
      "RDATE:19751026T020000",
      "RDATE:19761031T020000",
      "TZOFFSETFROM:-0400",
      "TZOFFSETTO:-0500",
      "TZNAME:EST",
      "END:STANDARD",
      "END:VTIMEZONE",
    ]);

    // Parse the VTIMEZONE
    const parsedTimezone = convertIcsTimezone(undefined, timezone);
    
    // Verify that the RDATE values were parsed correctly
    expect(parsedTimezone.props).toHaveLength(2);
    
    // Check DAYLIGHT component
    const daylightProp = parsedTimezone.props.find(prop => prop.type === "DAYLIGHT");
    expect(daylightProp).toBeDefined();
    expect(daylightProp?.recurrenceDates).toBeDefined();
    expect(daylightProp?.recurrenceDates).toHaveLength(2);
    
    // Check STANDARD component
    const standardProp = parsedTimezone.props.find(prop => prop.type === "STANDARD");
    expect(standardProp).toBeDefined();
    expect(standardProp?.recurrenceDates).toBeDefined();
    expect(standardProp?.recurrenceDates).toHaveLength(2);
  });

  it("should handle RDATE in VEVENT components", () => {
    // Create a VEVENT with RDATE
    const event = icsTestData([
      "BEGIN:VEVENT",
      "UID:20241210T100000-541111@example.com",
      "DTSTAMP:20241210T100000",
      "DTSTART:20241210T100000",
      "DTEND:20241210T110000",
      "RDATE:20241211T100000",
      "RDATE:20241212T100000",
      "SUMMARY:Event with RDATE",
      "END:VEVENT",
    ]);

    // Parse the VEVENT
    const parsedEvent = convertIcsEvent(undefined, event);
    
    // Verify that the RDATE values were parsed correctly
    expect(parsedEvent.recurrenceDates).toBeDefined();
    expect(parsedEvent.recurrenceDates).toHaveLength(2);
    
    // Check the dates
    expect(parsedEvent.recurrenceDates?.[0].date.toISOString()).toContain("2024-12-11");
    expect(parsedEvent.recurrenceDates?.[1].date.toISOString()).toContain("2024-12-12");
  });

  it("should handle recurrences across timezone changes", () => {
    // Create a recurrence rule that spans a DST change
    const rule = {
      frequency: "DAILY",
      interval: 1,
    };
    
    // October 25, 2025 (before DST change in America/New_York)
    const start = new Date("2025-10-25T10:00:00.000Z");
    
    // Create recurrences that span the DST change (October 26, 2025)
    const recurrences = extendByRecurrenceRule(rule, {
      start,
      // End date is after DST change
      end: new Date("2025-10-28T10:00:00.000Z"),
      startTimezone: "America/New_York"
    });
    
    // We should have 4 dates: Oct 25, 26, 27, 28
    expect(recurrences).toHaveLength(4);
    
    // Check that the local time remains consistent across the DST change
    // Convert to NY time and extract hours
    const hours = recurrences.map(date => {
      const nyTime = new Date(date.toLocaleString("en-US", { timeZone: "America/New_York" }));
      return nyTime.getHours();
    });
    
    // All hours should be the same (10:00 AM in NY time) despite the DST change
    expect(hours).toEqual([6, 6, 6, 6]);
  });
});