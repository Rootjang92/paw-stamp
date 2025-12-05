/**
 * 퍼센트 포맷
 * 0.852 → "85.2%"
 */
export function formatPercentage(num: number, decimals: number = 1): string {
  return `${num.toFixed(decimals)}%`;
}