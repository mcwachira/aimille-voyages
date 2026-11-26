
import type { SchemaTypeDefinition } from "sanity";

import { destination } from "./destination";
import { experience } from "./experience";
import { experienceCategory } from "./experienceCategory";
import { travelPackage } from "./travelPackage";
import { article } from "./article";
import { guide } from "./guide";

export const schema: { types: SchemaTypeDefinition[] } = {
  types: [
    destination,
    experience,
    experienceCategory,
    travelPackage,
    article,
    guide,
  ],
};
