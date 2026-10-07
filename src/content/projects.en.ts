import type { ProjectContent } from './types';

const qrMenu: ProjectContent = {
  id: 'qr-menu',
  kind: 'real',
  title: 'QR Menu',
  summary: 'A digital menu opened by QR code, with an admin panel to manage it, built for the restaurant of a hotel in Erdek.',
  sceneProblem: 'With a printed menu, every price change meant paying for a reprint.',
  sceneResult: 'Used at the restaurant throughout the summer 2026 season; I updated prices and items from the panel.',
  sceneAlt: 'A printed menu card turns into a digital menu on a phone screen.',
  tags: ['HTML/CSS/JS', 'Firebase Firestore', 'Cloudflare'],
  problem:
    'The restaurant used a printed menu, and every price change meant paying for a reprint. Paying a subscription for an off-the-shelf QR menu service was not wanted either.',
  solution:
    'I built a digital menu that opens from a QR code and an admin panel to manage its content. A guest scans the code and the menu opens on their phone. When an item or a price changes, it is updated from the panel; nothing is reprinted.',
  technical: [
    'Plain HTML, CSS and JavaScript; data in Firebase Firestore, with Cloudflare in front of the site.',
    'Category filter; search across item names and descriptions; optional item photos.',
    'Automatic Day/Evening menu based on Türkiye time (day is 08:00–19:00). The restriction can be set on a whole category or on a single item.',
    'Category order is set from the admin panel.',
    'The menu language is Turkish.',
  ],
  outcome: 'Used at the restaurant throughout the summer 2026 season. I updated prices and items from the panel myself. The hotel is seasonal; the menu stays in place for the next season.',
  demoNote:
    'This demo runs with a fictional restaurant; the items and prices are made up. The admin panel is not part of the demo.',
};

const agency: ProjectContent = {
  id: 'agency',
  kind: 'real',
  title: 'Agency Invoice and Payment Tracker',
  summary: 'An internal tool that records invoices issued to travel agencies and the payments they make, and shows the balance per agency. Built for front-office tracking, not for accounting.',
  sceneProblem: 'There was no way to see at a glance how much each agency owed.',
  sceneResult: 'I used it for about two years; I entered the records and reported to management from this tool.',
  sceneAlt: 'A pile of invoices turns into tidy rows, then into a table on a screen.',
  tags: ['Firebase Firestore', 'JavaScript', 'CSV'],
  problem:
    'Invoices issued to agencies and payments received from them were not tracked per agency. There was no way to see at a glance who owed how much.',
  solution:
    'I built an internal tool that keeps invoice and payment records and shows the balance for each agency. It does not replace the accounting software; it answers the front office’s question of who owes how much.',
  technical: [
    'Single-page web app; data kept in live sync with Firebase Firestore.',
    'Invoice records (agency, date, invoice number, amount) and payment records (agency, date, amount).',
    'Filter by agency, sorting and a quick summary.',
    'Bulk import by pasting from Excel or Sheets; export as CSV.',
    'In this demo the balance logic is a set of functions kept apart from the interface and written test-first (TDD); amounts are calculated as whole numbers of kuruş.',
  ],
  outcome: 'Used for about two years. I entered the records and reported to management from this tool. Before it, this was not tracked at all.',
  demoNote: 'Add an invoice or a payment; the agency balance and the summary change at once. Records you add stay in your own browser; nothing is sent anywhere.',
};

const lobby: ProjectContent = {
  id: 'lobby',
  kind: 'real',
  title: 'Lobby Information Display',
  summary: 'A web-based information panel I built for the TV facing the reception desk of a hotel in Erdek; it stayed on around the clock through the season.',
  sceneProblem: 'There was no always-on screen for the things guests ask about most.',
  sceneResult: 'Ran on the TV facing reception for about two years, in the seasons the hotel was open; I did the installation myself.',
  sceneAlt: 'A dark TV on a wall switches on; the screen fills with a clock, exchange rates and the weather.',
  tags: ['HTML/CSS/JS', 'Cloudflare Workers', 'Wake Lock API'],
  problem:
    'There was no always-on screen facing reception for the things guests ask about most: hours, prices, exchange rates and the weather.',
  solution:
    'I built a web-based information panel meant to stay on around the clock on the TV. I had an Android TV stick fitted to the TV and set the panel up to open full screen through a kiosk app.',
  technical: [
    'Plain HTML, CSS and JavaScript; served as a static site on Cloudflare Workers, with security headers and a content security policy.',
    'Exchange rates and weather come from free APIs that need no key (fawazahmed0 currency-api, Open-Meteo).',
    'Texts, prices and announcements live in a separate settings file that someone who does not code can edit.',
    'Weekday and weekend room rates switch on their own, by the day.',
    'Requests have a timeout and retries. When the connection drops, the last data stays on screen with an “Offline” label and its time; it refreshes when the connection returns.',
    'Measures for running around the clock: Wake Lock API, an automatic reload every night at 04:00, pixel shifting against screen burn-in, a hidden cursor.',
    'The 1920×1080 stage scales proportionally to any resolution. It also shows QR codes and a scrolling announcement ticker.',
  ],
  outcome: 'Ran around the clock on the TV facing reception for about two years, in the seasons the hotel was open. I redesigned it two or three times in that period. I did the installation myself. The hotel is seasonal; the panel stays in place for the next season.',
  demoNote: 'The panel below runs with a fictional hotel. The clock, exchange rates and weather are real and live; they come from the same two APIs as the real panel.',
};

const helpdesk: ProjectContent = {
  id: 'helpdesk',
  kind: 'concept',
  title: 'Office IT Helpdesk',
  summary: 'A concept tool that tracks the IT support requests of a 20-person office: a request is opened, assigned, and closed once resolved.',
  sceneProblem: 'In small offices, IT requests arrive by message, in passing, or on a sticky note; which one is still waiting gets forgotten.',
  sceneResult: 'A concept I built for a setting outside the hotel: who has each request, and how long it has been waiting, on one screen.',
  sceneAlt: 'Sticky notes stuck around a monitor turn into a tidy request board on the screen.',
  tags: ['TypeScript', 'localStorage', 'TDD'],
  problem:
    'In a small office, support requests come through scattered channels: a message, a sentence said in the corridor, a note stuck on a monitor. Who is waiting for what, which request is urgent and which has been forgotten cannot be seen.',
  solution:
    'I built a board that gathers the requests in one place. Each request is shown by priority and status; it says who has it, how long it has been open, and whether it has passed its target time.',
  technical: [
    'TypeScript; no backend, data stays in the browser only (localStorage).',
    'Four statuses (New, In progress, Waiting for user, Resolved) and the transitions allowed between them; an unassigned request cannot be started.',
    'Target time by priority: Urgent 4 hours, Normal 24 hours, Low 72 hours. A request past its target is flagged.',
    'Status transitions, validation and time calculation are functions kept apart from the interface and written test-first (TDD).',
    'Status changes with a button, not drag and drop; the board works with a keyboard and on a phone.',
  ],
  outcome: 'Concept work. It was not used at a real business; I built it to show the logic of support work and a scenario outside the hotel.',
  demoNote: 'Open a new request, assign it, move it along and resolve it; the summary at the top changes at once. The people and requests are made up; data stays in your own browser.',
};

export const projects: readonly ProjectContent[] = [qrMenu, lobby, agency, helpdesk];
