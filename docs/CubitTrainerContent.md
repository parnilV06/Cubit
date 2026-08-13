# Cubit Trainer V1 — Curriculum & Content Specification

> **Status:** V1 Curriculum Baseline  
> **Project:** Cubit  
> **Module:** Trainer  
> **Version:** 1.0  
> **Last Updated:** August 2026

---

## 1. Overview

Cubit Trainer is Cubit's structured learning system for helping users progress from complete beginners to confident speedcubers.

The V1 Trainer is designed around a progressive learning journey:

**Understand the Cube → Learn the Language → Solve Your First Cube → Learn to Speedsolve → Learn CFOP → Explore Other Cubes → Have Fun With Algorithms**

Cubit Trainer is not intended to be only a collection of solving tutorials. It introduces users to the broader cubing ecosystem, teaches fundamental concepts, provides a complete beginner solving path, and gradually introduces speedcubing methodology.

Cubit V1 also includes a separate **Cubing Guides & Resources** section containing evergreen informational content. These articles complement the Trainer but are not treated as traditional structured lessons.

---

# 2. V1 Content Structure

```text
TRAINER
│
├── 01. Getting Started
│   ├── Meet the Rubik's Cube
│   ├── Cube Types
│   ├── A Brief History of the Cube
│   ├── What is Speedcubing?
│   └── Fun Cube Patterns
│
├── 02. Cube Notation
│   ├── Basic Face Notation
│   ├── Prime & Double Turns
│   ├── Whole Cube Rotations
│   ├── Wide Moves
│   └── 4×4 & 5×5 Notation
│
├── 03. Solve Your First Cube
│   ├── Understanding the Beginner Method
│   ├── Make the White Cross
│   ├── Solve the First-Layer Corners
│   ├── Solve the Middle Layer
│   ├── Make the Yellow Cross
│   ├── Solve the Yellow Edges
│   ├── Position the Yellow Corners
│   ├── Orient the Yellow Corners
│   └── Bring It All Together
│
├── 04. Speedcubing Fundamentals
│   ├── From Solving to Speedsolving
│   ├── Inspection
│   ├── Cross Efficiency
│   ├── Turning & Finger Tricks
│   ├── Lookahead
│   ├── Reducing Pauses
│   └── Understanding TPS
│
├── 05. CFOP
│   ├── What is CFOP?
│   ├── Cross
│   ├── F2L Introduction
│   ├── F2L Cases
│   ├── F2L Efficiency
│   ├── 2-Look OLL
│   ├── Full OLL
│   ├── 2-Look PLL
│   ├── Full PLL
│   └── Putting CFOP Together
│
├── 06. Solving Other Cubes
│   ├── Solving the 2×2
│   ├── Solving the 4×4
│   └── Solving the 5×5
│
├── 07. Algorithms & Patterns
│   ├── Sexy Move
│   ├── Sledgehammer
│   ├── Checkerboard
│   ├── Snake
│   ├── Cube in a Cube
│   └── More Fun Algorithms
│
└── 08. Cubing Guides & Resources
    ├── What Cube Should You Buy?
    ├── Taking Care of Your Cube
    ├── Lubrication & Maintenance
    ├── Maintaining & Adjusting Magnetic Cubes
    ├── WCA & Official Cubing
    └── Cubing Competitions & Events
3. Module 01 — Getting Started
Purpose

Introduce complete beginners to the Rubik's Cube and the wider world of cubing.

This module assumes little or no previous cubing knowledge.

3.1 Meet the Rubik's Cube

Introduce the classic 3×3 Rubik's Cube.

Topics
What a Rubik's Cube is
The six faces and their colors
Basic cube terminology
Center pieces
Edge pieces
Corner pieces
How pieces move around the cube
Basic concepts needed before learning to solve
Goal

Make a complete beginner comfortable with the physical structure and terminology of a Rubik's Cube.

This lesson incorporates the basic cube anatomy that would otherwise require a separate lesson.

3.2 Cube Types

Introduce the wider world of twisty puzzles.

Topics
2×2
3×3
4×4
5×5
Pyraminx
Skewb
Megaminx
Other notable puzzle types
Goal

Show beginners that the 3×3 is only one part of the broader cubing world.

This is an introduction to different puzzles rather than a solving guide.

3.3 A Brief History of the Cube

Provide a short and engaging history of the Rubik's Cube.

Topics
Erno Rubik
Creation of the original cube
The original purpose of the puzzle
The cube becoming a worldwide phenomenon
The emergence of competitive solving
Development of modern speedcubing
Goal

Give the learner historical context and interesting background without turning the lesson into an exhaustive history article.

3.4 What is Speedcubing?

Introduce the concept of speedcubing.

Topics
What speedcubing means
Timed solving
Scrambles
Solve times
Averages and statistics
Competitive solving
Different cubing events
The broader speedcubing community
Goal

Transition the learner from:

"I know what a Rubik's Cube is."

to:

"I understand what speedcubing is and why people practice it."

3.5 Fun Cube Patterns

Introduce interesting cube patterns and algorithms purely for exploration and enjoyment.

Purpose
Make the cube more approachable
Let beginners experiment
Introduce the concept of algorithms
Help users become familiar with cube movements
Create an enjoyable first interaction with cubing

These patterns are not required for solving a cube.

4. Module 02 — Cube Notation
Purpose

Teach the notation system used throughout speedcubing.

Notation is a prerequisite for understanding algorithms and more advanced Trainer content.

4.1 Basic Face Notation

Introduce the six standard face identifiers:

U
D
L
R
F
B
Topics
What each letter represents
How faces are identified
How the cube should be oriented when reading notation
How notation sequences represent a series of moves
Goal

Allow a beginner to read and understand basic cube move notation.

4.2 Prime & Double Turns

Introduce move modifiers.

Examples:

R
R'
R2
Topics
Clockwise turns
Counter-clockwise turns
180-degree turns
How modifiers change a move
Combining moves into algorithms
Goal

Allow users to understand the basic notation used in almost every cubing algorithm.

4.3 Whole Cube Rotations

Introduce:

x
y
z
Topics
What whole-cube rotations are
How they differ from face turns
How the cube's orientation changes
Why rotations appear in advanced algorithms
Goal

Prepare users for more advanced notation and algorithm execution.

4.4 Wide Moves

Introduce wide turns.

Examples:

Rw
Uw
Fw
Lw
Dw
Bw
Topics
What a wide move means
Difference between an outer face turn and a wide turn
Why wide moves are important for larger cubes
Basic examples
Goal

Introduce notation that will later appear in 4×4 and 5×5 solving.

4.5 4×4 & 5×5 Notation

Introduce notation used when working with larger cubes.

Topics
Inner-layer turns
Multi-layer turns
Layer depth
Wide-layer notation
Depth prefixes

Example:

3Rw
Goal

Give users enough understanding to read and interpret big-cube scrambles.

This lesson connects directly with Cubit's support for 2×2–5×5 scramble generation.

5. Module 03 — Solve Your First Cube
Purpose

Provide a complete beginner-friendly path for solving a standard 3×3 cube.

This is the primary introductory solving course in Cubit Trainer V1.

5.1 Understanding the Beginner Method

Introduce the overall solving approach before teaching individual steps.

The learner is shown the complete progression:

White Cross
    ↓
First-Layer Corners
    ↓
Middle Layer
    ↓
Yellow Cross
    ↓
Yellow Edges
    ↓
Yellow Corners
    ↓
Final Corner Orientation
    ↓
Solved Cube
Topics
Overall solving strategy
Purpose of each stage
How stages depend on each other
Difference between solving a stage and solving the entire cube
Goal

Give the learner a mental map of the entire beginner method before they start executing individual steps.

5.2 Make the White Cross

Teach the learner how to create the first cross.

Topics
Finding white edge pieces
Positioning white edges
Building the white cross
Matching side colors with their centers
Understanding correct cross alignment
Goal

Create a correctly aligned white cross rather than simply placing four white stickers around the center.

5.3 Solve the First-Layer Corners

Teach how to complete the first layer.

Topics
Identifying white corners
Finding the correct corner position
Positioning corners
Inserting corners
Beginner-friendly algorithms
Preserving the solved cross
Goal

Complete the entire first layer.

5.4 Solve the Middle Layer

Teach how to solve the four middle-layer edges.

Topics
Identifying suitable edge pieces
Determining whether an edge belongs on the left or right
Left insertion
Right insertion
Avoiding disruption to the solved first layer
Goal

Complete the first two layers.

5.5 Make the Yellow Cross

Teach how to orient the yellow edges to form a yellow cross.

Topics
Identifying the current yellow-edge pattern
Understanding the different starting cases
Applying the required algorithm
Progressing toward a complete yellow cross
Goal

Create a yellow cross on the final layer.

5.6 Solve the Yellow Edges

Teach how to correctly position the yellow cross edges.

The learner progresses from:

"I have a yellow cross."

to:

"The yellow cross also matches the side centers."

Goal

Correctly position all final-layer edges.

5.7 Position the Yellow Corners

Teach how to move the yellow corners into their correct positions.

Important distinction

The corners do not necessarily need to be correctly oriented yet.

The focus is only on correct position.

Goal

Place all four yellow corners in their correct locations.

5.8 Orient the Yellow Corners

Teach the final beginner-method step.

Topics
Rotating the final corners
Preserving solved portions of the cube
Completing the final orientation
Recognizing when the cube is solved
Goal

Solve the complete cube.

5.9 Bring It All Together

A final complete-solve lesson that combines everything learned.

Complete solving flow
Scramble
    ↓
Inspection
    ↓
White Cross
    ↓
First Layer
    ↓
Middle Layer
    ↓
Yellow Cross
    ↓
Yellow Edges
    ↓
Yellow Corners
    ↓
Solved

No major new concept should be introduced here.

Goal

Demonstrate how all previous lessons combine into one complete solve.

The learner should finish this module being able to say:

"I can solve a Rubik's Cube."

6. Module 04 — Speedcubing Fundamentals
Purpose

Bridge the gap between:

"I can solve a Rubik's Cube."

and:

"I can solve a Rubik's Cube efficiently and quickly."

This module introduces the mindset and fundamentals required for speedsolving.

6.1 From Solving to Speedsolving

Explain what changes when solving becomes a speed-oriented activity.

Topics
Efficiency
Recognition
Turning speed
Lookahead
Inspection
Reducing pauses
Smooth execution
Goal

Help users understand that speedcubing is not simply turning the cube faster.

6.2 Inspection

Explain how speedcubers use inspection time before starting a solve.

Topics
Planning
Finding the cross
Tracking pieces
Using inspection efficiently
Preparing the beginning of a solve
Goal

Teach users to use pre-solve inspection as part of the solve itself.

6.3 Cross Efficiency

Move beyond simply completing the cross.

Topics
Planning the complete cross
Reducing unnecessary moves
Avoiding unnecessary cube rotations
Improving cross solutions
Thinking ahead
Goal

Teach users to build efficient crosses rather than simply valid crosses.

6.4 Turning & Finger Tricks

Introduce efficient physical cube turning.

Topics
Finger tricks
Efficient execution
Reducing regrips
Proper turning technique
Smooth movement
Goal

Help users execute algorithms faster and more consistently.

6.5 Lookahead

Introduce the concept of planning the next step while executing the current step.

Topics
Recognizing upcoming pieces
Tracking pieces during execution
Reducing recognition time
Maintaining continuous solving flow
Goal

Reduce pauses between solving steps.

6.6 Reducing Pauses

Explain why speedsolving is not simply about turning as quickly as physically possible.

Topics
Turning speed
Recognition
Lookahead
Flow
Pauses
Smooth solving
Goal

Teach users why a smooth solve can outperform a faster but inconsistent solve.

6.7 Understanding TPS

Introduce:

TPS — Turns Per Second

Topics
What TPS measures
How TPS is calculated
Why TPS matters
Why higher TPS does not automatically mean faster solves
Relationship between TPS and efficient solving
Goal

Give users a basic understanding of one of the common measurements used when discussing turning speed.

7. Module 05 — CFOP
Purpose

Introduce the CFOP speedsolving method and provide the foundation for progressing beyond the beginner method.

CFOP stands for:

C — Cross
F — F2L
O — OLL
P — PLL
7.1 What is CFOP?

Introduce the complete CFOP method.

Topics
What CFOP means
The four stages
How the stages work together
How CFOP differs from the beginner method
Why CFOP is widely used in speedcubing
Goal

Give users a clear mental model of the complete CFOP solving process.

7.2 Cross

Build on the Cross concepts introduced earlier.

Topics
Efficient cross planning
Inspection
Move efficiency
Cross execution
Transition into F2L
Goal

Teach the learner to treat Cross as the first optimized stage of a CFOP solve.

7.3 F2L Introduction

Introduce:

First Two Layers — F2L

Topics
What F2L means
Pairing corners and edges
Solving pairs instead of individual pieces
How F2L replaces the beginner method's first-layer and middle-layer approach
Basic F2L concepts
Goal

Give users a conceptual understanding of F2L before introducing cases.

7.4 F2L Cases

Introduce common F2L situations.

Topics
Case recognition
Pairing pieces
Inserting pairs
Common algorithms
Understanding different case types
Goal

Build the user's initial F2L case-recognition library.

7.5 F2L Efficiency

Move from simply solving F2L to solving it efficiently.

Topics
Move reduction
Avoiding unnecessary rotations
Better pair solutions
Lookahead
Maintaining flow
Efficient insertions
Goal

Help users improve the quality and speed of their F2L solutions.

7.6 2-Look OLL

Introduce the simplified OLL approach.

Break it into:

Edge Orientation
        ↓
Corner Orientation
Topics
What OLL means
Why orientation is needed
Edge orientation
Corner orientation
2-Look OLL workflow
Goal

Give learners a manageable introduction to last-layer orientation.

7.7 Full OLL

Introduce the complete OLL system.

Topics
What OLL cases are
Case recognition
Algorithm execution
Why different cases require different algorithms
Relationship between 2-Look OLL and Full OLL
Goal

Introduce the full OLL case system as the next progression after 2-Look OLL.

V1 note: This lesson acts as the introduction/reference point for the full OLL system. It does not require Cubit V1 to contain an individual lesson for every OLL case.

7.8 2-Look PLL

Introduce simplified PLL.

Break it into:

Corner Permutation
        ↓
Edge Permutation
Topics
What PLL means
Corner permutation
Edge permutation
2-Look PLL workflow
Goal

Give learners a manageable introduction to last-layer permutation.

7.9 Full PLL

Introduce the complete PLL system.

Topics
PLL case recognition
Algorithm execution
Full PLL concept
Relationship between 2-Look PLL and Full PLL
Goal

Introduce the full PLL case system as the next progression after 2-Look PLL.

V1 note: This lesson acts as the introduction/reference point for the full PLL system. It does not require Cubit V1 to contain an individual lesson for every PLL case.

7.10 Putting CFOP Together

Show how the complete CFOP solve works:

Cross
  ↓
F2L
  ↓
OLL
  ↓
PLL
  ↓
Solved
Topics
Complete CFOP workflow
Transition between stages
Maintaining flow
How the individual concepts connect
What a complete CFOP solve looks like
Goal

Give the learner a complete picture of how CFOP works as a unified solving method.

8. Module 06 — Solving Other Cubes
Purpose

Introduce solving approaches for Cubit's other supported major cube types.

These are compact guides rather than full multi-module courses.

8.1 Solving the 2×2

Introduce the 2×2 and explain how it differs from the 3×3.

Topics
2×2 structure
Differences from the 3×3
Basic solving approach
Beginner-friendly solution
Relevant algorithms
Goal

Give a 3×3 learner enough knowledge to begin solving a 2×2.

8.2 Solving the 4×4

Introduce the 4×4 solving process.

Topics
4×4 structure
Centers
Edge pairing
Reduction
Solving the reduced cube as a 3×3
Basic parity concepts
Goal

Give the learner a practical introduction to the 4×4 solving methodology.

This is not intended to be a complete advanced 4×4 course.

8.3 Solving the 5×5

Introduce the 5×5 solving process.

Topics
5×5 structure
Centers
Edge grouping
Reduction
Solving as a 3×3
Basic big-cube considerations
Goal

Give the learner a practical introduction to the 5×5 solving methodology.

This is not intended to be a complete advanced 5×5 course.

9. Module 07 — Algorithms & Patterns
Purpose

Provide fun, interesting and memorable cube algorithms.

This module is intentionally less formal than the main learning path.

It should feel like:

"Here's some cool stuff you can do with a cube."

rather than:

"Here are more things you have to memorize."

9.1 Sexy Move

Introduce:

R U R' U'
Topics
What the Sexy Move is
Why it is famous
How to execute it
Where it appears in cubing
Why it is useful beyond being a fun sequence
9.2 Sledgehammer

Introduce the Sledgehammer algorithm.

Topics
What the Sledgehammer is
How to execute it
Where it appears in solving
Why speedcubers use it
9.3 Checkerboard

Teach the moves required to create the classic checkerboard pattern.

Goal

Let users recreate the pattern themselves and understand how algorithms can create deliberate visual states.

9.4 Snake

Teach a visually interesting snake-style cube pattern.

Goal

Provide another fun sequence that encourages experimentation with the cube.

9.5 Cube in a Cube

Teach the algorithm required to create the classic cube-in-a-cube pattern.

Goal

Provide a more visually impressive pattern that users can recreate and share.

9.6 More Fun Algorithms

Provide a collection of additional interesting patterns and sequences.

Purpose

This lesson acts as an expandable collection.

Additional patterns can be added over time without changing the fundamental Trainer structure.

10. Module 08 — Cubing Guides & Resources
Purpose

This section is intentionally different from the structured Trainer curriculum.

These are evergreen informational articles designed to:

Help Cubit users
Answer common cubing questions
Provide useful reference material
Introduce new users to the cubing ecosystem
Provide discoverable content for search engines
Support Cubit's broader educational content strategy

These articles are not traditional Trainer lessons.

They do not need to participate in the lesson progression or completion system.

10.1 What Cube Should You Buy?

A beginner-oriented cube buying guide.

Topics
Choosing a first cube
2×2 vs 3×3 and other sizes
Magnetic vs non-magnetic cubes
Budget considerations
Stickered vs stickerless cubes
What beginners should look for
General recommendations
Purpose

Help a new cuber choose an appropriate first cube without overwhelming them with technical specifications.

10.2 Taking Care of Your Cube

A general cube maintenance guide.

Topics
Cleaning
Dust and debris
Storage
Handling
Preventing unnecessary wear
When maintenance is needed
Purpose

Teach beginners how to keep their cube in good condition.

10.3 Lubrication & Maintenance

A more detailed guide to cube lubrication and maintenance.

Topics
Why cubes need lubricant
Types of cube lubricant
When to lubricate
Basic cleaning
Maintenance routines
General setup considerations
Purpose

Help users understand how lubrication affects cube performance and how to maintain their cube properly.

10.4 Maintaining & Adjusting Magnetic Cubes

A guide specifically focused on modern magnetic cubes.

Topics
Magnetic systems
Tension
Compression
Adjustments
Setup
Maintaining consistent cube feel
General magnetic-cube maintenance
Purpose

Help users understand and maintain modern magnetic speedcubes.

10.5 WCA & Official Cubing

Introduce the official competitive cubing ecosystem.

Topics
What the World Cube Association is
What official competitions are
Competition regulations
Official events
Official results
Competition categories
How official cubing works
Important distinction

Cubit is an independent platform.

Cubit must not imply that it is:

Affiliated with the World Cube Association
Endorsed by the World Cube Association
Certified by the World Cube Association
An official WCA results platform

Cubit results, ratings, leaderboards and solve records are Cubit platform data and are not official WCA results.

10.6 Cubing Competitions & Events

A beginner-friendly guide to attending and participating in competitions.

Topics
How cubing competitions work
Registration
Events
Rounds
Inspection
Solving
Timing
Rankings
What a first-time competitor should expect
Purpose

Make official competitions less intimidating for users who have never attended one.

11. Content Classification

Cubit Trainer V1 contains two distinct types of educational content.

11.1 Structured Trainer Lessons

Modules 01–07 are part of the structured Trainer learning system.

These lessons can support:

Lesson progress
Completion state
Difficulty
Learning progression
Trainer rating rewards
Future prerequisites
Future interactive exercises

The intended high-level progression is:

Getting Started
      ↓
Cube Notation
      ↓
Solve Your First Cube
      ↓
Speedcubing Fundamentals
      ↓
CFOP
      ↓
Solving Other Cubes
      ↓
Algorithms & Patterns
11.2 Cubing Guides

Module 08 is an informational content library.

These articles:

Can be read independently
Can be linked from Trainer lessons
Can be linked from other Cubit pages
Can be indexed for SEO
Can be expanded over time
Act as evergreen educational resources

They do not need to be treated as part of the Trainer completion/progression system.

12. V1 Content Summary
Module	Name	Type	Content Count
01	Getting Started	Trainer Lessons	5
02	Cube Notation	Trainer Lessons	5
03	Solve Your First Cube	Trainer Lessons	9
04	Speedcubing Fundamentals	Trainer Lessons	7
05	CFOP	Trainer Lessons	10
06	Solving Other Cubes	Trainer Lessons	3
07	Algorithms & Patterns	Trainer Lessons	6
08	Cubing Guides & Resources	Informational Articles	6
	Total		51
Structured Trainer Content

45 lessons

Cubing Guides

6 articles

Total V1 Educational Content

51 content pieces

13. V1 Scope Boundary

The Trainer V1 curriculum intentionally focuses primarily on:

3×3 fundamentals
Beginner solving
Speedcubing fundamentals
CFOP introduction
Basic 2×2 solving
Basic 4×4 solving
Basic 5×5 solving
Fun algorithms and patterns
General cubing knowledge
Cube maintenance and care
Competition and WCA information

The following are intentionally not required for the initial V1 curriculum:

Full advanced 4×4 course
Full advanced 5×5 course
Blindfolded solving course
One-handed solving course
Advanced color neutrality training
Advanced cross curriculum
Advanced F2L mastery curriculum
Individual lessons for every OLL case
Individual lessons for every PLL case
Comprehensive advanced big-cube algorithms
Competition-level advanced coaching
Personalized AI training
Advanced solve analysis

These can be added in future Trainer releases without changing the fundamental V1 structure.

14. Future Expansion

The Trainer architecture should allow additional educational content to be added without restructuring the existing V1 curriculum.

Potential future additions include:

Advanced F2L
Advanced Lookahead
Color Neutrality
Advanced Cross
Full OLL Case Library
Full PLL Case Library
Advanced 4×4
Advanced 5×5
One-Handed Solving
Blindfolded Solving
Competition Preparation
Advanced Inspection
Advanced TPS & Turning
Solve Analysis
Personalized Training
AI-assisted Training

The V1 curriculum is therefore the initial content catalog, not the permanent limit of Cubit Trainer.

15. Trainer and Cubit Ecosystem

Cubit Trainer is intended to work together with the rest of the Cubit platform rather than existing as an isolated educational section.

The long-term learning loop is:

                 ┌──────────────┐
                 │    TRAINER   │
                 │    Learn     │
                 └──────┬───────┘
                        ↓
                 ┌──────────────┐
                 │    TIMER     │
                 │   Practice   │
                 └──────┬───────┘
                        ↓
                 ┌──────────────┐
                 │   SESSIONS   │
                 │    Record    │
                 └──────┬───────┘
                        ↓
                 ┌──────────────┐
                 │    STATS     │
                 │    Analyze   │
                 └──────┬───────┘
                        ↓
                 ┌──────────────┐
                 │    RATING    │
                 │    Improve   │
                 └──────┬───────┘
                        │
                        └──────────────┐
                                       ↓
                                  Back to Trainer

The intended experience is:

Trainer

The user learns what to do.

Timer

The user gets a place to practice.

Sessions

The user records their practice.

Statistics

The user analyzes their performance.

Rating & Gamification

The user gets motivation and progression.

Trainer

The user returns to learn the next skill.

This creates a continuous learning and improvement loop across the Cubit platform.

16. Content Design Principles

All V1 Trainer content should follow these principles.

Beginner Friendly

Lessons should assume the learner may have little prior cubing knowledge.

Technical terminology should be introduced before it is used heavily.

Progressive

Concepts should be introduced in an order where each lesson builds upon previous knowledge.

Users should not need to understand advanced concepts before completing beginner lessons.

Practical

Whenever possible, explanations should be connected to actual cube movements, algorithms, examples or practice.

Visual

Cubing is inherently spatial.

Where useful, lessons should use:

Cube visualizations
Move diagrams
Algorithm displays
Scrambles
Animated examples
Before/after cube states

Cubit already has a custom cube-state engine and visualizer, which can eventually be used to make Trainer content interactive.

Connected to Practice

Where appropriate, lessons should eventually connect users directly to Cubit's Timer.

For example:

Learn a concept
      ↓
Practice the concept
      ↓
Generate a scramble
      ↓
Solve
      ↓
Record result
      ↓
Analyze performance

This is a future integration goal for the Trainer.

Avoid Unnecessary Complexity

V1 should prioritize useful, high-quality content rather than trying to cover every possible cubing technique.

The Trainer should be expandable without requiring a complete redesign.

17. V1 Definition of Trainer Content Complete

The Trainer content specification is considered complete for V1 when the following content exists:

 5 Getting Started lessons
 5 Cube Notation lessons
 9 First Cube solving lessons
 7 Speedcubing Fundamentals lessons
 10 CFOP lessons
 3 Other Cube solving lessons
 6 Algorithms & Patterns lessons
 6 Cubing Guide articles

Total:

45 structured Trainer lessons + 6 informational guides = 51 content pieces

The content catalog should not expand beyond this scope during the initial V1 implementation unless a change is explicitly agreed upon.