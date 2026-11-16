# INTELLIGENT STORAGE CAPACITY

LLT CASE STUDY / UNIT 5 / SECTION G1

INTELLIGENT
STORAGE CAPACITY

STRATA Storage Observatory

Monitoring, forecasting and planning storage capacity through real telemetry collection and an explainable regression model.

TEAM MEMBER | REGISTRATION NUMBER

PANCHUMARTHI VENKATA SAHITH | RA2311003010368

ASWANTH S P | RA2311003010399

BAJANTRI CHIKULAGURI TULASI RAM | RA2311003010422

Faculty: Dr. V.S.Bakkialakshmi
Faculty code: 103043
Designation: Assistant Professor

Abstract

Shared engineering laboratories accumulate datasets, submissions and archives. A current usage percentage does not explain how soon capacity may become a constraint. STRATA provides a dashboard that compares servers, estimates threshold crossings and lets an administrator explore expansion scenarios.

A Python collector records actual volume usage in SQLite and exports timestamped CSV. The browser fits ordinary least squares regression, evaluates it on a chronological holdout and displays forecast errors. The starting history contains 270 explicitly synthetic observations for a repeatable classroom demonstration. A deterministic advisor executes calculation functions and exposes their inputs and outputs.

Prepared for the LLT case study demonstration. This is an academic prototype, with no automatic deletion or hardware provisioning.

01 / PROBLEM AND USE CASE

Problem statement

The lab administrator needs to identify which server approaches capacity first and decide when to expand it. Reactive checks after a disk is full can interrupt work. The solution must show both current measurements and the assumptions behind future projections.

Objectives

Collect real disk readings without reading file contents. Compare multiple storage workloads. Fit an explainable growth model, expose held-out errors, generate threshold alerts and evaluate capacity changes before any infrastructure action.

Use case: capacity review before submissions

ELEMENT | DESCRIPTION

Primary actor | Laboratory administrator

Trigger | Review capacity before a project submission period

Preconditions | Readable filesystem or valid historical CSV; modern browser; Python for collection

Main flow | Collect readings; export CSV; import history; inspect forecasts; compare scenarios; export the proposed plan

Alternative flow | Reject invalid rows, duplicate timestamps or changing capacity. Show no finite crossing for non-positive growth below a threshold.

Postcondition | Administrator has a reviewable forecast and capacity scenario. Files and hardware remain unchanged.

Demonstration boundary

The initial Atlas, Nova and Vault series are synthetic. The collector and folder inspector operate on real local measurements. A short live collection demonstrates the data path, but it cannot justify a reliable forecast months ahead.

Suggested speaking roles

PANCHUMARTHI VENKATA SAHITH: problem and actor flow. ASWANTH S P: dashboard, forecast and planning scenario. BAJANTRI CHIKULAGURI TULASI RAM: real-data path, model evaluation and advisor tool output. These are proposed presentation roles, not claims about past individual contributions.

02 / DESIGN AND METHODOLOGY

Technology stack

COMPONENT | TECHNOLOGY | PURPOSE

Collector | Python standard library | Read filesystem total and used bytes

History | SQLite | Store server and actual timestamp

Exchange | CSV | Transfer inspectable telemetry

Model | JavaScript OLS | Fit trend and evaluate held-out errors

Dashboard | HTML, CSS, SVG | Interact with forecasts and scenarios

Deployment | Static hosting / offline HTML | Run without API keys or runtime services

Collection and preprocessing

The collector reads the containing volume with shutil.disk_usage. Each timestamp is stored in SQLite. Export expresses elapsed time in days, preserving the true sampling interval. Import validates numeric values, unique timestamps and constant capacity per server. It accepts at least three observations for fitting and at least ten for validation metrics.

Regression and chronological evaluation

Ordinary least squares fits usage = intercept + slope x day. For the reset dataset, the first 70 observations train the evaluation model and the final 20 test it. MAE is average absolute test error; RMSE is the square root of average squared test error. The baseline repeats the last training value for every test point.

After evaluation, the operational model refits all observations. The displayed equation comes from this full-history fit. Future usage is anchored at the latest observation and extended with the fitted slope, avoiding a jump at the observed/forecast boundary.

Thresholds and scenarios

For positive growth, runway equals the ceiling of (threshold capacity minus latest usage) divided by slope. Reached thresholds return zero. Non-positive growth below a threshold has no finite crossing estimate. The planner adjusts capacity, a hypothetical one-time reclaim amount and a growth multiplier.

Advisor function calls

Supported questions route deterministically to compare_servers, forecast_threshold, plan_capacity or evaluate_model. The functions execute against the current data, and the UI shows their arguments and results. The advisor does not call an LLM or paid API.

03 / RESULTS AND EVALUATION

Reset dataset results

All values below come from the deterministic synthetic dataset. Simulating another day or importing measurements changes the results.

SERVER | USED / TOTAL GB | DAYS TO 90% | TEST MAE | TEST RMSE

Atlas | 817.65 / 1,000 | 21 | 5.37 GB | 6.06 GB

Nova | 545.17 / 750 | 61 | 3.20 GB | 3.92 GB

Vault | 1,153.41 / 2,000 | 265 | 6.92 GB | 7.76 GB

Atlas expansion example: adding 250 GB increases its runway to 90% from 21 days to 77 days under the same fitted growth. For a 90-day planning horizon and an 80% target, the calculated minimum addition is 476 GB.

Verification

Nine JavaScript tests passed: exact linear-trend recovery, chronological evaluation, threshold edge cases, malformed CSV rejection, CSV roundtrip, expansion sufficiency, advisor dispatch, declining trends and insufficient evaluation history. Three Python tests passed for real volume collection and elapsed-time export, plus the optional duplicate scanner. A real volume reading was also collected into a local temporary database.

Browser visual and end-to-end checks depend on an accessible preview or deployment. Passing calculation tests alone does not establish browser correctness or production readiness.

Uncertainty and limitations

The shaded band uses a normal approximation: 1.96 times residual standard error, adjusted for sample size and forecast distance. It assumes independent residuals with constant variance and a continuing linear trend. Anchoring, autocorrelation, sudden imports or retention jobs can affect its coverage. Synthetic-data scores do not establish accuracy on real workloads.

The prototype has no background cloud ingestion, user authentication, automatic cleanup or provisioning. Imports and acknowledgements remain in browser memory. Production use would require representative telemetry history, authenticated agents, audit records, robust ingestion and workload-aware modelling.

Conclusion

STRATA connects real usage collection with an inspectable forecasting workflow. It makes threshold risk and capacity tradeoffs visible while keeping the model, source data and limitations explainable for the administrator.

Implementation evidence: source code, tests, sample CSV, collector, offline dashboard, browser slide deck and viva guide are included in the project repository.
