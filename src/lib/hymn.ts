import type { CollectionEntry } from 'astro:content';

export function slugify(titleEn: string): string {
  return titleEn
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
}

export function hymnSlug(hymn: CollectionEntry<'hymns'>['data']): string {
  return slugify(hymn.titleEn);
}

type Stanza = CollectionEntry<'hymns'>['data']['stanzas'][number];

const ZH_NUMERALS = ['', '一', '二', '三', '四', '五', '六', '七', '八', '九', '十'];

const TYPE_LABELS: Record<Stanza['type'], { zh: string; en: string }> = {
  verse: { zh: '節', en: 'Verse' },
  chorus: { zh: '副歌', en: 'Chorus' },
  refrain: { zh: '疊句', en: 'Refrain' },
  bridge: { zh: '橋段', en: 'Bridge' },
};

export function stanzaLabel(stanza: Stanza): { zh: string; en: string } {
  const { zh, en } = TYPE_LABELS[stanza.type];
  if (stanza.type === 'verse' && stanza.number) {
    const zhNum = ZH_NUMERALS[stanza.number] ?? String(stanza.number);
    return { zh: `第${zhNum}節`, en: `Verse ${stanza.number}` };
  }
  return { zh, en };
}

export interface Slide {
  stanzaIndex: number;
  part: number;
  totalParts: number;
  type: Stanza['type'];
  number?: number;
  zh: string[];
  en: string[];
}

/**
 * Splits each stanza into screen-sized slides (default: 4 lines) so a long
 * verse doesn't overflow a single projected screen. Line counts stay small
 * enough to keep type large and readable from the back of a room.
 */
export function buildSlides(stanzas: Stanza[], maxLines = 4): Slide[] {
  return stanzas.flatMap((stanza, stanzaIndex) => {
    const lineCount = Math.max(stanza.zh.length, stanza.en.length);
    const totalParts = Math.max(1, Math.ceil(lineCount / maxLines));
    return Array.from({ length: totalParts }, (_, part) => {
      const start = part * maxLines;
      return {
        stanzaIndex,
        part,
        totalParts,
        type: stanza.type,
        number: stanza.number,
        zh: stanza.zh.slice(start, start + maxLines),
        en: stanza.en.slice(start, start + maxLines),
      };
    });
  });
}
