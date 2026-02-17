# Build System Guide

How the getbeseen.com static site is built, and important behavior to know.

---

## Quick reference

```bash
# From project root, run build from production folder
cd "production stuff"
node build/build.js
```

- **Output:** Everything is written to the `generated/` folder (at project root, *not* inside `production stuff`).
- **Do not edit** files in `generated/` — they are overwritten on every build.

---

## What the build does

1. **Cleans the output folder** — Empties `generated/` (see [Output directory cleanup](#output-directory-cleanup) below).
2. **Copies assets** — `production stuff/assets/`, `data/`, `includes/`, `templates/`, `services/` into `generated/`.
3. **Registers Handlebars** — Partials from `includes/`, helpers from `includes/image-helpers.html`, data from `data/image-library.json`.
4. **Generates pages** — Products, categories, services, industries, locations, index, about, contact, blog, cart, checkout, success, etc.
5. **Copies static files** — `robots.txt`, `llms.txt`, `BingSiteAuth.xml`, favicon, `.htaccess`, `developer-tools.html`.
6. **Generates sitemap** — `generated/sitemap.xml` from all generated HTML (single source of truth for URLs).

After a successful build you’ll see a sitemap summary and **Build successful!**

---

## Output directory cleanup (important)

The build **empties** the `generated/` folder before writing; it does **not** delete the folder itself.

- **Method used:** `fs.emptyDirSync(config.outputDir)` (from `fs-extra`).
- **Reason:** Deleting the directory with `fs.removeSync()` can fail with **`ENOTEMPTY`** when:
  - The project lives on **Google Drive** (or similar sync).
  - Sync or other processes hold locks or leave temporary files inside the folder.
- **Result:** The `generated/` directory stays in place; only its contents are removed, then the build writes a full set of files. This avoids ENOTEMPTY and works with synced project roots.

If you see **ENOTEMPTY** in the future, the build script should still be using `emptyDirSync`; if it was reverted, restore the “empty directory” behavior (see `build/build.js` around the “Clean output directory” comment).

---

## Running the build

| Step | Command | Notes |
|------|---------|--------|
| 1 | `cd "production stuff"` | From **project root** (where `production stuff` and `generated` live). |
| 2 | `node build/build.js` | Run the Node build script. |
| 3 | `cd ../generated && python3 -m http.server 8002` | Optional: serve locally to test. |
| 4 | Open http://localhost:8002 | Check the built site. |

**If `cd "production stuff"` fails:** You’re likely not in the project root. Navigate to the repo root first (the folder that contains `production stuff` and `generated`).

---

## Troubleshooting

### Build fails with "Cannot find module"

- Run **from inside** `production stuff`:  
  `cd "production stuff"` then `node build/build.js`.
- Ensure dependencies are installed in that folder:  
  `npm install` (in `production stuff`).

### Build fails with ENOTEMPTY / "Directory not empty"

- The build should use **emptyDirSync** (empty contents) rather than **removeSync** (delete folder). See [Output directory cleanup](#output-directory-cleanup).
- If the script was changed and uses `removeSync` again, switch back to `emptyDirSync` as in the current `build/build.js` “Clean output directory” block.

### Generated pages are wrong or missing

- Edit **only** under `production stuff/` (templates, data, includes, content).
- Run `node build/build.js` again and check `generated/` — never edit generated files by hand.

### Sitemap or developer tools out of date

- Sitemap and tooling use `generated/sitemap.xml`.  
- **Always run a full build** after adding/removing pages; the sitemap is regenerated each time.

---

## Related fixes (SEMrush / broken images)

As of the build that introduced the output-cleanup change, these were also addressed:

- **Business cards page** — Product image path was missing a leading slash (`assets/...` → `/assets/...`) in `content/products/business-cards.html`.
- **Services page** — Replaced missing image `/assets/images/services/team-working.jpg` with existing `/assets/images/services/sign-banner.jpg` in `templates/services-page-template.html`.

Broken internal image reports in SEMrush should clear after deploying the latest `generated/` output.

---

## File locations

| What | Where |
|------|--------|
| Build script | `production stuff/build/build.js` |
| Output directory | `generated/` (at project root) |
| Sitemap (generated) | `generated/sitemap.xml` |
| Edit templates | `production stuff/templates/` |
| Edit data | `production stuff/data/` |
| Image path helpers | `production stuff/includes/image-helpers.html` |

---

*Last updated: February 2025 — output cleanup (emptyDirSync) and guide added.*
