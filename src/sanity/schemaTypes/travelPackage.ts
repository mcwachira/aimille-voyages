import { defineArrayMember, defineField, defineType } from "sanity";

export const travelPackage = defineType({
    name: "travelPackage",
    title: "Travel Packages",
    type: "document",
    fields: [
        defineField({ name: "title", type: "string", validation: (rule) => rule.required() }),
        defineField({ name: "slug", type: "slug", options: { source: "title", maxLength: 96 }, validation: (rule) => rule.required() }),
        defineField({ name: "summary", type: "text", rows: 3, validation: (rule) => rule.required() }),
        defineField({ name: "description", type: "text", rows: 8 }),
        defineField({ name: "duration", type: "string", description: "Only add a duration that has been confirmed." }),
        defineField({ name: "destinations", type: "array", of: [defineArrayMember({ type: "reference", to: [{ type: "destination" }] })] }),
        defineField({ name: "experiences", type: "array", of: [defineArrayMember({ type: "reference", to: [{ type: "experience" }] })] }),
        defineField({ name: "image", type: "image", options: { hotspot: true } }),
        defineField({ name: "featured", type: "boolean", initialValue: false }),
        defineField({ name: "seo", type: "object", fields: [
            defineField({ name: "metaTitle", type: "string" }),
            defineField({ name: "metaDescription", type: "text", rows: 3 }),
        ] }),
    ],
});
