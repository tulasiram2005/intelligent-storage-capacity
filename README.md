# STRATA · Intelligent Storage Capacity

LLT Unit 5 case study · Section G1. A dependency-free, read-only storage analyzer with an interactive dashboard.

## Run the demonstration

Open `dist/index.html` in a modern browser. No installation, login, API key, or internet connection is required. Alternatively run `python3 -m http.server 8080 --directory dist` and visit http://localhost:8080.

## Use a real folder

```sh
python3 scanner.py /path/to/chosen/folder -o inventory.json
```

Select **Import folder scan** in the dashboard and choose the JSON output. The inventory is processed in browser memory and is not uploaded to a server. File names are included in the JSON; keep the inventory private. The disk metrics describe the containing volume; composition and duplicate savings describe only the selected folder. Do not scan a rapidly changing folder for reproducible results.

## Demonstration sequence (3 minutes)

1. Start with the labelled demonstration dataset: 742 GB used of 1,000 GB; 6 GB/day growth gives 43 days of runway.
2. Increase growth to 12 GB/day: runway becomes 22 days and the capacity attention label appears.
3. Preview cleanup: 275 GB of extra copies; at 6 GB/day runway would rise to 89 days. Nothing is deleted.
4. Search `copy` in File explorer to inspect the extra copies.
5. Run the scanner on a prepared folder with two identical files and one different file; import the inventory and compare the results.
6. Open Case study for the problem, method, team and faculty details.

## Architecture

Chosen folder → Python inventory → same-size grouping → streaming SHA-256 → JSON → browser validation → dashboard → scenario forecast and cleanup preview.

The Python scanner skips symlinks, `.git`, `node_modules`, and `.venv`. It reads files and writes only the requested JSON output. Equal-size candidate files are hashed in 1 MiB chunks. A duplicate group retains one representative; each other copy is counted once. Retention order is arbitrary and is not a recommendation about ownership. Empty files are omitted from duplicate grouping because they offer no capacity saving.

Runway is `ceil((capacity - used) / growth)`. Zero growth produces no finite exhaustion estimate. This is transparent rule-based decision support, not a trained ML model. Demo data is synthetic. Real scans measure bytes; GB in the interface means decimal 1,000,000,000 bytes.

## Verification

```sh
node tests/engine.test.js
python3 -m unittest discover -s tests
```

Tests cover duplicate detection with a same-size nonduplicate, skipped symlinks, missing folders, zero growth, full volumes, reclaim accounting and invalid imports.

## Scope and limitations

This is a polished academic prototype, not a certified production storage service. It has no automatic deletion, account system, scheduled monitoring, learned time-series model or cloud-storage connection. Forecast accuracy depends on the selected growth assumption. Volume usage may include files outside the scanned folder. On macOS, APFS shared blocks, snapshots and compression can make logical file sizes differ from physically reclaimable disk space. Files may change during scanning; errors are counted but atomic snapshots are not taken. Hashing large folders takes time. Browser imports are limited to 20 MB. For production, add snapshot consistency, measured growth history, access controls, audit logging and large-inventory pagination.

## Submission

- `docs/REPORT.md`: case study report, team details, use case, methodology and evaluation.
- `docs/VIVA.md`: concise questions and answers.
- `dist/presentation.html`: six-slide presentation; use arrow keys or the buttons, or print to PDF.

## Accounts

Core local demo: none. Source hosting: GitHub. Hosted preview: ChatGPT Sites. Supabase, OpenAI API, AWS, Vercel, Figma and paid AI tools are not required for this scope.
