import {
  createImageUrlBuilder,
  type SanityImageSource,
} from "@sanity/image-url";

import type { StaticImageData } from "next/image";
import { dataset, projectId } from "../env";
import type { SanityImage } from "@/sanity/types";

const builder = createImageUrlBuilder({ projectId, dataset });

export const urlFor = (source: SanityImageSource) => {
  return builder.image(source);
};

export function sanityImageUrl(
    image: SanityImage | undefined,
    fallback: string | StaticImageData,
): string | StaticImageData {
  if (!image?.asset) return fallback;

  return urlFor(image as SanityImageSource)
      .auto("format")
      .url() || fallback;
}