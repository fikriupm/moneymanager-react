// Money Manager — sample data seeder
// ------------------------------------------------------------------
// Generates ~6 months of realistic Malaysian (MYR) income & expense
// records and loads them into your account through the real REST API.
// This gives the Phase 2 AI features (category suggestion, finance
// assistant / RAG chat) a rich history to reason over.
//
// Usage (Node 18+, backend running on localhost:8080):
//   node seed/seed.mjs --dump                 # just write seed/dataset.json, no API calls
//   node seed/seed.mjs                         # register/login + push everything to the API
//   node seed/seed.mjs --email a@b.com --password secret --name "Fikri"
//   node seed/seed.mjs --url http://localhost:8080/api/v1.0 --months 6
//
// Notes:
//   - Re-running pushes the same data again (the API has no dedupe), so
//     use a fresh account or clear data between runs if you don't want dupes.
//   - Dates are capped at "today" so the future-date validation never trips.
// ------------------------------------------------------------------

import { writeFileSync, mkdirSync } from "node:fs";
import { dirname } from "node:path";
import { fileURLToPath } from "node:url";

// ---- args ---------------------------------------------------------
const args = process.argv.slice(2);
const getFlag = (name) => args.includes(`--${name}`);
const getOpt = (name, fallback) => {
  const i = args.indexOf(`--${name}`);
  return i !== -1 && args[i + 1] ? args[i + 1] : fallback;
};

const CONFIG = {
  url: getOpt("url", "http://localhost:8080/api/v1.0"),
  email: getOpt("email", "demo@moneymanager.dev"),
  password: getOpt("password", "Password123!"),
  name: getOpt("name", "Demo User"),
  months: Number(getOpt("months", "6")),
  dump: getFlag("dump"),
};

const TODAY = new Date("2026-06-10"); // matches project "today"; change if needed

// ---- categories ---------------------------------------------------
const INCOME_CATEGORIES = [
  { name: "Salary", type: "income", icon: "💼" },
  { name: "Freelance", type: "income", icon: "💻" },
  { name: "Bonus", type: "income", icon: "🎁" },
  { name: "Investment", type: "income", icon: "📈" },
];

const EXPENSE_CATEGORIES = [
  { name: "Groceries", type: "expense", icon: "🛒" },
  { name: "Rent", type: "expense", icon: "🏠" },
  { name: "Transportation", type: "expense", icon: "⛽" },
  { name: "Dining", type: "expense", icon: "🍜" },
  { name: "Utilities", type: "expense", icon: "💡" },
  { name: "Entertainment", type: "expense", icon: "🎬" },
  { name: "Shopping", type: "expense", icon: "🛍️" },
  { name: "Health", type: "expense", icon: "💊" },
  { name: "Subscriptions", type: "expense", icon: "📺" },
];

// ---- small deterministic-ish RNG so runs are reproducible ----------
let seed = 42;
const rand = () => {
  seed = (seed * 1103515245 + 12345) & 0x7fffffff;
  return seed / 0x7fffffff;
};
const between = (min, max) => Math.round((min + rand() * (max - min)) * 100) / 100;
const pick = (arr) => arr[Math.floor(rand() * arr.length)];
const iso = (d) => d.toISOString().split("T")[0];
const notFuture = (d) => (d > TODAY ? TODAY : d);

// month list: most recent `months` months up to TODAY
const monthsList = [];
for (let i = CONFIG.months - 1; i >= 0; i--) {
  const d = new Date(TODAY.getFullYear(), TODAY.getMonth() - i, 1);
  monthsList.push({ year: d.getFullYear(), month: d.getMonth() }); // month 0-indexed
}

// ---- transaction templates ---------------------------------------
const DINING = ["Mamak dinner", "Starbucks", "Nasi lemak", "McDonald's", "Sushi", "Bubble tea", "Office lunch", "Ramen"];
const GROCERIES = ["Tesco run", "Aeon groceries", "Mydin weekly", "Jaya Grocer", "99 Speedmart"];
const TRANSPORT = ["Petrol", "Grab ride", "Touch 'n Go reload", "Parking", "Car service"];
const SHOPPING = ["Shopee order", "Lazada order", "Uniqlo", "IKEA", "Phone accessories"];
const HEALTH = ["Pharmacy", "Clinic visit", "Vitamins", "Dental checkup"];
const ENTERTAINMENT = ["GSC cinema", "Concert ticket", "Game purchase", "Karaoke"];

function buildExpensesForMonth(year, month) {
  const out = [];
  const add = (cat, name, amount, day) => {
    let d = notFuture(new Date(year, month, day));
    out.push({ category: cat, name, amount, date: iso(d) });
  };

  // recurring monthly bills
  add("Rent", "Monthly rent", 1200, 1);
  add("Utilities", "Electricity & water", between(120, 220), 5);
  add("Utilities", "Internet (Unifi)", 139, 6);
  add("Subscriptions", "Netflix", 55, 8);
  add("Subscriptions", "Spotify", 22.9, 8);
  add("Subscriptions", "iCloud storage", 13.9, 8);

  // weekly-ish groceries
  for (const day of [3, 11, 19, 26]) add("Groceries", pick(GROCERIES), between(80, 260), day);

  // dining — slight upward trend over months for the AI to notice
  const diningCount = 6 + monthsList.findIndex((m) => m.year === year && m.month === month);
  for (let i = 0; i < diningCount; i++) add("Dining", pick(DINING), between(12, 65), 2 + Math.floor(rand() * 26));

  // transport
  for (const day of [4, 14, 24]) add("Transportation", pick(TRANSPORT), between(40, 160), day);

  // occasional categories
  if (rand() > 0.4) add("Shopping", pick(SHOPPING), between(50, 400), 10 + Math.floor(rand() * 15));
  if (rand() > 0.6) add("Health", pick(HEALTH), between(25, 180), 9 + Math.floor(rand() * 18));
  if (rand() > 0.5) add("Entertainment", pick(ENTERTAINMENT), between(20, 150), 12 + Math.floor(rand() * 14));

  // one big-ticket item in March for a visible spike
  if (month === 2) add("Shopping", "New laptop", 4200, 15);

  return out;
}

function buildIncomesForMonth(year, month) {
  const out = [];
  const add = (cat, name, amount, day) => {
    out.push({ category: cat, name, amount, date: iso(notFuture(new Date(year, month, day))) });
  };
  add("Salary", "Monthly salary", 5200, 25);
  if (rand() > 0.4) add("Freelance", "Side project", between(400, 1800), 18);
  if (month === 0 || month === 11) add("Bonus", "Year-end bonus", 5200, 20); // Jan / Dec
  if (rand() > 0.7) add("Investment", "Dividend payout", between(80, 350), 12);
  return out;
}

// ---- build dataset ------------------------------------------------
const expenses = [];
const incomes = [];
for (const { year, month } of monthsList) {
  expenses.push(...buildExpensesForMonth(year, month));
  incomes.push(...buildIncomesForMonth(year, month));
}
// drop anything that somehow lands in the future
const isPast = (t) => new Date(t.date) <= TODAY;
const allExpenses = expenses.filter(isPast);
const allIncomes = incomes.filter(isPast);

const dataset = {
  categories: [...INCOME_CATEGORIES, ...EXPENSE_CATEGORIES],
  incomes: allIncomes,
  expenses: allExpenses,
};

// ---- dump mode ----------------------------------------------------
const __dirname = dirname(fileURLToPath(import.meta.url));
if (CONFIG.dump) {
  const file = `${__dirname}/dataset.json`;
  mkdirSync(__dirname, { recursive: true });
  writeFileSync(file, JSON.stringify(dataset, null, 2));
  const sum = (a) => a.reduce((s, t) => s + t.amount, 0).toFixed(2);
  console.log(`Wrote ${file}`);
  console.log(`  ${dataset.categories.length} categories`);
  console.log(`  ${allIncomes.length} incomes  (RM ${sum(allIncomes)})`);
  console.log(`  ${allExpenses.length} expenses (RM ${sum(allExpenses)})`);
  process.exit(0);
}

// ---- API helpers --------------------------------------------------
let TOKEN = null;
async function api(path, { method = "GET", body, auth = true } = {}) {
  const headers = { "Content-Type": "application/json", Accept: "application/json" };
  if (auth && TOKEN) headers.Authorization = `Bearer ${TOKEN}`;
  const res = await fetch(`${CONFIG.url}${path}`, {
    method,
    headers,
    body: body ? JSON.stringify(body) : undefined,
  });
  const text = await res.text();
  let data;
  try { data = text ? JSON.parse(text) : null; } catch { data = text; }
  if (!res.ok) {
    const msg = (data && data.message) || res.statusText;
    const err = new Error(`${method} ${path} -> ${res.status} ${msg}`);
    err.status = res.status;
    throw err;
  }
  return data;
}

async function main() {
  console.log(`Seeding ${CONFIG.url} as ${CONFIG.email}\n`);

  // register (ignore if the account already exists)
  try {
    await api("/register", { method: "POST", auth: false, body: { fullName: CONFIG.name, email: CONFIG.email, password: CONFIG.password } });
    console.log("Registered new account.");
  } catch (e) {
    console.log(`Register skipped (${e.status || "?"}) — assuming account exists.`);
  }

  // login
  const login = await api("/login", { method: "POST", auth: false, body: { email: CONFIG.email, password: CONFIG.password } });
  TOKEN = login.token;
  if (!TOKEN) throw new Error("Login returned no token — check credentials / activation.");
  console.log("Logged in.\n");

  // ensure categories exist; map name -> id
  const existing = await api("/categories");
  const byName = new Map((existing || []).map((c) => [c.name.toLowerCase(), c.id]));
  for (const cat of dataset.categories) {
    if (byName.has(cat.name.toLowerCase())) continue;
    const created = await api("/categories", { method: "POST", body: cat });
    byName.set(cat.name.toLowerCase(), created.id);
    console.log(`  + category ${cat.name}`);
  }
  const catId = (name) => byName.get(name.toLowerCase());

  // push incomes + expenses
  const iconFor = (name) => dataset.categories.find((c) => c.name === name)?.icon || "";
  let ok = 0, fail = 0;
  const post = async (path, t) => {
    try {
      await api(path, { method: "POST", body: { name: t.name, amount: Number(t.amount), date: t.date, icon: iconFor(t.category), categoryId: catId(t.category) } });
      ok++;
    } catch (e) { fail++; console.warn(`  ! ${e.message}`); }
  };

  console.log(`\nPushing ${dataset.incomes.length} incomes...`);
  for (const t of dataset.incomes) await post("/incomes", t);
  console.log(`Pushing ${dataset.expenses.length} expenses...`);
  for (const t of dataset.expenses) await post("/expenses", t);

  console.log(`\nDone. ${ok} created, ${fail} failed.`);
}

main().catch((e) => { console.error("\nSeeding failed:", e.message); process.exit(1); });
