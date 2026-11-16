# Delivery status

## Public deployment
- URL: https://cosmic-treacle-ecfb9c.netlify.app
- Slides: https://cosmic-treacle-ecfb9c.netlify.app/presentation
- Netlify site ID: e578fc3c-7409-4a37-aa32-873b9b8c90c5
- Deploy ID: 6afb5f50be75c112e21c52b5; connector reports ready/current.
- Manual ZIP deployment. No GitHub continuous deployment configured.

## Verified browser flows
- Public dashboard loads without sign-in; desktop screenshot inspected.
- Planner: Atlas +250 GB gives 77 days vs 21 days; +300 GB recalculates to 88 days.
- Model lab displays held-out MAE 5.37 GB and 70/20 split.
- Simulate next day: observations increase from 270 to 273; reset restores 270.
- Advisor executes compare_servers, returning Atlas21, Nova61, Vault265 days.
- Presentation link loads the eight-section deck.
- Three actual disk readings were collected through collector.py and imported successfully; the ledger displayed Local-Mac data. Measurements were not committed. This seconds-long sample validates ingestion only, not long-term accuracy.
- Demo reset after testing.
- Nine JavaScript and three Python automated tests passed during development.
- Browser logs contained one MutationObserver error; project source has no MutationObserver usage. Its origin was not established; tested flows succeeded.

## Scope
Synthetic initial observations are labelled. Actual measurements require local collection and CSV import. Advisor uses deterministic calculation functions, not an LLM. Background remote-server ingestion is not implemented.
