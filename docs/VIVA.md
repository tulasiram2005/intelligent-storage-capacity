# STRATA viva and demonstration script

## Five-minute demonstration

| Time | Presenter | Action and explanation |
| --- | --- | --- |
| 0:00-0:45 | PANCHUMARTHI VENKATA SAHITH | Explain the shared-lab problem, administrator actor and the three server workloads. State that the reset history is synthetic. |
| 0:45-2:15 | ASWANTH S P | Select each server, scrub the forecast, simulate one day and reset. Add 250 GB to Atlas in the planner: 21 days becomes 77 days to 90%. |
| 2:15-4:15 | BAJANTRI CHIKULAGURI TULASI RAM | Show chronological validation, ask the advisor which server needs attention first, inspect its function-call output, then inspect a real folder or import measured CSV. |
| 4:15-5:00 | All | Explain limitations and answer questions. |

These are proposed speaking roles, not claims about individual development contributions.

## Key questions

**Why this topic?** Storage exhaustion interrupts submissions and lab work. We estimate future pressure so the administrator can plan capacity earlier.

**What is the AI/ML part?** Ordinary least squares regression learns a slope and intercept from historical usage. The model is statistical regression implemented explicitly in JavaScript. The advisor is a rule-based function router, not a language model.

**Why linear regression?** It is explainable and a useful baseline for approximately steady growth. We can inspect its equation and errors, then identify when changing workloads make it unsuitable.

**How do you avoid data leakage?** The first 78% of observations train the evaluation model. The last 22% test it. We do not shuffle timestamps. The operational forecast is a separate refit on all available history.

**What are MAE and RMSE?** MAE averages absolute errors in GB. RMSE squares errors before averaging and therefore penalizes larger errors more strongly.

**What is the baseline?** A naive forecast that repeats the final training usage for every test point. It lets us compare regression with a simple alternative.

**Why does the displayed equation differ slightly from the plotted forecast?** The displayed equation is the full-history OLS fit. We anchor future values at the last observation and apply its slope, avoiding a discontinuity at the latest point.

**How do you calculate runway?** Ceiling of `(threshold_capacity - latest_usage) / positive_slope`. A reached threshold returns zero. Non-positive growth has no finite crossing estimate while below the threshold.

**Why may the line exceed capacity?** It represents projected demand. A physical filesystem cannot store more than its capacity, but unmet demand is useful for planning.

**Is the shaded band a guarantee?** No. It is a normal-approximation 95% prediction band derived from OLS residuals. It assumes a stable linear trend and independent, constant-variance residuals. Anchoring and correlated errors can affect coverage.

**What is real?** The Python collector reads real filesystem statistics and stores timestamps in SQLite. The folder inspector reads actual file metadata in the browser. The initial 270-point history is synthetic and is labelled as such.

**Is a two-minute collection enough for a 90-day forecast?** No. The import demonstrates the data path. Reliable long-term forecasting needs observations across a representative time span.

**Where are the function calls?** The advisor routes supported questions to `compare_servers`, `forecast_threshold`, `plan_capacity`, or `evaluate_model`. Each result panel displays real inputs and outputs.

**Does the cloud site access your laptop?** No. It processes imported telemetry locally. The Python collector runs separately on the local computer.

**Does the planner change storage?** No. It calculates hypothetical capacity and reclaim scenarios. There is no automatic deletion or infrastructure provisioning.

**Why no cloud database tonight?** Local SQLite and CSV are sufficient for this demonstration and avoid making the classroom demo depend on account credentials or network availability.

## Rehearsal checklist

1. Open `dist/STRATA-Offline.html` before leaving for class.
2. Open `dist/presentation.html` in a second tab.
3. Reset the dataset so the 21 / 61 / 265 day examples match the slides.
4. Prepare a harmless folder of sample files for local inventory inspection.
5. Keep `samples/demo-telemetry.csv` available for import/export demonstration.
6. If using actual collected telemetry, state the sampling duration and its limitations.
7. Keep the offline file available even if hosting is working.

The typed assessment says 5 marks (2 presentation, 2 viva, 1 report). The rubric image includes additional components under a 10-mark total. Confirm which applies with the faculty.
