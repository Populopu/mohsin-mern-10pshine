export const formatDate = (date) =>
  new Date(date).toLocaleDateString("en-US", {
    day: "numeric",
    month: "short",
    year: "numeric"
  });
