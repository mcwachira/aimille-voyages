
import { defineField, defineType } from "sanity";

export const destination = defineType({
    name: "destination",
    title: "Destinations",
    type: "document",
    fields: [
        defineField({
            name: "name",
            title: "Destination Name",
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
            name: "country",
            title: "Country",
            type: "string",
            validation: (Rule) => Rule.required(),
        }),
        defineField({
            name: "region",
            title: "Region",
            type: "string",
        }),
        defineField({
            name: "image",
            title: "Main Destination Image",
            type: "image",
            options: { hotspot: true },
            validation: (Rule) => Rule.required(),
        }),
        defineField({
            name: "summary",
            title: "Short Summary",
            type: "text",
            rows: 3,
            validation: (Rule) => Rule.required(),
        }),
        defineField({
            name: "intro",
            title: "Introduction",
            type: "text",
            rows: 5,
        }),
        defineField({
            name: "special",
            title: "What Makes This Destination Special",
            description: "Add the key attractions and distinguishing features.",
            type: "array",
            of: [{ type: "string" }],
        }),
        defineField({
            name: "experiences",
            title: "Activity Ideas",
            description:
                "General activities visitors can enjoy here. These are not individual experience pages.",
            type: "array",
            of: [{ type: "string" }],
        }),
        defineField({
            name: "accommodation",
            title: "Accommodation Information",
            type: "text",
            rows: 4,
        }),
        defineField({
            name: "transport",
            title: "Transport Information",
            type: "text",
            rows: 4,
        }),
        defineField({
            name: "stayLength",
            title: "Recommended Stay Length",
            type: "string",
        }),
        defineField({
            name: "related",
            title: "Related Destinations",
            type: "array",
            of: [
                {
                    type: "reference",
                    to: [{ type: "destination" }],
                },
            ],
        }),
        defineField({
            name: "gallery",
            title: "Photo Gallery",
            type: "array",
            of: [
                {
                    type: "image",
                    options: { hotspot: true },
                },
            ],
        }),
        defineField({
            name: "featured",
            title: "Featured Destination",
            type: "boolean",
            initialValue: false,
        }),
        defineField({
            name: "seo",
            title: "SEO Settings",
            type: "object",
            fields: [
                defineField({
                    name: "metaTitle",
                    title: "Meta Title",
                    type: "string",
                }),
                defineField({
                    name: "metaDescription",
                    title: "Meta Description",
                    type: "text",
                    rows: 3,
                }),
            ],
        }),
    ],
    preview: {
        select: {
            title: "name",
            subtitle: "region",
            media: "image",
        },
    },
});
