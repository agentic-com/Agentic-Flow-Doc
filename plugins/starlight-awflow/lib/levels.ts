/**
 * Learning-path levels (awflow/Agentic-Flow#1341). Lessons opt in with
 * `kind: lesson` + `lesson: { level, order, minutes }` frontmatter; this file only names the levels
 * and points at each level's landing page, which the lesson rail links to as "next level".
 */
export interface LearningLevel {
	level: number;
	title: string;
	href: string;
}

export const LEARNING_LEVELS: LearningLevel[] = [
	{ level: 1, title: 'Your first automations', href: '/get-started/learning-path/' },
	{ level: 2, title: 'Working with data', href: '/get-started/working-with-data/' },
	{ level: 3, title: 'Agents & knowledge', href: '/get-started/agents-and-knowledge/' },
];

export const levelInfo = (level: number): LearningLevel =>
	LEARNING_LEVELS.find((l) => l.level === level) ?? { level, title: `Level ${level}`, href: '/get-started/learning-path/' };
