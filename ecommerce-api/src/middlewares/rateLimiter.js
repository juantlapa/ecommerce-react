import rateLimit from "express-rate-limit";

// Si estamos en ambiente de pruebas, los rate limiters no aplican
const isTestEnv = process.env.NODE_ENV === "test";
const noopLimiter = (_req, _res, next) => next();

// Rate limiter para autenticación (login/register)
export const authLimiter = isTestEnv
  ? noopLimiter
  : rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutos
    max: 5, // Máximo 5 intentos por ventana
    message: {
      message: "Too many authentication attempts, please try again after 15 minutes",
    },
    standardHeaders: true,
    legacyHeaders: false,
  });

// Rate limiter general para API
export const apiLimiter = rateLimit({
  windowMs: 30 * 60 * 1000, // 30 minutos
  max: 10000, // Máximo 10000 requests por ventana
  message: {
    message: "Too many requests, please try again later",
  },
  standardHeaders: true,
  legacyHeaders: false,
});

// Rate limiter estricto para operaciones sensibles
export const strictLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hora
  max: 100, // Máximo 3 intentos por hora
  message: {
    message: "Too many attempts, please try again after 1 hour",
  },
  standardHeaders: true,
  legacyHeaders: false,
});
