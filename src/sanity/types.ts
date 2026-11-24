export type SanityImage = {
    asset?: {
        _id?: string;
        url?: string;
        metadata?: {
            dimensions?: {
                width?: number;
                height?: number;
            };
            lqip?: string;
        };
    } | null;
} | null;

export type SanityDestinationCard = {
    _id: string;
    name: string;
    slug: string;
    country: string;
    region?: string;
    summary: string;
    image: SanityImage;
};

export type SanityDestination = SanityDestinationCard & {
    intro?: string;
    special?: string[];
    experiences?: string[];
    accommodation?: string;
    transport?: string;
    stayLength?: string;
    featured?: boolean;
    gallery?: SanityImage[];
    related?: SanityDestinationCard[];
    seo?: {
        metaTitle?: string;
        metaDescription?: string;
    };
};

export type SanityExperienceCategory = {
    _id: string;
    name: string;
    slug: string;
    blurb?: string;
    order?: number;
    image?: SanityImage;
};

export type SanityExperience = {
    _id: string;
    title: string;
    slug: string;
    description: string;
    considerations?: string[];
    duration?: string;
    durationVerified?: boolean;
    featured?: boolean;
    order?: number;
    image: SanityImage;
    gallery?: SanityImage[];
    category?: {
        _id?: string;
        name: string;
        slug: string;
        blurb?: string;
    } | null;
    destination?: {
        _id?: string;
        name: string;
        slug: string;
        country?: string;
        region?: string;
    } | null;
    seo?: {
        metaTitle?: string;
        metaDescription?: string;
    };
};