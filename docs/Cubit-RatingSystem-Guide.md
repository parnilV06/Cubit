Cubit Rating System
V1 Specification

Project: Cubit
System: Gamification & Rating
Version: 1.0
Status: Specification
Purpose: Define the authoritative rules by which Cubit Rating is earned, calculated, tracked, and displayed.

1. Overview

Cubit Rating is Cubit's persistent, uncapped progression score representing a combination of:

Cubing activity
Solve performance
Long-term improvement
Training progress
Consistency of practice

Cubit Rating is intentionally not an Elo system and does not have a maximum value.

A user's rating grows through meaningful activity inside Cubit.

The fundamental model is:

Cubit Rating
=
Solve Points
+
Improvement Points
+
Trainer Points
+
Activity / Streak Points

There is no maximum rating.

A user may continue increasing their rating indefinitely.

2. Rating Principles

The Cubit Rating system follows several core principles.

2.1 Rating is persistent

Rating earned legitimately is retained permanently.

Breaking a streak does not remove previously earned rating.

Performing worse in a future session does not remove previously earned improvement rating.

2.2 Rating is uncapped

There is no:

1000 maximum
5000 maximum
Level cap

Users can continue progressing indefinitely.

2.3 Both skill and activity matter

A user who solves frequently should progress.

A user who solves faster should progress faster.

Therefore:

More Solves
→ More Rating

Faster Solves
→ More Rating Per Solve

This allows Cubit Rating to reward both dedication and cubing ability.

2.4 Different puzzles use different performance curves

Cubit V1 supports:

2×2
3×3
4×4
5×5

Because expected solve times differ substantially between events, every puzzle has its own Solve Rating table.

3. Rating Sources

There are four rating sources in Cubit V1.

1. Solve Points
2. Improvement Points
3. Trainer Points
4. Activity & Streak Points

The system should track these independently.

Conceptually:

Total Rating:       1842.75

Solve Points:       1514.50
Improvement Points:  184.25
Trainer Points:       39.00
Activity Points:     105.00

This breakdown should remain available internally even if the V1 UI initially displays only Total Rating.

4. Solve Points

Every valid solve awards rating based on:

Puzzle Type
+
Effective Solve Time

The awarded values are tier values, not cumulative values.

For example, a 3×3 solve of 9.50s awards:

+2.00

NOT:

0.10 + 0.20 + 0.30 + ... + 2.00
5. Effective Solve Time

Solve Rating always uses the post-penalty effective solve time.

Normal solve
Raw: 12.40
Penalty: NONE

Effective: 12.40
+2 solve
Raw: 9.40
Penalty: +2

Effective: 11.40

Rating is calculated using:

11.40

not 9.40.

DNF

DNF solves receive:

+0 Solve Rating

DNFs still remain legitimate solve records for Cubit's statistics where appropriate, but do not generate Solve Points.

6. 3×3 Solve Rating

3×3 is the baseline Cubit performance curve.

Effective Time	Rating
Any valid solve	+0.10
< 120s	+0.20
< 90s	+0.30
< 75s	+0.40
< 60s	+0.50
< 45s	+0.60
< 30s	+0.75
< 25s	+0.90
< 20s	+1.10
< 15s	+1.35
< 12s	+1.60
< 10s	+2.00
< 8s	+2.50
< 6s	+3.25
< 5s	+4.00
< 4s	+5.00
< 3s	+6.50

Example:

3×3 — 34.21s
→ +0.60

3×3 — 17.82s
→ +1.10

3×3 — 9.72s
→ +2.00

3×3 — 4.83s
→ +4.00
7. 2×2 Solve Rating

2×2 naturally produces substantially shorter solve times than 3×3.

Its rating curve therefore awards somewhat fewer points for equivalent time milestones.

Effective Time	Rating
Any valid solve	+0.10
< 90s	+0.15
< 75s	+0.30
< 60s	+0.40
< 45s	+0.50
< 30s	+0.60
< 20s	+0.75
< 15s	+0.90
< 10s	+1.00
< 8s	+1.15
< 6s	+1.30
< 5s	+1.45
< 4s	+1.60
< 3s	+2.50
8. 4×4 Solve Rating

4×4 requires significantly more work per solve than 3×3.

The curve therefore uses larger time brackets and increasingly rewards advanced performance.

Effective Time	Rating
Any valid solve	+0.10
< 5:00	+0.20
< 4:30	+0.30
< 4:00	+0.40
< 3:30	+0.50
< 3:00	+0.75
< 2:30	+1.25
< 2:00	+2.00
< 1:45	+2.25
< 1:30	+2.50
< 1:15	+3.25
< 1:00	+4.00
< 50s	+5.00
< 40s	+6.50

This preserves the rough curve originally proposed while smoothing the transition between intermediate and advanced solving.

9. 5×5 Solve Rating

5×5 receives the widest time curve because of the substantially greater solve complexity.

Effective Time	Rating
Any valid solve	+0.10
< 7:00	+0.20
< 6:00	+0.30
< 5:00	+0.40
< 4:30	+0.50
< 4:00	+0.75
< 3:30	+1.00
< 3:00	+1.25
< 2:30	+1.75
< 2:00	+2.50
< 1:45	+3.00
< 1:30	+4.00
< 1:15	+5.00
< 1:00	+6.50

These values are the Cubit V1 balancing table.

They may be adjusted in future versions using real-world Cubit usage data without changing the fundamental Rating architecture.

10. Improvement Points

Cubit rewards users not only for solving but also for measurable long-term improvement.

Four metrics participate:

PB
Ao5
Ao12
Mean

Their multipliers are:

Metric	Multiplier
PB	× 0.50
Ao5	× 0.75
Ao12	× 1.00
Mean	× 1.00

Ao5, Ao12 and Mean receive stronger rewards because sustained performance improvement is harder than achieving a single improved solve.

11. Improvement Percentage

For a metric:

Improvement %
=
((Baseline - Current) / Baseline) × 100

Lower times represent improvement.

Example:

Historical PB baseline:

10.00s

New session PB:

9.00s

Therefore:

((10 - 9) / 10) × 100

= 10%

PB reward:

10 × 0.50

= +5 Rating
12. Historical Baseline

Improvement is not compared only with the immediately previous session.

Instead, the new session is compared against the user's historical session performance.

For a particular metric:

Historical Baseline
=
Average metric value across eligible previous sessions

Example:

Previous 3×3 session PBs:

12.0
11.5
10.8
10.4
10.3

The baseline is the average of these historical PB values.

The newly completed session's PB is compared against that baseline.

The same principle applies independently to:

PB
Ao5
Ao12
Mean
13. Puzzle-Specific Improvement

Improvement comparisons MUST occur only between sessions of the same puzzle type.

Example:

A newly completed:

3×3 session

may only be compared with historical:

3×3 sessions

It must not use:

2×2
4×4
5×5

statistics in its baseline.

Each event therefore develops its own improvement history.

14. Improvement Eligibility

A metric only participates if sufficient data exists.

For example:

A session without enough solves for Ao12:

Ao12 = unavailable

Therefore:

Ao12 Improvement Points = 0

Do not interpret unavailable statistics as zero seconds.

Likewise, historical sessions without a valid value for a particular metric should be excluded from that metric's baseline.

15. Negative Improvement

If:

Current Metric >= Historical Baseline

no improvement reward is granted.

Improvement Points cannot be negative.

Therefore:

Improvement = max(0, calculated improvement)

Poorer sessions never remove previously earned Cubit Rating.

16. Session Improvement Evaluation

Improvement rewards are evaluated per session.

A session becomes eligible for improvement evaluation when it transitions from being the user's working session into a completed/historical session as part of the normal session lifecycle.

The clearest V1 trigger is:

Current Session
      ↓
User creates a new session
      ↓
Previous session closes as working session
      ↓
Evaluate previous session
      ↓
Compare against earlier same-puzzle sessions
      ↓
Award eligible improvement points

A session must contain actual solve data before improvement rewards can be evaluated.

17. Improvement Rewards Are Idempotent

A session's improvement reward can be awarded only once.

Cubit must permanently track that the session has already been evaluated.

Simply:

opening old session
switching sessions
refreshing page
reopening Stats
restarting Cubit

must NEVER award improvement points again.

This is a critical anti-exploit requirement.

If historical sessions remain reopenable in Cubit, merely selecting an old session must not reset its previous improvement evaluation.

18. Improvement Example

Suppose the newly completed session produces:

PB:    9.00s
Ao5:   10.50s
Ao12:  11.00s
Mean:  11.50s

and historical same-puzzle baselines are:

PB:    10.00s
Ao5:   12.00s
Ao12:  12.50s
Mean:  12.50s

Then:

PB Improvement
10%
× 0.50
= 5.00

Ao5 Improvement
12.5%
× 0.75
= 9.375

Ao12 Improvement
12%
× 1.00
= 12.00

Mean Improvement
8%
× 1.00
= 8.00

Total:

+34.375 Improvement Rating

The implementation may store rating with higher precision internally while displaying it rounded consistently in the UI.

19. Trainer Rating

Trainer lessons provide Rating on their first successful completion only.

Difficulty	Rating
Beginner / Easy	+1
Intermediate / Medium	+2
Advanced	+3

Example:

Beginner lesson completed
→ +1

Intermediate lesson completed
→ +2

Advanced lesson completed
→ +3

Reopening or rereading the lesson:

+0

Completing an already completed lesson:

+0

Trainer rewards must therefore be idempotent.

20. Daily Activity Rating

Cubit rewards consistent cubing activity.

A calendar day becomes an:

Active Cubing Day

when the user completes at least one solve during that day.

Opening Cubit alone is insufficient.

Logging in alone is insufficient.

Viewing Community/Trainer alone is insufficient.

At least one solve must be recorded.

21. Daily Reward

The first solve of an eligible day awards:

+1 Rating

Additional solves during the same calendar day:

+0 additional Daily Activity Rating

They still earn their normal Solve Rating.

22. Streaks

Completing at least one solve on consecutive calendar days increases the user's activity streak.

Example:

Monday       ✓
Tuesday      ✓
Wednesday    ✓

Current Streak = 3

Missing an entire calendar day breaks the streak.

23. Streak Bonuses

Cubit awards milestone bonuses:

Consecutive Days	Bonus
7 days	+0.25
14 days	+0.50
30 days	+2.00
60 days	+4.00
100 days	+8.00
365 days	+20.00

These are milestone bonuses added on top of daily points.

Therefore a 7-day streak earns:

7 Daily Points
+
0.25 Milestone Bonus

= 7.25 Rating

A user reaching Day 14 has earned:

14 Daily Points
+
7-Day Bonus
+
14-Day Bonus

Milestone bonuses are awarded once when the milestone is reached.

24. Broken Streaks

Suppose:

Current streak = 18 days

The user then misses a full calendar day.

Their:

Current Streak

resets.

Previously earned rating does NOT disappear.

When they next complete a solve:

Current Streak = 1
Daily Rating = +1

A completely new streak begins.

The user can subsequently earn milestone bonuses again for the new streak when those milestones are reached.

25. Calendar-Day Semantics

Activity should be based on calendar days, not rolling 24-hour windows.

For example:

Monday 11:50 PM → solve
Tuesday 12:10 AM → solve

These represent two different activity days.

The Gamification Engine must use a consistent timezone strategy.

For Cubit V1, this behavior must be explicitly implemented rather than calculating streaks through:

currentTimestamp - previousTimestamp <= 24 hours

because that produces incorrect calendar streak semantics.

The implementation should determine the appropriate user/application timezone strategy during architecture design and document it.

26. Rating Accounting

Cubit should NOT store only:

user.rating = 1842.75

without knowing where that value came from.

The Gamification system must maintain auditable rating accounting.

Conceptually, rating events should be attributable to sources such as:

SOLVE
IMPROVEMENT
TRAINER
DAILY_ACTIVITY
STREAK_BONUS

Example conceptual ledger:

+1.10    SOLVE
+1.10    SOLVE
+1.35    SOLVE
+1.00    DAILY_ACTIVITY
+5.00    PB_IMPROVEMENT
+8.00    MEAN_IMPROVEMENT
+2.00    TRAINER
+0.25    STREAK_BONUS

The exact database architecture will be determined during implementation after auditing the existing Prisma schema.

27. Why Rating Events Should Be Auditable

This enables Cubit to understand:

Total Rating
Solve Rating
Improvement Rating
Trainer Rating
Activity Rating

It also makes the system easier to:

debug
rebalance
audit
protect against duplicate rewards
display rating history later
build achievements later
expand gamification in V2
28. Rating Precision

Rating calculations may produce decimal values.

The engine should preserve sufficient internal precision.

UI display should use a consistent rounding strategy.

Recommended:

2 decimal places

Example:

1842.75

Do not repeatedly round intermediate calculations if doing so would introduce cumulative errors.

29. Solve Mutation Rules

Because Solve Rating depends on solve time and penalties, the Gamification Engine must account for solve mutations.

Examples:

NONE → +2
+2 → NONE
NONE → DNF
DNF → NONE
solve deleted
solve time corrected

The engine must not allow rating inflation through editing solves.

If a solve originally earned:

+2.00

but is changed to DNF:

Solve Rating contribution becomes 0

The corresponding rating difference must be reconciled.

Likewise, deleting a solve should remove the Solve Rating contribution associated with that solve.

The implementation architecture should make these operations deterministic and auditable.

30. Anti-Duplication Rules

The following must never generate duplicate Rating:

Solve

One solve record can have only one current Solve Rating contribution.

Improvement

One eligible session evaluation can award its improvement reward once.

Trainer

One lesson can award its first-completion reward once per user.

Daily Activity

One calendar day can award the daily point once.

Streak

One milestone can be awarded once for that specific streak progression.

These rules must remain valid even under:

repeated API requests
refreshes
network retries
duplicate frontend actions
race conditions
31. Leaderboard Relationship

The Gamification Engine calculates and owns Cubit Rating.

The Leaderboard does NOT calculate Rating itself.

Architecture:

Cubit Activity
     ↓
Gamification Engine
     ↓
Rating Accounting
     ↓
Current User Rating
     ↓
Leaderboard

The Rating leaderboard simply ranks eligible users by their current Cubit Rating.

32. Rating Leaderboard

Ranking:

Highest Cubit Rating
        ↓
Lowest Cubit Rating

Two scopes exist:

GLOBAL
FRIENDS

Global:

All eligible Cubit users.

Friends:

Current User
+
Accepted Friends

Both use exactly the same Rating value.

33. PB Leaderboard

The PB leaderboard remains independent of Cubit Rating.

It ranks users according to their fastest valid effective solve.

DNF solves are excluded.

+2 solves use their effective penalized time.

Because PBs are puzzle-specific, the PB leaderboard must not compare different puzzle types as though they were equivalent.

The implementation should preserve puzzle/event identity when ranking PBs.

34. Gamification Engine Responsibility

The eventual Cubit Gamification Engine should conceptually respond to events such as:

Solve Created
      ↓
Calculate Solve Rating
      ↓
Award Rating

Solve Modified
      ↓
Recalculate Contribution
      ↓
Reconcile Difference

Session Completed
      ↓
Calculate Improvement
      ↓
Award Improvement Rating

Lesson Completed
      ↓
Check First Completion
      ↓
Award Trainer Rating

First Solve Today
      ↓
Award Daily Rating
      ↓
Update Streak
      ↓
Check Milestones
35. Gamification Engine Boundary

The Gamification Engine should own:

Rating rules
Solve point mappings
Improvement calculations
Trainer rewards
Daily activity
Streak calculations
Rating accounting
Duplicate protection
Rating reconciliation

It should NOT own:

Timer behavior
Scramble generation
Cube visualization
Community posts
Authentication
Session UI
Trainer content
Leaderboard presentation

Those systems should consume Gamification results rather than becoming coupled to its internal logic.

36. Cubit Rating V1 Formula

The authoritative conceptual formula is:

TOTAL CUBIT RATING

=

Σ Solve Rating Contributions

+

Σ Session Improvement Rewards

+

Σ First-Time Trainer Completion Rewards

+

Σ Daily Activity Rewards

+

Σ Streak Milestone Bonuses

Or:

R = S + I + T + A

where:

R = Total Cubit Rating
S = Solve Rating
I = Improvement Rating
T = Trainer Rating
A = Activity/Streak Rating

There is no upper bound on R.

37. V1 Philosophy

Cubit Rating should answer:

How much meaningful cubing progress has this person accumulated on Cubit?

It intentionally rewards several kinds of users.

Someone who practices frequently:

earns Rating through volume.

Someone who solves quickly:

earns Rating faster per solve.

Someone actively improving:

earns Improvement bonuses.

Someone learning:

earns Trainer rewards.

Someone practicing consistently:

earns Activity and Streak rewards.

Together, these form a single persistent representation of the user's Cubit journey.

38. V1 → Future Gamification

The V1 architecture should allow future systems such as:

Achievements
Badges
Challenges
Levels
XP
Seasonal competitions
Rating history graphs
Rating change notifications
Weekly challenges
Trainer achievements
Streak achievements

without requiring the core Rating Engine to be rewritten.

These are not part of V1 and should not be implemented now.