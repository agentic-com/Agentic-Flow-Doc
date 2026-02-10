import { defineCollection } from 'astro:content';
import { docsLoader, i18nLoader } from '@astrojs/starlight/loaders';
import { docsSchema, i18nSchema } from '@astrojs/starlight/schema';
import { videosSchema } from 'starlight-videos/schemas'
import { topicSchema } from 'starlight-sidebar-topics/schema'

export const collections = {
	docs: defineCollection({
		loader: docsLoader(), schema: docsSchema({
			extend: videosSchema.extend({
				...topicSchema.shape
			})
		})
	}),
	// Optional: the i18n collection is used to translate UI in multilingual sites
	//i18n: defineCollection({ loader: i18nLoader(), schema: i18nSchema() }),
};
