const sanitizeHtml = require("sanitize-html");

const sanitizeOptions = {
  allowedTags: [],
  allowedAttributes: {},
};

const clean = (input) => {
  if (typeof input !== "string") return input;
  return sanitizeHtml(input, sanitizeOptions);
};

// Simplified recursive function
const deepClean = (obj) => {
  if (Array.isArray(obj)) return obj.map(deepClean);
  if (obj !== null && typeof obj === "object") {
    return Object.keys(obj).reduce((acc, key) => {
      // Basic Prototype Pollution guard
      if (["__proto__", "constructor"].includes(key)) return acc;
      acc[key] = deepClean(obj[key]);
      return acc;
    }, {});
  }
  return clean(obj);
};

module.exports = (req, res, next) => {
  if (req.body) req.body = deepClean(req.body);
  if (req.params) req.params = deepClean(req.params);
  next();
};
