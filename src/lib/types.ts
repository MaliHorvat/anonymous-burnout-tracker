import type { ScoreFieldKey } from "@/lib/survey-questions";

export type SubmissionRow = {
  id: string;
  created_at: string;
  notes: string | null;
} & Record<ScoreFieldKey, number>;

export type SubmissionPayload = Record<ScoreFieldKey, number> & {
  notes?: string | null;
  org_slug: string;
};

export type OrganizationInfo = {
  id: string;
  name: string;
  slug: string;
  setup_completed: boolean;
  survey_url: string;
};

export type DashboardStats = {
  count: number;
  notes_count: number;
  averages: Record<ScoreFieldKey, number>;
  recent: SubmissionRow[];
  notes: { id: string; created_at: string; notes: string; average: number }[];
};
