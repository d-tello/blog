import axios from "axios";

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

export const fetcher = (url) => axios.get(url).then((res) => res.data);

export const isInViewport = (element) => {
  if (!element) return false;

  const rect = element.getBoundingClientRect();
  return (
    rect.top >= 0 &&
    rect.left >= 0 &&
    rect.bottom <=
      (window.innerHeight || document.documentElement.clientHeight) &&
    rect.right <= (window.innerWidth || document.documentElement.clientWidth)
  );
};
