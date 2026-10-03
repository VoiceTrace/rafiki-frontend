# Notifications — approved implementation

The user approved the inbox and Firebase web push plan on 2026-10-03.
The existing notification bell and teacher/student routes are retained. Their
empty page implementations are replaced with the approved All/Unread inbox,
mark-all-read, device push controls, and bilingual state handling. This replaces
the placeholder-page description in RAFIQI_PRODUCT_AND_DESIGN_REFERENCE.md.

First event: a newly created lesson-resource assignment, delivered to active
students belonging to that class. Updating an existing assignment does not emit
another event. No demo assignment or messaging features emit notifications.

Push budget: ten distinct notifications per user in a rolling ten-minute window,
shared across devices and worker processes. Further entries stay in the inbox and
unread badge; they are not delayed pushes. Retries reuse the original reservation.

Background display uses one FCM notification payload with generic localized text.
Foreground uses one app alert. Clicks enter the authenticated inbox; resource
navigation checks current class membership on the backend.

## Approved bell and toast extension — 2026-10-03

The user requested a dropdown card before the full inbox, plus Sonner toasts.
The current shell, semantic colors, source/time metadata, read states, and
English/Arabic layouts match SYS-US-05 and board 18 and are preserved. The
direct bell-to-page link and custom foreground alert are deprecated by this
extension: the bell opens an accessible popover card with recent updates and a
View all link; Sonner provides a single localized toaster and notification
action. There was no existing toast-library provider to migrate. This is the
approved addition to the earlier inbox reference, not a new notification system.

Firebase Installation IDs use register/onRegistered with Firebase JS 12.19.0
and the fid target with Admin Python 7.7.0. Both installed APIs were inspected.
Bearer tokens stay in the existing server-only DAL. Firebase private credentials
never reach browser code.

## Local test guide

The web app runs at http://localhost:3000 and the API at http://localhost:8001.
Keep the notification worker running alongside the API. Restart commands:

```powershell
# Backend/rafiqi-api (two terminals)
.venv/Scripts/python.exe -m uvicorn app.main:app --host 127.0.0.1 --port 8001
.venv/Scripts/python.exe -m app.services.notification_worker
# Frontend/rafiky-frontend
npm run build
npm run start -- --port 3000
```

1. Sign in as a student, open the bell, and select View all notifications.
   Enable notifications and allow Chrome permission for localhost:3000.
2. Keep the student tab visible. In a separate browser profile or private window,
   sign in as the teacher and open Resources. Create a NEW resource and assign it
   to a lesson in a class containing that student. Re-saving an existing assignment
   intentionally does not generate another notification.
3. The student receives one Sonner toast with View and Dismiss actions, and the
   unread bell badge increases. Open the bell to see the recent update card.
4. View all opens the inbox; Unread filters the list. Open an update to reach its
   authorized lesson and mark it read. Mark all as read shows a success toast.
5. Repeat in Arabic and at mobile width. Disable on this device stops future push
   alerts, while the inbox continues to receive updates.

Seeded local accounts: student@alnoor.edu.sa / student123 and
teacher@alnoor.edu.sa / teacher123. Use separate profiles so logging in as the
teacher does not replace the student browser session. If an old backend token
expires, sign out and sign in again.

Verified: real Firebase assignment delivery produced a Sonner toast; populated
bell card, View all, read navigation, bilingual layouts, and setup toast were
checked in Chrome. Build and lint pass (five existing unrelated lint warnings).
Five backend notification tests pass. Background OS click navigation requires
the production HTTPS origin; localhost omits Firebase's HTTPS-only link option.
