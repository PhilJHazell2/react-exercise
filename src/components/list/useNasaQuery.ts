import { useQuery } from "@tanstack/react-query";
import { type NasaResponse } from "../../types";

const fetchJson = async <T>(url: string): Promise<T> => {
  const res = await fetch(url);
  if (!res.ok) throw new Error("Network response was not ok");
  return (await res.json()) as T;
};

export const useNasaQuery = (urlNasaSearchUrl: string) => {
  return useQuery(
    ["nasaSearch", urlNasaSearchUrl],
    () => fetchJson<NasaResponse>(urlNasaSearchUrl),
    { enabled: !!urlNasaSearchUrl.length },
  );
};

export const useNasaAssetQuery = (urlAsset: string) => {
  return useQuery(
    ["nasaAsset", urlAsset],
    () => fetchJson<string[]>(urlAsset),
    {
      enabled: !!urlAsset.length,
    },
  );
};

/*TODO: This file probably shouldnt live in the list directory as its used also by the result card component, should move to a more general hooks directory */
