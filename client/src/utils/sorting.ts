export const sortData = <T>(
  data: T[],
  sortCol: keyof T | null,
  sortDir: "asc" | "des"
): T[] => {
  if (!sortCol) return data;

  return [...data].sort((a, b) => {
    const aValue = a[sortCol];
    const bValue = b[sortCol];

    return sortDir === "asc"
      ? aValue < bValue
        ? -1
        : aValue > bValue
        ? 1
        : 0
      : aValue > bValue
      ? -1
      : aValue < bValue
      ? 1
      : 0;
  });
};
