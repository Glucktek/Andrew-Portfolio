import { type SiteDataProps } from "../types/configDataTypes";

// Update this file with your site specific information
const siteData: SiteDataProps = {
  name: "{ Andrew Gluck }",
  // Your website's title and description (meta fields)
  title: "Andrew Gluck",
  description: "Building your digital future one line of code at a time",

  // Your information for blog post purposes
  author: {
    name: "Andrew Gluck",
    email: "contact@glucktek.com",
    twitter: "",
  },

  // default image for meta tags if the page doesn't have an image already
  defaultImage: {
    src: "/images/andrew.jpg",
    alt: "Cosmic Themes logo",
  },
};

export default siteData;
