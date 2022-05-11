
export const generateDatesInterval = (
  from = new Date(),
  daysBack = 60,
  maxInterval = 86400000 / 4 // 6 hours
) => {
  const start = from.getTime() - 86400000 * Math.random() * daysBack;
  const end = start + maxInterval * Math.random();
  const startTime = new Date(start);
  const endTime = new Date(end);
  return { startTime, endTime };
};