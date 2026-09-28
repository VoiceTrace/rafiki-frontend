# Teacher resource library

Approved direction: 28 September 2026, based on the teacher resources and “Add to library” reference images supplied in the task.

## Purpose and relationship to lessons

The teacher Resources page is the reusable library: **Your Library — everything you've added to Rafiqi's knowledge, in your words**. Teachers can find, preview, and add materials here. Lesson preparation uses these saved resources in its **Materials from your library** section. A teacher can attach an existing resource to a lesson or create a new targeted material, then mark it required or optional. Students see attached resources under the same lesson and can mark them complete.

## Approved library composition

The supplied resource-library image is the visual reference for this route. It replaces the page composition in the original [T08 wireframe](wireframes/T08.svg), while the T08 resource-management flow and [T-US-20](../docs/RAFIQI_PRODUCT_AND_DESIGN_REFERENCE.md) acceptance criteria remain applicable.

- A page title and short description sit beside a prominent **Add material** action.
- Search and Grade, Subject, and Lesson filters share a panel above the content.
- Type filters cover All materials, Questions, Articles, Links, Images, Videos, and Files.
- The content area places the matching material list beside a selected-resource preview. The list includes type, lesson context, date, and required/optional status, with a sort control and per-item actions.
- The preview shows resource type, requirement status, title, source or content preview, target audience, lesson context, date, teacher, and an edit action.
- The layout stacks the list and preview on narrow screens. Both English LTR and Arabic RTL are supported.

## Add to library

The supplied **Add to library** image is the reference for adding and editing a resource. The dialog supports Question, Article, Link, Image, Video, and File types, and changes its content fields with the selected type. Targeting includes grade, subject, chapter, and lesson. Visibility can be set to optional or required for all students. Saving adds the resource to the teacher's library; lesson attachment is a separate action in the lesson's Materials from your library section.

## Superseded T08 composition

The T08 wireframe's tabs-first page, filter/library split, and selected-material panel below are deprecated as the layout for this route. Keep its resource types, targeting, preview, required/optional, and management interactions as product requirements. This decision does not replace the wireframe file or alter the separate lesson-preparation flow.

## Implementation boundary

The initial route work is a frontend UI. Sample materials and add/edit interactions are local demo state; server persistence, student completion, and the lesson attachment flow require their own integration work.
