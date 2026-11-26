import { defineField, defineType } from "sanity";

export const article = defineType({
    name: "article",
    title: "Articles",
    type: "document",
    fields: [
        defineField({ name: "title", type: "string", validation: (rule) => rule.required() }),
        defineField({ name: "slug", type: "slug", options: { source: "title", maxLength: 96 }, validation: (rule) => rule.required() }),
        defineField({ name: "excerpt", type: "text", rows: 3, validation: (rule) => rule.required() }),
        defineField({ name: "body", type: "text", rows: 14, validation: (rule) => rule.required() }),
        defineField({ name: "image", type: "image", options: { hotspot: true } }),
        defineField({ name: "category", type: "string" }),
        defineField({ name: "publishedAt", type: "datetime" }),
        defineField({ name: "featured", type: "boolean", initialValue: false }),
        defineField({ name: "seo", type: "object", fields: [
            defineField({ name: "metaTitle", type: "string" }),
            defineField({ name: "metaDescription", type: "text", rows: 3 }),
        ] }),
    ],
});
