export const toSqliteTimestamp = (dateString: string): string => {
  const date = new Date(dateString);
  return date.toISOString().replace(/\.\d{3}/, '');
};