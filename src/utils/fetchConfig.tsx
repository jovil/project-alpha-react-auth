export const apiUrl = `${process.env.REACT_APP_API_URL}`;

export const getFetchConfig = {
  method: "GET",
  headers: {
    "Content-Type": "application/json",
  },
};

export const postFetchConfig = (data: any) => {
  return {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  };
};
