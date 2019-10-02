export const sortByNumber = (a, b, sortValue) => {
  return (a[sortValue] - b[sortValue]);
};

export const sortByTitle = (a, b, sortValue) => {
  return a[sortValue].localeCompare(b[sortValue]);
};
