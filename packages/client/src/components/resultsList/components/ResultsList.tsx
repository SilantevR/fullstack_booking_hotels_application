import React from "react";
import { SearchResults } from "../../../features/search/types";
import { ListItem } from "./ListItem";

export const ResultsList: React.FC<SearchResults> = ({ results, dates }) => {
  const list = results.map((result) => (
    <ListItem key={result._id} result={result} dates={dates} />
  ));
  return <>{list}</>;
};
