# Founder Daily Notes: future implementation plan

This is a post-launch plan. It is intentionally not part of the newsletter release being handed to Beeezo's senior developer now.

## Product shape

Add a compact `From Sergey today` section above the newsletter archive. It should feel like a live editorial note, not a third newsletter filter and not another oversized hero.

- Show the newest eligible post with its date, first two to four sentences, original media when present, and a `Read today's note` action.
- Open each note inside a Beeezo reader route such as `/blog/daily/:slug`.
- Keep a separate `Daily notes` archive behind a secondary link so the main newsletter archive remains easy to scan.
- When no eligible post appears on a given day, keep the latest note visible with its real publication date. Never label old content as new.

## Source rules

Use only original posts published by [Sergey Kiklevich](https://www.linkedin.com/in/sergeykiklevich/).

Include:

- Original short-form posts written by Sergey.
- The post's exact text, publication time, canonical LinkedIn URL, and attached image or video poster when available.

Exclude:

- Weekly Blockchain Digest editions, newsletter announcements, or links that promote an edition already in the journal.
- Reposts, comments, replies, job changes, profile events, and third-party posts.
- Anything without a stable LinkedIn post identifier and canonical URL.

## Data boundary

Keep daily notes separate from `src/content/articles.json` so the existing 79-edition newsletter archive stays deterministic.

Suggested record:

```ts
interface FounderDailyNote {
  id: string
  slug: string
  author: 'Sergey Kiklevich'
  publishedAt: string
  body: string
  sourceUrl: string
  media?: Array<{ src: string; alt: string; type: 'image' | 'video-poster' }>
  status: 'draft' | 'approved' | 'published'
  sourceFingerprint: string
}
```

Store approved records in `src/content/daily-posts.json` for the portable first version. A CMS adapter can replace that file later without changing the page components.

## Open Jarvis publishing flow

1. Run a daily source check using the authenticated LinkedIn connector owned by Beeezo.
2. Collect candidate posts since the last successful run.
3. Reject ineligible post types using the source rules above.
4. Deduplicate by LinkedIn post ID, canonical URL, and source fingerprint.
5. Download approved media to Beeezo-controlled storage and generate factual alt text.
6. Create a draft. Preserve Sergey's words; only normalize layout and unsafe markup.
7. Require human approval until the team explicitly enables trusted auto-publishing.
8. Publish the Beeezo page first, then send its Beeezo URL to Telegram. LinkedIn remains the provenance link, not the primary reader destination.
9. Log the source ID, content hash, published Beeezo URL, Telegram message ID, and any failure so retries are idempotent.

## UI rules

- Use the existing Onest font, `#101116` ink, white paper, and `#FFA500` signal color.
- Reuse the square editorial geometry and orange rule from the journal.
- Keep the module shorter than the latest newsletter card on desktop and mobile.
- Label the source and date plainly. Do not invent titles, metrics, urgency, or a daily cadence when Sergey did not post.
- Keep `Smarter Marketing Solutions` and `Weekly Blockchain Digest` as the only newsletter filters.

## Senior developer decisions needed later

- The production CMS or API endpoint for drafts, approval, and publication.
- The authenticated LinkedIn ingestion method and credential owner.
- The Telegram bot, target channel, and approval policy.
- Whether video should be mirrored or represented by a poster and source link.
- Retention, correction, deletion, and audit-log requirements.

## Acceptance criteria for the future release

- A new eligible Sergey post appears once and only once after approval.
- Newsletter announcements never enter the daily feed.
- The main page, daily archive, direct note routes, and empty state work at 375px, 768px, and desktop widths.
- Every media file loads from Beeezo-controlled storage and includes useful alternative text.
- A failed Telegram send can retry without republishing the web note.
- Removing or correcting a source post creates an explicit review task instead of silently changing published copy.
