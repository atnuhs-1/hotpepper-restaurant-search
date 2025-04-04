export interface Restaurant {
  id: string;
  name: string;
  access: string;
  address: string;
  lat: number;
  lng: number;
  logo_image: string;
  photo: {
    pc: {
      l: string;
      m: string;
      s: string;
    };
    mobile: {
      l: string;
      s: string;
    };
  };
  open: string;
  close: string;
  budget: {
    code: string;
    name: string;
    average: string;
  };
  catch: string;
  genre: {
    code: string;
    name: string;
  };
  urls: {
    pc: string;
  };
}

export interface SearchResults {
  results_available: number;
  results_returned: number;
  results_start: number;
  shop: Restaurant[];
}

export interface RestaurantSearchParams {
  lat?: string;
  lng?: string;
  range?: string;
  keyword?: string;
  genre?: string;
  budget?: string;
  page?: string;
  count?: string;
}

export interface Location {
  lat: number;
  lng: number;
}
