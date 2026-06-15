export const SCORE_QUESTIONS = [
  {
    key: "workload",
    label: "1. Kakšna je vaša delovna obremenitev?",
    title: "Delovna obremenitev",
    body: "Ocenite, kako obremenjeni ste z delom v zadnjem obdobju.",
  },
  {
    key: "feeling_valued",
    label: "2. Se počutite cenjeni na delovnem mestu?",
    title: "Počutje cenjenosti",
    body: "Ocenite, ali se na delovnem mestu počutite cenjeni in upoštevani.",
  },
  {
    key: "enough_resources",
    label: "3. Imate dovolj virov za opravljanje dela?",
    title: "Dovolj virov",
    body: "Ocenite, ali imate dovolj časa, opreme in podpore za kakovostno delo.",
  },
  {
    key: "work_life_balance",
    label: "4. Kako ocenjujete ravnovesje med delom in zasebnim življenjem?",
    title: "Ravnovesje delo–življenje",
    body: "Ocenite, ali lahko usklajujete delovne obveznosti z zasebnim življenjem.",
  },
  {
    key: "team_collaboration",
    label: "5. Kako ocenjujete sodelovanje in komunikacijo v ekipi?",
    title: "Ekipno sodelovanje",
    body: "Ocenite kakovost komunikacije in sodelovanja znotraj ekipe.",
  },
  {
    key: "manager_support",
    label: "6. Kako ocenjujete podporo nadrejenega / vodstva?",
    title: "Podpora vodstva",
    body: "Ocenite, ali prejemate ustrezno podporo in usmeritve od vodstva.",
  },
  {
    key: "job_satisfaction",
    label: "7. Kako zadovoljni ste s svojim delom na splošno?",
    title: "Splošno zadovoljstvo",
    body: "Ocenite celotno zadovoljstvo z delovnim mestom in vlogo.",
  },
  {
    key: "recommend_employer",
    label: "8. Priporočali bi podjetje kot delodajalca?",
    title: "Priporočilo delodajalca",
    body: "Ocenite, ali bi podjetje priporočili prijatelju ali znancu.",
  },
] as const;

export type ScoreFieldKey = (typeof SCORE_QUESTIONS)[number]["key"];

export const SCORE_FIELD_KEYS = SCORE_QUESTIONS.map((q) => q.key) as ScoreFieldKey[];

export const NOTES_FIELD = {
  key: "notes",
  label: "Dodatne opombe (neobvezno)",
  placeholder: "Delite morebitne predloge, skrbi ali opombe — brez osebnih podatkov. Največ 2000 znakov.",
  maxLength: 2000,
} as const;

export function emptyScoreValues(): Record<ScoreFieldKey, number | null> {
  return Object.fromEntries(SCORE_FIELD_KEYS.map((k) => [k, null])) as Record<ScoreFieldKey, number | null>;
}

export function submissionScores(row: Record<ScoreFieldKey, number>): number[] {
  return SCORE_FIELD_KEYS.map((k) => row[k]);
}

export function averageScores(rows: Record<ScoreFieldKey, number>[]): Record<ScoreFieldKey, number> {
  if (rows.length === 0) {
    return Object.fromEntries(SCORE_FIELD_KEYS.map((k) => [k, 0])) as Record<ScoreFieldKey, number>;
  }
  const sums = emptyScoreValues() as Record<ScoreFieldKey, number>;
  for (const row of rows) {
    for (const key of SCORE_FIELD_KEYS) sums[key] += row[key];
  }
  const result = {} as Record<ScoreFieldKey, number>;
  for (const key of SCORE_FIELD_KEYS) {
    result[key] = Math.round((sums[key] / rows.length) * 100) / 100;
  }
  return result;
}

export function rowAverage(row: Record<ScoreFieldKey, number>): number {
  const scores = submissionScores(row);
  return scores.reduce((a, b) => a + b, 0) / scores.length;
}
