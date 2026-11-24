
import { defineField, defineType } from "sanity";

export const experienceCategory = defineType({
    name: "experienceCategory",
    title: "Experience Categories",
    type: "document",
    fields: [
        defineField({
            name: "name",
            title: "Category Name",
            type: "string",
            validation: (Rule) => Rule.required(),
        }),
        defineField({
            name: "slug",
            title: "URL Slug",
            type: "slug",
            options: { source: "name", maxLength: 96 },
            validation: (Rule) => Rule.required(),
        }),
        defineField({
            name: "image",
            title: "Category Image",
            type: "image",
            options: { hotspot: true },
        }),
        defineField({
            name: "blurb",
            title: "Short Description",
            type: "text",
            rows: 3,
        }),
        defineField({
            name: "order",
            title: "Display Order",
            type: "number",
            initialValue: 0,
        }),
    ],
    orderings: [
        {
            title: "Display Order",
            name: "orderAsc",
            by: [{ field: "order", direction: "asc" }],
        },
    ],
    preview: {
        select: {
            title: "name",
            media: "image",
        },
    },
});
