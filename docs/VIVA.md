# Viva preparation

1. **What problem do you solve?** Unexpected storage exhaustion and poor visibility into duplicate file consumption in a shared lab.
2. **Why use SHA-256?** File names can differ while content is identical. Streaming content hashes identify equal content with extremely low collision probability; this implementation does not additionally compare bytes.
3. **Why group by size first?** Different-size files cannot be exact duplicates. Hashing only equal-size candidates reduces work.
4. **What is the forecast formula?** Ceiling of `(capacity - used) / selected daily growth`; at zero growth there is no finite exhaustion estimate.
5. **Is this AI or ML?** It is rule-based storage intelligence. There is no trained ML model. Historical scans would be needed for a learned growth prediction.
6. **Does cleanup delete files?** No. It previews a scenario and lists extra copies. Retention and ownership decisions remain with the user.
7. **What is real versus simulated?** The scanner reads real files. The initial dashboard dataset is synthetic and explicitly labelled. Daily growth is an assumption in both modes.
8. **Why can category totals differ from used storage?** Categories cover the scanned folder; used storage covers the containing volume.
9. **Why might real savings be smaller?** Logical sizes do not account for shared APFS blocks, compression or snapshots.
10. **How is privacy handled?** Files are scanned locally; relative names and metadata go into a local JSON file. Import is processed in browser memory. The JSON should not be committed or shared without review.
11. **What happens with unreadable files?** They are skipped and included in the error count. Symlinks are skipped deliberately.
12. **What would production need?** Authentication, audit logging, snapshot consistency, pagination, incremental scanning and periodic measured growth samples.

## 3-minute presentation roles

- Member 1, 45 seconds: problem, actor, scan flow.
- Member 2, 75 seconds: demo metrics, growth slider, cleanup preview and file search.
- Member 3, 60 seconds: real folder import, tests, limitations and conclusion.

The typed brief says 5 marks (2 + 2 + 1). The attached rubric shows a 10-mark scheme with additional components. Confirm the applicable rubric with the faculty; this package covers use case, presentation, viva, code demonstration and report.
