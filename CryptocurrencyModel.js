export class CryptocurrencyModel {
  constructor(data, timestamp) {
    this.data = data || [];
    this.timestamp = timestamp || null;
  }

  static fromJson(json) {
    const data = json.data ? json.data.map(Data.fromJson) : [];
    const timestamp = json.timestamp;
    return new CryptocurrencyModel(data, timestamp);
  }
}

export class Data {
  constructor(
    id,
    rank,
    symbol,
    name,
    supply,
    maxSupply,
    marketCapUsd,
    volumeUsd24Hr,
    priceUsd,
    changePercent24Hr,
    vwap24Hr,
    explorer
  ) {
    this.id = id;
    this.rank = rank;
    this.symbol = symbol;
    this.name = name;
    this.supply = supply;
    this.maxSupply = maxSupply;
    this.marketCapUsd = marketCapUsd;
    this.volumeUsd24Hr = volumeUsd24Hr;
    this.priceUsd = priceUsd;
    this.changePercent24Hr = changePercent24Hr;
    this.vwap24Hr = vwap24Hr;
    this.explorer = explorer;
  }

  static fromJson(json) {
    return new Data(
      json.id,
      json.rank,
      json.symbol,
      json.name,
      json.supply,
      json.maxSupply,
      json.marketCapUsd,
      json.volumeUsd24Hr,
      json.priceUsd,
      json.changePercent24Hr,
      json.vwap24Hr,
      json.explorer
    );
  }
}
