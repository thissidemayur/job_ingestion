export interface CanonicalJob {
  source: string;
  externalId: string;

  title: string;
  company: string;

  location?: string;
  description?: string;
  url: string;

  publishedAt?: Date;
  fetchedAt: Date;
}
