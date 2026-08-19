import { arbeitnowResponseSchema, type ArbeitnowResponse } from "./schema.js";

const ARBEITNOW_URL = "https://www.arbeitnow.com/api/job-board-api";

export async function fetchArbeitnowJobs(): Promise<ArbeitnowResponse> {
  const response = await fetch(ARBEITNOW_URL);

  if (!response.ok) {
    throw new Error(
      `Arbeitnow request failed: ${response.status} ${response.statusText}`,
    );
  }

  const data: unknown = await response.json();

  return arbeitnowResponseSchema.parse(data);
}

