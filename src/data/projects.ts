import type { Project } from './types'

export const PROJECTS: Project[] = [
  {
    id: 'proj-agent-monitor',
    slug: 'agent-monitor',
    number: '01',
    category: 'Browser Extension · Real-Time Monitoring',
    title: 'Agent Monitor',
    accent: 'blue',
    featured: false,
    status: 'completed',
    visibility: 'published',
    sortOrder: 1,
    demoType: 'internal',
    createdAt: '2026-08-15T00:00:00.000Z',
    updatedAt: '2026-08-15T00:00:00.000Z',
    tags: ['Chrome Extension', 'Real-Time'],
    description:
      'A browser extension that watches a call-center agent roster in real time and surfaces availability, break duration, and logout events the moment they happen — without anyone needing to keep a dashboard tab open and refreshing it.',
    capabilities: [
      'Live agent state: available, on call, on break, logged out',
      'Long-break threshold alerts',
      'Native browser notifications on state change',
      'Real-time counters per state',
      'Works passively in the background across tabs',
    ],
    tech: ['Chrome Extension (Manifest V3)', 'JavaScript', 'Notifications API', 'MutationObserver'],
    demoPath: '/demo/agent-monitor',
    caseStudy: {
      problem:
        'A call-center floor needed a fast answer to "who\'s actually available right now" without a supervisor babysitting a report page all shift. Agents going on break and forgetting to return, or staying logged out longer than allowed, were only caught after the fact.',
      solution:
        'A lightweight Manifest V3 extension that reads the existing agent-status page in the background, tracks state transitions locally, and raises a native browser notification the instant an agent goes over a configurable break threshold — turning a page you had to watch into a system that taps you on the shoulder.',
      keyFeatures: [
        'Per-agent state history with timestamps',
        'Configurable long-break alert threshold',
        'Live counters: available / on call / on break / logged out',
        'Zero backend — runs entirely in the browser against the existing internal tool',
      ],
      architecture:
        'A content script observes DOM changes on the internal agent-status page via MutationObserver (no polling), normalizes rows into a state model, and a background service worker owns the alert timers and the Notifications API calls. Popup UI reads from the same in-memory state.',
      contribution:
        'Designed and built solo — from reverse-engineering the internal page structure to the alerting logic and the notification UX.',
      challenges:
        'The source page had no API and re-rendered rows unpredictably, so naive polling either missed fast transitions or hammered the CPU. Switching to a MutationObserver-driven diff against a normalized previous-state map solved both.',
      result:
        'Gives a floor supervisor passive, always-on visibility into agent availability without an extra screen to watch, and surfaces break overruns as they happen instead of at end-of-shift review.',
    },
  },
  {
    id: 'proj-order-analyzer',
    slug: 'order-analyzer',
    number: '02',
    category: 'AI Automation · Offline AI',
    title: 'WhatsApp Order Analyzer',
    accent: 'teal',
    featured: false,
    status: 'completed',
    visibility: 'published',
    sortOrder: 2,
    demoType: 'internal',
    createdAt: '2026-08-15T00:00:00.000Z',
    updatedAt: '2026-08-15T00:00:00.000Z',
    tags: ['Local LLM', 'Offline AI'],
    description:
      'A browser-based AI tool that reads a WhatsApp-style order conversation, extracts the products and quantities being ordered, prices them against the live menu, and flags the difference against whatever total an employee typed in.',
    capabilities: [
      'Conversation parsing in mixed Arabic/English text',
      'Product + quantity extraction against a menu catalog',
      'Automatic total calculation',
      'Employee-entered total comparison with signed difference',
      'AI confidence score per extraction',
      'Runs fully offline — no API key, no cloud call',
    ],
    tech: ['Chrome Extension (Manifest V3)', 'Ollama (local LLM)', 'JavaScript'],
    demoPath: '/demo/order-analyzer',
    caseStudy: {
      problem:
        'Phone/chat orders were manually re-typed into the POS by an employee under time pressure, and pricing mistakes only surfaced as customer complaints or till discrepancies at close — with no easy way to check the math against the actual conversation.',
      solution:
        'An extension that runs a small local language model against the raw chat text, extracts a structured order (items, quantities), prices it from the current menu, and shows the AI-calculated total next to whatever total the employee entered — instantly highlighting a mismatch instead of relying on manual re-checking.',
      keyFeatures: [
        'Structured extraction from free-text chat orders',
        'Menu-matched pricing, including quantity handling',
        'Expected vs. entered total with signed difference and confidence score',
        'Fully offline inference — no data leaves the device, no per-call API cost',
      ],
      architecture:
        'A local LLM (Ollama, running a small quantized model) is prompted with the raw conversation text and a compact menu schema, returns structured JSON line items, which the extension then prices and diffs against the manually entered total — all inside the browser/extension boundary, no server round-trip.',
      contribution:
        'Solo build: prompt design and iteration for reliable structured extraction, the menu-matching and pricing logic, and the comparison UI.',
      challenges:
        'Getting a small local model to reliably return structured, menu-matched output from messy conversational text (typos, mixed language, implicit quantities like "and one more") took real prompt-iteration; the confidence score exists precisely because extraction on ambiguous phrasing is not always 100% certain, and the tool is honest about that instead of hiding it.',
      result:
        'Gives a fast, offline second check on manually entered order totals right where the conversation already lives, catching pricing mismatches before they become a customer complaint or a till discrepancy.',
    },
  },
  {
    id: 'proj-coupon-tracker',
    slug: 'coupon-tracker',
    number: '03',
    category: 'Browser Automation',
    title: 'Merchant Coupon Tracker',
    accent: 'amber',
    featured: false,
    status: 'completed',
    visibility: 'published',
    sortOrder: 3,
    demoType: 'internal',
    createdAt: '2026-08-15T00:00:00.000Z',
    updatedAt: '2026-08-15T00:00:00.000Z',
    tags: ['Browser Automation', 'Reconciliation'],
    description:
      'A browser automation tool that watches a merchant-style web portal, captures coupon codes the moment they appear or get checked, and keeps a running, de-duplicated record of their status for end-of-day reconciliation.',
    capabilities: [
      'Automatic coupon code capture as they appear on-page',
      'Status tracking: valid, used, pending',
      'Duplicate-code detection',
      'Daily report generation',
      'Spreadsheet export for reconciliation',
    ],
    tech: ['Chrome Extension (Manifest V3)', 'MutationObserver', 'CSV Export'],
    demoPath: '/demo/coupon-tracker',
    caseStudy: {
      problem:
        'Coupon codes appeared and got validated inside a third-party merchant portal with no export or reporting of its own — codes were manually copied into a spreadsheet, which was slow and prone to typos and duplicate entries at end of day.',
      solution:
        'An extension that observes the portal in the background, captures each code and its status the moment it changes, and de-duplicates automatically — turning what was a manual copy-paste task into a live, reconciled log ready to export.',
      keyFeatures: [
        'Passive capture — no manual copy-paste required',
        'Automatic duplicate detection',
        'Status breakdown: total / valid / used / pending',
        'One-click export for spreadsheet reconciliation',
      ],
      architecture:
        'A content script observes the merchant portal DOM for code and status changes via MutationObserver, writes normalized records to extension local storage, and a popup UI reads and exports that store — no external server involved.',
      contribution: 'Solo build, including the portal DOM analysis needed to capture codes reliably across its re-renders.',
      challenges:
        'The portal changed code-row markup between page states without firing predictable events, so capture logic had to be resilient to structural changes rather than tied to one exact selector.',
      result: 'Removes manual transcription from the daily reconciliation process and produces a clean, de-duplicated export automatically.',
    },
  },
  {
    id: 'proj-web-watcher',
    slug: 'web-watcher',
    number: '04',
    category: 'Real-Time Web Monitoring',
    title: 'Web Watcher',
    accent: 'violet',
    featured: false,
    status: 'completed',
    visibility: 'published',
    sortOrder: 4,
    demoType: 'internal',
    createdAt: '2026-08-15T00:00:00.000Z',
    updatedAt: '2026-08-15T00:00:00.000Z',
    tags: ['Real-Time', 'Alerting'],
    description:
      'A general-purpose monitoring extension that watches any operational web page — like a live call-queue screen — and raises an audible + browser alert the moment a defined threshold is crossed.',
    capabilities: [
      'Real-time monitoring of multiple pages at once',
      'Configurable threshold detection',
      'Audio alert + native browser notification',
      'Start/stop control per monitored page',
      'Running event history',
    ],
    tech: ['Chrome Extension (Manifest V3)', 'Web Audio API', 'Offscreen Documents'],
    demoPath: '/demo/web-watcher',
    caseStudy: {
      problem:
        'An operational screen (e.g. a live call-waiting board) needed constant human attention to catch the moment a queue backed up — easy to miss if a supervisor stepped away, especially across more than one monitored screen.',
      solution:
        'A watcher extension that polls the page state for a defined condition and, the moment a threshold is breached, plays an audio alert and raises a browser notification — so the alerting doesn\'t depend on someone staring at the screen.',
      keyFeatures: [
        'Threshold-based alerting on any numeric condition on the page',
        'Multiple monitored pages simultaneously',
        'Audio + visual alert together',
        'Event history so a missed alert is still visible afterward',
      ],
      architecture:
        'Manifest V3 extensions can\'t play audio from a background service worker directly, so alert sound is routed through an Offscreen Document; the monitoring loop itself lives in the service worker and reads target-page state through a lightweight content-script bridge.',
      contribution: 'Solo build, including working around the MV3 offscreen-audio constraint.',
      challenges:
        'Manifest V3 removed persistent background pages, which broke the naive "just play a sound from the background script" approach — the Offscreen Documents API had to be adopted specifically to keep audio alerts working under the new extension model.',
      result: 'Turns a page that required continuous human attention into one that alerts on its own when it actually needs attention.',
    },
  },
  {
    id: 'proj-team-ops',
    slug: 'team-ops',
    number: '05',
    category: 'Team Management Platform',
    title: 'Team Operations System',
    accent: 'rose',
    featured: false,
    status: 'completed',
    visibility: 'published',
    sortOrder: 5,
    demoType: 'internal',
    createdAt: '2026-08-15T00:00:00.000Z',
    updatedAt: '2026-08-15T00:00:00.000Z',
    tags: ['RBAC', 'Internal Tool'],
    description:
      'A complete internal team management platform covering attendance, leave, KPIs, tasks, and performance reviews — with strict role-based access so each person only ever sees what their role is meant to see.',
    capabilities: [
      'Employee accounts with per-person data scoping',
      'Attendance and leave management',
      'KPI tracking and weekly performance review',
      'Task assignment',
      'Points-based performance system',
      'Audit log for every administrative change',
    ],
    tech: ['React', 'TypeScript', 'Role-Based Access Control'],
    demoPath: '/demo/team-ops',
    caseStudy: {
      problem:
        'A growing team had attendance, leave, task assignment, and performance tracking spread across spreadsheets and chat threads, with no consistent record of who changed what, and no way to give an employee visibility into their own numbers without exposing everyone else\'s.',
      solution:
        'A single internal platform with accounts and roles: employees see their own attendance, KPIs, and tasks; managers get team-wide performance, task, and attendance views; administrators manage users, roles, and see a full audit trail — access enforced by role at every screen, not just hidden in the UI.',
      keyFeatures: [
        'Role-scoped dashboards: Employee / Team Leader / Manager / Administrator',
        'Attendance and leave tracking',
        'Weekly KPI and performance review workflow',
        'Points system with automatic deductions for defined infractions',
        'Full audit log of administrative actions',
      ],
      architecture:
        'A role field on each account drives both what data is queried and what UI is rendered — permission checks live alongside the data access layer, not just as conditional rendering, so a lower-privilege view can\'t be tricked into requesting higher-privilege data.',
      contribution: 'Solo design and build of the data model, the role/permission logic, and every role-scoped view.',
      challenges:
        'Getting the permission boundaries right required deciding, screen by screen, exactly what a Team Leader can see that an Employee can\'t but a Manager still can — a three-tier hierarchy is easy to get subtly wrong if permissions are checked ad hoc rather than as one consistent rule per role.',
      result:
        'Replaced scattered spreadsheets with one system where every employee has appropriate self-service visibility, managers get team-level oversight, and every administrative change is attributable and auditable.',
    },
  },
  {
    id: 'proj-delivery-platform',
    slug: 'delivery-platform',
    number: '06',
    category: 'Completed · Full-Stack Operations Platform',
    title: 'Multi-Branch Delivery Management System',
    accent: 'accent',
    featured: true,
    statusBadge: 'COMPLETED SYSTEM',
    status: 'completed',
    visibility: 'published',
    sortOrder: 6,
    demoType: 'internal',
    createdAt: '2026-08-15T00:00:00.000Z',
    updatedAt: '2026-08-15T00:00:00.000Z',
    tags: ['Completed', 'Full-Stack', 'Real-Time', 'Role-Based', 'Multi-Branch'],
    description:
      'A completed, full-stack delivery and operations platform managing the complete order lifecycle — from order creation and branch processing to dispatcher assignment, driver delivery, OTP confirmation, complaints, SLA monitoring, and management reporting — across multiple branches with a full role-based permission hierarchy.',
    capabilities: [
      'End-to-end order lifecycle management, order to delivery',
      'Branch management: service availability, delivery zones, delivery fees',
      'Dispatcher workflow: order queue, driver assignment, live operational board',
      'Driver app flow: accept, start delivery, arrive, OTP confirm, complete',
      'SLA monitoring with real-time breach detection',
      'OTP-verified delivery confirmation',
      'Customer complaint intake and resolution workflow',
      'Company-wide management dashboard with branch-level reporting',
      'Full role-based permission hierarchy and audit logging',
    ],
    tech: [
      'React',
      'TypeScript',
      'Vite',
      'Supabase (PostgreSQL + Row-Level Security)',
      'Flutter (driver app)',
      'Firebase Cloud Messaging',
      'Recharts',
      'Realtime subscriptions',
    ],
    demoPath: '/demo/delivery',
    caseStudy: {
      problem:
        'Built for a multi-branch restaurant operations environment where delivery delays had no clear owner and customer complaints had no traceable source. Nobody could say, with evidence, whether a late delivery was a kitchen prep problem or a driver problem — or reliably say which branch or driver a given delay belonged to.',
      solution:
        'A completed system that gives every order a full timestamped lifecycle — accepted, preparing, dispatched (with a photographed receipt as proof of hand-off), out for delivery, OTP-confirmed delivered — and cleanly separates branch responsibility (prep time) from driver responsibility (delivery time), so delays are attributable instead of guessed at. Five role-specific interfaces (customer, dispatcher, driver, branch manager, general manager) sit on top of one shared, permission-scoped data layer.',
      keyFeatures: [
        'Full order lifecycle with a timestamp at every state transition',
        'Dispatcher-owned hand-off proof (photographed receipt) that separates kitchen time from delivery time',
        'Per-branch SLA tiers with live on-track / breached status',
        'OTP-verified delivery confirmation',
        'Driver live-location and proximity awareness',
        'Complaint workflow: assign, note, resolve, compensate',
        'Company-wide reporting with per-branch breakdowns and time-range filters',
        'Backend-enforced data isolation — a branch manager cannot see another branch\'s numbers, not even aggregated',
      ],
      architecture:
        'React + TypeScript + Vite web apps for the customer and dispatcher interfaces, a Flutter app for drivers (GPS + push notifications + camera), a PostgreSQL database on Supabase with Row-Level Security enforcing every permission boundary at the database layer (not just hidden in the UI), realtime subscriptions for live order and driver-location updates, and Firebase Cloud Messaging for push notifications and OTP delivery. Scheduled database jobs handle SLA breach detection and driver-proximity checks.',
      contribution:
        'Solo full-stack design and build: the data model, the role/permission architecture, the order-lifecycle state machine, the SLA and OTP logic, all five role-specific interfaces, and the production hardening pass (rate limiting, audit logging, input validation, RLS policy design).',
      challenges:
        'The hardest part wasn\'t any single feature — it was making the permission boundary airtight at the database level so that no role could ever query data outside its scope, even by crafting a direct API call rather than using the UI. That meant every table\'s Row-Level Security policy had to be designed and tested per role, and re-verified as new features (driver location, OTP attempts, staff registration) were added over time.',
      result:
        'A completed, production system in active use that gives every delivery a traceable timestamp history, separates kitchen responsibility from driver responsibility with evidence rather than guesswork, and gives management real-time, branch-scoped visibility instead of end-of-week guesswork. The public demo below is a sanitized environment with entirely fictional branches, orders, and people — the architecture and workflow are real.',
    },
  },
  {
    id: 'proj-customer-complaints-log',
    slug: 'customer-complaints-log',
    number: '07',
    category: 'Business Automation · Customer Service',
    title: 'Customer Complaints Log',
    accent: 'amber',
    featured: false,
    status: 'completed',
    visibility: 'published',
    sortOrder: 7,
    demoType: 'external',
    demoUrl: 'https://rkovamwikiuwhmphvyyq.supabase.co/storage/v1/object/public/portfolio-demos/projects/customer-complaints-log/demo.html',
    liveUrl: 'https://rkovamwikiuwhmphvyyq.supabase.co/storage/v1/object/public/portfolio-demos/projects/customer-complaints-log/demo.html',
    thumbnail: 'https://rkovamwikiuwhmphvyyq.supabase.co/storage/v1/object/public/portfolio-assets/projects/customer-complaints-log/thumbnail/1786816468760.png',
    createdAt: '2026-08-15T17:40:59.000Z',
    updatedAt: '2026-08-15T18:27:00.000Z',
    tags: [
      'Google Apps Script',
      'Google Sheets',
      'HTML',
      'JavaScript',
      'Customer Complaints',
      'Complaint Management',
      'Customer Service',
      'Business Automation',
      'Dashboard',
      'Reporting',
      'Data Management',
      'Workflow Automation',
      'RTL',
      'Arabic Interface',
    ],
    description:
      'A customer complaint management system built with Google Apps Script, HTML/CSS/JavaScript, and Google Sheets. It is used to search customer records, review complaint history, monitor unresolved complaints, follow up with customers, review branch-level complaint reports, and export data.',
    capabilities: [
      'Customer search by phone number or customer name',
      'Customer complaint history',
      'Complaint tracking and follow-up',
      'Management dashboard',
      'Branch-level complaint reports',
      'Unresolved / pending complaint monitoring',
      'Complaint status tracking',
      'Data export',
      'Customer and complaint statistics',
      'Arabic RTL interface',
    ],
    tech: ['Google Apps Script', 'Google Sheets', 'HTML5', 'CSS3', 'JavaScript', 'Google Apps Script Web App'],
    caseStudy: {
      problem:
        'Managing a growing number of customer complaints manually made it difficult to search customer history, track unresolved cases, monitor follow-up, and understand complaint activity across branches. Management also needed a simple way to review complaint statistics and reports without requiring a complex backend system.',
      solution:
        'I built a centralized customer complaint management system using Google Apps Script and Google Sheets. The system organizes customer and complaint records into searchable workflows and provides dedicated views for customer lookup, complaint follow-up, management monitoring, branch reporting, unresolved cases, and data export.',
      keyFeatures: [
        'Customer search by phone number or customer name',
        'Customer complaint history',
        'Complaint tracking and follow-up',
        'Management dashboard',
        'Branch-level complaint reports',
        'Unresolved / pending complaint monitoring',
        'Complaint status tracking',
        'Data export',
      ],
      architecture:
        'The system uses Google Apps Script as the application and automation layer, with HTML, CSS, and JavaScript for the user interface and Google Sheets as the data storage layer. The application provides separate views for customer search, complaint follow-up, management monitoring, branch reporting, and data export.',
      whatIBuilt:
        'I built a centralized customer complaint management system that organizes complaint records and makes them easier to search, track, and review. The system includes customer lookup, complaint history, management dashboards, branch reports, follow-up workflows, unresolved complaint monitoring, and CSV export.',
      contribution:
        'I designed and developed the application interface, complaint-management workflows, search functionality, management views, branch reporting, and data-export features. I also structured the solution around Google Apps Script and Google Sheets to keep it lightweight, accessible, and easy to maintain.',
      challenges:
        'The main challenge was organizing a growing number of customer complaints into a workflow that could be searched and monitored easily. The system also needed to give management a clear overview of complaint activity while allowing staff to follow up with individual customers and monitor unresolved cases.',
      result:
        'The result is a practical complaint-management system that centralizes customer records, improves complaint visibility, simplifies follow-up, and gives management useful reporting tools without requiring a complex backend infrastructure.',
    },
  },
  {
    id: 'proj-my-moto',
    slug: 'my-moto',
    number: '08',
    category: 'Personal Product · Motorcycle Maintenance Tracker',
    title: 'My Moto',
    accent: 'teal',
    featured: false,
    status: 'completed',
    visibility: 'published',
    sortOrder: 8,
    demoType: 'none',
    liveUrl: 'https://my-moto-eta.vercel.app/',
    createdAt: '2026-09-27T00:00:00.000Z',
    updatedAt: '2026-09-27T00:00:00.000Z',
    tags: [
      'Next.js',
      'Supabase',
      'PWA',
      'Motorcycle Maintenance',
      'Fuel Tracking',
      'Personal Finance',
      'Arabic Interface',
      'RTL',
    ],
    description:
      'A personal product that tracks a motorcycle\'s entire lifecycle — fuel, range, and maintenance — from manually logged odometer readings and refuels, instead of relying on manufacturer sensors or estimates.',
    capabilities: [
      'Fuel range calculated from your own refuel entries once two full tanks are logged, not a manufacturer number',
      'Maintenance tracking across 18 individual parts, each with its own interval and condition',
      'A single health score with a transparent breakdown of what it is built from',
      'Free tier covers fuel/range, daily kilometers, and safety-critical parts (brakes, tires, cooling)',
      'PRO tier unlocks unlimited motorcycles, full history, expense analytics, and an AI assistant',
    ],
    tech: ['Next.js (App Router)', 'TypeScript', 'Supabase (Auth + Postgres)', 'Vercel', 'PWA'],
    caseStudy: {
      problem:
        "It's easy to lose track of a motorcycle's maintenance history — forgetting when a specific part was last serviced, how much has been spent on it, and what's actually due during the current riding period.",
      solution:
        'My Moto replaces memory and guesswork with logged data: odometer readings, fuel refuels, and per-part maintenance entries build a real picture of consumption and service intervals instead of relying on manufacturer defaults or a sensor that isn\'t there.',
      keyFeatures: [
        'Fuel & range estimate computed from actual refuel entries, active once two full tank fill-ups are logged',
        'Maintenance schedule across 18 parts, each showing its own interval, condition, and whether a figure is confirmed or estimated',
        'One health score with a visible breakdown of the factors behind it',
        'No sensors or vehicle connection required — every number traces back to something the rider entered',
        'Free tier for fuel/range and safety-critical parts; PRO tier for unlimited motorcycles, full history, expense analytics, and an AI assistant',
      ],
      architecture:
        'Built with Next.js (App Router) and deployed on Vercel; Supabase handles authentication and the Postgres data model for motorcycles, refuel logs, and per-part maintenance records. Ships as an installable PWA with a fully Arabic, RTL interface.',
      contribution:
        'Built with Claude Code as a pair-programming collaborator — the product definition, the data model for parts and maintenance intervals, the fuel-range calculation logic, and the UI were all driven and reviewed by me.',
      challenges:
        "Modeling a fuel-range estimate that stays honest when data is incomplete — the app deliberately reports that it doesn't know yet rather than fabricating a number before enough refuel history exists, which shaped both the data model and the onboarding flow (choose motorcycle → log odometer → log a full-tank refuel).",
      result:
        "Gives the rider one place to see real cost and maintenance status per part instead of relying on memory, with a range estimate grounded in their own riding and refueling habits rather than a manufacturer spec sheet.",
    },
  },
  {
    id: 'proj-system-application-team',
    slug: 'system-application-team',
    number: '09',
    category: 'Internal Tool · Team Performance Management',
    title: 'System Application Team',
    accent: 'violet',
    featured: false,
    status: 'completed',
    visibility: 'published',
    sortOrder: 9,
    demoType: 'none',
    liveUrl: 'https://team-system-psi.vercel.app/',
    createdAt: '2026-09-27T00:00:00.000Z',
    updatedAt: '2026-09-27T00:00:00.000Z',
    tags: [
      'Next.js',
      'Supabase',
      'Team Management',
      'Performance Tracking',
      'Role-Based Access',
      'Google OAuth',
      'Arabic Interface',
      'RTL',
    ],
    description:
      "An internal dashboard for tracking a team's day-to-day performance, with Team Leader-gated account activation and Google or email sign-in.",
    capabilities: [
      "Central performance dashboard for tracking each team member's work",
      'Google OAuth and email/password sign-in',
      'New accounts stay disabled until a Team Leader approves them',
      'Role-based access separating Team Leader oversight from regular members',
    ],
    tech: ['Next.js (App Router)', 'TypeScript', 'Supabase (Auth + Postgres)', 'Vercel'],
    caseStudy: {
      problem:
        "Tracking how a team is actually performing — who's doing what, and how well — tends to live in scattered chats and spreadsheets that nobody keeps current.",
      solution:
        'A dedicated internal dashboard where team members sign in and their performance is tracked in one place, with a Team Leader role controlling who gets access.',
      keyFeatures: [
        'Central performance dashboard per team member',
        'Google OAuth or email/password sign-in',
        'New sign-ups are held in a disabled state until a Team Leader activates them',
        'Role separation between Team Leader and regular team members',
      ],
      architecture:
        'Built with Next.js (App Router) and deployed on Vercel; Supabase provides authentication (Google OAuth + email/password) and the Postgres backend storing team members, roles, and performance data.',
      contribution:
        'Designed and built end-to-end, including the account-approval flow, role separation, and the performance dashboard.',
      challenges:
        'Gating new sign-ups behind explicit Team Leader approval without adding friction to the everyday login flow for already-approved members.',
      result:
        'Gives the team a single, access-controlled place to track performance instead of scattered manual tracking.',
    },
  },
]

export function getProjectBySlug(slug: string): Project | undefined {
  return PROJECTS.find((project) => project.slug === slug)
}

/** Public-facing lookup — draft projects must never be reachable by guessing their URL. */
export function getPublishedProjectBySlug(slug: string): Project | undefined {
  const project = getProjectBySlug(slug)
  return project?.visibility === 'published' ? project : undefined
}
