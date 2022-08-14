function convertMinutesInTimeDuration(_minutes: number): string {
  const hours = String(Math.floor(_minutes / 60)).padStart(2, '0');
  const minutes = String(Math.floor(_minutes % 60)).padStart(2, '0');

  return `${hours}:${minutes}`;
}

export default convertMinutesInTimeDuration;
