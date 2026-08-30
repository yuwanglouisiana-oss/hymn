# 主日詩歌 · Sunday Hymns

A bilingual (Chinese/English) hymn site: a browsable hymnal, a per-hymn lyrics page with three
display modes, and a full-screen "present" mode for showing lyrics on a projector.

## Commands

| Command           | Action                                      |
| :----------------- | :------------------------------------------ |
| `npm run dev`      | Local dev server at `localhost:4321`        |
| `npm run build`    | Build the static site to `./dist/`          |
| `npm run preview`  | Preview the production build locally        |

## Adding a hymn

Each hymn is one JSON file in `src/content/hymns/`. The filename itself isn't used for the
URL — the route slug is derived from `titleEn` instead — so filenames just need to be
unique and readable (e.g. `great-is-thy-faithfulness.json`).

```jsonc
{
  "number": "004",              // optional, shown in the list
  "titleZh": "你信實何廣大",
  "titleEn": "Great is Thy Faithfulness",
  "lyricist": "Thomas O. Chisholm",
  "composer": "William M. Runyan",
  "year": "1923",
  "scripture": "耶利米哀歌 3:22-23 · Lamentations 3:22-23",
  "ccli": "",                    // optional CCLI song number, for copyrighted songs
  "youtubeId": "",               // optional YouTube video ID (the part after v=)
  "background": {                // optional bilingual background story
    "zh": "...",
    "en": "..."
  },
  "stanzas": [
    {
      "type": "verse",           // "verse" | "chorus" | "refrain" | "bridge"
      "number": 1,                // required for type "verse", used for the label
      "zh": ["line one", "line two"],
      "en": ["line one", "line two"],
      "startSeconds": 12          // optional, see "Syncing slides to music" below
    }
  ]
}
```

List `stanzas` in the order the song is actually sung — repeat the chorus entry inline
wherever it recurs (verse, chorus, verse, chorus, ...). That order drives both the lyrics
page and the slide sequence in present mode, so it should match how the song flows.

The schema is enforced in `src/content.config.ts`; `npm run dev` or `npm run build` will
fail with a clear error if a hymn file doesn't match it.

## Syncing slides to music

Present mode (`/present/[id]/`) can auto-advance slides to follow a YouTube recording,
using YouTube's own embedded player — no audio is downloaded or rehosted, which would
violate YouTube's terms and the recording's copyright. To turn it on for a hymn:

1. Set `youtubeId` to the video's ID (the `v=` value in its URL).
2. Add `startSeconds` to each stanza — the second in the recording where that stanza
   begins. Play the video yourself and note the timestamps; there's no reliable way to
   infer them automatically.

With both set, a small player and a "Play music" button appear in present mode; while
it's playing, the deck jumps to the matching slide as playback crosses each stanza's
`startSeconds`. If `youtubeId` is set but stanzas have no `startSeconds`, the player still
shows so you can play the recording alongside manual slide advancing.

## Deploying (git push → live site)

Hosted on GitHub Pages at **https://yuwanglouisiana-oss.github.io/hymn/**, built and
published automatically by [`.github/workflows/deploy.yml`](.github/workflows/deploy.yml)
on every push to `main`. One-time setup, in the repo's GitHub settings:

**Settings → Pages → Build and deployment → Source → "GitHub Actions"**

(It defaults to "Deploy from a branch," which won't use the workflow — this has to be
switched once.)

That's the only manual step. From then on:

```bash
git add src/content/hymns/your-new-hymn.json
git commit -m "Add hymn: ..."
git push
```

The push triggers the Actions workflow, which builds the site and publishes it — the new
hymn (or any edit to an existing one) is live at the URL above a minute or two later. Check
the repo's **Actions** tab if a push doesn't show up; that's where build errors (e.g. a
hymn JSON file that fails the schema) surface.

Because the site is served under `/hymn/` rather than at a domain root, every internal
link in the codebase goes through `withBase()` from
[`src/lib/site.ts`](src/lib/site.ts) instead of a plain `/path`. If you add a new page or
link, use that helper rather than a hardcoded absolute path, or it'll 404 in production
while working fine in `npm run dev`.

## Site name / tagline

Edit `src/config.ts`.

## Notes on the example hymns

The three hymns included (`Amazing Grace`, `What a Friend We Have in Jesus`,
`It Is Well with My Soul`) are 19th-century, public-domain texts. The Chinese lyrics are
common hymnal translations reproduced from memory for this scaffold — treat them as
placeholders and check them against your congregation's usual hymnal/translation before
using them for real. `youtubeId` was intentionally left unset for all three; add real
video IDs from recordings you have rights to use.
