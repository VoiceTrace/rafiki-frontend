# Rafiqi product and design reference

---

The sections below preserve the source documents. The MVP plan defines current release scope; broader stories and design assets provide context. Visual assets and supporting files are in [`design/`](../design/).

---

<a id="design-kit-overview"></a>

## Design kit overview

_Source: `design/README.md`_

# Rafiqi — complete UI design kit

This package contains **34 rendered design boards**, **34 SVG wireframes**, matching PNG/SVG previews, source-route coverage, and an optional native Figma import helper. Boards 30 and 31 are superseded proposals. Boards 32 and 33 hold the first-login interaction specification. Board 34 is the selected professional visual direction and approved frontend implementation reference.

## Open the designs

- [Current MVP plan](#mvp-simple-tickets): the implementation scope, tickets, and delivery order for Student Profile, Pre-Class, and During-Class.
- [Broader product specification](#product-description-and-user-stories): product context and detailed user stories beyond the current MVP.
- [Rendered design boards](../design/BOARDS.md): teacher and student screens, secondary forms, mobile journeys, Arabic RTL direction and a component/state sheet.
- [Editable wireframe index](#wireframe-index): all 34 named frames.
- [Feature coverage and flow](#design-coverage): original routes and their proposed destinations.
- [Figma setup](#design-kit-overview): create native editable frames and navigation links.
- [Verification report](../design/verification.json).
- Original functional HTML snapshots are in [reference/rafiqi-teacher.html](../design/reference/rafiqi-teacher.html) and [reference/rafiqi-student.html](../design/reference/rafiqi-student.html).

## What each asset is for

The PNG/SVG boards establish the visual direction. They contain generated example copy and can differ in navigation labels, numbers, illustrations or control details. The SVG wireframes and screens.json are the canonical structural specification. Use the source HTML as the reference for exact demo behavior.

The SVGs use separate text and vector elements. Direct SVG import behavior, including text conversion, depends on the receiving editor. The optional helper instead creates native Figma TextNodes and shapes with named sections.

The helper creates a new page containing 34 desktop wireframe frames and mapped navigation hotspots. It does not import the rendered artwork, create production AI services, implement form data entry, or run the HTML JavaScript. Forms and detailed action states are specifications, not a fully functional application. Existing HTML files have not been redesigned or modified.

Mobile and Arabic RTL coverage currently consists of visual reference boards, not a complete set of translated responsive frames. The Arabic board requires copy review; generated scientific graphics are illustrative, and the displayed F = -F shorthand should be replaced with properly indexed force vectors in final teaching content.

## Design decisions

- Organize teaching around Before class → During class → After class.
- Organize student learning around Before → During → Review → Homework.
- Keep the next action prominent on Today.
- Keep curriculum, lesson, learner, material and conversation context visible.
- Place messages, rooms and Development Club under Connect.
- Use orange for primary emphasis, pale peach for selected surfaces, lavender for assistant content, and sage for positive status.
- Preserve access to secondary functionality through explicit screens and dialogs.

## Validation and remaining assembly

All 21 original data-s routes have at least one matching wireframe. All SVGs render; geometry and navigation targets were checked. The Figma helper passed a JavaScript syntax check and simulated API execution. It has not been run in a real Figma file, because the session's Figma tools and browser control were unavailable. This is not a verified live Figma deliverable.

For the final high-fidelity Figma file, apply the image direction to these wireframes, standardize icons and copy, build reusable auto-layout components, and wire detailed input/feedback variants. The static boards are not evidence that every original JavaScript interaction has been reproduced.

---

<a id="design-coverage"></a>

## Design coverage

_Source: `design/COVERAGE.md`_

# Functionality coverage and user flows

## Verified route coverage

| Role | Original route | Wireframe(s) | Functionality represented |
| --- | --- | --- | --- |
| Teacher | today | T01 T02 T15 T16 | Attention queues, schedule views, date picker, recurring classes, tasks, priorities, subtasks, ordering |
| Teacher | lesson | T03 T04 T05 T18 | Objectives, Socratic prep, materials, lesson flow, checks, presentation, live questions, notes, observation demo, analytics, homework approval, learner support |
| Teacher | dash | T06 | Date/class/student filters, metrics, trends, chart/table, mastery and reports |
| Teacher | messages | T10 T17 | Student/parent conversations, drafts/replies, calls, groups and rooms |
| Teacher | club | T12 | Submit ideas/suggestions, filters, status changes |
| Teacher | cave | T11 | Assistant conversation, attachment, editable teaching model, model discussion |
| Teacher | smap | T07 | Subject/chapter/lesson hierarchy, lesson details, questions and materials |
| Teacher | library | T08 T14 | Type filters, targeting, previews, six material types, add/edit/delete, required/optional |
| Teacher | students | T09 | Roster, learner profile, model, progress and follow-up |
| Teacher | courses | T13 | Catalog, details and enrollment request |
| Student | home | S01 | Next class, warm-up, continue study, homework and progress entry points |
| Student | prime | S04 | Warm-up choices, guided feedback and follow-up |
| Student | map | S02 S14 | Curriculum hierarchy, schedule views, date picker, personal recurring events and deletion |
| Student | lesson | S03 | Representations, class notes, materials and summaries |
| Student | hw | S08 | Hints, answer, validation and feedback |
| Student | teach | S11 S16 | Assistant, attachment, learner-model editing/discussion |
| Student | study | S05 S06 S07 | Lesson selectors, four phases, conversations, teacher questions, notes, highlights, summary download |
| Student | rooms | S09 S15 | Conversations, send, room setup, live/scheduled entry points |
| Student | res | S10 | Contextual recommended resources |
| Student | club | S13 | Idea types, posting, anonymous option, filters and votes |
| Student | prog | S12 | Mastery, learning-loop balance, corrected misconceptions, curiosity, homework trend, consistency and next steps |

## Teacher core flow

T01 Today → T03 Prepare lesson → T04 During class → T05 Review → T18 Homework/parent follow-up.

Supporting loops: T07 Curriculum → T03 Lesson; T08 Library ↔ T14 Material editor; T05 Review → T09 Student → T10 Conversation; T06 Insights → T09 Student; T01 Schedule → T02 Calendar → T16 Add class; T01 Tasks → T15 Task editor; T10 Connect → T17 Groups/rooms or T12 Development Club.

## Student core flow

S01 Today → S04 Warm-up → S05 Before class → S06 During class → S07 Review → S08 Homework → S12 Progress.

Supporting loops: S02 Map → S03 Lesson → S05 Study Cave; S02 Schedule → S14 Event; S09 Connect → S15 Room or S13 Development Club; S11 My Rafiqi → S16 Edit model; S10 Resources → S03 Lesson.

## State behavior to preserve during implementation

- Forms: empty, filled, invalid, saved, cancelled.
- Lists: search/filter, no results, selection, expansion and deletion confirmation.
- Tasks: priority, complete/incomplete, subtask edits and reordering.
- Calendar: day/week/month, selected date, single/recurring events, occurrence preview.
- Study: selected lesson, phase context, locked future stages, progressive hints, submitted answer, feedback.
- Materials: six type-dependent field sets, target lesson, required/optional, preview and completion.
- Communication: selected conversation, editable AI draft, send state, group membership, room options.
- Reports: subject/date/student context, selected metric, chart/table, individual report.
- Community: idea type, filter, vote/unvote for students and status change for teachers.
- Models: displayed model, edit/cancel/save, model discussion and attachments.

## Approved MVP additions - C1/C2 live-session UI

**Decision (2026-09-13):** the student and teacher session lifecycle is approved for implementation within the existing Study Cave and teacher lesson flows. It does not introduce a separate app shell or backend behavior.

- **Student:** the existing During-class tab first shows a join card, then a joining state, connected banner, reconnecting/failed recovery states, and a locked completion state.
- **Teacher:** the existing During tab first shows a lobby/start card, then connected, reconnecting/failed, end-class confirmation, and locked completion states.
- **Responsive/localization:** these states use the existing responsive shell and English LTR/Arabic RTL message files.
- **Current boundary:** state transitions are frontend-only demo state; joining, presence, reconnection, and the session lock are not persisted or synchronized.

The canonical visual references are now [Board 19 - T04 live-session states](../design/boards/19-mvp-live-session-lifecycle.md) and [Board 20 - S06 mobile Arabic RTL states](../design/boards/20-mvp-live-session-mobile-arabic.md). They explicitly extend—not replace—the existing structural references **T04** and **S06**.

## Proposed MVP additions - B2/B3/B6 lesson-preparation UI

**Design-first decision (2026-09-13):** [Board 21](../design/boards/21-t03-lesson-preparation-states.md) and [Board 22](../design/boards/22-t03-lesson-preparation-mobile-arabic.md) extend the existing **T03 Before class** page with proposed generation, draft review, editing, saving, failure, and warm-up-misconception states. They do not replace T03 or authorize backend behavior.

- **B2:** in-context generation progress, draft review, teacher approval, regeneration, and failure/retry.
- **B3:** inline edit/reorder, unsaved indicator, save/cancel, and discard confirmation.
- **B6:** privacy-safe ranked misconception summary, anonymized evidence, teaching suggestion, empty, processing, and failure direction.
- **Responsive/localization:** Board 22 sets mobile Arabic RTL direction; English desktop direction is in Board 21.
- **Standalone implementation references:** [Board 23](../design/boards/23-t03-generated-draft-review.md) for B2 draft review, [Board 24](../design/boards/24-t03-edit-lesson-preparation.md) for B3 edit/save, and [Board 25](../design/boards/25-t03-warmup-misconceptions.md) for B6 insights.

## Approved MVP additions - B5/B7 student pre-class UI

**Decision (2026-09-13):** [Board 26](../design/boards/26-s04-warmup-submitted.md), [Board 27](../design/boards/27-s05-question-sent.md), and [Board 28](../design/boards/28-s04-s05-mobile-arabic-states.md) are approved for frontend-only implementation. They extend, rather than replace, the existing **S04 Warm-up** and **S05 Before class** structures.

- **B5:** local answer selection, checking, guided correct/retry feedback, saved state, question progress, final completed/locked state, and Continue to Study Cave.
- **B7:** local question compose, sending, sent/pending/failure-retry, empty, local draft edit/delete, and class-start locked states inside the existing questions-for-class card.
- **Boundary:** no real delivery, teacher inbox, answer lifecycle, backend, authentication, API, realtime behavior, or persistence is authorized.
- **Responsive/localization:** Board 28 supplies the Arabic mobile RTL direction; English desktop uses Boards 26 and 27.

## Approved MVP addition - A2/A3/A5/A6 first-open profile onboarding

**Decision (2026-09-14):** [Board 29](../design/boards/29-s11-first-open-profile.md) is approved for the first time a student opens the existing **S11 My Rafiqi** workspace. It extends, rather than replaces, S11 and S16; a student is not sent to a separate profile form or onboarding route.

- **A2:** Rafiqi gets to know the student in a short voluntary chat about what they enjoy, what they prefer to avoid, and how they prefer learning.
- **A3/A6:** the adjacent learner-model cards update visibly from those messages. Every profile item is marked **Confident** or **Still forming**, so the update is transparent rather than silent.
- **A5:** Edit, Save, Cancel, Not quite me?, and Discuss with Rafiqi remain available after onboarding.
- **Responsive/localization:** the existing desktop two-column workspace stays intact; mobile stacks the cards; Arabic uses the RTL shell, logical spacing, and reviewed labels shown in Board 29.
- **Boundary:** this approval covers the frontend-only demo state. A1 data persistence, production inference, cross-device history, teacher/guardian visibility, and A8 privacy-governed storage are not authorized by this board.

## Superseded A2/A3 onboarding welcome revision

[Board 30](../design/boards/30-s11-onboarding-welcome-concept.md) and its [mobile Arabic companion](../design/boards/31-s11-onboarding-mobile-arabic.md) propose inserting a clear welcome state before the first question, with a persistent Skip action and an explanation of how answers update the learner profile. This proposal keeps the existing S11 route, two-column desktop relationship, three questions, certainty labels, and correction controls.

This proposal was superseded by Board 32 after the requirement was clarified as a standalone first-login screen. Board 29 and the current frontend remain authoritative until the replacement is approved.
## Provisional A2/A3 first-login onboarding

[Board 32](../design/boards/32-first-login-onboarding.md) and its [mobile Arabic companion](../design/boards/33-first-login-onboarding-mobile-arabic.md) propose a focused onboarding screen immediately after a student's first successful login and before Student Today. The student may answer three voluntary questions or skip, then enters the existing student experience. This supersedes the proposed in-workspace welcome direction in Boards 30 and 31.

The user selected [Board 34](../design/boards/34-first-login-onboarding-selected.md) as the professional visual direction on 2026-09-14. Frontend routing, the interactive bilingual question flow, a per-student browser completion marker, and the existing session-only profile demonstration are approved. Server persistence, production inference, and data sharing remain out of scope.
## Limits of this check

This table verifies screen-level representation and documents interaction families. It does not assert that each source handler has a working Figma equivalent. The full original function and inline-action inventory is included as source-interactions.json.

The original HTML is the executable reference. AI, camera observations, messages and calendars are demo behaviors in that source. Native Figma imports contain navigation connections; form submission, state mutation, uploads, downloads and services still require prototype state work or application code.

---

<a id="wireframe-index"></a>

## Wireframe index

_Source: `design/WIREFRAMES.md`_

# Rafiqi wireframes

34 editable SVG screens and supporting states. For native text layers and linked frames, use the Figma import helper.

| ID | Role | Screen | Source route |
| --- | --- | --- | --- |
| T01 | teacher | [Today](../design/wireframes/T01.svg) | today |
| T02 | teacher | [Schedule](../design/wireframes/T02.svg) | today |
| T03 | teacher | [Newton’s Third Law](../design/wireframes/T03.svg) | lesson |
| T04 | teacher | [Teach the lesson](../design/wireframes/T04.svg) | lesson |
| T05 | teacher | [Review and follow up](../design/wireframes/T05.svg) | lesson |
| T06 | teacher | [Insights](../design/wireframes/T06.svg) | dash |
| T07 | teacher | [Curriculum map](../design/wireframes/T07.svg) | smap |
| T08 | teacher | [Resources library](../design/wireframes/T08.svg) | library |
| T09 | teacher | [Your students](../design/wireframes/T09.svg) | students |
| T10 | teacher | [Connect](../design/wireframes/T10.svg) | messages |
| T11 | teacher | [Rafiqi’s Cave](../design/wireframes/T11.svg) | cave |
| T12 | teacher | [Development Club](../design/wireframes/T12.svg) | club |
| T13 | teacher | [Professional learning](../design/wireframes/T13.svg) | courses |
| T14 | teacher | [Add or edit material](../design/wireframes/T14.svg) | library |
| T15 | teacher | [Add or edit task](../design/wireframes/T15.svg) | today |
| T16 | teacher | [Add a class](../design/wireframes/T16.svg) | today |
| T17 | teacher | [Groups and study rooms](../design/wireframes/T17.svg) | messages |
| T18 | teacher | [Lesson follow-up](../design/wireframes/T18.svg) | lesson |
| S01 | student | [Today](../design/wireframes/S01.svg) | home |
| S02 | student | [Learning map and schedule](../design/wireframes/S02.svg) | map |
| S03 | student | [Newton’s Third Law](../design/wireframes/S03.svg) | lesson |
| S04 | student | [Ask Rafiqi · Warm-up](../design/wireframes/S04.svg) | prime |
| S05 | student | [Study Cave · Before class](../design/wireframes/S05.svg) | study |
| S06 | student | [Study Cave · During class](../design/wireframes/S06.svg) | study |
| S07 | student | [Study Cave · After class](../design/wireframes/S07.svg) | study |
| S08 | student | [Homework · Action & Reaction](../design/wireframes/S08.svg) | hw |
| S09 | student | [Companions](../design/wireframes/S09.svg) | rooms |
| S10 | student | [Resources](../design/wireframes/S10.svg) | res |
| S11 | student | [Rafiqi’s Cave](../design/wireframes/S11.svg) | teach |
| S12 | student | [My progress](../design/wireframes/S12.svg) | prog |
| S13 | student | [Development Club](../design/wireframes/S13.svg) | club |
| S14 | student | [Add your own event](../design/wireframes/S14.svg) | map |
| S15 | student | [Open a study room](../design/wireframes/S15.svg) | rooms |
| S16 | student | [Edit how Rafiqi understands you](../design/wireframes/S16.svg) | teach |

## Approved state extensions

- [Board 29 — S11 first-open profile onboarding](../design/boards/29-s11-first-open-profile.md) extends S11 and S16 with a voluntary first-time conversation, live learner-profile updates, **Confident** / **Still forming** labels, correction controls, and a mobile Arabic RTL direction. It does not replace the canonical S11/S16 wireframes.

## Proposed state extensions

- [Board 30 — S11 onboarding welcome concept](../design/boards/30-s11-onboarding-welcome-concept.md) proposes a dedicated welcome state with a persistent Skip action before the A2 questions begin. [Board 31](../design/boards/31-s11-onboarding-mobile-arabic.md) supplies the companion mobile Arabic RTL direction. Neither board changes the canonical or currently approved S11/S16 reference until design approval.

- [Board 32 — First-login student onboarding](../design/boards/32-first-login-onboarding.md) supersedes the proposed Boards 30/31 direction. It moves the voluntary A2/A3 conversation to a focused screen immediately after first login, before the student shell. [Board 33](../design/boards/33-first-login-onboarding-mobile-arabic.md) supplies the provisional mobile Arabic RTL direction. Implementation still requires approval.

---

<a id="product-description-and-user-stories"></a>

## Product description and user stories

_Source: `PRODUCT_DESCRIPTION_AND_USER_STORIES.md`_

# Rafiqi — Product Description and User Stories

> **Current MVP scope:** [Rafiqi MVP Plan — Simple Tickets](#mvp-simple-tickets) is the authoritative plan for the current release. It limits delivery to Student Profile, Pre-Class, and During-Class; this document remains the wider product specification and reference.

## 1. Product summary

Rafiqi is a bilingual school learning platform that connects the daily work of teachers and students around one shared learning journey. It helps teachers prepare lessons, support students during class, review learning afterward, assign appropriate follow-up work, and communicate with students and parents. It helps students prepare before class, participate during class, review afterward, complete guided homework, understand their progress, and ask for help in context.

The product is organized around a recurring learning loop:

1. **Before class:** the teacher prepares the lesson and the student completes a short warm-up.
2. **During class:** the teacher delivers the lesson while questions, notes, and engagement signals remain connected to that lesson. The student takes notes and asks questions.
3. **After class:** the teacher reviews understanding and plans follow-up. The student receives a structured lesson summary.
4. **Homework and growth:** the student completes tailored practice with progressive support. The teacher reviews outcomes and both users see progress over time.

Rafiqi acts as a contextual assistant throughout this loop. Its responses should be grounded in the selected grade, subject, chapter, lesson, learning materials, and the learner or teacher profile. The assistant supports human decisions; it does not silently assign work, send messages, change grades, or alter a user profile. Transparent learner-profile updates from conversation are allowed only when they are visibly labeled by certainty and can be corrected by the student.

## 2. Product vision

Rafiqi should make every school day feel understandable and actionable. A teacher should know what needs attention, what the next class requires, and which students need support. A student should know what comes next, why it matters, and where to get help without losing the context of the lesson.

The product should reduce administrative friction while strengthening the relationship among teachers, students, and families. It should encourage reflection, curiosity, and steady improvement instead of using grades as the only measure of progress.

## 3. Product goals

- Give teachers one coherent workspace for planning, teaching, reviewing, and following up.
- Give students one clear path through preparation, learning, review, and practice.
- Keep curriculum, materials, questions, notes, assignments, conversations, and progress connected to the relevant lesson.
- Surface the next useful action without hiding the broader learning journey.
- Personalize support while keeping teachers and students in control of important decisions.
- Support English and Arabic, including complete right-to-left layouts.
- Work across desktop and mobile with accessible, age-appropriate interaction patterns.

## 4. Non-goals for the current prototype

- The current HTML does not prove production AI, messaging, calling, file storage, calendar synchronization, analytics, or camera-analysis services.
- Generated recommendations, engagement data, and assistant replies in the prototype are sample behavior.
- The prototype is not a student information system, learning management system, or gradebook replacement unless those integrations are added later.
- Figma interactions demonstrate navigation and states; they do not provide data persistence or execute application logic.

## 5. Primary users

### Teacher

A teacher manages several classes and needs to prepare lessons, organize materials, respond to student needs, communicate with families, and understand class progress. The teacher needs speed, context, control, and confidence that AI suggestions remain editable.

### Student

A student needs a simple view of the school day, a clear learning path, explanations in a suitable format, safe access to help, and progress feedback that encourages improvement. The experience should avoid unnecessary complexity and public comparison.

### Parent or guardian

A parent is a communication participant rather than a full product workspace in the current scope. Parents receive and reply to teacher messages and may receive learning-support notes concerning their child.

### School or training team

This is an implied supporting role. A school team may manage curricula, classes, permissions, moderation, professional-learning courses, and safeguarding policies. Administrative screens are outside the current UI scope but are required for a production deployment.

## 6. Experience principles

1. **The next action is obvious.** Today screens lead with the next class, warm-up, lesson, review, or assignment.
2. **Context travels with the user.** Grade, subject, chapter, lesson, and student context remain visible when moving between related tools.
3. **One learning loop.** Preparation, class activity, review, homework, and progress are connected stages rather than separate products.
4. **AI is visible and controllable.** Generated content is labeled, editable, reviewable, and never sent or assigned without a user action.
5. **Progress is supportive.** The product highlights growth, consistency, resolved misconceptions, and curiosity alongside grades.
6. **Communication is safe.** Student, teacher, parent, group, and study-room communication is moderated according to school policy.
7. **Bilingual by design.** Arabic is a full RTL experience rather than translated text placed in an LTR layout.
8. **Accessible by default.** Keyboard access, readable contrast, clear focus states, meaningful labels, touch targets, and alternatives to color are required.

## 7. Information architecture

### Teacher navigation

- **Today:** priorities, attention queue, schedule, tasks, and quick actions.
- **Teaching:** curriculum map and Before/During/After lesson workspace.
- **Students:** roster, individual profiles, learning preferences, progress, and notes.
- **Resources:** searchable library and material creation.
- **Connect:** student and parent messages, groups, study rooms, and Development Club.
- **Insights:** class and student performance, engagement, attendance, and trends.
- **Rafiqi:** assistant conversation and editable teacher model.
- **Courses:** professional-learning catalog and enrollment.

### Student navigation

- **Today:** next class, warm-up, current lesson, due work, schedule, and progress snapshot.
- **Learn:** curriculum map, lesson content, and Study Cave stages.
- **Homework:** tailored assignments, hints, answers, and feedback.
- **My progress:** mastery, consistency, curiosity, misconceptions resolved, and next steps.
- **Resources:** lesson-specific articles, videos, diagrams, files, and practice.
- **Connect:** teacher messages, study rooms, and Development Club.
- **My Rafiqi:** assistant conversation and editable learner model.

## 8. Core end-to-end journeys

### Teacher lesson journey

The teacher opens Today, sees the next class and outstanding work, enters the lesson workspace, reviews or generates preparation material, teaches with lesson-linked questions and notes, opens the after-class review, approves or adjusts homework, identifies students who need support, and optionally sends a parent note.

Wireframe path: **T01 → T03 → T04 → T05 → T18**.

### Student lesson journey

The student opens Today, completes the warm-up, enters Study Cave before class, takes notes and asks questions during class, reviews the generated lesson summary, completes homework with progressive hints, and sees the result reflected in progress.

Wireframe path: **S01 → S04 → S05 → S06 → S07 → S08 → S12**.

### Curriculum-to-resource journey

The teacher selects a lesson from the curriculum, opens its workspace, attaches existing resources or creates a new targeted material, and marks it required or optional. The student later sees that material under the same lesson and can mark it complete.

Wireframe path: **T07 → T03 → T08/T14 → S03/S10**.

### Support and communication journey

After reviewing a lesson or report, the teacher opens a student profile, records a note, starts a conversation with the student or parent, or creates a guided study room. The student can reply, enter a room, or set a reminder.

Wireframe path: **T05/T06 → T09 → T10/T17 → S09/S15**.

## 9. Teacher user stories

### Epic T-A — Today and attention management

#### T-US-01 — See the teaching day

**As a teacher, I want to see my next class, schedule, outstanding actions, and tasks when I sign in, so that I can decide what to do first.**

Acceptance criteria:

- Today identifies the next class with grade, subject, lesson, time, location, and preparation status.
- Attention items show a count, reason, and direct action.
- The schedule distinguishes the current or next class from other events.
- Tasks show completion and priority without requiring another page.
- Empty sections provide a useful action instead of a blank panel.

#### T-US-02 — Manage personal tasks

**As a teacher, I want to create and organize lesson-related tasks and subtasks, so that preparation and follow-up work remain manageable.**

Acceptance criteria:

- A task supports a title, priority, start date, deadline, grade, subject, lesson, and subtasks.
- The teacher can create, edit, complete, reopen, expand, collapse, and reorder tasks.
- Removing a subtask does not remove its parent task.
- Required fields show inline validation.
- Saving updates the task list and provides success feedback; cancelling discards unsaved edits.

#### T-US-03 — View the calendar

**As a teacher, I want day, week, and month calendar views, so that I can understand teaching commitments at different levels of detail.**

Acceptance criteria:

- The selected date remains consistent when changing views.
- Previous, next, today, and date-picker controls update the calendar.
- Selecting a class opens a contextual detail panel.
- Overlapping events remain distinguishable and accessible.
- An empty date offers an Add class action.

#### T-US-04 — Add a single or recurring class

**As a teacher, I want to schedule one class or a recurring series, so that my teaching calendar represents the academic timetable.**

Acceptance criteria:

- The form accepts class, date, start time, and duration.
- Weekly recurrence supports selected weekdays and an end date.
- A preview lists occurrences before confirmation.
- Invalid or incomplete recurrence rules cannot be saved.
- Confirming adds the sessions; cancelling makes no changes.

### Epic T-B — Curriculum and lesson preparation

#### T-US-05 — Navigate the curriculum

**As a teacher, I want to expand subjects and chapters and select a lesson, so that I can work from the curriculum structure I already use.**

Acceptance criteria:

- Subjects contain chapters and chapters contain ordered lessons.
- Lessons display an understandable status such as completed, current, available, or locked.
- Selecting a lesson shows objectives, questions, materials, and available results.
- The selected grade, subject, chapter, and lesson persist when opening the lesson workspace.

#### T-US-06 — Define lesson objectives

**As a teacher, I want to create, generate, edit, reorder, complete, and remove lesson objectives, so that the lesson has a clear learning purpose.**

Acceptance criteria:

- A lesson contains an overall goal and a list of observable objective points.
- AI-generated objectives are visibly labeled and editable before saving.
- The teacher can add, edit, remove, and mark objective points.
- Changes stay connected to the selected lesson.

#### T-US-07 — Prepare Socratic questions

**As a teacher, I want to prepare and enable warm-up questions, so that students arrive with their prior thinking activated.**

Acceptance criteria:

- Questions can be generated, added, edited, removed, reordered, and enabled or disabled.
- Generated questions are not published until the teacher confirms them.
- The student warm-up uses only published questions for the selected lesson.
- The teacher can distinguish active questions from drafts.

#### T-US-08 — Build a lesson flow

**As a teacher, I want to organize lesson activities into timed segments, so that I can deliver a coherent class within the available time.**

Acceptance criteria:

- Each segment has a title, duration, description, and order.
- The total duration is visible and compared with the class duration.
- Segments can be generated, added, edited, removed, and reordered.
- A warning appears when the planned duration exceeds the class period.

#### T-US-09 — Prepare checks for understanding

**As a teacher, I want to add questions that check understanding during or after the lesson, so that I can identify misconceptions early.**

Acceptance criteria:

- Checks can be generated, created, edited, removed, and linked to an objective.
- The teacher can choose when each check appears.
- Results remain associated with the question and lesson.

#### T-US-10 — Attach lesson materials

**As a teacher, I want to attach required and optional materials from my library, so that students receive the right preparation and support.**

Acceptance criteria:

- The material picker can search and filter the library.
- Selected materials show type, name, requirement status, and lesson target.
- The teacher can add or remove materials without leaving the lesson context.
- Required and optional status is visible to students.

#### T-US-11 — Create a presentation from preparation

**As a teacher, I want to create a presentation draft from objectives, activities, checks, and materials, so that lesson preparation can become a usable classroom resource.**

Acceptance criteria:

- The action clearly describes which lesson information will be used.
- The teacher reviews the generated result before use or download.
- Generation status includes processing, success, and failure states.
- The generated presentation remains editable or replaceable.

### Epic T-C — During-class support

#### T-US-12 — Review incoming student questions

**As a teacher, I want lesson questions grouped by theme and status, so that I can address common confusion efficiently.**

Acceptance criteria:

- Questions show author or anonymous status, time, theme, and resolution state.
- Similar questions can be grouped without losing the original entries.
- The teacher can open a group and mark individual or all questions answered.
- Students receive an appropriate resolved state or teacher answer.

#### T-US-13 — Record lesson notes and focus points

**As a teacher, I want to capture notes and highlight important points during class, so that review and follow-up reflect what actually happened.**

Acceptance criteria:

- Notes autosave or expose a clear Save action and status.
- Focus points can be added to the lesson record.
- Notes remain private unless the teacher explicitly shares them.
- Highlighted points can be reused in the after-class summary.

#### T-US-14 — Use classroom observation controls

**As a teacher, I want to explore classroom and teacher observation views, so that I can review lesson delivery signals where school policy permits it.**

Acceptance criteria:

- Observation is explicitly labeled as a demo until a real service exists.
- Playback supports play, pause, and seek.
- Classroom and teacher views, overlays, and metrics can be toggled.
- The UI explains the data source and confidence when production analytics exist.
- Access, consent, retention, and safeguarding must be defined before real student data is processed.

### Epic T-D — Review, homework, and insight

#### T-US-15 — Review a completed lesson

**As a teacher, I want a concise after-class view of participation, engagement, rhythm, questions, and notes, so that I can decide what to reinforce.**

Acceptance criteria:

- The review distinguishes observed data, student responses, and AI interpretation.
- The teacher can switch between student and teacher perspectives.
- Recommendations link to the evidence that produced them.
- The teacher can add or edit a follow-up note.

#### T-US-16 — Approve tailored homework

**As a teacher, I want to review and adjust suggested homework for each student, so that practice is appropriate and remains under my control.**

Acceptance criteria:

- Each student row shows recent performance, the suggested tier, and the proposed assignment.
- The teacher can adjust, approve individually, or approve all after review.
- Assignments are not sent before confirmation.
- Students receive due date, instructions, support options, and assignment status.

#### T-US-17 — Identify struggling students

**As a teacher, I want to see misconceptions and students needing support, so that I can intervene before gaps grow.**

Acceptance criteria:

- Each signal names the lesson, evidence, date range, and affected students.
- The teacher can open the relevant student profile or question group.
- A low-confidence signal is clearly presented as uncertain.
- The teacher can dismiss, resolve, or create a follow-up action.

#### T-US-18 — Analyze class and student progress

**As a teacher, I want to filter reports by subject, class, date range, and student, so that I can understand performance and plan support.**

Acceptance criteria:

- Reports include grade, engagement, attendance, mastery, and change over time where data exists.
- Filters update all related metrics and visuals consistently.
- Chart and table views expose equivalent information.
- The teacher can open an individual student report from a class report.
- Every metric includes a definition and accessible text equivalent.

### Epic T-E — Students, resources, and communication

#### T-US-19 — Understand an individual learner

**As a teacher, I want a learner profile containing progress, preferences, strengths, misconceptions, and notes, so that I can adapt support.**

Acceptance criteria:

- The profile identifies which information is observed, self-reported, teacher-entered, or inferred.
- The teacher can filter progress by relevant period or subject.
- Sensitive notes follow role-based visibility rules.
- The teacher can open a conversation or add a follow-up action.

#### T-US-20 — Manage the resource library

**As a teacher, I want to find, preview, create, edit, target, and remove materials, so that reusable content remains organized.**

Acceptance criteria:

- Search and filters cover type, grade, subject, chapter, and lesson.
- Supported types are question, article, link, image, video, and file.
- Type selection exposes only relevant fields.
- A material can be required or optional and assigned to an audience.
- Deletion requires confirmation and explains its impact.

#### T-US-21 — Message students and parents

**As a teacher, I want separate student, parent, and group conversations, so that I can communicate in the correct context.**

Acceptance criteria:

- Conversations can be searched and filtered by participant type.
- The selected conversation clearly shows participant identity and context.
- The teacher can write, attach, send, and see delivery state.
- An AI draft is editable and cannot be sent without teacher confirmation.
- Communication is logged and governed by school policy.

#### T-US-22 — Create groups and study rooms

**As a teacher, I want to select students and create a group or guided room, so that learners can receive collaborative support.**

Acceptance criteria:

- The teacher can name a group, search students, select members, and review the final membership.
- A room supports topic, lesson context, participants, schedule, and guidance settings.
- Live and scheduled rooms show different actions.
- A teacher can join, monitor, edit, or close rooms according to permissions.

#### T-US-23 — Use Rafiqi as a teaching assistant

**As a teacher, I want to discuss a lesson with Rafiqi and attach materials, so that I can generate ideas grounded in my teaching context.**

Acceptance criteria:

- The assistant shows the active grade, subject, lesson, or student context.
- The teacher can send text and permitted attachments.
- Responses identify generated suggestions and never impersonate a human message.
- The teacher can convert a useful suggestion into an objective, task, question, or material only through an explicit action.

#### T-US-24 — Correct the teacher model

**As a teacher, I want to view, edit, and discuss what Rafiqi understands about my teaching, so that personalization remains accurate and transparent.**

Acceptance criteria:

- The model separates teaching style, strengths, preferences, and goals.
- The teacher can edit, cancel, save, and discuss each part.
- The product records the source and update date where appropriate.
- The teacher can request correction or deletion according to privacy policy.

#### T-US-25 — Participate in Development Club

**As a teacher, I want to submit ideas and manage their status, so that improvements can move from suggestions to action.**

Acceptance criteria:

- Ideas support type, title, description, author, date, and status.
- The feed can be filtered by suggestion or big idea.
- Authorized teachers can move ideas through defined statuses.
- Status changes remain visible to contributors.

#### T-US-26 — Explore professional learning

**As a teacher, I want to explore course details and request enrollment, so that I can develop my teaching practice.**

Acceptance criteria:

- Course cards show title, topic, duration, delivery format, and availability.
- Details include overview, outcomes, syllabus, and instructor information.
- Enrollment requires confirmation and displays the resulting status.

## 10. Student user stories

### Epic S-A — Today and learning path

#### S-US-01 — Know what to do next

**As a student, I want Today to show my next class, warm-up, current lesson, homework, schedule, and progress, so that I can begin without searching.**

Acceptance criteria:

- The next action is visually primary and opens in one step.
- Due work includes subject, task, due date, and status.
- The student can return to a lesson at the last relevant stage.
- The schedule and progress summaries link to full views.

#### S-US-02 — Explore the learning map

**As a student, I want to see subjects, chapters, lesson order, and completion state, so that I understand where I am in the curriculum.**

Acceptance criteria:

- Subjects and chapters can expand and collapse.
- Lesson states include completed, current, available, and locked with text labels.
- Selecting a lesson shows its purpose, materials, and next action.
- Locked content explains the requirement for access.

#### S-US-03 — Manage a personal schedule

**As a student, I want to view school events and add recurring personal study events, so that I can plan my learning time.**

Acceptance criteria:

- Day, week, and month views share the same selected date.
- The student can navigate dates and use a date picker.
- A personal event supports title, date, time, duration, recurrence, and end date.
- Recurrence is previewed before saving.
- Only personal events can be edited or deleted by the student.

### Epic S-B — Prepare and learn

#### S-US-04 — Complete a pre-class warm-up

**As a student, I want to answer a short lesson question and receive useful feedback, so that I activate prior knowledge before class.**

Acceptance criteria:

- The screen shows the lesson and progress through the warm-up.
- The student can select one response and change it before submitting.
- Feedback explains the idea rather than showing only correct or incorrect.
- The student can ask Rafiqi or send a question to the teacher.
- Unanswered, selected, correct, and needs-review states are represented.

#### S-US-05 — Choose a lesson representation

**As a student, I want to switch among explanation, diagram, and chart views, so that I can use the representation that helps me understand.**

Acceptance criteria:

- All representations communicate the same learning objective accurately.
- Switching representation retains the lesson and progress context.
- Diagrams have text alternatives and do not rely on color alone.
- The selected preference may inform the learner model only with transparent controls.

#### S-US-06 — Prepare in Study Cave

**As a student, I want a guided Before class stage with a goal, materials, warm-up, and questions, so that I arrive ready to learn.**

Acceptance criteria:

- Subject, chapter, and lesson selectors identify the active context.
- Required preparation items and completion state are visible.
- The student can discuss the idea with Rafiqi.
- Questions sent to the teacher remain attached to the lesson.
- Later stages show understandable locked or available states.

#### S-US-07 — Learn during class

**As a student, I want to take notes, ask questions, and receive contextual prompts during class, so that I can stay engaged and record my understanding.**

Acceptance criteria:

- Notes autosave or show a clear Save state.
- Questions show sent, pending, and answered states.
- Suggested highlights require student confirmation before entering personal notes.
- Assistant prompts remain secondary to the teacher and lesson.

#### S-US-08 — Review after class

**As a student, I want a structured summary of the lesson, my notes, questions, and materials, so that I can consolidate what I learned.**

Acceptance criteria:

- The summary covers objective, key points, lesson sequence, and self-check.
- Sections can expand and collapse without losing state.
- The student can review teacher answers and remaining questions.
- Materials show completion and can be opened.
- A downloadable summary includes the same essential information in an accessible format.

### Epic S-C — Homework and progress

#### S-US-09 — Complete guided homework

**As a student, I want to write an answer and request progressively stronger hints, so that I can solve the problem without immediately seeing the solution.**

Acceptance criteria:

- The task includes clear instructions, context, due date, and answer format.
- The student can request hints one level at a time.
- The full solution is not exposed before earlier support levels unless policy permits it.
- Empty or insufficient answers show specific validation.
- Submission feedback explains reasoning and offers a next action.

#### S-US-10 — Understand personal progress

**As a student, I want to see mastery, consistency, questions, homework growth, and misconceptions I resolved, so that I understand how I am improving.**

Acceptance criteria:

- Progress is personal and does not expose a public student ranking.
- Every visualization includes an understandable text summary.
- The page distinguishes completed work, mastery estimates, and motivational streaks.
- The next recommended action links to the relevant lesson or practice.
- The student can understand why Rafiqi made a recommendation.

### Epic S-D — Resources, communication, and agency

#### S-US-11 — Find relevant resources

**As a student, I want resources filtered around my current lesson, so that I can find useful support without browsing an entire library.**

Acceptance criteria:

- Resources show type, title, description, required or optional status, and completion.
- The student can open or download permitted resources.
- The active lesson context can be changed.
- Missing or inaccessible files show a useful recovery message.

#### S-US-12 — Message the teacher

**As a student, I want to message my teacher within the lesson context, so that I can ask for help safely.**

Acceptance criteria:

- The selected conversation clearly identifies the teacher or group.
- The student can send text and permitted attachments.
- Sent, delivered, and failed states are visible where supported.
- Moderation and school communication policies apply.

#### S-US-13 — Join or create a study room

**As a student, I want to enter a live room, set a reminder, or create an allowed study room, so that I can learn with others.**

Acceptance criteria:

- Live and scheduled rooms are visually distinct.
- Room information includes topic, lesson, host, participant limit, time, and moderation status.
- The student can enter live rooms and set or remove reminders for scheduled rooms.
- Room creation respects age, school, and teacher-moderation rules.

#### S-US-14 — Use My Rafiqi

**As a student, I want to ask Rafiqi for explanations and study support, so that I can continue learning when I am stuck.**

Acceptance criteria:

- The assistant uses the selected lesson context and age-appropriate language.
- The student can request explanations, examples, questions, and hints.
- The assistant avoids completing assessed work without supporting learning.
- Unsafe or unsupported requests follow school safeguarding and escalation policy.

#### S-US-15 — Correct the learner model

**As a student, I want to view and correct how Rafiqi describes the way I learn, so that personalization represents me fairly.**

Acceptance criteria:

- The model shows preferences, strengths, curiosity, and goals in understandable language.
- The student can edit, cancel, save, and discuss the model.
- Inferences are labeled and explainable.
- On first use, Rafiqi may ask a short, voluntary chat sequence about interests, dislikes, and how the student prefers learning; it must offer a skip path rather than a mandatory profile form.
- Every chat-derived item visibly states whether Rafiqi is **confident** or it is **still forming**, and the live update does not silently replace the student's view of themselves.
- A teacher or guardian view, if any, follows explicit permission rules.

#### S-US-16 — Contribute to Development Club

**As a student, I want to submit and vote on suggestions or big ideas, so that I can help improve school life.**

Acceptance criteria:

- The student can choose an idea type, enter a title and description, and optionally post anonymously where policy allows.
- The feed supports All, Suggestions, and Big ideas filters.
- Voting can be added and removed once per student.
- The student can see idea status without seeing private moderator information.
- Content is moderated and reportable.

## 11. Parent communication user stories

#### P-US-01 — Receive useful learning updates

**As a parent, I want clear messages about my child’s learning and practical support steps, so that I can help without needing specialist knowledge.**

Acceptance criteria:

- Messages identify the child, subject, lesson context, teacher, and date.
- Recommendations use plain language and concrete actions.
- Parents can reply through an authorized channel.
- Sensitive data is limited to what the parent is permitted to view.

#### P-US-02 — Distinguish teacher messages from generated drafts

**As a parent, I want all received communication to be clearly sent by the teacher, so that responsibility and authorship are unambiguous.**

Acceptance criteria:

- AI drafts are never delivered directly to a parent.
- The teacher reviews and sends the final message.
- The communication record identifies the human sender.

## 12. Shared system stories

### SYS-US-01 — Bilingual English and Arabic experience

**As a user, I want to switch between English and Arabic, so that I can use Rafiqi in my preferred language.**

Acceptance criteria:

- Language selection persists for the signed-in user.
- Arabic uses RTL layout, mirrored navigation, correct text alignment, and appropriate icon direction.
- Dates, numbers, names, scientific expressions, and mixed-language content render correctly.
- No screen contains untranslated interface strings in a released locale.

### SYS-US-02 — Responsive access

**As a user, I want core journeys to work on desktop and mobile, so that I can use Rafiqi where it is most convenient.**

Acceptance criteria:

- Core navigation, Today, lesson stages, homework, messages, and primary forms work at supported breakpoints.
- Mobile layouts use touch targets of an appropriate size and avoid horizontal scrolling.
- Essential actions are not hidden behind hover interactions.

### SYS-US-03 — Accessible interaction

**As a user with accessibility needs, I want Rafiqi to work with assistive technology and the keyboard, so that I can complete the same core tasks.**

Acceptance criteria:

- All controls have programmatic names, roles, values, and visible focus states.
- Keyboard order follows visual and logical order.
- Status never depends only on color or animation.
- Dialogs manage focus and provide an accessible close action.
- Charts, media, and learning diagrams include text alternatives.
- Text contrast and scaling meet the selected accessibility standard.

### SYS-US-04 — Safe failure and recovery

**As a user, I want clear processing, empty, error, offline, and retry states, so that I understand what happened and do not lose work.**

Acceptance criteria:

- Long operations show progress and can recover from failure.
- Draft text and form data are preserved when practical.
- Errors explain what the user can do next.
- Destructive actions use confirmation and name the affected item.
- Duplicate submissions are prevented.

### SYS-US-05 — Notifications

**As a user, I want relevant notifications that open the correct context, so that I can respond without searching.**

Acceptance criteria:

- Notifications identify the event, source, time, and destination.
- Opening a notification goes to the correct lesson, message, assignment, or room.
- Read/unread status and preferences are supported.
- Safeguarding or urgent school notices follow separate priority rules.

### SYS-US-06 — Privacy and permissions

**As a school user, I want data access to match my role, so that student information is handled responsibly.**

Acceptance criteria:

- Teachers see only authorized classes and students.
- Students see only their own private progress and permitted shared spaces.
- Parent access is limited to linked children and approved information.
- Sensitive actions are auditable.
- Retention, export, correction, and deletion rules are defined before production use.

## 13. Functional data model

The UI implies the following main records:

- User, role, language, profile, notification preferences, and permissions.
- School, academic year, grade, class, subject, chapter, lesson, and enrollment.
- Lesson objective, Socratic question, lesson segment, understanding check, and presentation.
- Resource, resource type, file or URL, curriculum target, requirement status, visibility, and completion.
- Calendar event, owner, class, date, time, duration, recurrence rule, and occurrence.
- Task, priority, dates, lesson context, completion, order, and subtasks.
- Student response, warm-up attempt, homework submission, hint level, feedback, and mastery evidence.
- Teacher note, student note, parent note, question, question group, and resolution.
- Conversation, participants, message, attachment, draft source, delivery state, and moderation record.
- Study room, topic, lesson, host, participants, schedule, status, and moderation settings.
- Progress indicator, evidence, value, date range, definition, and confidence.
- Teacher or learner model statement, source, confidence, visibility, and revision history.
- Development Club idea, type, author or anonymous flag, status, votes, comments, and moderation state.
- Professional-learning course, availability, syllabus, instructor, and enrollment request.

## 14. State requirements

Every applicable screen should specify:

- Initial loading and skeleton state.
- Populated default state.
- Empty state with an appropriate next action.
- Search with results and no results.
- Filtered state and Clear filters action.
- Selected and unselected items.
- Expanded and collapsed sections.
- Enabled, disabled, hover, focus, pressed, and keyboard states.
- Form empty, filled, invalid, submitting, saved, failed, cancelled, and unsaved-change states.
- Confirmation for destructive actions.
- Offline or unavailable-service state where network services are required.
- Permission-denied state when the user lacks access.

## 15. AI behavior requirements

- The active context and the sources used by the assistant should be visible where useful.
- AI-generated objectives, questions, flows, homework, summaries, drafts, recommendations, and model statements must be labeled.
- A user must review consequential generated content before publishing, assigning, or sending it.
- Users must be able to edit, reject, regenerate, or report generated content.
- The product must distinguish factual learning content from suggestions and inferences.
- The assistant must avoid exposing one student’s private data to another student.
- Age-appropriate safety, school escalation, and moderation behavior must be defined before production launch.
- Student learning support should encourage reasoning rather than provide hidden assessed answers immediately.

## 16. Analytics definitions requiring product decisions

Before implementation, the product team must define the source and meaning of:

- Mastery score and mastery bands.
- Engagement score and engagement index.
- Participation count.
- Attendance percentage.
- Attention distribution and classroom heatmap.
- Lesson rhythm and dead-time estimates.
- Misconception detection.
- Curiosity and consistency indicators.
- Homework tier recommendations.

Each metric requires a calculation method, evidence window, confidence treatment, user-facing explanation, and policy for correction. Metrics derived from camera, audio, or behavioral monitoring require a dedicated privacy and safeguarding review.

## 17. Suggested MVP scope

The first production release should prioritize the connected learning loop without unverified observation capabilities:

1. Authentication, roles, classes, curricula, and bilingual preferences.
2. Teacher Today, schedule, tasks, curriculum, and lesson preparation.
3. Student Today, learning map, warm-up, Study Cave, lesson summary, and homework.
4. Shared resource library and lesson targeting.
5. Lesson-linked student questions and teacher responses.
6. Teacher-approved homework suggestions and basic progress reporting.
7. Messages with clear permissions and moderation.
8. Editable teacher and learner personalization models.

Camera analysis, live calling, advanced engagement inference, presentation export, Development Club workflows, and professional-learning enrollment can follow when their operational and policy requirements are ready.

## 18. Product success measures

- Percentage of teachers who can prepare and publish a lesson without assistance.
- Median time from opening Today to completing the next priority action.
- Student warm-up completion before the relevant class.
- Percentage of lesson questions resolved by the teacher.
- Homework completion and resubmission after guided feedback.
- Resource completion for required materials.
- Teacher acceptance, edit, and rejection rates for AI suggestions.
- Student understanding of recommendations and progress indicators.
- Message-response time within school policy.
- Accessibility completion rate for core journeys.
- English and Arabic task-completion parity.

Success measures should be interpreted carefully and should not reward excessive notifications, surveillance, or artificial streak maintenance.

## 19. Dependencies and open decisions

- Identity, school, class, roster, and curriculum source.
- Ownership of timetable data and recurrence rules.
- Storage, antivirus scanning, access control, and retention for uploads.
- AI model, grounding sources, review rules, safety controls, and cost limits.
- Messaging provider, parent identity, delivery receipts, moderation, and audit history.
- Study-room audio/video provider and safeguarding requirements.
- Definition and governance of all analytics and learner-model inferences.
- Presentation and summary export format and accessibility.
- Arabic translation ownership, terminology, fonts, and mixed-direction content.
- Course catalog ownership and enrollment workflow.
- Development Club moderation, anonymity, voting, and status permissions.
- Legal basis, consent, retention, and security for minors’ data.

## 20. Design traceability

The current design package contains 34 wireframe frames that represent all 10 teacher routes and all 11 student routes found in the supplied HTML. The teacher frames are T01–T18 and the student frames are S01–S16. The visual boards include desktop direction, key secondary states, mobile concepts, Arabic RTL direction, and a component sheet.

This document treats the supplied HTML as the executable reference for demonstrated functionality. It treats the reference screenshots as visual inspiration and the generated design boards as design direction. When these sources disagree, production behavior should follow an approved product specification and acceptance criteria rather than inferred image content.

---

<a id="mvp-simple-tickets"></a>

## MVP simple tickets

_Source: `MVP_SIMPLE_TICKETS.md`_

# Rafiqi MVP Plan — Simple Tickets

## Scope

This MVP covers three connected areas for both teachers and students:

- Student Profile
- Pre-Class
- During-Class

Everything else shown in the current mockups is out of scope for this release. Each ticket below describes the outcome, intended user, and purpose. Foundation tickets are technical or governance prerequisites rather than user stories.

## Epic A — Student Profile

| ID | Ticket | User / type | Purpose |
| --- | --- | --- | --- |
| A1 | Profile data model | Foundation | Store a student's trait scores, written notes, teaching tips, and Rafiqi confidence for each item. This is the prerequisite for the rest of the epic. |
| A2 | Cave chat | Student | Chat with Rafiqi in **Rafiqi's Cave** so it can get to know the student without requiring a form. |
| A3 | Profile updates from chat | Student | Update the student's profile automatically from conversations, without manual entry. Mark each profile item as **confident** or **still forming** based on Rafiqi's certainty. |
| A4 | Show where a trait came from | Teacher | See the conversation that informed a profile trait when it appears incorrect, so the teacher can understand the inference. |
| A5 | “Not quite me?” correction | Student | Flag an inaccurate profile card and explain why, keeping the profile accurate. |
| A6 | “How Rafiqi sees you” | Student | See the personal profile update live during conversations, building trust and enabling early correction. |
| A7 | Class roster with profile cards | Teacher | See every student's profile in the roster to adapt teaching. Students who have not yet chatted must be clearly marked **new**, rather than appearing blank or broken. |
| A8 | Data privacy review | Foundation — early | Establish how minors' personal and behavioural data is stored and used before shipping. This constrains what A3 may save. |
| A9 | Teacher profile edits | Teacher — nice-to-have | Correct a profile field directly rather than waiting for Rafiqi to update it through chat. |

### A2/A3/A5/A6 frontend slice status (2026-09-14)

[Board 29 — S11 first-open profile onboarding](../design/boards/29-s11-first-open-profile.md) is approved and implemented as a local, bilingual My Rafiqi experience. On a first visit, Rafiqi asks what the student enjoys, what they prefer to avoid, and how they prefer learning. The profile updates visibly beside the chat and labels each item **Confident** or **Still forming**. The student can skip, edit, cancel, correct, or discuss the profile at any time.

The current implementation is deliberately a frontend-only, browser-session demo. It stores only the minimum profile display state for the active visit and does not create A1 persistence, authenticated per-student identity, AI inference, cross-device history, teacher/guardian visibility, or production data handling. A1 and A8 remain required before profile data can be stored or inferred in production.

### Selected first-login onboarding implementation (2026-09-14)

[Board 34 — Selected professional first-login onboarding](../design/boards/34-first-login-onboarding-selected.md) supersedes Board 29 as the first-login visual reference. Authenticated students now enter a focused bilingual onboarding route before Student Today, unless they previously completed or skipped it in the same browser. The three answers update the existing session-only My Rafiqi profile demonstration.

The browser stores only a versioned per-student completion marker. Personal answers remain session-only. Server persistence, cross-device history, production inference, and teacher/guardian access still require A1 and A8.

## Epic B — Pre-Class

| ID | Ticket | User / type | Purpose |
| --- | --- | --- | --- |
| B1 | Lesson-prep data model | Foundation | Store lesson objectives, flow, check questions, and materials. |
| B2 | Generate lesson prep with AI | Teacher | Generate a first draft of objectives, lesson flow, and check questions instead of starting from a blank page. |
| B3 | Edit generated prep | Teacher | Edit, reorder, or delete anything Rafiqi generated so the plan matches the teacher's intended lesson. |
| B4 | Attach materials | Teacher — nice-to-have | Attach files from the teacher's library to a lesson so required resources stay together. |
| B5 | Student warm-up (“Prime”) | Student | Complete a short prediction game before class to arrive already thinking about the topic. |
| B6 | Review class misconceptions | Teacher | See the most common incorrect warm-up answers before teaching, making misconceptions addressable in the plan. |
| B7 | Ask the teacher ahead of time | Student | Flag a question for the teacher while chatting with Rafiqi, so it is not lost before class. |
| B8 | Turn prep into slides | Teacher — nice-to-have | Generate a presentation from completed prep instead of rebuilding it in a slide tool. |

## Epic C — During Class

| ID | Ticket | User / type | Purpose |
| --- | --- | --- | --- |
| C1 | Start and join a class session | Teacher | Start a live session that students can join, creating one shared classroom room. |
| C2 | Live teacher–student connection | Foundation — early | Provide real-time synchronization for engagement, questions, and highlights between the teacher and every student in a session. This is a prerequisite for the remaining live-class work. |
| C3 | Live student activity | Teacher | See who is taking notes, asking questions, or disengaged in real time, so the teacher knows whom to check in with. |
| C4 | Group similar questions | Teacher | Group student questions by topic and rank them by volume, while preserving the ability to view who asked and how each question was phrased. |
| C5 | Push a “highlight this” | Teacher | Mark something important and have it appear immediately on every student's screen. |
| C6 | Student notes and questions | Student | Take notes and ask questions during class, creating a learning record and giving the teacher visibility into needed support. |
| C7 | Connect notes to questions | Student — nice-to-have | Have Rafiqi recognize when the student's own notes answer a previously asked question. |
| C8 | Freeze session data at class end | Foundation | Lock engagement and question data when a session ends, so it can safely feed later summaries and profile updates. |

### C1/C2 frontend slice status (2026-09-13)

The student Study Cave During-class UI is implemented as a local, bilingual demo layer above the existing S06 content. It includes ready, joining, connected, reconnecting, failed/retry, and locked states without backend, real-time synchronization, authentication, or persistence. The teacher session UI remains a separate frontend-only slice. C1/C2 still require their backend/realtime foundation before either experience can represent a shared class session.

## Suggested delivery order

1. Foundations: A1, A2, B1, C1, C2.
2. Complete the profile loop: A3 → A6 → A7.
3. Complete the pre-class loop: B2/B3 → B5 → B6/B7.
4. Complete the live-class loop: C3 → C4 → C5 → C6.
5. Do not defer: A5 and A8 (privacy review).
6. Nice-to-haves: A9, B4, B8, C7, C8.

## Relationship to the broader product specification

This plan is the authoritative scope for the current MVP. [Product Description and User Stories](#product-description-and-user-stories) remains the broader product reference; features outside the three MVP areas above are deferred unless explicitly added to this plan.

---

<a id="current-frontend-page-reference"></a>

## Current frontend page reference

_Source: `CURRENT_FRONTEND_PAGE_REFERENCE.md`_

# Rafiqi Current Frontend — Implemented Page Reference

## Scope and status

This document describes the frontend currently located at `Frontend/rafiky-frontend`. It distinguishes implemented pages from routes that are placeholders.

The current application preserves the original product idea—an AI-supported teacher/student learning loop—but uses a new design system, new information architecture, responsive navigation, and bilingual English/Arabic support.

## Technical and design foundation

- Next.js 16 App Router with React 19 and TypeScript.
- English and Arabic routes through `next-intl`, using `/en/...` and `/ar/...`.
- LTR English and RTL Arabic layouts.
- Separate teacher and student route groups with a shared application shell.
- Tailwind-based semantic styling and reusable shadcn-style primitives.
- Lucide icons and Next.js optimized images.
- Responsive desktop sidebar, tablet navigation rail, and mobile bottom navigation.
- Desktop content is constrained to readable maximum widths instead of stretching edge to edge.
- The new look uses cleaner spacing, flatter information hierarchy, semantic pastel surfaces, modern cards, consistent focus states, and accessibility labels.

## Shared application shell

### Desktop and tablet

- Sticky full-height sidebar.
- Rafiqi brand link returns to the role-specific Today page.
- Full navigation at extra-large widths and icon-only rail at medium widths.
- Active route highlighting.
- Search field filters all role navigation plus Settings, Help, and Schedule.
- Search results link directly to matching sections and include a no-results state.
- Utility links for Settings and Help.
- Language switch between English and Arabic.
- Notification and account controls.
- Skip-to-content accessibility link.

### Mobile

- Compact top header with brand, search, notifications, and profile/menu controls.
- Bottom navigation shows the first three role destinations plus a More menu.
- More contains remaining destinations and utilities.
- All directional icons mirror appropriately in RTL.

## Student first-login onboarding

- Route: `/[locale]/onboarding`, outside the regular student shell.
- Default successful student login destination; teachers continue to their Today page.
- Returning students with a local completion or skip marker continue to Student Today.
- Welcome, persistent Skip, three localized questions, optional suggestions, free text, progress, review, and completion states.
- Answers update the existing session-only My Rafiqi profile demonstration. The completion marker contains no answer content.
- English LTR and Arabic RTL share the same responsive hierarchy.
- Visual reference: [Board 34](../design/boards/34-first-login-onboarding-selected.md).


# Student frontend

## Student navigation

Today, Learn, Study Cave, Homework, Progress, Resources, Connect, and My Rafiqi, with Settings and Help as utilities.

## 1. Student Today — implemented

Route: `/[locale]/student/today`

The dashboard greets Ahmed, shows the date, and presents three priority cards:

- Next class: Grade 10 Physics and Newton's Third Law, with a Start warm-up action.
- Study Cave: current lesson, 60% progress bar, and Continue action.
- Seven-day streak: weekday markers and encouragement.

Below are:

- Homework list for Physics, Mathematics, and English, with details, due information, and View all.
- Today's schedule with five classes, times, room information, and current-class emphasis.
- View schedule action.
- Ask Rafiqi panel with prompt input, Send, and suggestion chips. Submitting redirects to My Rafiqi with the prompt in the URL.

## 2. Learn — implemented

Route: `/[locale]/student/learn`

The page contains:

- Learn heading and learning-journey description.
- Grade picker.
- Learning Map and Schedule view switch.
- Accordion list for Mathematics, Physics, Chemistry, Biology, and English.
- Expanded Physics chapter: Forces and Motion.
- Six lessons with lesson numbers, completion checks, current state, locks, content type, and estimated duration.
- Newton's Third Law is the current lesson and has an Open lesson button.
- A Your week schedule card beside the learning map.

Current limitation: `/student/learn/lesson` exists but returns no UI, so Open lesson leads to an unfinished route.

## 3. Student Schedule / Your week — implemented

Route: `/[locale]/student/schedule`

The same schedule component is used in Learn and as a full page. It supports:

- Day, Week, and Month selection.
- Previous and next date navigation across three sample days.
- Classes for Mathematics, Physics, English, Computer Science, and PE.
- Time, room, and current-class styling.
- Personal event card.
- Add personal event dialog with event name, time, and place.
- Edit and delete personal event actions.

Events currently use local component state and are not persisted to a backend.

## 4. Warm-up — implemented inside Study Cave

Canonical route: `/[locale]/student/study-cave`, Before class phase.

The warm-up now uses the same shared conversation component as My Rafiqi. Rafiqi proactively greets Ahmed before Physics class, wakes up his thinking without pressure, and asks the Newton's Third Law car/motorbike prediction inside the conversation.

It includes:

- A proactive Rafiqi wake-up message.
- The prediction as a conversational prompt.
- Three quick-answer choices displayed under the chat.
- Free-text input for explaining the student's own thinking.
- Conversational feedback explaining equal and opposite forces and the role of mass in acceleration.
- A message that the prediction has been saved for class.
- Full English and Arabic copy with RTL support.
- B5 local/demo answer states: selected, checking, supportive correct feedback, guided retry, saved, three-question progress, and completed/locked with a Continue to Study Cave action. These states do not persist answers or generate feedback through a service.

The Student Today warm-up card opens Study Cave directly. The legacy `/[locale]/student/learn/warm-up` URL redirects to Study Cave so there is one canonical warm-up experience.

## 5. Study Cave — implemented

Routes: `/[locale]/student/study-cave` and `/[locale]/student/learn/study-cave`

The page includes subject, chapter, and lesson selectors and four phase tabs: Before class, During class, After class, and Homework.

### Before class

- Today's goal and on-track status.
- Warm-up material checklist: short video, textbook section, real-life examples, and quick practice.
- Completion percentage calculated from checked items.
- My Rafiqi-style warm-up conversation that proactively wakes the student, asks a prediction, supports quick choices or free text, and responds with guidance.
- Questions-for-class compose and local/demo empty, sending, sent (with time and success feedback), pending, failed/retry, local-draft edit/delete, and class-start locked states. The card explicitly says it does not deliver to a teacher.

### During class

- A frontend-only session gate before the existing notes/questions layout: ready-to-join, joining, connected, reconnecting, failed, and locked states.
- Join class action and connected status banner; the existing notes, questions, and lesson-context UI appears after joining.
- The local UI demo accepts `?phase=during&session=ready|joining|connected|reconnecting|failed|locked` for reviewing each approved state; this query does not represent a real session or persisted state.
- Large editable class-notes area with example notes and autosaved label.
- Questions form and status list.
- What Rafiqi noticed card.
- Add-highlight-to-notes action.
- Matching notes card with key Newton's Third Law points and Add to my notes.
- Live lesson context identifying Mr. Adel and the current rocket example.
- Supportive suggestions for diagrams and other daily-life examples.

### After class and Homework

The tabs are selectable, but they currently reuse a generic phase layout rather than the richer original-prototype summaries. The generic layout includes editable notes, questions, noticed/matching/context cards, and phase-specific explanatory copy. The lock icons are visual; the implementation does not prevent opening these phases.

All edits and session-state transitions are client-side state and are not persisted or synchronized with a teacher.

### B5/B7 frontend-state decision (2026-09-13)

Boards 26–28 are approved as the frontend-only state specification for the Study Cave warm-up and questions-for-class cards. They extend the existing S04/S05 structures; they do not authorize backend delivery, a teacher inbox, AI feedback generation, authentication changes, realtime behavior, APIs, or persistence.

## 6. Homework — implemented

Route: `/[locale]/student/homework`

The guided homework experience has Question, Hints, and Review stages.

Question stage:

- Newton's Third Law car/motorbike problem.
- Progressive inline hints.
- Answer textarea.
- Check my answer, disabled until text is entered.
- Success result with the correct explanation.
- Rafiqi help card with a nudge input.
- 60% homework progress card.

Hints stage:

- Three separately revealable hints.
- Locked hint wording until selected.
- A companion reminder that Rafiqi helps without giving away the answer.

Review stage:

- Concise correct-answer summary.
- Guidance to return to the Question stage to revise or request another nudge.

Current limitation: any non-empty answer produces the success result; real answer assessment and persistence are not connected.

## 7. My Rafiqi — implemented

Route: `/[locale]/student/rafiqi`

The page uses a two-column companion workspace.

Conversation area:

- On a first visit, a short voluntary get-to-know-you chat asks what the student enjoys, what they prefer to avoid, and **How you prefer learning**. Quick-reply suggestions and Skip for now are available.
- Each onboarding answer visibly updates the learner-model card beside the chat; the returning state keeps the existing Newton's Third Law everyday-life conversation and PDF attachment display.
- Message input, response interaction, and Discuss with Rafiqi remain available.

Learner profile area:

- Course selector-style button for Grade 10 Physics.
- First-open cards: What you enjoy, What you would rather avoid, and How you prefer learning.
- Every profile card identifies Rafiqi's certainty as **Confident** or **Still forming**; an empty profile is intentionally shown as still forming, not blank or pre-filled.
- Student-learning illustration.
- Goals are explicitly still forming until the student discusses them.
- Edit, Save, Cancel, Not quite me?, and Discuss with Rafiqi controls.

The design keeps the original living learner-model idea but presents fewer, more focused profile cards. Board 29 extends S11/S16 with the first-open flow, desktop two-column layout, and mobile Arabic RTL direction.

Current limitation: this is a frontend-only browser-session demonstration. It has no A1 data model, account-level persistence, production AI inference, cross-device history, teacher/guardian visibility, or privacy-governed storage. A1 and A8 remain prerequisites for production profile updates.

## 8. Progress — coming-soon page

Route: `/[locale]/student/progress`

Displays a localized This space is almost ready state, with Back to today and Explore learning actions. The detailed progress dashboard from the prototype is not implemented yet.

## 9. Resources — coming-soon page

Route: `/[locale]/student/resources`

Displays the same localized coming-soon experience. Curated lesson resources are not implemented yet.

## 10. Connect — partially represented

Route: `/[locale]/student/connect`

The parent route displays the coming-soon experience. Child routes for Messages, Rooms, and Development Club exist but currently return no interface.

## 11. Student utility routes — placeholders

Notifications, Settings, Help, and the Learn lesson route currently return `null`, producing no page content.

# Teacher frontend

## Teacher navigation

Today, Teaching, Students, Resources, Connect, Insights, Rafiqi, and Courses, with Settings and Help as utilities.

## 1. Teacher Today — implemented

Route: `/[locale]/teacher/today`

The dashboard contains:

- Greeting and date.
- Small productive-day information card.
- Large gradient next-class hero for Grade 10 Physics, Newton's Third Law.
- Time, room, lesson illustration, and Prepare lesson action.
- Today's classes list with three Physics classes.
- View schedule and See full schedule actions.
- Needs attention cards for six homework approvals, four student questions, and three learners needing support.
- Task list with High, Medium, Low, and All filters.
- Five initial tasks with priority and Today/Tomorrow due labels.
- Completion checkboxes with strike-through state.
- Add task action that appends a local sample task.

Current limitation: several links from this page lead to placeholder routes.

## 2. Teacher lesson preparation — implemented, simplified

Route: `/[locale]/teacher/teaching/lesson`

The Newton's Third Law page includes:

- Back and More controls.
- Grade 10 Physics time range.
- Before, During, and After tabs.
- Three learning objectives.
- Materials list containing slides, a PhET simulation, and a worksheet.
- Four-step lesson flow: engage with a rocket video, elicit prior knowledge, introduce the law, and check understanding.
- Save draft and Prepare for class actions.
- Before-class B2/B3/B6 local UI: generation progress, generated-draft review/keep/regenerate and retry states; teacher-controlled objective, warm-up, flow, and check editing; unsaved/discard, validation, save success/failure UI; and privacy-safe warm-up misconception states with anonymized evidence only.
- Before-tab compact session strip: scheduled/ready status, join count, and Start class while objectives, warm-up questions, materials, lesson flow, and checks remain available.
- During-tab live session UI: ready lobby, students joining, connected status, reconnecting/failed recovery, end-class confirmation, and locked completion state.
- During-tab classroom-support cards: Student questions, Class readiness, Participation & engagement, My notes, Highlight these, and a consent-labeled Classroom observation demo with a permission-denied/retry state.

Current limitation: the teacher session states and classroom-support data are frontend-only demo state. They do not start a real class, connect students, synchronize questions, access a camera, or lock a persisted session record. Homework recommendations and persisted lesson results remain outside this implementation.

## 3. Teacher routes currently blank

The following routes exist but return no UI:

- Teaching overview
- Students list
- Individual student profile
- Resources
- Connect overview
- Connect Messages
- Connect Companions
- Connect Development Club
- Insights
- Rafiqi
- Courses list
- Course details
- Schedule
- Notifications
- Settings
- Help

# Global and system pages

## Locale and role redirects

- A locale root redirects to the student Today page.
- `/student` redirects to student Today.
- `/teacher` redirects to teacher Today.

## Login

A non-localized `/login` route exists as the authentication entry point. Authentication uses NextAuth infrastructure, but the page is separate from the localized role shells.

## Coming soon

A reusable bilingual empty-state page explains that a section is almost ready and links back to Today or Learn.

## Not found

A localized 404 page says the page could not be found and provides a Back to today action.

## Error and loading states

Localized error boundaries and loading states exist at application and locale levels.

## Theme preview

`/[locale]/theme-preview` is development-only. It demonstrates buttons, focus/pressed/disabled states, form controls, checkboxes, semantic surfaces, and dialogs. It returns Not Found in production.

# Relationship to the original prototypes

The new frontend keeps these main concepts:

- Separate teacher and student experiences.
- Today dashboards focused on immediate priorities.
- Four-stage learning cycle.
- Socratic warm-up before class.
- Guided homework that offers hints instead of answers.
- Rafiqi as a persistent learning companion.
- Personalization through learner preferences and goals.
- Connected teacher lesson preparation.
- Responsive navigation and role-specific information architecture.

The current visual design differs through its modern responsive shell, semantic pastel surfaces, tighter cards, cleaner typography, Lucide icon system, bilingual RTL support, and smaller focused workflows.

Major prototype concepts still awaiting implementation include the teacher curriculum map, resource library, student profiles, live classroom analysis, full teacher dashboard, messaging/rooms, Development Club, course catalog, student progress dashboard, resource catalog, lesson detail, and backend persistence.
