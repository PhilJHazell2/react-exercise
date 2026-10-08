import { useQuery } from "@tanstack/react-query";

export const useNasaQuery = (urlNasaSearchUrl: string) => {
  return useQuery(
    ["nasaSearch", urlNasaSearchUrl],
    () => fetch(urlNasaSearchUrl).then((res) => { if (!res.ok) throw new Error("Network response was not ok"); return res.json(); }),
    { enabled: !!urlNasaSearchUrl.length }
  );
};

export const useNasaAssetQuery = (urlAsset: string) => {
  return useQuery(
    ["nasaAsset", urlAsset],
    () => fetch(urlAsset).then((res) => { if (!res.ok) throw new Error("Network response was not ok"); return res.json(); }),
    { enabled: !!urlAsset.length }
  );
};

/*TODO: This file probably shouldnt live in the list directory as its used also by the result card component, should move to a more general hooks directory */