export interface PricingEntryResponse {
  id: string;
  zone: string;
  price_usd: number;
}

export interface PricingEntryRequest {
  zone: string;
  price_usd: number;
}

export interface UpsertPricingRequest {
  entries: PricingEntryRequest[];
}
