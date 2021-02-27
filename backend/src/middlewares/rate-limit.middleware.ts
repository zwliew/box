import expressRateLimit from "express-rate-limit";

const rateLimit = expressRateLimit({
  draft_polli_ratelimit_headers: true,
  message: {
    status: 429,
    message: "Too many requests. Please try again later.",
  },
});

export default rateLimit;
