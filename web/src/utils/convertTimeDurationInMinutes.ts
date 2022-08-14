function convertTimeDurationInMinutes(duration: string): number {
  const [hours, minutes] = duration.split(':');

  return Number(hours) * 60 + Number(minutes);
}

export default convertTimeDurationInMinutes;
