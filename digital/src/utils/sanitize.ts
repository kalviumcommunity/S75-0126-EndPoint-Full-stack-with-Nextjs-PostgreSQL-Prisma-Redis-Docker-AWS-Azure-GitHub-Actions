import sanitizeHtml from "sanitize-html";

export function sanitizeInput(input: unknown) {
  if (typeof input !== "string") return input;

  return sanitizeHtml(input, {
    allowedTags: [],
    allowedAttributes: {},
  });
}
