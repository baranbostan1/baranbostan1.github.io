import type { CvContent } from './types';

export const cv: CvContent = {
  metaTitle: 'CV — Baran Berkay Bostan',
  metaDescription:
    'CV of Baran Berkay Bostan: Management Information Systems graduate with front-office experience and three digital tools built for a business.',
  headline: 'Management Information Systems graduate · IT and software support, implementation, business analysis',
  location: 'Erdek, Balıkesir, Türkiye',
  remoteNote: 'Open to remote work',
  summaryHeading: 'Summary',
  summary:
    'While working at a hotel front desk I saw what was missing in the day-to-day work and built three digital tools for the same business: a QR menu, a lobby information display and an agency invoice tracker. Spotting the problem, the product decisions and the verification are mine; I produce the code with AI tools (Claude Code, ChatGPT Codex), reading and steering it.',
  experienceHeading: 'Experience',
  experience: {
    title: 'Front Desk Agent',
    place: 'A hotel in Erdek (seasonal)',
    period: 'May 2023 – September 2026',
    points: [
      'Used the AKINSOFT Wolvox Hotel, Accounting and Cafe programs in daily front-office work.',
      'Was the first person called for computer problems at the business.',
      'Tracked invoices issued to travel agencies and their payments with a tool I built; reported to management from it.',
      'Had an Android TV stick chosen for the lobby TV, set up the information panel with a kiosk app and kept it running for about two years.',
      'Moved the restaurant’s printed menu to a QR menu updated from an admin panel.',
    ],
  },
  projectsHeading: 'Projects',
  projectsNote: 'All three were built for the same business and used there. Working demos are on the site.',
  educationHeading: 'Education',
  education: { degree: 'Management Information Systems, bachelor’s degree', school: 'Bandırma Onyedi Eylül University', year: '2025' },
  skillsHeading: 'Skills',
  skills: [
    { label: 'AI-assisted development', items: 'Claude Code, ChatGPT Codex' },
    { label: 'Used in projects', items: 'Firebase, Cloudflare, GitHub Pages' },
    { label: 'Basic reading level', items: 'HTML, CSS, SQL' },
    { label: 'Office and systems', items: 'Excel (intermediate), Windows setup, troubleshooting by research' },
    { label: 'Hotel software', items: 'AKINSOFT Wolvox Hotel, Accounting, Cafe' },
  ],
  languagesHeading: 'Languages',
  languages: [
    { name: 'Turkish', level: 'native' },
    { name: 'English', level: 'intermediate' },
  ],
  downloadPdf: 'Download PDF',
  pdfFile: '/cv/baran-berkay-bostan-cv-en.pdf',
};
