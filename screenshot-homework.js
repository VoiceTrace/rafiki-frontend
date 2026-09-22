// Screenshot script — Epic E Homework flow
const { chromium } = require('playwright');
const fs = require('fs');

const BASE = 'http://localhost:3000';
const API  = 'http://localhost:8000';
const OUT  = 'D:/work/ENTRAI/Rafiqi/rafiki-frontend/design/boards';

const TEACHER_EMAIL = 'teacher@alnoor.edu.sa';
const STUDENT_EMAIL = 'student@alnoor.edu.sa';
const PASSWORD = 'teacher123';
const S_PASS   = 'student123';

async function apiFetch(path, opts = {}) {
  const r = await fetch(`${API}${path}`, opts);
  return r.json();
}

async function loginBrowser(page, email, password) {
  await page.goto(`${BASE}/en/login`);
  await page.waitForLoadState('networkidle');
  await page.fill('input[name="email"]', email);
  await page.fill('input[name="password"]', password);
  await page.click('button[type="submit"]');
  // Wait for redirect away from login
  await page.waitForFunction(
    () => !window.location.pathname.includes('/login'),
    { timeout: 10000 }
  ).catch(() => {});
  await page.waitForLoadState('networkidle');
  // Wait for sidebar nav to confirm dashboard has painted
  await page.waitForSelector('nav, [role="navigation"], aside', { timeout: 8000 }).catch(() => {});
  await page.waitForTimeout(800);
}

async function shot(page, name, full = false) {
  const p = `${OUT}/${name}.png`;
  await page.screenshot({ path: p, fullPage: full });
  console.log('  saved', name);
}

async function main() {
  // ── Seed data via API ────────────────────────────────────────────────────
  console.log('\n── API setup ──');
  const { access_token: tToken } = await apiFetch('/auth/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email: TEACHER_EMAIL, password: PASSWORD }),
  });

  const th = { Authorization: `Bearer ${tToken}`, 'Content-Type': 'application/json' };

  // Create a fresh assignment for screenshots
  const asn = await apiFetch('/homework/assignments', {
    method: 'POST', headers: th,
    body: JSON.stringify({ lesson_id: 'lesson-newton3', title: "Newton's Third Law Quiz" }),
  });
  console.log('  created assignment', asn.id);

  // Add 3 questions
  const q1 = await apiFetch(`/homework/assignments/${asn.id}/questions`, {
    method: 'POST', headers: th,
    body: JSON.stringify({
      question_text: 'If cart A pushes cart B with 6N, how much force does cart B exert on cart A?',
      options: [
        { id: 'a', text: '3 N' },
        { id: 'b', text: '6 N' },
        { id: 'c', text: '12 N' },
        { id: 'd', text: '0 N — B is stationary' },
      ],
      correct_answer: 'b',
      concept_ref: 'newton3-reaction-pairs',
    }),
  });
  const q2 = await apiFetch(`/homework/assignments/${asn.id}/questions`, {
    method: 'POST', headers: th,
    body: JSON.stringify({
      question_text: 'Which of the following is a pair of Newton\'s Third Law forces?',
      options: [
        { id: 'a', text: 'Gravity pulling you down and the table supporting the book' },
        { id: 'b', text: 'Your foot pushing ground backward and ground pushing your foot forward' },
        { id: 'c', text: 'A moving car and a parked car' },
        { id: 'd', text: 'Weight of a book and friction on a table' },
      ],
      correct_answer: 'b',
      concept_ref: 'newton3-action-reaction-identification',
    }),
  });
  const q3 = await apiFetch(`/homework/assignments/${asn.id}/questions`, {
    method: 'POST', headers: th,
    body: JSON.stringify({
      question_text: 'Two ice skaters push off each other. Skater A (60 kg) moves at 2 m/s. What can we say about Skater B\'s momentum?',
      options: [
        { id: 'a', text: 'Equal in magnitude and same direction as A' },
        { id: 'b', text: 'Greater than A because B is lighter' },
        { id: 'c', text: 'Equal in magnitude and opposite direction to A' },
        { id: 'd', text: 'Zero — only the heavier skater moves' },
      ],
      correct_answer: 'c',
      concept_ref: 'newton3-momentum-conservation',
    }),
  });
  console.log('  added 3 questions');

  // Get student to distribute to
  const studentsResp = await apiFetch('/users?role=student', { headers: th });
  const students = Array.isArray(studentsResp) ? studentsResp : studentsResp.items || [];
  const studentId = students[0]?.id;
  console.log('  student id:', studentId);

  // Distribute
  const distributed = await apiFetch(`/homework/assignments/${asn.id}/distribute`, {
    method: 'POST', headers: th,
    body: JSON.stringify({ student_ids: [studentId] }),
  });
  console.log('  distributed, status:', distributed.status);

  // Student: get student_assignment_id
  const { access_token: sToken } = await apiFetch('/auth/login', {
    method: 'POST', headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email: STUDENT_EMAIL, password: S_PASS }),
  });
  const sh = { Authorization: `Bearer ${sToken}` };
  const myList = await apiFetch('/homework/me/assignments', { headers: sh });
  const said = myList.find(x => x.assignment_id === asn.id)?.id;
  console.log('  student_assignment_id:', said);

  // ── Screenshots ──────────────────────────────────────────────────────────
  const browser = await chromium.launch({ headless: true });

  // ── Teacher screenshots ──────────────────────────────────────────────────
  console.log('\n── Teacher flow ──');
  const tCtx = await browser.newContext({ viewport: { width: 1440, height: 900 } });
  const tPage = await tCtx.newPage();

  // Login page (pre-fill)
  await tPage.goto(`${BASE}/en/login`);
  await tPage.waitForLoadState('networkidle');
  await shot(tPage, 'E1-T01-login-teacher');

  // Log in as teacher
  await loginBrowser(tPage, TEACHER_EMAIL, PASSWORD);
  await shot(tPage, 'E1-T02-teacher-home');

  // Homework list (with assignments)
  await tPage.goto(`${BASE}/en/teacher/homework`);
  await tPage.waitForLoadState('networkidle');
  await shot(tPage, 'E1-T03-teacher-homework-list');

  // New assignment form
  await tPage.goto(`${BASE}/en/teacher/homework/new`);
  await tPage.waitForLoadState('networkidle');
  await shot(tPage, 'E1-T04-teacher-homework-new-empty');

  // Fill form
  await tPage.fill('input[name="lesson_id"]', 'lesson-newton3');
  await tPage.fill('input[name="title"]', "Forces & Motion - Chapter Review");
  await tPage.fill('textarea[name="description"]', 'Practice questions on Newton\'s Laws of Motion');
  await shot(tPage, 'E1-T05-teacher-homework-new-filled');

  // Assignment edit/builder page (navigate directly with our API-created assignment)
  await tPage.goto(`${BASE}/en/teacher/homework/${asn.id}/edit`);
  await tPage.waitForLoadState('networkidle');
  await shot(tPage, 'E1-T06-teacher-homework-edit-overview', true);

  // Scroll to question form
  const qForm = tPage.locator('form').last();
  await qForm.scrollIntoViewIfNeeded().catch(() => {});
  await shot(tPage, 'E1-T07-teacher-homework-add-question');

  // Fill question form
  const qtInput = tPage.locator('textarea[name="question_text"], input[name="question_text"]').first();
  if (await qtInput.isVisible().catch(() => false)) {
    await qtInput.fill('What is the unit of force in the SI system?');
    await shot(tPage, 'E1-T08-teacher-homework-question-filling');
  }

  // Distribute button
  const distBtn = tPage.locator('button', { hasText: /distribute/i }).first();
  const distVisible = await distBtn.isVisible().catch(() => false);
  if (distVisible) {
    await shot(tPage, 'E1-T09-teacher-homework-distribute-btn');
    await distBtn.click();
    await tPage.waitForTimeout(600);
    await shot(tPage, 'E1-T10-teacher-homework-distribute-dialog');
  }

  // ── Student screenshots ──────────────────────────────────────────────────
  console.log('\n── Student flow ──');
  const sCtx = await browser.newContext({ viewport: { width: 1440, height: 900 } });
  const sPage = await sCtx.newPage();

  await sPage.goto(`${BASE}/en/login`);
  await sPage.waitForLoadState('networkidle');
  await shot(sPage, 'E1-S01-login-student');

  await loginBrowser(sPage, STUDENT_EMAIL, S_PASS);
  await shot(sPage, 'E1-S02-student-home');

  await sPage.goto(`${BASE}/en/student/homework`);
  await sPage.waitForLoadState('networkidle');
  await shot(sPage, 'E1-S03-student-homework-list');

  // MCQ page — direct nav with student_assignment_id
  if (said) {
    await sPage.goto(`${BASE}/en/student/homework/${said}`);
    await sPage.waitForLoadState('networkidle');
    await shot(sPage, 'E1-S04-student-homework-mcq', true);

    // Each question is a Card; click the FIRST option button inside each card
    const cards = sPage.locator('[data-slot="card"]');
    const cardCount = await cards.count();
    console.log(`  found ${cardCount} question cards`);
    for (let i = 0; i < cardCount; i++) {
      const firstOpt = cards.nth(i).locator('button[type="button"]').first();
      if (await firstOpt.isVisible().catch(() => false)) {
        await firstOpt.click().catch(() => {});
        await sPage.waitForTimeout(100); // let React update state between clicks
      }
    }
    await shot(sPage, 'E1-S05-student-homework-mcq-answered');

    // Wait for React to register all selections, then wait for submit to be enabled
    const submitBtn = sPage.locator('button', { hasText: /submit/i }).first();
    const enabled = await submitBtn.waitFor({ state: 'enabled', timeout: 5000 }).then(() => true).catch(() => false);
    console.log('  submit enabled:', enabled);
    await submitBtn.click().catch(e => console.log('  click error:', e.message));
    // Wait for either results banner or error to appear
    await sPage.waitForSelector('[class*="success"], [role="alert"], .text-destructive', { timeout: 8000 }).catch(() => {});
    await sPage.waitForTimeout(1000);
    await shot(sPage, 'E1-S06-student-homework-results', true);
  }

  // ── Arabic RTL ───────────────────────────────────────────────────────────
  console.log('\n── Arabic RTL ──');
  const arCtx = await browser.newContext({ viewport: { width: 1440, height: 900 } });
  const arPage = await arCtx.newPage();
  await loginBrowser(arPage, TEACHER_EMAIL, PASSWORD);
  await arPage.goto(`${BASE}/ar/teacher/homework`);
  await arPage.waitForLoadState('networkidle');
  await shot(arPage, 'E1-AR01-teacher-homework-arabic');

  await browser.close();
  console.log('\nDone! Screenshots in', OUT);
  console.log('IDs used: assignment=', asn.id, 'student_assignment=', said);
}

main().catch(err => { console.error(err); process.exit(1); });
