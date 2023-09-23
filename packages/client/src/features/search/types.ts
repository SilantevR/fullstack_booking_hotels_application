export interface SearchData {
  hotel: string;
}
export interface SearchDates {
  startDate: Date;
  endDate: Date;
}

export interface DateRange {
  startDate?: Date;
  endDate?: Date;
  key?: string;
}

export interface URL {
  url: string;
}

export interface SearchResult {
  _id: string;
  title: string;
  description: string;
  images: string[];
  isEnabled: true;
  createdAt: string;
  updatedAt: string;
  hotel?: {
    _id: string;
    title: string;
    description: string;
  };
}
export interface SearchResults {
  results: SearchResult[];
}
export interface ResultItem {
  result: SearchResult;
  key: string;
}
