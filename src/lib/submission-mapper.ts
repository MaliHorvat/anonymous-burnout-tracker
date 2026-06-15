import type { Submission } from "@prisma/client";
import { SCORE_FIELD_KEYS, type ScoreFieldKey } from "@/lib/survey-questions";
import type { SubmissionRow } from "@/lib/types";

const PRISMA_KEY_MAP: Record<ScoreFieldKey, keyof Submission> = {
  workload: "workload",
  feeling_valued: "feelingValued",
  enough_resources: "enoughResources",
  work_life_balance: "workLifeBalance",
  team_collaboration: "teamCollaboration",
  manager_support: "managerSupport",
  job_satisfaction: "jobSatisfaction",
  recommend_employer: "recommendEmployer",
};

export function mapSubmissionRow(row: Submission): SubmissionRow {
  const scores = {} as Record<ScoreFieldKey, number>;
  for (const key of SCORE_FIELD_KEYS) {
    scores[key] = row[PRISMA_KEY_MAP[key]] as number;
  }

  return {
    ...scores,
    id: row.id,
    created_at: row.createdAt.toISOString(),
    notes: row.notes,
  };
}

export function parseScore(value: unknown): number | null {
  const n = Number(value);
  if (!Number.isInteger(n) || n < 1 || n > 5) return null;
  return n;
}

export function parseNotes(value: unknown): string | null {
  if (value === undefined || value === null || value === "") return null;
  if (typeof value !== "string") return null;
  const trimmed = value.trim();
  if (!trimmed) return null;
  return trimmed.slice(0, 2000);
}
