const CalculateDensity = (
  wQuantity: number,
  wAmount: number,
  vQuantity: number,
  vAmount: number,
) => {
  const res = (wQuantity * wAmount) / (vQuantity * vAmount);
  return Math.round(res * 1000) / 1000;
};

export default CalculateDensity;