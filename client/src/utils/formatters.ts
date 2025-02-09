export const formatAddress = (address: string): string => {
  if (address.length < 10) return address;
  return `${address.slice(0, 6)}...${address.slice(-4)}`;
};

export const formatNumber = (num: number): string => {
  const scaledNum = num / Math.pow(10, 18);
  return new Intl.NumberFormat().format(scaledNum);
};

export const formatPercentage = (num: number): string => {
  return `${num.toFixed(0)}%`;
};

export const formatHolderPercentage = (num: number): string => {
  return `${num.toFixed(2)}%`;
};
