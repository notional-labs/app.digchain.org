export const digChain = {
  chainId: "dig-1",
  chainName: "DIG",
  rpc: "https://rpc-1-dig.notional.ventures",
  rest: "https://api-1-dig.notional.ventures",
  bip44: {
    coinType: 118,
  },
  bech32Config: {
    bech32PrefixAccAddr: "dig",
    bech32PrefixAccPub: "dig" + "pub",
    bech32PrefixValAddr: "dig" + "valoper",
    bech32PrefixValPub: "dig" + "valoperpub",
    bech32PrefixConsAddr: "dig" + "valcons",
    bech32PrefixConsPub: "dig" + "valconspub",
  },
  currencies: [
    {
      coinDenom: "DIG",
      coinMinimalDenom: "udig",
      coinDecimals: 6,
      coinGeckoId: "dig",
    },
  ],
  feeCurrencies: [
    {
      coinDenom: "DIG",
      coinMinimalDenom: "udig",
      coinDecimals: 6,
      coinGeckoId: "dig",
    },
  ],
  stakeCurrency: {
    coinDenom: "DIG",
    coinMinimalDenom: "udig",
    coinDecimals: 6,
    coinGeckoId: "dig",
  },
  coinType: 118,
  gasPriceStep: {
    low: 0.01,
    average: 0.025,
    high: 0.03,
  },
}

export const digTest = {
  chainId: "digtest-5",
  chainName: "DIG",
  rpc: "http://168.119.91.22:2231/",
  rest: "http://168.119.91.22:2269/",
  bip44: {
    coinType: 118,
  },
  bech32Config: {
    bech32PrefixAccAddr: "dig",
    bech32PrefixAccPub: "dig" + "pub",
    bech32PrefixValAddr: "dig" + "valoper",
    bech32PrefixValPub: "dig" + "valoperpub",
    bech32PrefixConsAddr: "dig" + "valcons",
    bech32PrefixConsPub: "dig" + "valconspub",
  },
  currencies: [
    {
      coinDenom: "DIX",
      coinMinimalDenom: "udix",
      coinDecimals: 6,
    },
  ],
  feeCurrencies: [
    {
      coinDenom: "DIX",
      coinMinimalDenom: "udix",
      coinDecimals: 6,
    },
  ],
  stakeCurrency: {
    coinDenom: "DIX",
    coinMinimalDenom: "udix",
    coinDecimals: 6,
  },
  coinType: 118,
  gasPriceStep: {
    low: 0.01,
    average: 0.025,
    high: 0.03,
  },
}