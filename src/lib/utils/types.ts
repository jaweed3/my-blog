export type NoUndefinedField<T> = { [P in keyof T]-?: NoUndefinedField<NonNullable<T[P]>> };

export type SparkleType = {
  id: string,
  createdAt: number,
  color: string,
  size: number,
  style: any
}

export type TagType = {
  label: string,
  color?: 'primary' | 'secondary'
}

export type SocialLink = {

}

export type Feature = {
  name: string,
  description: string,
  image: string,
  tags: TagType[]
}

export type BlogPost = {
  tags: string[],
  keywords: string[],
  hidden: boolean,
  slug: string,
  title: string,
  date: string,
  updated: string,
  excerpt: string,
  html: string | undefined,
  readingTime: string,
  relatedPosts: BlogPost[],
  coverImage: string | undefined
}

export type Project = {
  title: string;
  slug: string;
  description: string;
  excerpt: string;
  coverImage: string;
  tags: string[];
  techStack: string[];
  github?: string;
  demo?: string;
  paper?: string;
  date: string;
  status: 'active' | 'wip' | 'archived';
  featured: boolean;
  hidden: boolean;
  html: string | undefined;
  impact: string;
  problem: string;
  results: string[];
  outcome: string;
};
