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

export const ethChain = {
  chainId: "dig-1",
  chainName: "DIG",
  rpc: "https://rpc-1-dig.notional.ventures",
  rest: "https://api-1-dig.notional.ventures",
  bip44: {
    coinType: 60,
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
  coinType: 60,
  gasPriceStep: {
    low: 0.01,
    average: 0.025,
    high: 0.03,
  },
}