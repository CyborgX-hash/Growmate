import rateLimit from "express-rate-limit";

// Rate limiter for standard API routes
export const standardLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 300,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    error: "Too many requests from this IP, please try again later."
  }
});

// Stricter rate limiter for heavy AI inference routes (planning and leaf vision diagnosis)
export const aiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 30, // 30 AI calls per 15 minutes
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    error: "AI inference request limit reached (30 requests per 15 minutes). Please try again shortly."
  }
});
