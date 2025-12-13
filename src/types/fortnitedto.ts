
export interface ApiResponse<T> {
  data: T | null;
  loading: boolean;
  error: string | null;
}

export interface PlayerStats {
  account: { name: string; id: string };
  battlePass: { level: number; progress: number };
  image: string | null;
  stats: {
    all: {
      overall: {
        score: number;
        wins: number;
        winRate: number;
        kills: number;
        kd: number;
        matches: number;
        deaths: number;
      };
    };
  };
}

export interface ShopItem {
  id: string;
  name: string;
  description: string;
  type: {
    value: string;
    displayValue: string;
  };
  rarity: {
    value: string;
    displayValue: string;
  };
  images: {
    smallIcon: string;
    icon: string;
    featured?: string;
  };
}

export interface ShopEntry {
  regularPrice: number;
  finalPrice: number;
  bundle?: {
    name: string;
    image: string;
    info?: string;
  };
  brItems?: ShopItem[];
  layout?: {
    id: string;
    name: string;
    category?: string;
    index: number;
    rank: number;
  };
  devName: string;
  offerId: string;
  banner?: {
    value: string;
    intensity: string;
    backendValue: string;
  };
}

export interface ShopResponse {
  hash: string;
  date: string;
  vbuckIcon: string;
  entries: ShopEntry[];
}

export interface MapLocation {
  x: number;
  y: number;
  z: number;
}

export interface MapPOI {
  id: string;
  name: string;
  location: MapLocation;
}

export interface MapImages {
  blank: string;
  pois: string;
}

export interface MapData {
  images: MapImages;
  pois: MapPOI[];
}

export interface MapResponse {
  data: MapData;
}

export interface NewsMotd {
  id: string;
  title: string;
  tabTitle: string;
  body: string;
  image: string;
  tileImage: string;
  sortingPriority: number;
  hidden: boolean;
}

export interface BRNews {
  hash: string;
  date: string;
  image: string;
  motds: NewsMotd[];
}

export interface STWMessage {
  title: string;
  body: string;
  image: string;
}

export interface STWNews {
  hash: string;
  date: string;
  messages: STWMessage[];
}

export interface NewsResponse {
  br: BRNews;
  stw: STWNews;
}