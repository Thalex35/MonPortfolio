import { additionalProjects, featuredProjects } from "../data/projects";

export const fallbackProjects = [...featuredProjects, ...additionalProjects].map(
  (project, index) => ({
    id: `fallback-${index}`,
    title: project.name,
    category: project.type,
    description: project.description,
    full_description: "",
    technologies: project.technologies,
    github_url: project.github,
    live_demo_url: project.demo || "",
    image_url: "",
    status: project.status ? "in_progress" : "published",
    status_label: project.status || "",
    featured: index < featuredProjects.length,
    sort_order: index,
  }),
);

export const fallbackAbout = {
  headline: "Developer, student & Christian.",
  introduction:
    "A little about who I am, what I\u2019m learning, and what matters to me.",
  profile_name: "Theodore Louisjuste",
  image_url: "",
  image_alt: "Portrait of Theodore Louisjuste",
  paragraphs: [
    "I\u2019m Theodore Louisjuste, also known as Theed. I\u2019m a Computer Science student at UoPeople and a Business Management student at UEspoir, based in Aquin Sud, Haiti.",
    "I enjoy building useful software and turning ideas into clear, thoughtful interfaces. Each project gives me a chance to solve a problem, learn something new, and improve how I build for the people using it.",
    "My current focus is frontend development. I work mainly with React, JavaScript, HTML, and CSS, and use Vite in my projects. I\u2019m continuing to build experience through hands-on work and study.",
    "My Christian faith is important to me and guides me to approach people and my work with integrity and care. I\u2019m early in my journey, learning steadily and building one project at a time.",
  ],
  stats: [
    { value: "9", label: "Projects showcased" },
    { value: "2", label: "Degrees in progress" },
    { value: "HTI", label: "Based in Haiti" },
  ],
  interests: [
    "Web development",
    "Anime",
    "Church services",
    "Business",
    "Learning English",
    "Problem solving",
  ],
};

export const fallbackContactLinks = [
  {
    id: "fallback-email",
    label: "Email",
    value: "louisjuste.theodore.jr@gmail.com",
    kind: "email",
    enabled: true,
    sort_order: 0,
  },
  {
    id: "fallback-github",
    label: "GitHub",
    value: "https://github.com/Thalex35",
    kind: "url",
    enabled: true,
    sort_order: 1,
  },
  {
    id: "fallback-linkedin",
    label: "LinkedIn",
    value: "https://www.linkedin.com/in/theodore-louisjuste-763412407/",
    kind: "url",
    enabled: true,
    sort_order: 2,
  },
];

export function projectToCard(project) {
  return {
    ...project,
    name: project.title,
    type: project.category,
    github: project.github_url || "",
    demo: project.live_demo_url || "",
    primary: false,
    status: project.status_label || (project.status === "in_progress" ? "In development" : ""),
  };
}

export function contactHref(link) {
  return link.kind === "email" ? `mailto:${link.value}` : link.value;
}

export function isValidWebUrl(value) {
  if (!value) return true;

  try {
    const parsed = new URL(value);
    return parsed.protocol === "https:" || parsed.protocol === "http:";
  } catch {
    return false;
  }
}
