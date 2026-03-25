export const AGENCY_DEFAULTS = {
  agency_name: 'Mind The Hat',
  agency_website: 'mindthehat.com',
  agency_email: 'hello@mindthehat.com',
  sender_name: 'Warren Fabricius',
  sender_title: 'Founder, Mind The Hat',
  footer_tagline: 'We appreciate the opportunity and look forward to driving measurable growth for your business.',
  sender_signature_name: 'Warren Fabricius',
  sender_signature_title: 'Founder',
  sender_signature_company: 'Mind The Hat',
}

export const DEFAULT_INTRO = `Thank you for the opportunity to present this proposal. We understand that choosing the right digital growth partner is a significant decision, and we appreciate your consideration of Mind The Hat.

Our goal is straightforward: to build the infrastructure that turns your marketing spend into measurable revenue. We do this by handling the full stack — web development, paid media, conversion tracking, and analytics — so every layer of your growth engine works together.

Most agencies do one thing. They run ads, or they build sites. We do both, and we build the attribution infrastructure that connects them. That means you get accurate data, lower cost per acquisition, and a clear view of what's working.

This proposal outlines the services we recommend for your business, along with our pricing. We're happy to discuss any aspect of it before you decide.

We look forward to working with you.`

export const DEFAULT_ABOUT_WHO = `Mind The Hat is a performance marketing and web development studio based in Somerset West, South Africa, working with companies across Africa and internationally. We specialise in measurable business growth through integrated digital solutions — paid media, analytics infrastructure, CRM integration, and high-performance websites.`

export const DEFAULT_ABOUT_PHILOSOPHY = `We optimise across all connected layers rather than in isolated silos. Paid media, analytics, CRM, and web performance are interdependent — improving one without the others leaves measurable growth on the table. Every engagement is designed to ensure every action traces back to measurable business outcomes.`

export const DEFAULT_WHY_US = [
  'Full-stack capability — campaigns, tracking, analytics, web, and CRM in one team',
  'Transparent by default — you retain ownership of all accounts, data, and insights',
  'Data-driven decision making — measurement guides strategy, not platform narratives',
  'Structured methodology from diagnosis through continuous optimisation',
  'Proven outcomes: 600% revenue scaling, 52% cost-per-lead reduction',
]

export const DEFAULT_NEXT_STEPS = [
  'Review this proposal carefully. We want you to be fully comfortable with everything before proceeding.',
  `If you have any questions, contact ${AGENCY_DEFAULTS.sender_name} directly at ${AGENCY_DEFAULTS.agency_email}.`,
  "Once you're ready to proceed, sign below and return this proposal. You'll receive a countersigned copy for your records.",
  "We'll be in touch within 24 hours to confirm start dates and next steps.",
]

export const DEFAULT_SERVICE_GROUPS = [
  {
    category: 'Content & Strategy',
    category_description: 'Foundation services that shape how your business is found, understood, and experienced online.',
    services: [],
  },
  {
    category: 'Website Development',
    category_description: 'High-performance web builds tailored to your business goals.',
    services: [],
  },
  {
    category: 'Tracking & Analytics',
    category_description: 'Measurement infrastructure that connects every marketing action to a measurable outcome.',
    services: [
      {
        name: 'Implement Google Analytics',
        description: 'Full setup and configuration of Google Analytics 4, including event tracking, conversion goals, and audience definitions. You get accurate, meaningful data from day one — so every decision is backed by real user behaviour.',
      },
      {
        name: 'Implement Google Tag Manager',
        description: 'Installation and configuration of Google Tag Manager to centralise all tracking scripts in one place. Enables faster tag deployment, cleaner code, and full control over what fires — without touching the website codebase every time.',
      },
      {
        name: 'Implement Server Side Tag Manager',
        description: 'Server-side Google Tag Manager setup to improve data accuracy, reduce page load impact, and future-proof your tracking against browser-based ad blockers and cookie restrictions.',
      },
    ],
  },
]

export const DEFAULT_TERMS = [
  { title: 'Payment', body: 'Website and project work is invoiced 50% upfront before work commences and 50% upon completion. Monthly retainers are billed at the start of each month.' },
  { title: 'Cancellation', body: 'Once-off project fees are non-refundable once work has commenced. Monthly retainers require 30 days written notice to cancel.' },
]
