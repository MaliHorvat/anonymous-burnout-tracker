import type { Organization, SurveyQuestion } from "@prisma/client";
import { prisma } from "@/lib/db";
import { slugify } from "@/lib/slug";
import type { SurveyConfig, SurveyQuestionRow } from "@/lib/types";

export const DEFAULT_SURVEY_CONFIG: SurveyConfig = {
  title: "Anonimna anketa o zadovoljstvu in izgorelosti",
  subtitle: "Vaši odgovori so popolnoma anonimni.",
  notes_enabled: true,
  notes_label: "Dodatne opombe (neobvezno)",
  notes_placeholder: "Delite morebitne predloge, skrbi ali opombe — brez osebnih podatkov.",
};

export const DEFAULT_QUESTION_TEMPLATES = [
  {
    key: "workload",
    title: "Delovna obremenitev",
    body: "Ocenite, kako obremenjeni ste z delom v zadnjem obdobju.",
    label: "Kakšna je vaša delovna obremenitev?",
  },
  {
    key: "feeling_valued",
    title: "Počutje cenjenosti",
    body: "Ocenite, ali se na delovnem mestu počutite cenjeni in upoštevani.",
    label: "Se počutite cenjeni na delovnem mestu?",
  },
  {
    key: "enough_resources",
    title: "Dovolj virov",
    body: "Ocenite, ali imate dovolj časa, opreme in podpore za kakovostno delo.",
    label: "Imate dovolj virov za opravljanje dela?",
  },
  {
    key: "work_life_balance",
    title: "Ravnovesje delo–življenje",
    body: "Ocenite, ali lahko usklajujete delovne obveznosti z zasebnim življenjem.",
    label: "Kako ocenjujete ravnovesje med delom in zasebnim življenjem?",
  },
  {
    key: "team_collaboration",
    title: "Ekipno sodelovanje",
    body: "Ocenite kakovost komunikacije in sodelovanja znotraj ekipe.",
    label: "Kako ocenjujete sodelovanje in komunikacijo v ekipi?",
  },
  {
    key: "manager_support",
    title: "Podpora vodstva",
    body: "Ocenite, ali prejemate ustrezno podporo in usmeritve od vodstva.",
    label: "Kako ocenjujete podporo nadrejenega / vodstva?",
  },
  {
    key: "job_satisfaction",
    title: "Splošno zadovoljstvo",
    body: "Ocenite celotno zadovoljstvo z delovnim mestom in vlogo.",
    label: "Kako zadovoljni ste s svojim delom na splošno?",
  },
  {
    key: "recommend_employer",
    title: "Priporočilo delodajalca",
    body: "Ocenite, ali bi podjetje priporočili prijatelju ali znancu.",
    label: "Priporočali bi podjetje kot delodajalca?",
  },
] as const;

const LEGACY_KEY_MAP: Record<string, keyof Pick<
  import("@prisma/client").Submission,
  | "workload"
  | "feelingValued"
  | "enoughResources"
  | "workLifeBalance"
  | "teamCollaboration"
  | "managerSupport"
  | "jobSatisfaction"
  | "recommendEmployer"
>> = {
  workload: "workload",
  feeling_valued: "feelingValued",
  enough_resources: "enoughResources",
  work_life_balance: "workLifeBalance",
  team_collaboration: "teamCollaboration",
  manager_support: "managerSupport",
  job_satisfaction: "jobSatisfaction",
  recommend_employer: "recommendEmployer",
};

export function mapQuestionRow(q: SurveyQuestion): SurveyQuestionRow {
  return {
    id: q.id,
    key: q.key,
    title: q.title,
    body: q.body,
    label: q.label,
    sort_order: q.sortOrder,
    active: q.active,
  };
}

export function mapSurveyConfig(org: Organization): SurveyConfig {
  return {
    title: org.surveyTitle,
    subtitle: org.surveySubtitle,
    notes_enabled: org.notesEnabled,
    notes_label: org.notesLabel,
    notes_placeholder: org.notesPlaceholder,
  };
}

export async function seedDefaultQuestions(organizationId: string) {
  if (!prisma) return;
  const existing = await prisma.surveyQuestion.count({ where: { organizationId } });
  if (existing > 0) return;

  await prisma.surveyQuestion.createMany({
    data: DEFAULT_QUESTION_TEMPLATES.map((q, i) => ({
      organizationId,
      key: q.key,
      title: q.title,
      body: q.body,
      label: q.label,
      sortOrder: i,
      active: true,
    })),
  });
}

export async function getActiveQuestions(organizationId: string) {
  if (!prisma) return [];
  return prisma.surveyQuestion.findMany({
    where: { organizationId, active: true },
    orderBy: { sortOrder: "asc" },
  });
}

export async function getAllQuestions(organizationId: string) {
  if (!prisma) return [];
  return prisma.surveyQuestion.findMany({
    where: { organizationId },
    orderBy: { sortOrder: "asc" },
  });
}

export function uniqueQuestionKey(base: string, used: Set<string>): string {
  let key = slugify(base).slice(0, 48) || "vprasanje";
  if (!/^[a-z]/.test(key)) key = `q-${key}`;
  let candidate = key;
  let n = 2;
  while (used.has(candidate)) {
    candidate = `${key}-${n}`;
    n += 1;
  }
  used.add(candidate);
  return candidate;
}

export function answersFromSubmission(
  submission: import("@prisma/client").Submission,
): Record<string, number> {
  if (submission.answers && typeof submission.answers === "object" && !Array.isArray(submission.answers)) {
    const raw = submission.answers as Record<string, unknown>;
    const result: Record<string, number> = {};
    for (const [k, v] of Object.entries(raw)) {
      const n = Number(v);
      if (Number.isInteger(n) && n >= 1 && n <= 5) result[k] = n;
    }
    if (Object.keys(result).length > 0) return result;
  }

  const legacy: Record<string, number> = {};
  for (const [key, field] of Object.entries(LEGACY_KEY_MAP)) {
    const value = submission[field];
    if (typeof value === "number") legacy[key] = value;
  }
  return legacy;
}

export function averageForQuestions(
  rows: Record<string, number>[],
  questionKeys: string[],
): Record<string, number> {
  if (rows.length === 0) return Object.fromEntries(questionKeys.map((k) => [k, 0]));
  const result: Record<string, number> = {};
  for (const key of questionKeys) {
    const values = rows.map((r) => r[key]).filter((v) => typeof v === "number");
    if (values.length === 0) {
      result[key] = 0;
      continue;
    }
    result[key] = Math.round((values.reduce((a, b) => a + b, 0) / values.length) * 100) / 100;
  }
  return result;
}

export function rowAverageFromAnswers(answers: Record<string, number>, keys: string[]): number {
  const values = keys.map((k) => answers[k]).filter((v) => typeof v === "number");
  if (values.length === 0) return 0;
  return values.reduce((a, b) => a + b, 0) / values.length;
}

export const NOTES_MAX_LENGTH = 2000;
