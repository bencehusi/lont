export interface CartItem {
  price_id: string;
  id: string;
  quantity: number;
}

export interface StripePrice {
  id: string;
  object: string;
  active: boolean;
  billing_scheme: string;
  created: number;
  currency: string;
  custom_unit_amount: null;
  livemode: boolean;
  lookup_key: null;
  metadata: { [key: string]: string };
  nickname: null;
  product: string;
  recurring: null;
  tax_behavior: string;
  tiers_mode: null;
  transform_quantity: null;
  type: string;
  unit_amount: number;
  unit_amount_decimal: string;
}

export interface StripeProduct {
  id: string;
  object: string;
  active: boolean;
  attributes: [];
  created: number;
  default_price: string;
  description: string;
  images: [];
  livemode: boolean;
  marketing_features: [];
  metadata: { [key: string]: string };
  name: string;
  package_dimensions: null;
  shippable: null;
  statement_descriptor: null;
  tax_code: null;
  type: string;
  unit_label: null;
  updated: number;
  url: null;
}

export interface StripeProductWithPrice extends StripeProduct {
  prices: StripePrice[];
}
