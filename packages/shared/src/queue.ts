export interface PersistJobPayload {
  source: string;
  externalId: string;

  title: string;
  company: string;

  location?: string;
  description?: string;
  url: string;

  publishedAt?: string;
  fetchedAt: string;
}
