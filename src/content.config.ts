import { defineCollection } from 'astro:content';
import { z } from 'astro/zod';
import { docsLoader } from '@astrojs/starlight/loaders';
import { docsSchema } from '@astrojs/starlight/schema';
import { videosSchema } from 'starlight-videos/schemas'
import { topicSchema } from 'starlight-sidebar-topics/schema'

/**
 * AWFlow page metadata (epic awflow/Agentic-Flow#1308). Every field is optional so
 * existing pages keep building; the starlight-awflow plugin reads them to render
 * section banners, node headers, lesson rails and recipe cards.
 */
const awflowSchema = z.object({
	/** Which page template the plugin renders. */
	kind: z.enum(['node', 'lesson', 'recipe', 'concept', 'guide', 'connection', 'release', 'hub']).optional(),
	/** Top-level tab the page belongs to (drives the section colour). */
	section: z.enum(['get-started', 'app', 'recipes', 'nodes', 'concepts', 'releases']).optional(),
	/** Where a node runs. Replaces the per-page CORS explanations. */
	worksIn: z.array(z.enum(['extension', 'web'])).optional(),
	/** Node reference metadata; `id` matches the node's docLink slug. */
	node: z
		.object({
			id: z.string(),
			family: z.enum(['trigger', 'lambda', 'inpage', 'flow', 'data', 'core', 'ai', 'integration']).optional(),
			agentTool: z.boolean().optional(),
			deprecated: z.boolean().optional(),
			since: z.string().optional(),
		})
		.optional(),
	/** Learning-path lesson metadata. */
	lesson: z
		.object({
			level: z.number().int().min(1),
			order: z.number().int().min(1),
			minutes: z.number().int().optional(),
		})
		.optional(),
	/** Recipe metadata; `awf` points at the example workflow file. */
	recipe: z
		.object({
			goal: z.string(),
			level: z.enum(['beginner', 'intermediate', 'advanced']),
			minutes: z.number().int(),
			setup: z.enum(['none', 'connection', 'on-device']),
			apps: z.array(z.string()).optional(),
			awf: z.string().optional(),
			marketplaceId: z.string().optional(),
		})
		.optional(),
});

export const collections = {
	docs: defineCollection({
		loader: docsLoader(), schema: docsSchema({
			extend: videosSchema.extend({
				...topicSchema.shape,
				...awflowSchema.shape,
			})
		})
	}),
};
