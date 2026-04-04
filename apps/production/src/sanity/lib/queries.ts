export const projectsQuery = `
  *[_type == "project" && isVisible == true] | order(order asc) {
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
    client,
    year,
    order
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
