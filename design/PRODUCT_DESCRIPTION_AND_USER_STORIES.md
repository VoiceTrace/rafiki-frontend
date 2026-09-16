# Rafiqi — Product Description and User Stories

## 1. Product summary

Rafiqi is a bilingual school learning platform that connects the daily work of teachers and students around one shared learning journey. It helps teachers prepare lessons, support students during class, review learning afterward, assign appropriate follow-up work, and communicate with students and parents. It helps students prepare before class, participate during class, review afterward, complete guided homework, understand their progress, and ask for help in context.

The product is organized around a recurring learning loop:

1. **Before class:** the teacher prepares the lesson and the student completes a short warm-up.
2. **During class:** the teacher delivers the lesson while questions, notes, and engagement signals remain connected to that lesson. The student takes notes and asks questions.
3. **After class:** the teacher reviews understanding and plans follow-up. The student receives a structured lesson summary.
4. **Homework and growth:** the student completes tailored practice with progressive support. The teacher reviews outcomes and both users see progress over time.

Rafiqi acts as a contextual assistant throughout this loop. Its responses should be grounded in the selected grade, subject, chapter, lesson, learning materials, and the learner or teacher profile. The assistant supports human decisions; it does not silently assign work, send messages, change grades, or alter a user profile.

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

**Revision 2 scope decision:** MVP v1 is built around Student Profile, Pre-Class, outside-class Study Sessions, and teacher-approved self-checking Homework. The whole During-Class epic and anything realtime are deferred to MVP v2.

The first production release should prioritize the connected learning loop without unverified observation capabilities:

1. Authentication, roles, classes, curricula, and bilingual preferences.
2. Teacher Today, schedule, tasks, curriculum, and lesson preparation.
3. Student Today, learning map, warm-up, Study Cave, lesson summary, and homework.
4. Shared resource library and lesson targeting.
5. Lesson-linked student questions and teacher responses.
6. Teacher-approved homework suggestions and basic progress reporting.
7. Messages with clear permissions and moderation.
8. Editable teacher and learner personalization models.

Camera analysis, live calling, in-class notes/questions, live question clustering, highlight broadcast, advanced engagement inference, and all other realtime behavior are MVP v2. Human-marked/open-response homework, peer study, lesson-efficacy feedback, presentation export, Development Club workflows, and professional-learning enrollment are also deferred.

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
