export const isCommittimeExpired = (deadline: string | null) => {
  if (!deadline) return false;

  const today = new Date();
  const endDate = new Date(deadline);

  today.setHours(0, 0, 0, 0);
  endDate.setHours(0, 0, 0, 0);

  return endDate < today;
};
