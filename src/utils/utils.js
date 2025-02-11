import BigNumber from 'bignumber.js';

const WEI_TO_ETH = new BigNumber(10).pow(18);

export function formatEth(valueInWei) {
  return new BigNumber(valueInWei).dividedBy(WEI_TO_ETH).toFixed(6);
}
