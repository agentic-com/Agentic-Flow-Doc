import { defineCollection } from 'astro:content';
import { docsLoader, i18nLoader } from '@astrojs/starlight/loaders';
import { docsSchema, i18nSchema } from '@astrojs/starlight/schema';
import { autoSidebarLoader } from 'starlight-auto-sidebar/loader'
import { autoSidebarSchema } from 'starlight-auto-sidebar/schema'
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
	autoSidebar: defineCollection({
		loader: autoSidebarLoader(),
		schema: autoSidebarSchema(),
	}),
	// Optional: the i18n collection is used to translate UI in multilingual sites
	i18n: defineCollection({ loader: i18nLoader(), schema: i18nSchema() }),
};
