const bitToMB = (val: number) =>
  (Number(val ?? 0) / (1024 * 1024))
    .toFixed(2)
    .replace(/\B(?=(\d{3})+(?!\d))/g, ",");

export default bitToMB;
