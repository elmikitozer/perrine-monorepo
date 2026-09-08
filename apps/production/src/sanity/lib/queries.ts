export const projectsQuery = `
  *[_type == "project" && isVisible == true] | order(orderRank asc) {
    _id,
    title,
    slug,
    image {
      ...,
      asset->{
        _id,
        url,
        metadata {
          dimensions,
          lqip
        }
      }
    },
    images[0...4] {
      ...,
      asset->{
        _id,
        url,
        metadata {
          dimensions,
          lqip
        }
      }
    },
    client,
    year
  }
`;

export const projectBySlugQuery = `
  *[_type == "project" && slug.current == $slug][0] {
    _id,
    title,
    slug,
    client,
    year,
    role,
    image {
      ...,
      asset->{
        _id,
        url,
        metadata { dimensions, lqip }
      }
    },
    images[] {
      ...,
      asset->{
        _id,
        url,
        metadata { dimensions, lqip }
      }
    }
  }
`;

export const sitemapProjectsQuery = `
  *[_type == "project" && isVisible == true && defined(slug.current)] {
    "slug": slug.current,
    _updatedAt
  }
`;

export const aboutQuery = `
  *[_type == "aboutPage"][0] {
    bio,
    email,
    instagram,
    linkedin
  }
`;
