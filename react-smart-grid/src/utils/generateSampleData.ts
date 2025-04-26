export const generateUsers = (count = 1000) => {
  const roles = ["Admin", "User", "Manager", "Viewer"];
  const status = ["Active", "Inactive", "Pending"];

  return Array.from({ length: count }, (_, i) => ({
    id: i + 1,
    name: `User ${i + 1}`,
    email: `user${i + 1}@example.com`,
    role: roles[i % roles.length],
    status: status[i % status.length],
  }));
};
