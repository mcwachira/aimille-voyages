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

export type SanityRelatedDestination = {
    _id: string;
    name: string;
    slug: string;
    country?: string;
    region?: string;
    summary?: string;
    image?: SanityImage;
};

export type SanityRelatedExperience = {
    _id: string;
    title: string;
    slug: string;
    description?: string;
    duration?: string;
    durationVerified?: boolean;
    image?: SanityImage;
};

export type SanityEditorialSeo = {
    metaTitle?: string;
    metaDescription?: string;
};

export type SanityTravelPackage = {
    _id: string;
    _updatedAt?: string;
    title: string;
    slug: string;
    summary: string;
    description?: string;
    duration?: string;
    destinations?: Array<SanityRelatedDestination | null>;
    experiences?: Array<SanityRelatedExperience | null>;
    image?: SanityImage;
    featured?: boolean;
    seo?: SanityEditorialSeo;
};

export type SanityArticle = {
    _id: string;
    _updatedAt?: string;
    title: string;
    slug: string;
    excerpt: string;
    body: string;
    image?: SanityImage;
    category?: string;
    publishedAt?: string;
    featured?: boolean;
    seo?: SanityEditorialSeo;
};

export type SanityGuide = {
    _id: string;
    _updatedAt?: string;
    title: string;
    slug: string;
    summary: string;
    body: string;
    destinations?: Array<SanityRelatedDestination | null>;
    experiences?: Array<SanityRelatedExperience | null>;
    image?: SanityImage;
    featured?: boolean;
    seo?: SanityEditorialSeo;
};
