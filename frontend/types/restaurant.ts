export interface Restaurant {
  id: string;
  name: string;
  access: string;
  address: string;
  open: string;
  close: string;
  photo: {
    pc: {
      l: string;  // 大サイズ画像URL
      m: string;  // 中サイズ画像URL
      s: string;  // 小サイズ画像URL
    };
    mobile: {
      l: string;
      s: string;
    };
  };
  budget: {
    name: string;
    average: string;
  };
  genre: {
    name: string;
    catch: string;
  };
  urls: {
    pc: string;
  };
  lat: number;
  lng: number;
  ktai_coupon: number;
  coupon_urls: {
    pc: string;
    sp: string;
  };
}

export interface SearchResults {
  results: {
    shop: Restaurant[];
    results_available: number;
    results_returned: string;
    results_start: number;
  };
}