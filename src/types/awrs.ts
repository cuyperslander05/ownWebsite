export interface NavLink {
  label: string;
  href: string;
}

export interface AboutCard {
  avatarInitials: string;
  name: string;
  title: string;
  bio: string;
}

export interface EducationEntry {
  school: string;
  degree: string;
  status: string;
  years: string;
}

export interface StatItem {
  label: string;
  value: number;
  icon: string;
}

export interface ExperienceEntry {
  period: string;
  role: string;
  org: string;
  description: string;
  tags: string[];
  icon: string;
  accentColor: string;
}

export interface SkillItem {
  name: string;
  icon: string;
}

export interface ProjectScreenshot {
  src: string;
  alt: string;
}

export interface ProjectItem {
  index: string;
  title: string;
  category: string;
  date: string;
  description: string;
  logo: string;
  screenshots: ProjectScreenshot[];
  tags: string[];
  href: string;
  cardBg: string;
}

export interface GithubStats {
  username: string;
  totalContributions: number;
  followers: number;
  repositories: number;
  stars: number;
}

export interface FooterLinkGroup {
  heading: string;
  links: NavLink[];
}
