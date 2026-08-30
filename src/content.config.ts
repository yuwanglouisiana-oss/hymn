import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const stanzaSchema = z.object({
  type: z.enum(['verse', 'chorus', 'refrain', 'bridge']),
  number: z.number().optional(),
  zh: z.array(z.string()),
  en: z.array(z.string()),
  /** Seconds into the YouTube track where this stanza begins, for synced present mode. */
  startSeconds: z.number().optional(),
});

const hymns = defineCollection({
  loader: glob({ pattern: '**/*.json', base: './src/content/hymns' }),
  schema: z.object({
    number: z.string().optional(),
    titleZh: z.string(),
    titleEn: z.string(),
    lyricist: z.string().optional(),
    composer: z.string().optional(),
    year: z.string().optional(),
    scripture: z.string().optional(),
    ccli: z.string().optional(),
    youtubeId: z.string().optional(),
    background: z
      .object({
        zh: z.string(),
        en: z.string(),
      })
      .optional(),
    stanzas: z.array(stanzaSchema),
  }),
});

export const collections = { hymns };
