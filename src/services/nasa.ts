import { NasaSearchParams } from "../types";

export const NASA_API_URL = "https://images-api.nasa.gov/search";

/**
 * TODO:
 *  - Consider adding support for additional search parameters such as year_end, photographer, location, etc.
 *  - Implement proper encoding for special characters in search parameters to avoid issues with the NASA API
 *  - Add support for pagination
 */
export const urlNasaSearch = ({
  keywords,
  mediaType,
  yearStart,
}: NasaSearchParams): string => {
  const paramsObjectWithSnakeCaseKeys = {
    keywords,
    media_type: mediaType,
    ...(!!yearStart &&
      !Number.isNaN(yearStart) && { year_start: `${yearStart}` }),
  };
  const paramsString = new URLSearchParams(
    paramsObjectWithSnakeCaseKeys,
  ).toString();
  return `${NASA_API_URL}?${paramsString}&page_size=10`;
};
