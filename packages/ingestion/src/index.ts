import { toCanonicalJob } from "./sources/arbeitnow/adapter.js";
import { fetchArbeitnowJobs } from "./sources/arbeitnow/client.js";

export async function ingestArbeitnowJobs() {
  const response = await fetchArbeitnowJobs();
  return response.data.map(toCanonicalJob);
}


