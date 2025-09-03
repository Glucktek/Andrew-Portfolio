export type SocialLink = {
  name: string;
  url: string;
  icon: string; // astro-icon name
};

export const socialLinks: SocialLink[] = [
  { name: "Twitter", url: "https://x.com/glucktek", icon: "tabler/brand-x" },
  {
    name: "LinkedIn",
    url: "https://www.linkedin.com/in/andrew-gluck-452ab295",
    icon: "tabler/brand-linkedin",
  },
  {
    name: "GitHub",
    url: "https://github.com/glucktek",
    icon: "tabler/brand-github",
  },
];

export default socialLinks;
