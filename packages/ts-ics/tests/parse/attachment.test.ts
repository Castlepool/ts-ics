import { convertIcsAttachment } from "@/lib/parse/values/attachment";
import { getLine } from "@/lib/parse/utils/line";

it("Test Ics IcsAttachment Parse", async () => {
  const attachment = `ATTACH:CID:jsmith.part3.960817T083000.xyzMail@example.com`;

  const { line } = getLine(attachment);

  expect(() => convertIcsAttachment(undefined, line)).not.toThrow();
});

it("Test Ics IcsAttachment Parse", async () => {
  const attachment = `ATTACH;FMTTYPE=application/postscript:ftp://example.com/pub/reports/r-960812.ps`;

  const { line } = getLine(attachment);

  expect(() => convertIcsAttachment(undefined, line)).not.toThrow();
});
