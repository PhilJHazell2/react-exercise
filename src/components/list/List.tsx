"use client";
import { Text, Loader } from "@cruk/cruk-react-components";
import { NasaSearchParams, ItemsType } from "../../types";
import { urlNasaSearch } from "../../services/nasa";
import { ResultCard } from "../result-card/ResultCard";

import { useNasaQuery } from "./useNasaQuery";
import { StyledGrid } from "./Grid";

/** 
 * TODO: 
 *  - Seperate presentational and container components, for example by using a useList hook which handles the data fetching and logic
 *  - Handle errors from the NASA API not just no results found
 *  - Pagination!
 *  - Allow users to filter and sort the results
 */

export function List({ values }: { values: NasaSearchParams | undefined }) {

  const urlNasaSearchUrl = values
    ? urlNasaSearch(values as NasaSearchParams)
    : "";

  const { data, isLoading } = useNasaQuery(urlNasaSearchUrl);

  if (!values) {
    return null;
  }

  if (isLoading) {
    return <Loader/>;
  }

  if (!data?.collection.items.length) {
    return <Text>No results found</Text>;
  }

  return (
    <StyledGrid> 
      {data?.collection.items.map((item: ItemsType, index: number) => (
        <ResultCard key={index} item={item} />
      ))}
    </StyledGrid>
  );
}
