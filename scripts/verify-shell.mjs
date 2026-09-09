import { spawnSync } from "node:child_process";
import { mkdirSync, writeFileSync } from "node:fs";
import assert from "node:assert/strict";
const binary = process.env.AGENT_BROWSER_BIN || "agent-browser";
const session = spawnSync(
  binary,
  ["session", "id", "--scope", "worktree", "--prefix", "next-dev-loop"],
  { encoding: "utf8" },
).stdout.trim();
const env = {
  ...process.env,
  AGENT_BROWSER_SESSION: session,
  AGENT_BROWSER_RESTORE: session,
};
const report = [];
function browser(...args) {
  const result = spawnSync(binary, ["--json", ...args], {
    encoding: "utf8",
    env,
    timeout: 40000,
  });
  let response;
  try {
    response = JSON.parse(result.stdout);
  } catch {
    throw new Error(args.join(" ") + ": " + result.stderr + result.stdout);
  }
  if (!response.success)
    throw new Error(args.join(" ") + ": " + JSON.stringify(response.error));
  return response.data;
}
function evaluate(code) {
  return browser("eval", "-b", Buffer.from(code).toString("base64")).result;
}
function viewport(width, height) {
  // Windows CLI occasionally reports EOF after applying a viewport successfully.
  try {
    browser("set", "viewport", String(width), String(height));
  } catch (error) {
    if (evaluate("innerWidth") !== width) throw error;
  }
}
function open(path) {
  browser(
    "--restore",
    "--headed",
    "--enable",
    "react-devtools",
    "open",
    "http://localhost:3000" + path,
  );
  browser("wait", "--load", "networkidle");
}
function menu() {
  browser("click", "button[data-slot=dialog-trigger]");
}
function checkPage(locale, role) {
  const result = evaluate(`(()=>{
   const visible=e=>!!e&&getComputedStyle(e).display!=="none"&&e.getBoundingClientRect().width>0;
   const side=document.querySelector("aside");
   const bottom=document.querySelector("nav[class*=bottomNavigation]");
   const main=document.querySelector("main");
   const links=[...document.querySelectorAll("a[href]")].filter(e=>visible(e)&&!e.className.includes("localeSwitch")&&!e.getAttribute("href").startsWith("#"));
   return {lang:document.documentElement.lang,dir:document.documentElement.dir,width:innerWidth,scrollWidth:document.documentElement.scrollWidth,
     sidebar:visible(side),sideX:side.getBoundingClientRect().x,sideRight:side.getBoundingClientRect().right,bottom:visible(bottom),
     header:visible(document.querySelector("header")),empty:main.textContent.trim()==="",links:links.map(e=>e.getAttribute("href"))};
 })()`);
  assert.equal(result.lang, locale);
  assert.equal(result.dir, locale === "ar" ? "rtl" : "ltr");
  assert.ok(result.scrollWidth <= result.width + 1, "horizontal overflow");
  assert.ok(result.header && result.empty, "header and empty page");
  assert.equal(result.sidebar, result.width >= 768);
  assert.equal(result.bottom, result.width < 768);
  if (result.sidebar)
    assert.ok(
      locale === "ar"
        ? Math.abs(result.sideRight - result.width) < 2
        : result.sideX < 2,
      "sidebar direction",
    );
  assert.ok(
    result.links.every((href) => href.startsWith("/" + locale + "/")),
    "locale-aware links",
  );
  report.push({ check: "responsive", locale, role, ...result });
}
function checkMenu() {
  const result = evaluate(
    `(()=>{const d=document.querySelector("[role=dialog]");const r=d.getBoundingClientRect();return {left:r.left,right:r.right,top:r.top,bottom:r.bottom,width:innerWidth,height:innerHeight,focus:d.contains(document.activeElement),links:[...d.querySelectorAll("a")].map(a=>a.getAttribute("href"))}})()`,
  );
  assert.ok(
    result.left >= 0 &&
      result.right <= result.width + 1 &&
      result.top >= 0 &&
      result.bottom <= result.height,
    "menu clipped",
  );
  assert.ok(result.focus, "focus must be trapped in dialog");
  return result;
}
mkdirSync("verification", { recursive: true });
try {
  for (const role of ["teacher", "student"])
    for (const locale of ["en", "ar"]) {
      open("/" + locale + "/" + role + "/today");
      for (const width of [320, 390, 768, 1024, 1440]) {
        viewport(width, width < 768 ? 844 : 1000);
        checkPage(locale, role);
      }
      viewport(390, 844);
      const primary = evaluate(
        '[...document.querySelector("nav[class*=bottomNavigation]").querySelectorAll("a")].map(a=>a.getAttribute("href"))',
      );
      for (const href of primary) {
        browser("click", 'nav[class*=bottomNavigation] a[href="' + href + '"]');
        browser("wait", "--load", "networkidle");
        browser("wait", "--url", "**" + href);
        assert.equal(evaluate("location.pathname"), href);
        assert.ok(
          evaluate(
            "document.querySelector('nav[class*=bottomNavigation] a[aria-current=page]')?.getAttribute(\"href\")",
          ) === href,
        );
      }
      menu();
      const more = checkMenu();
      browser("press", "Tab");
      assert.ok(
        evaluate(
          'document.querySelector("[role=dialog]").contains(document.activeElement)',
        ),
      );
      browser("press", "Escape");
      assert.equal(
        evaluate('document.activeElement.getAttribute("data-slot")'),
        "dialog-trigger",
      );
      for (const href of more.links) {
        menu();
        checkMenu();
        browser("click", '[role=dialog] a[href="' + href + '"]');
        browser("wait", "--load", "networkidle");
        browser("wait", "--url", "**" + href);
        assert.equal(evaluate("location.pathname"), href);
        assert.equal(
          evaluate('!!document.querySelector("[role=dialog]")'),
          false,
        );
        assert.ok(
          evaluate(
            'document.querySelector("button[data-slot=dialog-trigger]").className.includes("active")',
          ),
        );
      }
      menu();
      checkMenu();
      browser(
        "screenshot",
        "verification/" + locale + "-" + role + "-menu.png",
      );
      browser("click", "button[data-slot=dialog-close]");
      browser(
        "screenshot",
        "verification/" + locale + "-" + role + "-mobile.png",
      );
      browser("click", "a[class*=localeSwitch]");
      browser("wait", "--load", "networkidle");
      const other = locale === "ar" ? "en" : "ar";
      assert.equal(evaluate("document.documentElement.lang"), other);
      assert.equal(
        evaluate("document.documentElement.dir"),
        other === "ar" ? "rtl" : "ltr",
      );
      report.push({
        check: "mobile-navigation",
        locale,
        role,
        primary: primary.length,
        menu: more.links.length,
        escapeFocus: true,
        localeSwitch: true,
      });
      console.log(
        "PASS " + locale + " " + role + " responsive and mobile navigation",
      );
    }
  writeFileSync(
    "verification/shell-results.json",
    JSON.stringify(report, null, 2),
  );
  console.log("PASS all shell checks");
} catch (error) {
  writeFileSync(
    "verification/shell-results.json",
    JSON.stringify({ completed: report, error: error.message }, null, 2),
  );
  throw error;
}
