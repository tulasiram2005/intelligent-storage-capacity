# INTELLIGENT STORAGE CAPACITY
## STRATA: A Read-Only Storage Analysis and Capacity Planning Prototype

**LLT Case Study · Unit 5 · Section G1**

| Team member | Registration number |
| --- | --- |
| PANCHUMARTHI VENKATA SAHITH | RA2311003010368 |
| ASWANTH S P | RA2311003010399 |
| BAJANTRI CHIKULAGURI TULASI RAM | RA2311003010422 |

**Faculty:** Dr. V.S.Bakkialakshmi · Faculty Code 103043 · Assistant Professor

## 1. Abstract

Shared engineering laboratories accumulate large media files, datasets, project archives and duplicate submissions. When capacity is checked only after a disk fills, work is interrupted and cleanup decisions are rushed. Intelligent Storage Capacity addresses this problem through a read-only inventory scanner and a dashboard that explains usage, identifies duplicate content and models future capacity pressure.

The prototype uses Python standard-library filesystem functions and streaming SHA-256 hashing to produce a JSON inventory. A browser dashboard displays capacity, file categories, search results, scenario-based runway and a cleanup preview. A synthetic dataset supports a repeatable classroom demonstration, while imported folder scans demonstrate real filesystem analysis. No trained machine-learning model or automatic deletion is claimed.

## 2. Problem statement and objectives

A laboratory administrator needs to know how much storage is in use, which files occupy a chosen project folder, whether identical copies exist and when capacity may be exhausted under an assumed workload. The objectives are to inventory files without modifying them, verify duplicate content, make capacity calculations explainable and preview possible savings before any manual action.

## 3. Use case

**Primary actor:** Laboratory administrator. **Secondary actors:** Student project teams. **Trigger:** Capacity review before a project submission period. **Preconditions:** Python 3.10 or newer, a readable folder and a modern browser. No cloud account is required for local execution.

**Main flow:** The administrator scans a chosen folder; the scanner records relative paths, sizes, categories and modification ages; same-size candidates are hashed; one representative is retained per identical-content group; JSON is imported into the dashboard; the administrator inspects composition, adjusts expected daily growth and previews duplicate savings.

**Alternative flows:** Unreadable entries increment an error count. Missing folders fail with an error. Invalid JSON is rejected by the dashboard. Zero daily growth produces no finite exhaustion date. A scan with no duplicate files produces zero duplicate savings.

**Postcondition:** A reviewable inventory and capacity scenario are available. The source folder remains unchanged.

## 4. Design and implementation

The architecture separates data collection from presentation. `scanner.py` performs local read-only analysis. `dist/engine.js` contains testable forecast, validation and reclaim calculations. `dist/app.js` connects the inventory to dashboard controls. HTML and CSS provide a responsive interface without external dependencies.

The scanner first groups nonempty files by logical byte size, reducing unnecessary hashing. It then reads candidate files in 1 MiB chunks to compute SHA-256 digests. Matching digests within the same-size group identify duplicate candidates. The implementation does not perform an additional byte-by-byte comparison, so it relies on SHA-256 collision resistance. Symlinks are skipped to avoid following external paths or cycles.

Capacity uses the containing filesystem's reported total and used values. Category totals and duplicates cover only the scanned folder. This distinction is necessary when the volume also contains unrelated files.

## 5. Capacity model

Remaining capacity = total capacity minus used capacity. For positive selected daily growth, runway in days = ceiling of remaining capacity divided by daily growth. After a cleanup preview, used capacity is reduced by the sum of extra duplicate copies. At zero growth, no finite exhaustion estimate is shown.

This model is a what-if calculation rather than an empirical prediction. A single scan provides no historical growth series. A later version could store periodic samples and fit a trend with uncertainty bounds.

## 6. Demonstration and expected outcomes

The synthetic scenario contains 12 files totalling 742 GB on a 1,000 GB volume. Two extra copies account for 275 GB. At 6 GB/day, initial runway is 43 days. Previewing duplicate removal lowers modelled usage to 467 GB and extends runway to 89 days. At 12 GB/day, initial runway falls to 22 days.

For the real-data demonstration, create a temporary folder containing two identical text files and a third different file of the same length. Run the scanner, import its JSON and verify that only one extra copy is counted. Real disk metrics depend on the demonstration machine and must not be presented as fixed benchmark results.

## 7. Verification

The implementation includes two Python unit tests and six JavaScript assertions. Python tests verify duplicate grouping, rejection of a same-size nonduplicate, symlink exclusion, byte totals and a missing-folder error. JavaScript assertions verify normal and zero-growth forecasts, a full-volume boundary, duplicate accounting and invalid imported values. These checks passed during development. They are functional checks, not a performance benchmark or evidence of enterprise readiness.

## 8. Proposed team responsibilities

These are suggested presentation responsibilities, not claims about work already performed by each member.

| Member | Suggested responsibility |
| --- | --- |
| PANCHUMARTHI VENKATA SAHITH | Problem statement, actor flow and storage scanner explanation |
| ASWANTH S P | Dashboard demonstration, forecast calculation and cleanup scenario |
| BAJANTRI CHIKULAGURI TULASI RAM | Integration, test evidence, repository and limitations |

## 9. Scalability, cost and limitations

The local implementation has no API or hosting cost. Directory traversal is linear in entry count; duplicate hashing cost depends on the total bytes in equal-size candidate groups. Metadata is held in memory, and browser rendering currently lacks pagination, so very large inventories require a different design. Physical storage savings can differ from logical duplicate byte totals because of compression, copy-on-write sharing and snapshots.

The prototype does not enforce file ownership, recommend deletion of old files, perform automatic cleanup, or guarantee a consistent snapshot while files change. A production system would require authenticated access, audit records, incremental scans, snapshot support, retention policies and measured growth history.

## 10. Conclusion

Intelligent Storage Capacity demonstrates a practical link between filesystem analysis and understandable decision support. The combination of real inventory scanning, content-based duplicate detection and interactive capacity scenarios makes storage planning easier to explain and review. The prototype prioritizes transparent calculations and read-only operation while leaving room for future monitoring and historical forecasting.

## Technical reading

- Python pathlib documentation: https://docs.python.org/3/library/pathlib.html
- Python hashlib documentation: https://docs.python.org/3/library/hashlib.html
- Python shutil.disk_usage documentation: https://docs.python.org/3/library/shutil.html#shutil.disk_usage

These links are suggested technical reading; no external performance claims are made in this report.
