export const handleError = (err) => {
  if (err) {
    console.error(`${err}`);
    process.exit();
  }
};
