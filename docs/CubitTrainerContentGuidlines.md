# Cubit Trainer V1 — Content Guidelines

> **Purpose:** This document defines how Cubit Trainer content should be written, structured, illustrated, presented, and maintained.
>
> `CubitTrainerContent.md` defines **what** Cubit teaches.
>
> `CubitTrainerLessonSpecs.md` defines **what each lesson must contain**.
>
> This document defines **how Cubit should teach it**.

---

# 1. Core Philosophy

Cubit Trainer is not intended to be a collection of articles with algorithms pasted into cards.

It should feel like an actual learning system.

The learner should be able to:

```text
Discover
   ↓
Understand
   ↓
See
   ↓
Try
   ↓
Practice
   ↓
Complete
   ↓
Know what to learn next

Every piece of Trainer content should contribute to this learning loop.

The goal is not maximum information density.

The goal is:

Make a beginner understand cubing, learn to solve, and progressively become better at solving.

2. Content Principles
2.1 Teach, Don't Dump Information

Do not present large blocks of information simply because the topic contains many facts.

Instead:

introduce the concept;
explain why it matters;
show it;
give an example;
let the learner interact where useful;
reinforce it with practice.

Bad:

The Rubik's Cube has six faces. It has eight corners,
twelve edges and six centers...

Better:

Before learning to solve the cube, you need to know
what you're actually moving.

There are three kinds of pieces:

Corner — touches three faces.
Edge — touches two faces.
Center — identifies a face.

Then show the pieces visually.

3. Write for the Learner's Current Level

Cubit Trainer has multiple progression levels.

Content should respect the learner's current knowledge.

Do not introduce:

F2L terminology in the first beginner lesson;
OLL terminology before the learner understands the final layer;
advanced notation before basic notation;
TPS before explaining what speedsolving is.

Every lesson should assume only the knowledge provided by its prerequisites.

4. Difficulty Levels

Trainer uses three primary difficulty levels.

Beginner

The learner may know almost nothing about speedcubing.

Use:

simple language;
explicit explanations;
visual demonstrations;
minimal terminology;
frequent examples.

Avoid assuming prior cubing knowledge.

Intermediate

The learner understands the basics and can solve a cube.

Use:

more technical terminology;
algorithms;
efficiency concepts;
recognition;
interactive demonstrations;
structured practice.
Advanced

The learner is actively speedsolving.

Use:

precise terminology;
optimization concepts;
case recognition;
algorithm selection;
efficiency analysis;
performance considerations.

Avoid unnecessarily simplifying advanced material.

5. Lesson Opening

Every lesson should establish context quickly.

A good opening normally contains:

Title

What the learner is learning.

One-line description

Why the topic matters.

Learning Objective

A short statement describing what the learner should be able to do after completing the lesson.

Example:

By the end of this lesson, you'll be able to identify
all six cube faces and recognize corner, edge, and
center pieces.

Avoid long introductions.

The learner should reach useful information quickly.

6. Recommended Lesson Structure

The default structure should be:

Title
↓
Short Introduction
↓
Learning Objective
↓
Concept / Explanation
↓
Visual Demonstration
↓
Interactive Experience
↓
Example
↓
Practice
↓
Common Mistakes
↓
Key Takeaways
↓
What's Next?

Not every lesson needs every section.

For example:

a history lesson may not need an interactive cube;
an algorithm lesson should;
a maintenance guide may use a checklist instead of practice.

The structure should serve the learning goal.

7. Section Length

Avoid extremely long uninterrupted sections.

Prefer:

Short explanation
↓
Visual
↓
Short explanation
↓
Example

over:

1000-word wall of text

As a general guideline:

paragraphs: 1–4 sentences;
sections: focused on one idea;
lists: use when information is naturally list-like;
long explanations: break into subsections.
8. Language & Tone

Cubit Trainer should sound:

clear;
friendly;
confident;
technical when necessary;
encouraging;
practical.

It should not sound:

childish;
corporate;
academic for the sake of being academic;
overly enthusiastic;
robotic;
artificially motivational.

Use language similar to an experienced cuber teaching a newcomer.

9. Terminology

Use standard cubing terminology.

Examples:

sticker;
piece;
center;
edge;
corner;
face;
layer;
scramble;
algorithm;
inspection;
PB;
DNF;
+2;
TPS;
F2L;
OLL;
PLL.

When introducing a term for the first time:

Lookahead is the process of identifying what you'll
solve next while you're still executing the current pair.

After the term has been established, use the standard short form.

10. Notation Formatting

Cube notation must always be visually distinguishable from normal prose.

Use inline code:

R U R' U'

For algorithms, use a dedicated algorithm block where possible.

Example:

R U R' U'

Do not write algorithms in ambiguous plain prose.

Incorrect:

Do R U R prime U prime.

Preferred:

R U R' U'
11. Algorithm Presentation

Every algorithm should be presented with enough context to execute it correctly.

A good algorithm presentation contains:

Case / Purpose
↓
Starting Position
↓
Algorithm
↓
Result
↓
Practice

For example:

### Right-Hand Insert

Use this when the edge belongs in the right slot.

Algorithm:

R U R' U'

After execution, the pair is inserted into the
right-hand slot.

Where useful, include:

case diagram;
animation;
notation breakdown;
repetition;
reset.
12. Interactive Cube Philosophy

Cubit has its own custom cube-state engine.

Trainer should leverage it.

The Interactive Cube is particularly valuable when teaching:

notation;
algorithms;
patterns;
solving steps;
F2L;
OLL;
PLL;
cube rotations;
wide moves.

The interactive cube should not be added merely because it is technically possible.

It should exist when:

Seeing the cube move helps the learner understand what the text alone cannot communicate efficiently.

13. Interactive Cube Design

Where an Interactive Cube is used, it should generally provide:

visible cube;
clear orientation;
move controls;
animation;
reset;
optional previous/next controls;
current move indicator where useful.

Example:

        [ 3D Cube ]

       R     U     F
       
       [ Reset ]

Move:
R U R' U'

The interface should make it obvious:

what state the cube is currently in;
what move is being demonstrated;
what happened after the move.
14. Cube Orientation

Trainer demonstrations must use a consistent orientation.

Unless a lesson explicitly teaches another orientation:

White = Up
Green = Front
Yellow = Down
Blue = Back
Red = Right
Orange = Left

This should remain consistent with Cubit's existing cube engine and visualizer.

Do not casually rotate the cube between demonstrations.

If the orientation changes:

Explicitly tell the learner.

15. Cube Visual Accuracy

Exact cube states are technical information.

Never rely on an AI-generated image to represent an exact algorithm state.

For:

algorithms;
scramble states;
notation;
solving steps;
piece positions;

use Cubit's deterministic cube engine.

Static illustrations may be used for conceptual explanations, but exact sticker positions must come from verified data.

16. Visual Learning Strategy

Use visuals when they reduce cognitive load.

Good uses:

identifying pieces;
showing face names;
showing cube layers;
explaining algorithms;
showing before/after states;
showing solving progression;
explaining cube types.

Avoid visuals that merely decorate the page.

Every visual should answer:

What does this help the learner understand?

17. Visual Asset Types

Cubit Trainer may use:

A. Interactive Cube

Best for:

moves;
algorithms;
solving procedures;
patterns.
B. Cube Diagram

Best for:

piece identification;
notation;
static explanations.
C. Infographic

Best for:

solving roadmap;
CFOP structure;
cube history;
WCA events.
D. Photograph

Best for:

real cubes;
hardware;
maintenance;
competitions.
E. Illustration

Best for:

conceptual explanations;
decorative context;
historical material.
18. AI-Generated Images

AI-generated images may be used selectively.

Appropriate:

decorative illustrations;
conceptual scenes;
historical-style imagery;
general visual storytelling.

Not appropriate as the authoritative source for:

exact cube states;
algorithms;
notation;
competition rules;
technical cube diagrams.

If accuracy matters, generate the visual programmatically or use a verified source.

19. Video Content

Video should be treated as a supplementary learning format.

It should not simply repeat the exact same paragraph from the lesson.

Good video use:

Written explanation:
Detailed reference

Video:
Visual overview / demonstration

The learner should still be able to understand the lesson without the video unless the lesson is explicitly designed around video.

20. NotebookLM / AI Video Workflow

For suitable lessons, an AI-generated educational video may be produced using tools such as NotebookLM.

The workflow should be:

Approved Lesson Specification
        ↓
Verified Source Material
        ↓
Cubit Lesson Draft
        ↓
Video Brief
        ↓
AI Video Generation
        ↓
Human Review
        ↓
Trainer Integration

The AI should receive:

lesson specification;
approved lesson content;
supporting references;
Cubit terminology;
target audience;
desired duration;
visual requirements.

Do not simply ask an AI tool:

Make a video about Rubik's cubes.

The resulting content may introduce incorrect terminology or facts.

21. Video Quality Requirements

Every published video must be checked for:

factual accuracy;
correct terminology;
correct cube orientation;
correct algorithms;
readable notation;
appropriate pacing;
absence of unsupported claims.

AI-generated video must be treated as a draft until reviewed.

22. Practice Philosophy

Practice should reinforce the lesson's primary objective.

Do not add random quizzes just to make a lesson interactive.

Examples:

Notation Lesson

Ask:

What does R' mean?
Piece Identification

Ask:

Which piece is this?
Beginner Solve

Ask the learner to perform the next step.

Algorithm Lesson

Let the learner execute the algorithm.

History Lesson

Use a short knowledge check.

23. Practice Types

Cubit Trainer can use:

Identification

Identify a piece, face, case, or notation.

Multiple Choice

Useful for conceptual knowledge.

Ordering

Arrange solving steps correctly.

Move Prediction

Predict the resulting state.

Interactive Execution

Perform a move or algorithm.

Case Recognition

Identify an F2L/OLL/PLL case.

Guided Solve

Perform a sequence of solving steps.

Reflection

Useful for advanced learning:

Where did you pause most during this solve?
24. Don't Over-Test

Not every lesson needs a formal quiz.

For a procedural lesson:

Learning → Doing → Completion

may be better than:

Learning → Quiz → Quiz → Quiz → Completion

The learner should practice the actual skill.

25. Common Mistakes

Procedural and algorithmic lessons should include a short:

Common Mistakes

section.

Examples:

holding the cube incorrectly;
confusing clockwise direction;
inserting a corner into the wrong slot;
rotating the cube unexpectedly;
executing an algorithm from the wrong orientation.

The purpose is not to overwhelm the learner.

Only mention mistakes that are genuinely common or important.

26. Key Takeaways

Lessons should end the teaching portion with a concise summary.

Example:

### Key Takeaways

- Centers identify the faces.
- Edges have two colors.
- Corners have three colors.
- Face notation is based on the face being viewed directly.

Keep this short.

It should reinforce the lesson, not introduce new material.

27. "What's Next?" Section

Every lesson must end with a navigation section.

Recommended structure:

## What's Next?

### Continue Learning

→ Prime & Double Turns

You'll learn how `'` and `2` modify basic face turns.

### Related

→ Whole Cube Rotations
→ Wide Moves

### Explore

→ Fun Cube Patterns

The Continue Learning item should normally be a single clear recommendation.

28. Navigation Principles

Navigation should form a learning graph rather than a simple linear list.

A learner may arrive at a lesson through:

previous lesson;
module page;
recommendation;
search;
profile/trainer progress;
related lesson;
algorithm page.

Therefore, every lesson should provide a sensible way forward.

29. Don't Create Dead Ends

Avoid ending a lesson with:

Lesson Complete.

and nothing else.

The learner should always have an obvious next action.

Possible actions:

continue learning;
practice;
explore a related topic;
return to module;
start a recommended lesson.
30. Content Progression

The Trainer should gradually increase complexity.

Recommended progression:

Terminology
   ↓
Basic Cube Understanding
   ↓
Notation
   ↓
Beginner Solving
   ↓
Speedsolving Concepts
   ↓
CFOP
   ↓
Advanced Algorithms
   ↓
Other Cubes

Do not force advanced material into the beginner curriculum.

31. Module-Level Introductions

Each module should have a short introduction.

The module introduction should explain:

What this module covers.
Who it is for.
What the learner will be able to do afterward.

Example:

## Solve Your First Cube

This module takes you from a scrambled 3×3 to a
complete solve using the beginner layer-by-layer method.

You don't need to know any algorithms before starting.
We'll introduce each one when you need it.
32. Module Completion

Completing a module should represent meaningful progress.

A module should not be marked complete simply because the learner opened every page.

Where possible, completion should be based on the lesson's actual completion criteria.

Examples:

conceptual lesson → finish + knowledge check;
algorithm lesson → learn/execute algorithm;
solving lesson → complete required task;
guide → finish reading.
33. Trainer Difficulty & Rating Integration

Trainer lesson difficulty maps to Cubit's gamification system.

The existing rating specification defines:

Easy / Beginner       +1
Medium / Intermediate +2
Advanced              +3

These rewards are awarded for the first completion of a lesson.

Content authors must therefore assign difficulty intentionally.

Do not label a lesson "Advanced" merely because it contains many pages.

Difficulty should reflect the knowledge/skill required.

34. First-Time Completion

Trainer content should support first-time completion tracking.

A learner should not receive the lesson completion reward repeatedly by:

reopening;
rereading;
refreshing;
replaying an interactive demo.

The lesson should have a stable identity.

35. Content Metadata

Every lesson should maintain metadata such as:

id:
module:
title:
difficulty:
type:
estimatedMinutes:
prerequisites:
objectives:
topics:

The content layer should not depend on titles as identifiers.

Stable IDs are required for:

progress;
completion;
rating;
recommendations;
navigation;
analytics.
36. Images & Asset Naming

Assets should use predictable names.

Preferred:

trainer/
├── getting-started/
│   ├── cube-pieces.webp
│   ├── cube-types.webp
│   └── cube-history.webp
│
├── notation/
│   ├── face-notation.webp
│   └── wide-moves.webp
│
└── beginner/
    ├── white-cross.webp
    └── first-layer-corners.webp

Avoid:

img1.png
final-final-2.png
newcube.png

Asset names should communicate purpose.

37. Image Accessibility

Every meaningful image must have appropriate alternative text.

Example:

A 3×3 Rubik's Cube showing the white face on top
and green face toward the viewer.

Do not use:

cube image

for meaningful instructional visuals.

Decorative images may use empty alternative text where appropriate.

38. Responsive Content

Trainer content must work across:

desktop;
tablet;
mobile.

Do not rely on:

extremely wide diagrams;
tiny algorithm text;
hover-only explanations;
desktop-only interactive controls.

Interactive cube controls must remain usable on touch devices.

39. Mobile Interactive Cube

On mobile:

cube should remain large enough to inspect;
controls should be easy to tap;
algorithm notation should remain readable;
reset should remain accessible;
horizontal overflow should be avoided.

If an interaction cannot reasonably fit mobile, provide an appropriate simplified layout.

40. Accessibility

Trainer should support:

keyboard navigation;
visible focus states;
sufficient contrast;
readable text sizes;
accessible buttons;
semantic headings;
alternative text;
reduced-motion preferences where applicable.

Animations should enhance learning but never make the lesson unusable.

41. Motion & Animation

Cube animation should communicate cause and effect.

Avoid:

unnecessarily slow animations;
flashy transitions;
decorative motion;
animations that hide the resulting state.

For an algorithm:

Move 1 → Move 2 → Move 3 → ...

should be understandable.

Where useful, allow:

pause;
replay;
step-by-step execution;
reset.
42. Written Content + Interactive Content

Written content and interaction should complement each other.

Bad:

Here is an algorithm.

[Huge cube]

That's it.

Better:

### What you're trying to do

This algorithm inserts the edge into the right slot.

[Starting Cube State]

### Algorithm

R U R' U'

[Play Animation]

### Try It Yourself

[Interactive Cube]
43. Algorithm Case Libraries

Large algorithm collections such as:

F2L;
OLL;
PLL;

should not become giant unreadable pages.

Use structured case presentation.

Each case can contain:

Case
Recognition
Starting State
Algorithm
Interactive Preview
Practice

Filtering/search can be introduced when the case library becomes large enough to justify it.

44. F2L Content Guidelines

F2L should teach recognition, not only memorization.

For each important case explain:

Where the corner is.
Where the edge is.
How the pair should be formed.
How the pair is inserted.
What to look for next.

Avoid turning F2L into:

Case 1 → Algorithm
Case 2 → Algorithm
Case 3 → Algorithm
...

without explaining the underlying idea.

45. OLL / PLL Guidelines

OLL and PLL contain many cases.

The learner should first understand:

what OLL solves;
what PLL solves;
how recognition works;
why algorithms are grouped.

Then introduce case memorization.

Use:

Recognition → Algorithm → Execution → Repetition

rather than:

Algorithm → Memorize
46. Beginner Solving Guidelines

Beginner solving should prioritize:

Understanding.
Correctness.
Consistency.
Confidence.
Speed.

Do not teach speed optimization before the learner can reliably solve the cube.

Avoid overwhelming beginners with:

F2L;
OLL;
PLL;
TPS;
advanced finger tricks.

Those concepts have dedicated later modules.

47. Speedcubing Guidelines

Speedcubing content should avoid the common misconception:

Faster solving = turning faster.

Instead teach the broader relationship:

Planning
+
Recognition
+
Efficiency
+
Turning
+
Lookahead
+
Low pauses
=
Better solving
48. Editorial / Blog-Style Lessons

Some Trainer modules are intentionally more like guides or blog posts.

Examples:

Cube history.
What cube should I buy?
Cube maintenance.
WCA.
Competitions.

These can be more narrative than procedural lessons.

However, they must still have:

clear headings;
readable sections;
useful visuals;
reliable sources;
concise takeaways;
What's Next navigation.
49. SEO-Oriented Editorial Content

Editorial lessons may also function as discoverable Cubit content.

However:

SEO must never reduce educational quality.

Do not keyword-stuff.

Use natural topic coverage.

Useful elements may include:

descriptive title;
clear headings;
concise introduction;
relevant terminology;
internal links;
useful visuals;
source references.
50. External Sources

When a lesson depends on external facts, use reliable sources.

Priority:

Official source
↓
Primary source
↓
Trusted specialist source
↓
Established educational source

Avoid relying on random blogs for authoritative claims.

Especially verify:

WCA rules;
competition information;
historical facts;
hardware specifications;
current recommendations.
51. WCA Content

Cubit must be conservative when discussing the World Cube Association.

Use:

WCA-style scramble generation

rather than claiming:

WCA-compliant scramble generation

unless the exact claim has been independently verified and is legally appropriate.

Cubit is independent from the WCA.

Cubit is not:

affiliated with;
endorsed by;
certified by;

the World Cube Association.

Cubit results, ratings, leaderboards, and solve records are not official WCA results.

52. Hardware Recommendations

Hardware recommendations can become outdated.

Lessons involving products should include:

date reviewed;
basis for recommendation;
clear distinction between facts and opinion.

Avoid claiming:

This is objectively the best cube.

Prefer:

This is a strong option for beginners because...
53. Content Maintenance

Trainer content is not permanently finished.

Some lessons require periodic review.

High-maintenance content includes:

cube recommendations;
WCA information;
competition information;
product specifications;
external links.

Stable educational content includes:

basic notation;
cube piece terminology;
fundamental solving concepts.
54. Content Versioning

When significant curriculum changes occur, update the documentation.

Examples:

new module;
removed lesson;
changed learning path;
new algorithm set;
new Trainer interaction.

Do not silently change the curriculum structure while leaving documentation outdated.

55. AI-Assisted Writing Guidelines

AI can be used extensively during content production.

Appropriate uses:

first drafts;
rewriting;
simplification;
examples;
quizzes;
summaries;
lesson introductions;
video scripts;
alternative explanations;
SEO metadata.

AI output must be reviewed before publication.

56. AI Must Not Invent Technical Facts

AI must never be trusted blindly for:

algorithms;
cube states;
move sequences;
WCA rules;
competition regulations;
historical claims;
product specifications.

If AI proposes an algorithm:

Verify against a trusted source
        +
Verify using Cubit's cube engine

before publishing.

57. AI Content Generation Workflow

Recommended process:

Cubit Lesson Specification
        ↓
Content Guidelines
        ↓
Verified Research Material
        ↓
AI Draft
        ↓
Human Editing
        ↓
Technical Verification
        ↓
Visual Planning
        ↓
Interactive Implementation
        ↓
Final Review

Never use:

Lesson title
↓
"Write the entire lesson"
↓
Publish

without review.

58. Content Review Checklist

Before publishing a lesson:

Structure
 Clear title.
 Clear objective.
 Logical progression.
 Appropriate headings.
 Concise sections.
 Key takeaways.
 What's Next.
Accuracy
 Facts verified.
 Algorithms verified.
 Notation verified.
 Cube states verified.
 External claims sourced.
Learning
 Beginner terminology explained.
 Examples provided where useful.
 Practice included where appropriate.
 Difficulty is accurate.
 Prerequisites are respected.
Visuals
 Visuals actually add value.
 Exact cube states are deterministic.
 Images have appropriate alt text.
 Assets load correctly.
Interaction
 Cube starts in correct state.
 Moves are correct.
 Animation is understandable.
 Reset works.
 Mobile interaction works.
Navigation
 Next lesson works.
 Related lessons work.
 Explore links work.
 No dead ends.
59. Final Content Quality Standard

A Cubit Trainer lesson should satisfy the following test:

Could a motivated learner understand the concept, see how it works, practice it, and know what to learn next without needing to leave Cubit?

If yes, the lesson is likely fulfilling its purpose.

If the learner has to:

search YouTube for the explanation;
search Google for the notation;
find an external algorithm sheet;
figure out the next lesson themselves;

then the Trainer experience is incomplete.

60. What Cubit Trainer Should Feel Like

The final experience should feel like:

"I'm learning this."
        ↓
"Oh, I understand it."
        ↓
"I can see it."
        ↓
"Let me try it."
        ↓
"I got it."
        ↓
"What's next?"
        ↓
"Let's learn that."

Not:

Article
↓
Article
↓
Algorithm table
↓
Article
↓
Good luck.
61. V1 Content Scope Principle

Cubit V1 should prioritize a coherent and high-quality curriculum over an enormous amount of content.

It is better to have:

A smaller number of excellent lessons

than:

Hundreds of shallow AI-generated lessons.

Every published lesson should have a clear educational purpose.

62. Final Non-Negotiable Principles
Accuracy comes before content volume.
Teach concepts before asking learners to memorize them.
Use visuals when they genuinely improve understanding.
Use Cubit's cube engine for exact cube-state demonstrations.
Never use AI-generated cube diagrams as authoritative technical references.
Interactive content should serve learning, not exist merely as a feature showcase.
Every lesson must have a clear learning objective.
Every lesson must have a meaningful completion condition.
Every lesson must have a What's Next section.
AI can assist authors but does not replace verification.
Beginner content must remain genuinely beginner-friendly.
Advanced content should respect the learner's existing knowledge.
Algorithms must be verified independently and against Cubit's engine.
External factual claims must be sourced appropriately.
WCA-related claims must be conservative and accurate.
Editorial content must remain useful rather than becoming SEO filler.
Trainer should form a connected learning graph, not isolated articles.
The curriculum should be maintainable as Cubit grows.
Content should be accessible on desktop and mobile.
The learner should always know what they can do next.
63. Relationship With the Other Trainer Documents

The Trainer documentation system consists of three primary documents.

CubitTrainerContent.md

Defines:

WHAT exists in Cubit Trainer?

It contains:

modules;
lessons;
lesson descriptions;
curriculum organization.
CubitTrainerLessonSpecs.md

Defines:

WHAT must each lesson teach and contain?

It contains:

objectives;
lesson-specific requirements;
interactive requirements;
practice;
completion criteria;
navigation.
CubitTrainerContentGuidelines.md

Defines:

HOW should Cubit teach it?

It contains:

writing style;
pedagogy;
visual strategy;
interactive strategy;
video strategy;
AI-assisted content workflow;
accessibility;
navigation;
QA;
content maintenance.

Together:

                    CUBIT TRAINER
                         │
             ┌───────────┴───────────┐
             │                       │
        Curriculum               Experience
             │                       │
             ▼                       ▼
CubitTrainerContent.md    CubitTrainerLessonSpecs.md
                                     │
                                     ▼
                         CubitTrainerContentGuidelines.md

These three documents should be treated as the source of truth for all future Trainer content and implementation decisions