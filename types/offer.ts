export interface OfferResponse {
  id: string;
  title: string;
  category: string;
  description: string;
  is_active: boolean;
  price_usd: number | null;
}

export interface OfferAdminResponse extends OfferResponse {
  created_at: string;
  updated_at: string;
}

export interface CreateOfferRequest {
  title: string;
  category: string;
  description?: string;
  is_active?: boolean;
}

export interface UpdateOfferRequest {
  title?: string;
  description?: string;
  is_active?: boolean;
}
