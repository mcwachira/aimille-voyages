
import { defineQuery } from "next-sanity";

// ---------------------------------------------
// DESTINATIONS
// ---------------------------------------------

export const DESTINATIONS_QUERY = defineQuery(`
  *[_type == "destination"] | order(name asc) {
    _id,
    _createdAt,
    _updatedAt,
    name,
    "slug": slug.current,
    country,
    region,
    summary,
    intro,
    special,
    experiences,
    accommodation,
    transport,
    stayLength,
    featured,
    image {
      ...,
      asset-> {
        _id,
        url,
        metadata {
          dimensions,
          lqip
        }
      }
    },
    gallery[] {
      ...,
      asset-> {
        _id,
        url,
        metadata {
          dimensions,
          lqip
        }
      }
    },
    related[]-> {
      _id,
      name,
      "slug": slug.current,
      country,
      region,
      summary,
      image {
        ...,
        asset-> {
          _id,
          url
        }
      }
    },
    seo
  }
`);

export const DESTINATION_BY_SLUG_QUERY = defineQuery(`
  *[_type == "destination" && slug.current == $slug][0] {
    _id,
    _createdAt,
    _updatedAt,
    name,
    "slug": slug.current,
    country,
    region,
    summary,
    intro,
    special,
    experiences,
    accommodation,
    transport,
    stayLength,
    featured,
    image {
      ...,
      asset-> {
        _id,
        url,
        metadata {
          dimensions,
          lqip
        }
      }
    },
    gallery[] {
      ...,
      asset-> {
        _id,
        url,
        metadata {
          dimensions,
          lqip
        }
      }
    },
    related[]-> {
      _id,
      name,
      "slug": slug.current,
      country,
      region,
      summary,
      image {
        ...,
        asset-> {
          _id,
          url
        }
      }
    },
    seo
  }
`);

export const FEATURED_DESTINATIONS_QUERY = defineQuery(`
  *[_type == "destination" && featured == true]
    | order(name asc) {
      _id,
      name,
      "slug": slug.current,
      country,
      region,
      summary,
      image {
        ...,
        asset-> {
          _id,
          url,
          metadata {
            dimensions,
            lqip
          }
        }
      }
    }
`);


// ---------------------------------------------
// EXPERIENCE CATEGORIES
// ---------------------------------------------

export const EXPERIENCE_CATEGORIES_QUERY = defineQuery(`
  *[_type == "experienceCategory"] | order(order asc, name asc) {
    _id,
    name,
    "slug": slug.current,
    blurb,
    order,
    image {
      ...,
      asset-> {
        _id,
        url,
        metadata {
          dimensions,
          lqip
        }
      }
    }
  }
`);

export const EXPERIENCE_CATEGORY_BY_SLUG_QUERY = defineQuery(`
  *[_type == "experienceCategory" && slug.current == $slug][0] {
    _id,
    name,
    "slug": slug.current,
    blurb,
    order,
    image {
      ...,
      asset-> {
        _id,
        url,
        metadata {
          dimensions,
          lqip
        }
      }
    }
  }
`);


// ---------------------------------------------
// EXPERIENCES
// ---------------------------------------------

export const EXPERIENCES_QUERY = defineQuery(`
  *[_type == "experience"] | order(order asc, title asc) {
    _id,
    _createdAt,
    _updatedAt,
    title,
    "slug": slug.current,
    description,
    considerations,
    duration,
    durationVerified,
    featured,
    order,
    image {
      ...,
      asset-> {
        _id,
        url,
        metadata {
          dimensions,
          lqip
        }
      }
    },
    gallery[] {
      ...,
      asset-> {
        _id,
        url,
        metadata {
          dimensions,
          lqip
        }
      }
    },
    category-> {
      _id,
      name,
      "slug": slug.current,
      blurb
    },
    destination-> {
      _id,
      name,
      "slug": slug.current,
      country,
      region
    },
    seo
  }
`);

export const EXPERIENCE_BY_SLUG_QUERY = defineQuery(`
  *[_type == "experience" && slug.current == $slug][0] {
    _id,
    _createdAt,
    _updatedAt,
    title,
    "slug": slug.current,
    description,
    considerations,
    duration,
    durationVerified,
    featured,
    order,
    image {
      ...,
      asset-> {
        _id,
        url,
        metadata {
          dimensions,
          lqip
        }
      }
    },
    gallery[] {
      ...,
      asset-> {
        _id,
        url,
        metadata {
          dimensions,
          lqip
        }
      }
    },
    category-> {
      _id,
      name,
      "slug": slug.current,
      blurb
    },
    destination-> {
      _id,
      name,
      "slug": slug.current,
      country,
      region
    },
    seo
  }
`);

export const FEATURED_EXPERIENCES_QUERY = defineQuery(`
  *[_type == "experience" && featured == true]
    | order(order asc, title asc) {
      _id,
      title,
      "slug": slug.current,
      description,
      duration,
      durationVerified,
      image {
        ...,
        asset-> {
          _id,
          url,
          metadata {
            dimensions,
            lqip
          }
        }
      },
      category-> {
        name,
        "slug": slug.current
      },
      destination-> {
        name,
        "slug": slug.current
      }
    }
`);

export const EXPERIENCES_BY_CATEGORY_QUERY = defineQuery(`
  *[
    _type == "experience" &&
    category->slug.current == $categorySlug
  ] | order(order asc, title asc) {
    _id,
    title,
    "slug": slug.current,
    description,
    considerations,
    duration,
    durationVerified,
    featured,
    image {
      ...,
      asset-> {
        _id,
        url,
        metadata {
          dimensions,
          lqip
        }
      }
    },
    category-> {
      name,
      "slug": slug.current
    },
    destination-> {
      name,
      "slug": slug.current
    }
  }
`);

export const EXPERIENCES_BY_DESTINATION_QUERY = defineQuery(`
  *[
    _type == "experience" &&
    destination->slug.current == $destinationSlug
  ] | order(order asc, title asc) {
    _id,
    title,
    "slug": slug.current,
    description,
    considerations,
    duration,
    durationVerified,
    featured,
    image {
      ...,
      asset-> {
        _id,
        url,
        metadata {
          dimensions,
          lqip
        }
      }
    },
    category-> {
      name,
      "slug": slug.current
    },
    destination-> {
      name,
      "slug": slug.current
    }
  }
`);
