const WINDOW_MS = 60_000;
const MAX_REQUESTS = 5;

const requestLog = new Map();

export const isRateLimited = (userId) => {
  if (!userId) {
    return false;
  }

  const now = Date.now();
  const cutoff = now - WINDOW_MS;
  const recent = (requestLog.get(userId) || []).filter(
    (timestamp) => timestamp > cutoff,
  );

  if (recent.length >= MAX_REQUESTS) {
    requestLog.set(userId, recent);
    return true;
  }

  recent.push(now);
  requestLog.set(userId, recent);
  return false;
};

export const resetRateLimiter = () => {
  requestLog.clear();
};
