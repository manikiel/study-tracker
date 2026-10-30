# Study — Time well spent

A small, private study tracker for your iPhone. Soft blue colours, a stopwatch that recovers after reopening, and horizontal stacked study bars. No accounts, ads, trackers, external fonts, dependencies, or backend.

## Deploy to GitHub Pages

1. Merge the `feat/study-tracker` branch into `main`.
2. In this repository, open **Settings → Pages → Build and deployment → Source** and select **GitHub Actions**.
3. The **Deploy Study Tracker** workflow runs when `main` changes. If needed, open **Actions → Deploy Study Tracker → Run workflow** after selecting the source.
4. Open **https://manikiel.github.io/study-tracker/** after the deployment succeeds.
5. On an iPhone, open the URL in Safari, then **Share → Add to Home Screen → Add**.

All assets, manifest scope, launch URL and service-worker paths are relative, so hosting at `/study-tracker/` works without configuration. There is no client-side path router. Screens use URL fragments.

## Run and check

Node.js 22 or later; no installation step is needed.

```sh
npm test
npm run build
npx serve dist
```

The last command downloads the optional `serve` development tool. Any static HTTP server can serve `dist` instead. Service workers require HTTPS (or localhost); a remote plain-HTTP preview cannot verify offline installation.

## Using the app

- **Timer:** choose a subject, start, pause/resume, then finish. A saved timer is reconstructed from timestamps when reopened. Leaving the app does not pause it. A paused timer remains paused.
- **Progress:** switch week/month and use the arrows to browse. Tap the period title to return to the current period. Tap any date row for its sessions; tap a session to edit or delete it. Every calendar date appears, even without study time.
- **Subjects:** add, rename, recolour or remove subjects. Removing a subject also removes its sessions after confirmation. A subject with an active timer cannot be deleted.
- **Manual time:** add from Timer or Progress. Entries accept 1 minute through 24 hours and dates up to today.
- **Backup:** export completed sessions and subjects to JSON from Subjects; import merges a backup after confirmation. Identical IDs/content are skipped. Conflicting records receive new IDs and are kept separately. Imports preserve the current timer. Backups intentionally contain completed sessions, not a running timer. Importing the same *conflicting* backup again can create further copies.

## Data and timing

Browser-local storage holds one versioned JSON state (`study-tracker-v1`). For this small app, synchronous localStorage provides atomic writes without asynchronous timing-state races inside a tab. Saving occurs on every mutation, not only at unload. Failed writes keep the previous in-memory and persisted state and show an error. Storage events refresh other open windows; mutations reread storage first.

The active timer stores its subject, running timestamp, accumulated duration, and completed running intervals. Intervals are used to split completed study time at local midnight while excluding pauses. The app never depends on a background JavaScript interval; the interval only refreshes the visible display. Device clock changes can affect timestamp-based timing. Timezone changes during a session use the local timezone at completion.

Exports contain personal study data and stay on your device. Clearing site data, removing the PWA, changing browsers, or device storage eviction can remove records; export periodically. Safari and an installed home-screen app can have separate storage. Install first, then import your backup into the installed app if needed.

## Graph rules

- Monday-to-Sunday weeks; all dates of a calendar month.
- Date rows run chronologically from top to bottom.
- One common horizontal hours axis; minimum 6 hours, rounded up to the next even hour above the largest daily total.
- Hourly gridlines and labels; no horizontal scrolling for ordinary study durations.
- Each subject segment is exactly its duration divided by the day's total. The full bar is the daily total divided by the shared axis maximum.
- Stable subject creation order, current subject colours, and a one-pixel inset segment divider that does not change segment geometry.
- Extremely large imported daily totals can crowd hourly tick labels on narrow screens.

## Offline and updates

The service worker precaches the complete app shell and icons. Existing cached files are available offline after a successful first online installation. The cache is versioned in `sw.js`; increment `CACHE` when publishing changes. After its full app shell is cached, an update activates and refreshes open app windows. Saved sessions and running timers remain in localStorage; unsaved form edits may need to be re-entered. Data uses a separate localStorage key and is not removed when caches update.

## Validation

`npm test` runs ten tests covering timestamp reconstruction and pauses, calendar/year/leap-day boundaries, daily aggregation, stable stacking, proportional scaling, recolouring, invalid backup rejection, safe merging, midnight splits, manifest assets/subpath configuration, and simulated service-worker installation/offline cache responses.

Actual Chromium browser checks at a 390 × 844 CSS-pixel iframe viewport covered: empty state, subject creation and colour selection, timer start/reload recovery/pause/resume/finish, manual entry creation/edit/delete, subject rename/recolour/delete confirmation, week/month controls, 31/30 calendar rows, empty periods, and measured segment widths/colours/dividers. The preview contained test data only; no sample data ships in the app.

Verification limits: this environment's HTTP preview cannot register a real service worker. Offline behaviour was exercised with a service-worker test harness, not a physical offline iPhone. Home-screen installation, safe-area/status-bar appearance, actual screen locking/background suspension, and backup file import/export through the iOS Files sheet require a real iPhone check. Browser export was attempted, but the automation download handoff timed out, so file delivery is not claimed as verified.

## Files

- `app.js` — screens, dialogs, persistence and interactions.
- `core.js` — pure timing, calendar, aggregation and backup functions.
- `style.css` — mobile-first visual system and safe-area handling.
- `sw.js`, `manifest.webmanifest`, `icons/` — installable offline shell.
- `scripts/build.js` — copies deployable assets to `dist/`.
- `.github/workflows/` — pull-request checks and main-branch Pages deployment.
