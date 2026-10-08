import styled from "styled-components";
import { useNasaAssetQuery } from "../list/useNasaQuery";
import { type ItemsType } from "../../types";

import { StyledImage } from "./StyledImage";
import { Video } from "./Video";
import { Audio } from "./Audio";

const StyledResultCard = styled.div`
  border: 1px solid #ccc;
  padding: 16px;
  border-radius: 8px;
  text-align: center;
`;

/**
 * TODO:
 *  - Improve seperation of concerns as has been done in the Form component, for example by moving styled components to their own files, using a useResultCard hook for logic, etc.
 *  - Consider adding proper error handling and loading states for media assets
 *  - Implement lazy loading for media assets to improve performance
 */
export const ResultCard = ({ item }: { item: ItemsType }) => {
  const itemData = item.data[0];
  const mediaType = itemData?.media_type;
  const needsAsset = mediaType === "video" || mediaType === "audio";

  const asset = useNasaAssetQuery(needsAsset ? item.href : "");
  const assetSrc: string | undefined = asset.data?.[0];

  if (!itemData) {
    return null;
  }

  switch (mediaType) {
    case "image": {
      const imageHref = item.links[0]?.href;
      if (!imageHref) {
        return null;
      }
      return (
        <StyledResultCard>
          <StyledImage
            src={imageHref}
            alt="Nasa Image"
            width={500}
            height={500}
          />
          <p>{itemData.title}</p>
        </StyledResultCard>
      );
    }
    case "video":
      if (!assetSrc) {
        return null;
      }
      return (
        <StyledResultCard>
          <Video src={assetSrc} controls width={400} />
          <p>{itemData.title}</p>
        </StyledResultCard>
      );
    case "audio":
      if (!assetSrc) {
        return null;
      }
      return (
        <StyledResultCard>
          <Audio src={assetSrc} controls />
          <p>{itemData.title}</p>
        </StyledResultCard>
      );
    default:
      return null;
  }
};
