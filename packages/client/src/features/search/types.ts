import { RoomData } from "../room/types";
export interface SearchData {
  hotel: string;
}
export interface SearchDates {
  startDate: Date;
  endDate: Date;
}

export interface DateRange {
  startDate: Date;
  endDate: Date;
  key?: string;
}

export interface URL {
  url: string;
}

export interface SearchResults {
  results: RoomData[];
  dates?: SearchDates;
}
export interface ResultItem {
  result: RoomData;
  dates?: SearchDates;
  key: string;
}
