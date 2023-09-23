import React from "react";
import { SearchResults } from "../types";
import { ListItem } from "./ListItem";

export const ResultsList: React.FC<SearchResults> = ({ results }) => {
  const list = results.map((result) => (
    <ListItem key={result._id} result={result} />
  ));
  return <ul>{list}</ul>;
};
