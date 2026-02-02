import type { ErrorRequestHandler } from 'express';

const errorHandler: ErrorRequestHandler = (err, _req, res, _next) => {
  if (err instanceof Error) {
    if (err.cause) {
      const cause = err.cause as { status: number; code?: string };
      return res.status(cause.status ?? 500).json({ message: err.message, code: cause.code });
    }
    return res.status(500).json({ message: err.message });
  }
  return res.status(500).json({ message: 'Internal server error' });
};

export default errorHandler;
