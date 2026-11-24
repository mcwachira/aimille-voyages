
import type { SchemaTypeDefinition } from "sanity";

import { destination } from "./destination";
import { experience } from "./experience";
import { experienceCategory } from "./experienceCategory";

export const schema: { types: SchemaTypeDefinition[] } = {
  types: [
    destination,
    experience,
    experienceCategory,
  ],
};
