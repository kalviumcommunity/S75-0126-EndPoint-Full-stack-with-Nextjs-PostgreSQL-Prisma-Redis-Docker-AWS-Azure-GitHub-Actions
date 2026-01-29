import sanitizeHtml from "sanitize-html";

export const sanitizeInput = (input) => {
  if (!input) return "";

  return sanitizeHtml(input, {
    allowedTags: [],       // No HTML tags allowed
    allowedAttributes: {}, // No attributes allowed
  });
};
