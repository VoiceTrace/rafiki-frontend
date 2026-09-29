# Teacher resource library

Approved direction: 28 September 2026, based on the teacher resources and “Add to library” reference images supplied in the task.

## Purpose and relationship to lessons

The teacher Resources page is the reusable library: **Your Library — everything you've added to Rafiqi's knowledge, in your words**. Teachers can find, preview, and add materials here. Lesson preparation uses these saved resources in its **Materials from your library** section. A teacher can attach an existing resource to a lesson or create a new targeted material, then mark it required or optional. Students see attached resources under the same lesson and can mark them complete.

## Approved library composition

The supplied resource-library image is the visual reference for this route. It replaces the page composition in the original [T08 wireframe](wireframes/T08.svg), while the T08 resource-management flow and [T-US-20](../docs/RAFIQI_PRODUCT_AND_DESIGN_REFERENCE.md) acceptance criteria remain applicable.

- A page title and short description sit beside a prominent **Add material** action.
- Search and class filters share a panel. The class selects the authoritative grade, while the target lesson list is filtered to lessons mapped to that grade.
- Type filters cover All materials, Questions, Articles, Links, Images, Videos, and Files.
- The content area places the matching library material list beside a selected-resource preview. Required or optional is set on each class/lesson assignment, not on the reusable library record.
- The preview supports attaching an existing resource to the selected class and lesson. Add to library can also create a new record and assign it directly to a selected lesson as required or optional.
- The layout stacks the list and preview on narrow screens. Both English LTR and Arabic RTL are supported.

## Add to library

The supplied **Add to library** image is the reference for adding a resource. The dialog supports Question, Article, Link, Image, Video, and File types, and changes its content fields with the selected type. A class determines the grade and the grade-specific lesson list. Visibility is required or optional for that class and lesson. A resource can also be saved to the library without assignment.

## Superseded T08 composition

The T08 wireframe's tabs-first page, filter/library split, and selected-material panel below are deprecated as the layout for this route. Keep its resource types, targeting, preview, required/optional, and management interactions as product requirements. This decision does not replace the wireframe file or alter the separate lesson-preparation flow.

## Implementation boundary

The frontend uses the school-scoped resources API. Library records are separate from class/lesson assignments; completion is stored for the student and assignment, independent of review-session state. File uploads use a private storage path and authenticated download proxy.
