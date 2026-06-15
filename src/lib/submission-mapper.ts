import type { Submission } from "@prisma/client";
import { answersFromSubmission } from "@/lib/survey-service";
import type { SubmissionRow } from "@/lib/types";

export function mapSubmissionRow(submission: Submission): SubmissionRow {
  return {
    id: submission.id,
    created_at: submission.createdAt.toISOString(),
    notes: submission.notes,
    answers: answersFromSubmission(submission),
  };
}

export function parseScore(value: unknown): number | null {
  const n = Number(value);
  if (!Number.isInteger(n) || n < 1 || n > 5) return null;
  return n;
}

export function parseNotes(value: unknown, maxLength = 2000): string | null {
  if (value === undefined || value === null || value === "") return null;
  if (typeof value !== "string") return null;
  const trimmed = value.trim();
  if (!trimmed) return null;
  return trimmed.slice(0, maxLength);
}
