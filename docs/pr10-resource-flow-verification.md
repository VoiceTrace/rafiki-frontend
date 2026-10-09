# PR #10 resource flow verification

Verified on 7 October 2026 against backend PR #11 at `ecefbd6`, using a separate PostgreSQL database with migrations and demo seed data. Real backend authentication was enabled; no mock backend was used.

## Confirmed review fixes

- Resource creation and attachment recover separately. An injected attachment failure kept the saved article visible. Retrying from the preview produced one resource record and a persisted assignment.
- Creating a class in another grade cleared the previous lesson and disabled assignment until a valid lesson was selected.
- Resource, class, and roster dialogs used the shared Dialog primitive. Keyboard navigation stayed inside the dialogs; Escape closed dialogs and restored focus to their launch buttons.
- Creating a class in Arabic retained Arabic grade labels across the class list.
- Stopping the test backend produced an explicit library error. After restarting it, Try again restored the saved resources.

## Teacher-to-student checks

- Teacher created classes, enrolled a student, and assigned an article as required and a PDF as optional.
- Unsupported uploads were rejected. A valid one-page PDF uploaded, rendered in the teacher preview, and downloaded through the authenticated proxy.
- The enrolled student received the materials. Student download succeeded; teacher download access was denied for the student.
- Completion persisted after reload in the student Resources page and Arabic After class. Student API payloads contained no teacher answer field.
- English and Arabic views were checked at desktop and mobile widths, including RTL direction and absence of horizontal overflow.

## Static checks and limitations

- Frontend TypeScript: passed.
- Frontend repository lint: passed, with five existing warnings.
- Standard production build: passed in an isolated checkout with its own dependencies. The shared dependency junction in the browser-test checkout is incompatible with Turbopack; this is a local setup limitation.
- Backend tests: 69 passed, 8 skipped, 1 failed. The unchanged backend test `test_catalog_fixture_and_seed_agree` fails because the migration fixture and current seed catalog differ. No backend source was changed by these fixes.
- Browser console checks included expected errors during injected network failures and normal development-server warnings. These checks do not claim deployment or production-network coverage.
