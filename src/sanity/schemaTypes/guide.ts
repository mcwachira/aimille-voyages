import { defineArrayMember, defineField, defineType } from "sanity";

export const guide = defineType({
    name: "guide",
    title: "Travel Guides",
    type: "document",
    fields: [
        defineField({ name: "title", type: "string", validation: (rule) => rule.required() }),
        defineField({ name: "slug", type: "slug", options: { source: "title", maxLength: 96 }, validation: (rule) => rule.required() }),
        defineField({ name: "summary", type: "text", rows: 3, validation: (rule) => rule.required() }),
        defineField({ name: "body", type: "text", rows: 14, validation: (rule) => rule.required() }),
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
