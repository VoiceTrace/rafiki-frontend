export const homeworkIds = ["action-reaction", "force-pairs", "balanced-forces"] as const;
export type HomeworkId = (typeof homeworkIds)[number];
export function isHomeworkId(value: string): value is HomeworkId { return homeworkIds.some((id) => id === value); }
