
import { defineField, defineType } from "sanity";

export const experience = defineType({
    name: "experience",
    title: "Experiences",
    type: "document",
    fields: [
        defineField({
            name: "title",
            title: "Experience Title",
            type: "string",
            validation: (Rule) => Rule.required(),
        }),
        defineField({
            name: "slug",
            title: "URL Slug",
            type: "slug",
            options: { source: "title", maxLength: 96 },
            validation: (Rule) => Rule.required(),
        }),
        defineField({
            name: "category",
            title: "Experience Category",
            type: "reference",
            to: [{ type: "experienceCategory" }],
            validation: (Rule) => Rule.required(),
        }),
        defineField({
            name: "destination",
            title: "Destination",
            type: "reference",
            to: [{ type: "destination" }],
            validation: (Rule) => Rule.required(),
        }),
        defineField({
            name: "image",
            title: "Main Experience Image",
            type: "image",
            options: { hotspot: true },
            validation: (Rule) => Rule.required(),
        }),
        defineField({
            name: "description",
            title: "Description",
            type: "text",
            rows: 5,
            validation: (Rule) => Rule.required(),
        }),
        defineField({
            name: "considerations",
            title: "Important Considerations",
            description:
                "Things visitors should know before enquiring or booking.",
            type: "array",
            of: [{ type: "string" }],
        }),
        defineField({
            name: "duration",
            title: "Duration",
            type: "string",
            description: "Only enter a duration when it has been confirmed.",
        }),
        defineField({
            name: "durationVerified",
            title: "Duration Verified",
            type: "boolean",
            initialValue: false,
            description:
                "The website should only display the duration when this is enabled.",
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
            title: "Featured Experience",
            type: "boolean",
            initialValue: false,
        }),
        defineField({
            name: "order",
            title: "Display Order",
            type: "number",
            initialValue: 0,
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
    orderings: [
        {
            title: "Display Order",
            name: "orderAsc",
            by: [{ field: "order", direction: "asc" }],
        },
    ],
    preview: {
        select: {
            title: "title",
            subtitle: "destination.name",
            media: "image",
        },
    },
});
