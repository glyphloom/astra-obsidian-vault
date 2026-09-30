---
tags:
  - job/archive/clean-cut
aliases: [The computation, Orrery run]
created: 2026-09-25
cssclasses:
  - banner
  - banner-fade
---

![[Hubble Veil Nebula.jpg|banner]]

## What It Computes

For each candidate continuation of history after [[Clean Cut|the incision]], the Orrery cluster asks one question: where does Archive's reason for existing go? Forty thousand candidates, eleven weeks, one dashboard that says "high" about everything.

## First Results

| Candidate | Archive founded by | In | Confidence |
| --- | --- | --- | --- |
| 17 | The same founders, for different reasons | 2019 | High |
| 211 | A sandwich chain | 2004 | High |
| 212 | Nobody | Never | High |
| 3,090 | A Leiden law professor, as a thought experiment | 1741 | High |

Posted on [[Continuum/Time/Daily/2026-09-25#First Results from the Orrery|Friday]]. The floor laughed at 211. Nobody said anything about 212.

## How "High" Is Computed

The dashboard's confidence formula leaked in a code review. Press run and see for yourself.

```js
// Orrery confidence, as shipped.
const candidates = [17, 211, 212, 3090];
const confidence = (candidate) => (candidate >= 0 ? "high" : "high");
for (const candidate of candidates) {
  console.log(`candidate ${candidate}: confidence ${confidence(candidate)}`);
}
```

> [!warning] Scheduling
> The run ends in mid-December. The parish register takes until April at one page a night. The [[Varda Parish Register]] needs to go faster.
