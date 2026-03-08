export type BlogPromptMode = "tldr" | "tell_more";

export interface KanbanCardSummary {
  id: string;
  title: string;
  status: string;
  priority?: string;
}

export const buildBlogPrompt = (
  title: string,
  content: string,
  mode: BlogPromptMode,
) => {
  const plainText = content
    .replace(/<[^>]*>/g, " ")
    .replace(/\s+/g, " ")
    .trim()
    .slice(0, 3000);

  const prompts = {
    tldr: `
You are a concise summarizer.

Given the blog post titled "${title}", provide a TL;DR summary in 3-4 bullet points.

Rules:
- Each bullet must be a key takeaway
- Keep it clear and punchy
- Use "•" bullet formatting

Blog content:
${plainText}
`,

    tell_more: `
You are an insightful writer who expands on blog topics.

Given the blog post titled "${title}", provide 3-4 deeper insights or additional context.

Rules:
- Number the points
- Add background or implications
- Expand the author's ideas

Blog content:
${plainText}
`,
  };

  return prompts[mode];
};

export const buildKanbanMovePrompt = (
  instruction: string,
  cards: KanbanCardSummary[],
): string => {
  return `
You are an AI assistant managing a Kanban board.

User instruction:
"${instruction}"

Here are the current cards:

${JSON.stringify(cards, null, 2)}

Valid statuses:
backlog
todo
doing
done

Your task:
Determine which cards should move to another status.

Rules:
- Match cards using title or priority
- Only include cards that should move
- If nothing matches return []

Return ONLY JSON like this:

[
  { "cardId": "CARD_ID", "newStatus": "todo" }
]
`;
};
