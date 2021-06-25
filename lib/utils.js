// Format date. Example: "May 5, 2021 at 11:25 AM"
export const formatDate = (dateString) => {
  try {
    return new Intl.DateTimeFormat("en", {
      dateStyle: "long",
      timeStyle: "short",
    }).format(new Date(dateString));
  } catch (error) {
    return null;
  }
};
