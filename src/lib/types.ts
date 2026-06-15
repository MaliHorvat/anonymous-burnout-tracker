export type SurveyQuestionRow = {
  id: string;
  key: string;
  title: string;
  body: string;
  label: string;
  sort_order: number;
  active: boolean;
};

export type SurveyConfig = {
  title: string;
  subtitle: string;
  notes_enabled: boolean;
  notes_label: string;
  notes_placeholder: string;
};

export type SubmissionRow = {
  id: string;
  created_at: string;
  notes: string | null;
  answers: Record<string, number>;
};

export type SubmissionPayload = {
  org_slug: string;
  answers: Record<string, number>;
  notes?: string | null;
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
  config: SurveyConfig;
  questions: SurveyQuestionRow[];
  averages: Record<string, number>;
  recent: SubmissionRow[];
  notes: { id: string; created_at: string; notes: string; average: number }[];
};

export type PublicSurvey = {
  config: SurveyConfig;
  questions: SurveyQuestionRow[];
};

export type QuestionInput = {
  id?: string;
  key?: string;
  title: string;
  body: string;
  label: string;
  active?: boolean;
};

export type SurveySettingsInput = {
  title: string;
  subtitle: string;
  notes_enabled: boolean;
  notes_label: string;
  notes_placeholder: string;
  questions: QuestionInput[];
};
