# Mass Data Upload Guide

How to safely import large batches of product copy and pricing without breaking templates.

---

## Goal

Bulk update product data (verbiage, SEO text, pricing) in `products.json` using CSV/Sheets workflows, with validation and rollback safety.

---

## Source of Truth

- Main data file: `production stuff/data/products.json`
- Optional rich page content: `production stuff/content/products/*.html`
- Build output (never edit): `generated/`

---

## Safe Workflow (Recommended)

1. Work on a sandbox branch only.
2. Prepare CSV in Google Sheets (one row per `product_id`).
3. Export as CSV.
4. Import into `products.json` using a merge script (recommended) or controlled manual edits.
5. Run build:
   ```bash
   cd "production stuff"
   node build/build.js
   ```
6. Review QA warnings and spot-check key pages in `generated/`.
7. Commit only after QA passes.

---

## CSV Template (Minimum Columns)

Use `product_id` as the key. Keep the header row exactly:

```csv
product_id,page_title,seo_description,base_description,price,description_long,features_pipe,use_cases_pipe
```

Notes:
- `product_id` must match existing IDs in `products.json`.
- `features_pipe` and `use_cases_pipe` are pipe-delimited lists (example: `Fast turnaround|Indoor/outdoor|UV resistant`).
- Leave a cell blank to keep existing JSON value unchanged.

---

## Field Mapping

- `page_title` -> `page_title`
- `seo_description` -> `seo_description`
- `base_description` -> `base_description`
- `price` -> `price` (or `product_details.price` depending on product structure)
- `description_long` -> `product_details.description_long`
- `features_pipe` -> `product_details.features[]`
- `use_cases_pipe` -> `product_details.use_cases[]`

---

## Guardrails (Do Not Skip)

- Never change `product_id`, `path`, `slug`, or hub/child wiring in bulk copy imports.
- Reject rows whose `product_id` does not exist.
- Skip blank values (do not overwrite with empty strings).
- Keep backups before each import batch.
- Run build and validation after every import.

---

## Suggested Batch Strategy

- Batch size: 10-20 products at a time.
- Start with one family (for example: `commercial_signage_*`).
- After each batch:
  - Build
  - QA review
  - Visual spot checks (2-3 pages)
  - Commit checkpoint

---

## QA Checklist After Import

- No build failures.
- No `[no-verbiage]` warnings for updated products.
- No `[no-pricing]` warnings for products expected to have pricing.
- Titles and meta descriptions are unique enough for SEO.
- Product pages render correctly on localhost.

---

## Rollback Plan

If a batch causes issues:

1. Revert the changed source file(s) in git.
2. Re-run build.
3. Re-import smaller batch.

Always roll back source in `production stuff/`, never by editing `generated/`.

---

## Practical Tips

- Keep one Sheet tab per product family to reduce mistakes.
- Keep a locked master export that is never edited directly.
- Add a `notes` column in Sheets for copywriter context (ignored during import).
- Standardize tone and length before import to reduce cleanup.

