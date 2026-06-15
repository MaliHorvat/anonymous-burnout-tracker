export type SubmissionRow = {
  id: string;
  workload: number;
  feeling_valued: number;
  enough_resources: number;
  created_at: string;
};

export type SubmissionPayload = {
  workload: number;
  feeling_valued: number;
  enough_resources: number;
};

export type DashboardStats = {
  count: number;
  averages: {
    workload: number;
    feeling_valued: number;
    enough_resources: number;
  };
  recent: SubmissionRow[];
};
