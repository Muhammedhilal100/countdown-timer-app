import dayjs from 'dayjs';

export function findActiveTimer(timers, now = dayjs()) {
  const active = timers.filter(t => dayjs(t.startDate).isBefore(now) && dayjs(t.endDate).isAfter(now));
  if (!active.length) return null;
  return active.sort((a, b) => dayjs(a.endDate).diff(dayjs(b.endDate)))[0];
}
