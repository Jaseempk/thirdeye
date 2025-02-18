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
export const calculateTokenAge = (createdAt: number): string => {
  const now = Math.floor(Date.now() / 1000); // Current time in seconds
  const diffInSeconds = now - createdAt;
  const days = Math.floor(diffInSeconds / (60 * 60 * 24));

  if (days === 0) {
    const hours = Math.floor(diffInSeconds / (60 * 60));
    if (hours === 0) {
      const minutes = Math.floor(diffInSeconds / 60);
      return `${minutes} minute${minutes !== 1 ? "s" : ""} `;
    }
    return `${hours} hour${hours !== 1 ? "s" : ""} `;
  }

  return `${days} day${days !== 1 ? "s" : ""} `;
};
