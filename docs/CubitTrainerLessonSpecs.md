# Cubit Trainer V1 — Lesson Specifications

> **Purpose:** `CubitTrainerContent.md` defines *what* exists in Trainer. This document defines *what each lesson must teach, contain, and connect to*. It is a content blueprint, not final lesson prose or frontend implementation code.

---

# 1. Global Lesson Contract

Every lesson should define the following metadata:

| Field | Required | Purpose |
|---|---|---|
| `id` | Yes | Stable unique identifier |
| `moduleId` | Yes | Parent module identifier |
| `title` | Yes | User-facing lesson title |
| `difficulty` | Yes | Beginner / Intermediate / Advanced |
| `type` | Yes | Concept / Procedure / Algorithm / Guide / Editorial |
| `estimatedMinutes` | Yes | Approximate learning time |
| `prerequisites` | Yes | Required prior knowledge |
| `objectives` | Yes | Observable learner outcomes |
| `topics` | Yes | Main concepts covered |
| `visuals` | Yes | Required/optional visual assets |
| `interactive` | Yes | Interactive requirements |
| `practice` | Yes | Practice/check activity |
| `completionCriteria` | Yes | What counts as completion |
| `nextLesson` | Yes | Recommended continuation |
| `relatedLessons` | Yes | Closely related lessons |
| `exploreLessons` | Yes | Optional exploration |
| `video` | Yes | Whether video adds value |
| `notes` | Yes | Authoring constraints |

---

# 2. Lesson Types

## 2.1 Concept

Used primarily to explain an idea, terminology, concept, or mental model.

Typical structure:

1. Introduction
2. Core explanation
3. Visual example
4. Key takeaway
5. Quick check
6. What's Next?

Examples:

- Meet the Rubik's Cube
- Cube Types
- What is Speedcubing?
- Inspection
- Understanding TPS

---

## 2.2 Procedure

Used when the learner needs to perform a sequence of actions to accomplish a goal.

Typical structure:

1. Goal
2. Starting state
3. Pieces/concepts to identify
4. Step-by-step instructions
5. Algorithm where required
6. Visual/interactive demonstration
7. Common mistakes
8. Practice
9. Completion check
10. What's Next?

Examples:

- Make the White Cross
- Solve the Middle Layer
- Solve the 2×2
- Solve the 4×4

---

## 2.3 Algorithm

Used for algorithms, cases, patterns, and move-sequence practice.

Typical structure:

1. What the algorithm/case does
2. Recognition
3. Starting state
4. Algorithm notation
5. Interactive execution
6. Result
7. Practice
8. What's Next?

Examples:

- Sexy Move
- F2L Cases
- Full OLL
- Full PLL

---

## 2.4 Guide

Used for practical advice and reference material.

Typical structure:

1. Problem/question
2. Key considerations
3. Recommendations
4. Examples
5. Practical checklist
6. What's Next?

Examples:

- What Cube Should You Buy?
- Taking Care of Your Cube
- Lubrication & Maintenance

---

## 2.5 Editorial

Used for broader informational content.

Typical structure:

1. Introduction
2. Main sections
3. Supporting visuals
4. Key facts
5. Further reading
6. What's Next?

Examples:

- A Brief History of the Cube
- WCA & Official Cubing
- Cubing Competitions & Events

---

# 3. Shared Interactive Cube Requirements

Cubit already has a custom mathematically audited cube-state engine.

Trainer must reuse the existing Cubit cube engine.

**Trainer must not implement a second independent cube-mathematics system.**

Where a lesson requires cube interaction, its specification should define:

- Initial cube state.
- Allowed moves.
- Move sequence.
- Whether moves are user-controlled or automated.
- Whether animation is required.
- Reset behavior.
- Whether the learner can step forward/backward.
- Whether pieces/faces should be highlighted.
- Expected resulting state.

Typical use cases include:

- Basic notation.
- Prime and double turns.
- Whole-cube rotations.
- Wide moves.
- Algorithms.
- Beginner solving steps.
- F2L.
- OLL.
- PLL.
- Cube patterns.

---

# 4. Shared Visual Asset Requirements

Visual assets are divided into three categories.

## 4.1 Programmatic / Deterministic Visuals

Preferred for exact cube information.

Examples:

- Cube nets.
- Cube-state diagrams.
- Sticker states.
- Piece highlighting.
- Move demonstrations.
- Algorithm states.

These should be generated from Cubit's own cube engine wherever possible.

---

## 4.2 Curated / Static Illustrations

Useful for:

- Cube history.
- Competition context.
- Hardware guides.
- General educational concepts.

---

## 4.3 AI-Generated Visuals

Allowed for non-technical decorative or conceptual imagery where exact cube state is not important.

AI-generated imagery must **not** be used as the authoritative representation of:

- Cube algorithms.
- Exact cube states.
- Notation.
- Piece positions.
- WCA rules.

---

# 5. Shared Video Requirements

Video is an optional supplementary learning medium.

Use video when narration, visual storytelling, or an overview explanation materially improves comprehension.

Good candidates include:

- Cube history.
- Cube types.
- What is Speedcubing?
- CFOP overview.
- WCA overview.
- Competition introduction.
- Buying guides.
- Maintenance guides.

For exact moves and algorithms, the Interactive Cube is preferred over video.

Every video-enabled lesson should define:

- Purpose.
- Approximate duration.
- Source/support material.
- Video title.
- Placement.
- Whether watching is optional or required.

No lesson should require a video when the same information is more effectively taught interactively.

---

# 6. Shared "What's Next?" Contract

Every Trainer lesson must end with a **What's Next?** section.

The section contains:

### Next Lesson

The single recommended continuation.

### Related

Lessons directly related to the current concept but not necessarily part of the primary learning path.

### Explore

Optional lessons that broaden the learner's knowledge.

Example:

```text
What's Next?

→ Prime & Double Turns
  Continue learning cube notation.

Related:
→ Whole Cube Rotations
→ Wide Moves

Explore:
→ Fun Cube Patterns

Navigation should be driven by lesson metadata rather than hardcoded independently inside each page.

7. Module 01 — Getting Started
7.1 Meet the Rubik's Cube

ID: getting-started-meet-the-cube

Type: Concept
Difficulty: Beginner
Estimated Time: 4–6 minutes

Objective

The learner should understand what a standard 3×3 Rubik's Cube is, recognize its six faces and three primary piece types, and understand at a basic level how turning a face changes the cube.

Must Teach
What the Rubik's Cube is.
Six faces.
Six standard colors.
Center pieces.
Edge pieces.
Corner pieces.
Difference between stickers and physical pieces.
Why center pieces identify the faces.
Basic idea of a face turn.
Visuals

Required:

Clear 3×3 cube illustration.
Labels for cube faces.
Piece-type illustration showing center, edge, and corner pieces.

Preferred:

Interactive 3D cube showing a simple face turn.
Interactive

Optional for the initial version, but preferred for the final V1 Trainer experience.

Practice

The learner should identify:

A center piece.
An edge piece.
A corner piece.
A named face.
Completion Criteria

Learner reaches the end of the lesson and completes the identification check.

Navigation

Next: getting-started-cube-types

Related:

notation-basic-face-notation

Explore:

getting-started-fun-patterns
7.2 Cube Types

ID: getting-started-cube-types

Type: Concept
Difficulty: Beginner
Estimated Time: 4–6 minutes

Objective

Understand that the 3×3 Rubik's Cube is one member of a larger family of twisty puzzles.

Must Teach
2×2.
3×3.
4×4.
5×5.
Pyraminx.
High-level differences between cube sizes.
Why the 3×3 is the primary beginner reference in Cubit.
Visuals

Required:

Comparison visual showing major puzzle types.
Interactive

Optional.

Video

Optional.

A short visual overview can be useful for introducing the different puzzle types.

Practice

Simple matching/identification activity.

Completion Criteria

Learner can distinguish the major puzzle types.

Navigation

Next: getting-started-cube-history

Related:

other-cubes-solving-2x2

Explore:

guides-what-cube-to-buy
7.3 A Brief History of the Cube

ID: getting-started-cube-history

Type: Editorial
Difficulty: Beginner
Estimated Time: 5–7 minutes

Objective

Give learners an engaging understanding of the Rubik's Cube's origin and growth.

Must Teach
Ernő Rubik.
Creation of the puzzle.
Original purpose.
Global popularity.
Growth of competitive cubing.
Evolution toward modern speedcubing.
Visuals

Required:

Historical or conceptual illustration.
Video

Recommended.

A short video overview can complement the written lesson.

Interactive

Not required.

Practice

Short knowledge check.

Completion Criteria

Learner reaches the end and completes the knowledge check.

Navigation

Next: getting-started-what-is-speedcubing

Related:

guides-wca-official-cubing

Explore:

getting-started-cube-types
7.4 What is Speedcubing?

ID: getting-started-what-is-speedcubing

Type: Concept
Difficulty: Beginner
Estimated Time: 5–7 minutes

Objective

Understand speedcubing and the terminology a new Cubit user will encounter.

Must Teach
Timed solving.
Scrambles.
Inspection.
Solve time.
Personal best.
+2.
DNF.
Ao5.
Ao12.
Competitions.
Visuals

Useful:

Timer/competition illustration.
Simple solve lifecycle diagram.
Video

Recommended.

Interactive

Optional timer demonstration.

Practice

Match terminology to definitions.

Completion Criteria

Learner correctly identifies the core speedcubing terminology.

Navigation

Next: getting-started-fun-patterns

Related:

fundamentals-from-solving-to-speedsolving

Explore:

guides-cubing-competitions
7.5 Fun Cube Patterns

ID: getting-started-fun-patterns

Type: Algorithm / Pattern
Difficulty: Beginner
Estimated Time: 5–10 minutes

Objective

Make the first cubing experience fun while introducing intentional move sequences.

Must Teach
What a cube pattern is.
How algorithms can create visual patterns.
How to restore the cube afterward.
Suggested Patterns
Checkerboard.
Snake.
Cube in a Cube.
Interactive

Required.

Use the Interactive Cube to demonstrate the patterns.

Practice

The learner should be able to:

Execute a pattern.
Observe the resulting state.
Reset the cube.
Completion Criteria

Learner interacts with at least one pattern.

Navigation

Next: notation-basic-face-notation

Related:

algorithms-sexy-move

Explore:

getting-started-what-is-speedcubing
8. Module 02 — Cube Notation
8.1 Basic Face Notation

ID: notation-basic-face-notation

Type: Concept + Interactive
Difficulty: Beginner
Estimated Time: 5–8 minutes

Objective

Understand U, D, L, R, F, B and correctly interpret the viewpoint used by cube notation.

Must Teach
Six face letters.
Fixed face naming.
Clockwise viewpoint.
Difference between looking directly at a face and viewing the cube from another side.
Interactive

Required.

Controls should include:

U
D
L
R
F
B

Each move should animate correctly on the Interactive Cube.

Include reset.

Visuals

Required:

Face-labelled cube.
Practice

Learner identifies faces and executes requested moves.

Completion Criteria

Learner can correctly identify all six face letters.

Navigation

Next: notation-prime-double-turns

Related:

notation-whole-cube-rotations

Explore:

getting-started-fun-patterns
8.2 Prime & Double Turns

ID: notation-prime-double-turns

Type: Concept + Interactive
Difficulty: Beginner
Estimated Time: 4–6 minutes

Objective

Understand notation modifiers such as R, R', and R2.

Must Teach
Quarter turn.
Prime/inverse turn.
Double turn.
Direction convention.
Interactive

Required.

Demonstrate:

R
R'
R2

Include reset.

Practice

Given a notation token, learner identifies the corresponding movement.

Navigation

Next: notation-whole-cube-rotations

Related:

notation-basic-face-notation

Explore:

algorithms-sexy-move
8.3 Whole Cube Rotations

ID: notation-whole-cube-rotations

Type: Interactive Concept
Difficulty: Beginner
Estimated Time: 4–6 minutes

Objective

Understand x, y, and z as whole-cube rotations.

Must Teach
x.
y.
z.
Difference between rotating the entire cube and turning one face.
Interactive

Required.

Demonstrate:

x
y
z
Practice

Identify whether a sequence contains a face turn or a whole-cube rotation.

Navigation

Next: notation-wide-moves

Related:

notation-prime-double-turns

Explore:

fundamentals-inspection
8.4 Wide Moves

ID: notation-wide-moves

Type: Interactive Concept
Difficulty: Intermediate
Estimated Time: 5–7 minutes

Objective

Understand wide turns and their notation.

Must Teach
Rw.
Uw.
Fw.
Lw.
Dw.
Bw.
Lowercase notation where applicable.
Difference between an outer-layer turn and a wide turn.
Interactive

Required.

Demonstrate at least:

Rw
Uw
Fw
Navigation

Next: notation-4x4-5x5-notation

Related:

other-cubes-solving-4x4

Explore:

notation-basic-face-notation
8.5 4×4 & 5×5 Notation

ID: notation-4x4-5x5-notation

Type: Interactive Concept
Difficulty: Intermediate
Estimated Time: 6–8 minutes

Objective

Understand the notation needed to interpret larger-cube scrambles.

Must Teach
Wide moves on larger cubes.
Layer-depth prefixes.
Examples such as 3Rw.
Examples such as 3Fw2.
Inner-layer movement concept.
Interactive

Required.

Use 4×4 and/or 5×5 states where useful.

Navigation

Next: beginner-understanding-method

Related:

other-cubes-solving-4x4

Explore:

notation-wide-moves
9. Module 03 — Solve Your First Cube
General Module Requirement

This is Cubit's primary procedural beginner curriculum.

Every lesson should follow:

Goal
↓
Starting State
↓
Pieces / Concepts to Identify
↓
Procedure
↓
Algorithm Where Required
↓
Interactive Demonstration
↓
Common Mistakes
↓
Practice
↓
Completion Check
↓
What's Next?
9.1 Understanding the Beginner Method

ID: beginner-understanding-method

Type: Concept
Difficulty: Beginner
Estimated Time: 5–7 minutes

Objective

Understand the layer-by-layer beginner solving method and the complete roadmap.

Must Teach
Layer-by-layer concept.
Full solving roadmap.
Purpose of each stage.
Roadmap
White Cross.
First-Layer Corners.
Middle Layer.
Yellow Cross.
Yellow Edges.
Position Yellow Corners.
Orient Yellow Corners.
Visual

Required:

Layer-by-layer roadmap.
Navigation

Next: beginner-white-cross

Related:

notation-basic-face-notation

Explore:

fundamentals-from-solving-to-speedsolving
9.2 Make the White Cross

ID: beginner-white-cross

Type: Procedure + Interactive
Difficulty: Beginner
Estimated Time: 8–12 minutes

Objective

Build a correctly aligned white cross.

Must Teach
White edge identification.
Correct vs incorrect cross.
Side-center alignment.
Placement strategies.
Common beginner mistakes.
Interactive

Required.

Practice

Build a white cross from a prepared state.

Completion Criteria

The white cross is correctly formed and all side colors align with their centers.

Navigation

Next: beginner-first-layer-corners

Related:

beginner-understanding-method

Explore:

fundamentals-cross-efficiency
9.3 Solve the First-Layer Corners

ID: beginner-first-layer-corners

Type: Procedure + Algorithm
Difficulty: Beginner
Estimated Time: 8–12 minutes

Objective

Complete the first layer by correctly positioning and orienting all four corners.

Must Teach
Corner identification.
Target slot.
Corner orientation.
Beginner insertion algorithm(s).
Handling different cases.
Interactive

Required.

Navigation

Next: beginner-middle-layer

Related:

beginner-white-cross

Explore:

algorithms-sexy-move
9.4 Solve the Middle Layer

ID: beginner-middle-layer

Type: Procedure + Algorithm
Difficulty: Beginner
Estimated Time: 10–15 minutes

Objective

Solve all four middle-layer edges.

Must Teach
Middle-layer edge identification.
Left insertion.
Right insertion.
Relevant algorithms.
Handling misplaced edges.
Interactive

Required.

Navigation

Next: beginner-yellow-cross

Related:

beginner-first-layer-corners

Explore:

fundamentals-lookahead
9.5 Make the Yellow Cross

ID: beginner-yellow-cross

Type: Procedure + Algorithm
Difficulty: Beginner
Estimated Time: 8–12 minutes

Objective

Create the yellow cross on the final layer.

Must Teach
Dot state.
L state.
Line state.
Cross state.
Correct orientation.
Interactive

Required.

Navigation

Next: beginner-yellow-edges

Related:

beginner-middle-layer

Explore:

algorithms-sexy-move
9.6 Solve the Yellow Edges

ID: beginner-yellow-edges

Type: Procedure + Algorithm
Difficulty: Beginner
Estimated Time: 6–10 minutes

Objective

Correctly position the final-layer edges.

Must Teach
Side-color alignment.
Correct edge placement.
Relevant algorithm.
Interactive

Required.

Navigation

Next: beginner-position-yellow-corners

Related:

beginner-yellow-cross

Explore:

fundamentals-cross-efficiency
9.7 Position the Yellow Corners

ID: beginner-position-yellow-corners

Type: Procedure + Algorithm
Difficulty: Beginner
Estimated Time: 7–10 minutes

Objective

Place every final-layer corner in its correct location before orienting it.

Must Teach
Correct corner location.
Difference between position and orientation.
Positioning algorithm.
Interactive

Required.

Navigation

Next: beginner-orient-yellow-corners

Related:

beginner-first-layer-corners

Explore:

algorithms-sexy-move
9.8 Orient the Yellow Corners

ID: beginner-orient-yellow-corners

Type: Procedure + Algorithm
Difficulty: Beginner
Estimated Time: 8–12 minutes

Objective

Correctly orient the final-layer corners and complete the cube.

Must Teach
Corner twisting.
Preserving solved pieces.
Correct orientation procedure.
Final solved state.
Interactive

Required.

Navigation

Next: beginner-bring-it-together

Related:

algorithms-sexy-move

Explore:

fundamentals-from-solving-to-speedsolving
9.9 Bring It All Together

ID: beginner-bring-it-together

Type: Procedure / Review
Difficulty: Beginner
Estimated Time: 8–15 minutes

Objective

Perform a complete beginner solve independently.

Must Contain
Complete solving roadmap.
Summary of every step.
Links back to each stage.
Practice recommendation.
Transition to timed solving.
Interactive

Strongly recommended.

Completion Criteria

Learner completes or meaningfully attempts a complete solve flow.

Navigation

Next: fundamentals-from-solving-to-speedsolving

Related:

All Module 03 lessons.

Explore:

algorithms-checkerboard
10. Module 04 — Speedcubing Fundamentals
10.1 From Solving to Speedsolving

ID: fundamentals-from-solving-to-speedsolving

Type: Concept
Difficulty: Beginner
Estimated Time: 5–7 minutes

Must Teach
Transition from solving correctly to solving efficiently.
Move efficiency.
Turning.
Recognition.
Lookahead.
Pauses.
Planning.
Navigation

Next: fundamentals-inspection

10.2 Inspection

ID: fundamentals-inspection

Type: Concept + Practice
Difficulty: Beginner
Estimated Time: 5–8 minutes

Must Teach
What inspection is.
Cross planning.
Piece scanning.
Efficient use of inspection.
Practice

Allow the learner to inspect a scramble and identify a cross plan.

Navigation

Next: fundamentals-cross-efficiency

10.3 Cross Efficiency

ID: fundamentals-cross-efficiency

Type: Practice
Difficulty: Intermediate
Estimated Time: 7–10 minutes

Must Teach
Move efficiency.
Cross planning.
Planning the cross on the bottom.
Transition into F2L.
Navigation

Next: fundamentals-turning-finger-tricks

10.4 Turning & Finger Tricks

ID: fundamentals-turning-finger-tricks

Type: Concept + Interactive
Difficulty: Intermediate
Estimated Time: 6–10 minutes

Must Teach
Finger tricks.
Grip.
Regrips.
Efficient turning.
Interactive

Preferred/required for move demonstrations.

Navigation

Next: fundamentals-lookahead

10.5 Lookahead

ID: fundamentals-lookahead

Type: Concept + Interactive
Difficulty: Intermediate
Estimated Time: 6–10 minutes

Must Teach
Planning the next pair while executing the current pair.
Watching pieces.
Avoiding pauses.
Interactive

Use cube-state demonstrations.

Navigation

Next: fundamentals-reducing-pauses

10.6 Reducing Pauses

ID: fundamentals-reducing-pauses

Type: Concept + Practice
Difficulty: Intermediate
Estimated Time: 5–8 minutes

Must Teach
Recognition pauses.
Planning pauses.
Regrip pauses.
Maintaining solve flow.
Navigation

Next: fundamentals-tps

10.7 Understanding TPS

ID: fundamentals-tps

Type: Concept
Difficulty: Intermediate
Estimated Time: 4–6 minutes

Must Teach
What TPS means.
Relationship between TPS and solve time.
Why TPS alone is not enough to measure performance.
Navigation

Next: cfop-what-is-cfop

11. Module 05 — CFOP
11.1 What is CFOP?

ID: cfop-what-is-cfop

Type: Concept
Difficulty: Intermediate
Estimated Time: 6–8 minutes

Must Teach
Cross.
F2L.
OLL.
PLL.
Overall CFOP workflow.
Difference between CFOP and beginner solving.
Navigation

Next: cfop-cross

11.2 Cross

ID: cfop-cross

Type: Practice
Difficulty: Intermediate
Estimated Time: 7–10 minutes

Must Teach
Efficient cross planning.
Cross execution.
Reducing unnecessary moves.
Navigation

Next: cfop-f2l-introduction

11.3 F2L Introduction

ID: cfop-f2l-introduction

Type: Concept + Interactive
Difficulty: Intermediate
Estimated Time: 8–12 minutes

Must Teach
Corner-edge pairing.
F2L slots.
Pair creation.
Pair insertion.
Difference between beginner layer solving and F2L.
Interactive

Required.

Navigation

Next: cfop-f2l-cases

11.4 F2L Cases

ID: cfop-f2l-cases

Type: Algorithm + Interactive
Difficulty: Intermediate
Estimated Time: 15–25 minutes initially; may become multi-session

Must Teach
Case recognition.
Case grouping.
Common F2L cases.
Algorithms.
Execution.
Recognition-to-execution relationship.
Interactive

Required.

Each case should have:

Correct starting state.
Case visualization.
Algorithm.
Interactive execution.
Reset.
Practice.
Content Architecture

This lesson may eventually be split into multiple lessons if the case library becomes too large.

Navigation

Next: cfop-f2l-efficiency

11.5 F2L Efficiency

ID: cfop-f2l-efficiency

Type: Practice
Difficulty: Advanced
Estimated Time: 8–12 minutes

Must Teach
Move reduction.
Rotation avoidance.
Lookahead.
Efficient pairing.
Pause reduction.
Navigation

Next: cfop-2look-oll

11.6 2-Look OLL

ID: cfop-2look-oll

Type: Algorithm + Interactive
Difficulty: Intermediate
Estimated Time: 10–15 minutes

Must Teach
Two-stage OLL approach.
Recognition.
Required algorithms.
Execution.
Interactive

Required.

Navigation

Next: cfop-full-oll

11.7 Full OLL

ID: cfop-full-oll

Type: Algorithm + Interactive
Difficulty: Advanced
Estimated Time: Multi-session

Must Teach
OLL recognition.
Case families.
Algorithms.
Execution.
Progressive memorization.
Content Architecture

Do not force the entire OLL library into one giant wall of algorithms.

Support progressive case groups.

Interactive

Required.

Navigation

Next: cfop-2look-pll

11.8 2-Look PLL

ID: cfop-2look-pll

Type: Algorithm + Interactive
Difficulty: Intermediate
Estimated Time: 10–15 minutes

Must Teach
Simplified PLL.
Recognition.
Required algorithms.
Execution.
Navigation

Next: cfop-full-pll

11.9 Full PLL

ID: cfop-full-pll

Type: Algorithm + Interactive
Difficulty: Advanced
Estimated Time: Multi-session

Must Teach
PLL recognition.
Case families.
Algorithms.
Memorization.
Execution.
Interactive

Required.

Navigation

Next: cfop-putting-it-together

11.10 Putting CFOP Together

ID: cfop-putting-it-together

Type: Practice / Review
Difficulty: Advanced
Estimated Time: 10–20 minutes

Must Teach

Connect:

Cross
  ↓
F2L
  ↓
OLL
  ↓
PLL
Practice

Encourage complete CFOP solves.

Navigation

Next: other-cubes-solving-2x2

Related:

All CFOP lessons.

Explore:

algorithms-sexy-move
12. Module 06 — Solving Other Cubes
12.1 Solving the 2×2

ID: other-cubes-solving-2x2

Type: Procedure
Difficulty: Intermediate
Estimated Time: 10–15 minutes

Must Teach
2×2 structure.
Differences from 3×3.
Beginner solving approach.
Core algorithms.
Complete solve.
Interactive

Required.

Navigation

Next: other-cubes-solving-4x4

Related:

getting-started-cube-types

Explore:

cfop-what-is-cfop
12.2 Solving the 4×4

ID: other-cubes-solving-4x4

Type: Procedure
Difficulty: Intermediate
Estimated Time: 15–20 minutes

Must Teach
Centers.
Edge pairing.
Reduction.
3×3-like final stage.
Parity concept.
Interactive

Required.

Navigation

Next: other-cubes-solving-5x5

Related:

notation-4x4-5x5-notation

Explore:

guides-what-cube-to-buy
12.3 Solving the 5×5

ID: other-cubes-solving-5x5

Type: Procedure
Difficulty: Intermediate
Estimated Time: 15–20 minutes

Must Teach
Centers.
Edge grouping.
Reduction.
Final-stage solving.
Relevant parity concepts.
Interactive

Required.

Navigation

Next: guides-what-cube-to-buy

Related:

other-cubes-solving-4x4

Explore:

guides-cubing-competitions
13. Module 07 — Algorithms & Patterns
13.1 Sexy Move

ID: algorithms-sexy-move

Type: Algorithm + Interactive
Difficulty: Beginner
Estimated Time: 3–5 minutes

Algorithm
R U R' U'
Must Teach
What the Sexy Move is.
Notation.
Execution.
Result.
Why it appears frequently in cubing.
Interactive

Required.

Navigation

Next: algorithms-sledgehammer

13.2 Sledgehammer

ID: algorithms-sledgehammer

Type: Algorithm + Interactive
Difficulty: Intermediate
Estimated Time: 3–5 minutes

Must Teach
Recognition.
Execution.
Result.
Interactive

Required.

Navigation

Next: algorithms-checkerboard

13.3 Checkerboard

ID: algorithms-checkerboard

Type: Pattern + Interactive
Difficulty: Beginner
Estimated Time: 3–5 minutes

Must Teach
Pattern sequence.
Resulting visual state.
Restoration.
Interactive

Required.

Navigation

Next: algorithms-snake

13.4 Snake

ID: algorithms-snake

Type: Pattern + Interactive
Difficulty: Beginner
Estimated Time: 3–5 minutes

Must Teach
Sequence.
Result.
Restoration.
Interactive

Required.

Navigation

Next: algorithms-cube-in-cube

13.5 Cube in a Cube

ID: algorithms-cube-in-cube

Type: Pattern + Interactive
Difficulty: Intermediate
Estimated Time: 4–6 minutes

Must Teach
Sequence.
Result.
Restoration.
Interactive

Required.

Navigation

Next: algorithms-more-fun

13.6 More Fun Algorithms

ID: algorithms-more-fun

Type: Pattern / Editorial
Difficulty: Beginner–Intermediate
Estimated Time: Variable

Objective

Provide an expandable collection of recreational algorithms and patterns.

Requirements

New patterns can be added without restructuring the entire Trainer module.

Navigation

Next: guides-what-cube-to-buy

14. Module 08 — Cubing Guides & Resources
14.1 What Cube Should You Buy?

ID: guides-what-cube-to-buy

Type: Guide
Difficulty: Beginner
Estimated Time: 7–10 minutes

Must Teach
Budget considerations.
Puzzle type.
Magnetic vs non-magnetic.
Beginner priorities.
Avoiding unnecessary spending.
Visuals

Recommended:

Cube category illustrations.
Comparison visuals.
Video

Optional.

Maintenance

This lesson is time-sensitive because hardware recommendations change.

It must be reviewed periodically.

Navigation

Next: guides-taking-care-of-cube

14.2 Taking Care of Your Cube

ID: guides-taking-care-of-cube

Type: Guide
Difficulty: Beginner
Estimated Time: 5–7 minutes

Must Teach
Cleaning.
Dust removal.
Storage.
General handling.
Signs that maintenance is needed.
Navigation

Next: guides-lubrication-maintenance

14.3 Lubrication & Maintenance

ID: guides-lubrication-maintenance

Type: Guide
Difficulty: Intermediate
Estimated Time: 6–10 minutes

Must Teach
Purpose of lubricant.
When to lubricate.
General lubricant types.
Cleaning.
Avoiding over-lubrication.
Navigation

Next: guides-magnetic-cube-maintenance

14.4 Maintaining & Adjusting Magnetic Cubes

ID: guides-magnetic-cube-maintenance

Type: Guide
Difficulty: Intermediate
Estimated Time: 6–10 minutes

Must Teach
Magnetic behavior.
Tension.
Adjustment systems.
Spring/core settings.
Cleaning.
When adjustment is appropriate.
Navigation

Next: guides-wca-official-cubing

14.5 WCA & Official Cubing

ID: guides-wca-official-cubing

Type: Editorial
Difficulty: Beginner
Estimated Time: 6–10 minutes

Must Teach
What the WCA is.
Official events.
Competition rules at a high level.
Official timing and judging.
Difference between Cubit and official WCA results.
Accuracy Requirement

This lesson must use current authoritative sources when finalized.

Cubit must explicitly be described as independent from and not affiliated with, endorsed by, or certified by the World Cube Association.

Cubit results, ratings, leaderboards, and solve records are not official WCA results.

Navigation

Next: guides-cubing-competitions

14.6 Cubing Competitions & Events

ID: guides-cubing-competitions

Type: Editorial / Guide
Difficulty: Beginner
Estimated Time: 7–10 minutes

Must Teach
Finding competitions.
Registration.
Events.
Scrambles.
Inspection.
Solving.
Judging.
Results.
Competition etiquette.
What beginners should bring.
Navigation

Related:

guides-wca-official-cubing

Explore:

getting-started-what-is-speedcubing
15. Cross-Lesson Navigation Map

The primary Trainer learning path is:

01. Getting Started
        │
        ├── Meet the Rubik's Cube
        ↓
        ├── Cube Types
        ↓
        ├── A Brief History of the Cube
        ↓
        ├── What is Speedcubing?
        ↓
        └── Fun Cube Patterns
                    │
                    ▼
02. Cube Notation
        │
        ├── Basic Face Notation
        ↓
        ├── Prime & Double Turns
        ↓
        ├── Whole Cube Rotations
        ↓
        ├── Wide Moves
        ↓
        └── 4×4 & 5×5 Notation
                    │
                    ▼
03. Solve Your First Cube
        │
        ├── Understanding the Beginner Method
        ↓
        ├── Make the White Cross
        ↓
        ├── Solve the First-Layer Corners
        ↓
        ├── Solve the Middle Layer
        ↓
        ├── Make the Yellow Cross
        ↓
        ├── Solve the Yellow Edges
        ↓
        ├── Position the Yellow Corners
        ↓
        ├── Orient the Yellow Corners
        ↓
        └── Bring It All Together
                    │
                    ▼
04. Speedcubing Fundamentals
        │
        ├── From Solving to Speedsolving
        ↓
        ├── Inspection
        ↓
        ├── Cross Efficiency
        ↓
        ├── Turning & Finger Tricks
        ↓
        ├── Lookahead
        ↓
        ├── Reducing Pauses
        ↓
        └── Understanding TPS
                    │
                    ▼
05. CFOP
        │
        ├── What is CFOP?
        ↓
        ├── Cross
        ↓
        ├── F2L Introduction
        ↓
        ├── F2L Cases
        ↓
        ├── F2L Efficiency
        ↓
        ├── 2-Look OLL
        ↓
        ├── Full OLL
        ↓
        ├── 2-Look PLL
        ↓
        ├── Full PLL
        ↓
        └── Putting CFOP Together
                    │
                    ▼
06. Solving Other Cubes
        │
        ├── Solving the 2×2
        ↓
        ├── Solving the 4×4
        ↓
        └── Solving the 5×5

Module 07 and Module 08 are exploration/reference modules and can be entered from multiple points in the curriculum.

16. Lesson Authoring Rules

The final lesson prose must not simply reproduce this specification.

This specification is the checklist.

The final lesson is the teaching experience.

Every lesson should answer:

What am I learning?
Why does it matter?
How does it work?
Can I see it?
Can I try it?
Do I understand it?
What should I learn next?
17. Source-of-Truth Hierarchy

When authoring a lesson, use this hierarchy:

Cubit-approved curriculum specification.
Authoritative/verified external sources.
Cubit-specific product behavior.
General explanatory knowledge.

If a factual claim is not sufficiently supported, do not invent it.

Flag it for verification.

For exact cube transformations, Cubit's custom cube engine is authoritative for the application's visual demonstrations.

18. Content Validation Before Publication

Every lesson must pass the following checks.

Accuracy
 Cubing facts verified.
 Algorithms verified.
 Notation verified.
 Cube states verified.
 WCA claims verified where applicable.
Pedagogy
 Prerequisites respected.
 No unexplained advanced terminology.
 Objective is clear.
 Lesson length is reasonable.
 Practice follows explanation.
Interaction
 Interactive cube starts in correct state.
 Every demonstrated move is mathematically correct.
 Animation matches actual move.
 Reset works.
 Resulting state is correct.
Navigation
 Next lesson exists.
 Related links exist.
 Explore links resolve.
 No dead-end unless intentional.
Product
 Completion tracking works.
 Mobile layout works.
 Accessibility basics are met.
 Visual assets load correctly.
19. Content Production Workflow

The intended workflow is:

Lesson Specification
        ↓
Research / Source Collection
        ↓
Draft
        ↓
Fact Check
        ↓
Visual / Interactive Planning
        ↓
Final Lesson Content
        ↓
Frontend Integration
        ↓
QA
        ↓
Publish

AI may assist with:

Drafting.
Restructuring.
Simplifying explanations.
Generating examples.
Summarizing approved sources.
Preparing video scripts.

AI does not replace:

Curriculum decisions.
Algorithm verification.
Cube-state verification.
Source verification.
Final review.
20. Future Extensibility

The lesson specification should support future additions without changing the fundamental lesson contract.

Future capabilities may include:

Algorithm libraries.
Algorithm recognition training.
Timed practice.
Interactive quizzes.
Audio explanations.
Video.
Personalized recommendations.
Trainer challenges.
Practice scrambles.
Session-linked exercises.

These are optional capabilities and are not mandatory for every V1 lesson.

21. Non-Negotiable Principles
Accuracy over speed of content production.
Teaching value over content volume.
Interactive Cube over inaccurate static imagery for cube mechanics.
Verified information over AI-generated assumptions.
One authoritative cube engine.
Every lesson has a clear next step.
AI assists content creation; it does not define Cubit's curriculum.
Do not create content merely to increase lesson count.
Do not make interaction mandatory when it adds no educational value.
Trainer must remain coherent as the curriculum expands.
Exact cube mechanics must always be represented accurately.
A lesson should teach something meaningful, not merely present information.
Every lesson must connect naturally to the broader learning graph.
The learner should never be trapped in a dead-end learning path.
22. Final Definition of the Lesson Specification

This document is the contract between:

Cubit's curriculum.
Content authors.
AI-assisted content generation.
Visual/interactive designers.
Frontend implementation.
QA.

CubitTrainerContent.md answers:

What lessons exist?

CubitTrainerLessonSpecs.md answers:

What must each lesson teach and contain?

CubitTrainerContentGuidelines.md answers:

How should Cubit teach and present that material?

The final Trainer lesson should be produced only after all three layers are understood and respected.