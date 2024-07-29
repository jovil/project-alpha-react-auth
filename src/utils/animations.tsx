export const slideInFromBottom = {
  hidden: {
    opacity: 0,
    y: "50px",
  },
  visible: {
    opacity: 1,
    y: "0",
    transition: {
      duration: 0.2,
    },
  },
  exit: {
    opacity: 0,
    y: "50px",
  },
};

export const slideInFromRight = {
  hidden: {
    opacity: 0,
    x: "50px",
  },
  visible: {
    opacity: 1,
    x: "0",
    transition: {
      duration: 0.2,
      delay: 0.2,
    },
  },
  exit: {
    opacity: 0,
    x: "50px",
  },
};
