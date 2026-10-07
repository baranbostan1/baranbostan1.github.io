import type { HomeContent } from './types';

export const home: HomeContent = {
  metaTitle: 'Baran Berkay Bostan — From business problems to working tools',
  metaDescription:
    'Management Information Systems graduate. Three tools I built for a seasonal hotel, where they were used in real work: a QR menu, a lobby information display and an agency invoice tracker. Each with a live demo.',
  hero: {
    title: 'I turn the everyday problems of a business into working tools.',
    lead: 'I hold a degree in Management Information Systems. I spot the problem on site, plan the solution, and ship it with AI-assisted development. I built the three tools below for a seasonal hotel in Erdek; all three were used there in real work.',
    scrollHint: 'Scroll',
    sceneAlt: 'A dim desk at night; among scattered papers, a screen lights up and fills the desk with light.',
  },
  projectCta: 'View project',
  live: {
    clockLabel: 'Right now',
    ratesLabel: 'Live rates',
    ratesUnavailable: 'Rates unavailable',
    balanceLabel: 'Open balance',
    balanceNote: 'A demo counter running on made-up data',
    invoiceAdded: 'Invoice added',
    paymentAdded: 'Payment added',
  },
  howIWork: {
    heading: 'How I work',
    lead: 'Spotting the problem, the product decisions and the verification are mine; the code is produced with AI. This site was built the same way.',
    whoLabel: 'Who',
    steps: [
      { title: 'Spot it', text: 'Working inside the job, I notice what is missing or harder than it should be.', who: 'Me' },
      { title: 'Plan it', text: 'Who will use it, what do they need, what is the simplest solution: I pin these down.', who: 'Me' },
      { title: 'Build with AI', text: 'I produce the code with Claude Code and ChatGPT Codex; I read it and steer it.', who: 'AI and me' },
      { title: 'Test it', text: 'I try it on the real device, in real use.', who: 'Me' },
      { title: 'Ship it', text: 'I publish it, set it up, and fix it when something breaks.', who: 'Me' },
    ],
  },
  about: {
    heading: 'About',
    lead: 'I hold a degree in Management Information Systems. My front-desk experience is at a hotel in Erdek; working inside the job I saw what was missing, and built these three tools for that business.',
    skills: [
      {
        title: 'Seeing the problem and the process',
        text: 'Agency balances were not being tracked. I noticed the need and set up the tool.',
      },
      {
        title: 'Building with AI and shipping',
        text: 'I built three tools; all three were used in the daily work of a real business.',
      },
      {
        title: 'Installation and on-site fixes',
        text: 'For the lobby TV I had an Android TV stick (Xiaomi Mi Stick) chosen and set up the panel with a kiosk app. When the panel did not fit the screen, I reworked the layout to fit any resolution.',
      },
      {
        title: 'Technical support',
        text: 'While working at reception I was the first person called for computer problems. In daily work I used the AKINSOFT Wolvox Hotel, Accounting and Cafe programs.',
      },
    ],
    educationHeading: 'Education',
    education: 'Management Information Systems, bachelor’s degree. Bandırma Onyedi Eylül University, 2025.',
  },
  contact: {
    heading: 'Contact',
    lead: 'You can reach me by email about a position or a project. I am open to remote work.',
    copyEmail: 'Copy email address',
    emailCopied: 'Copied',
    cvLabel: 'CV',
    sceneAlt: 'Three screens side by side, switched on and running.',
  },
};
