export function convertDurationToMinutes(duration: string): number {
  const [hours, minutes] = duration.split(':');

  return (Number(hours) * 60) + Number(minutes);
}