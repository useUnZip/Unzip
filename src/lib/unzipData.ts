// Seeded demo data for the Cansa app

export type LeadStatus = "new" | "qualified" | "contacted" | "negotiating" | "won" | "lost";
export type Temp = "cold" | "warm" | "hot";

export interface Lead {
  id: string;
  name: string;
  company: string;
  niche: string;
  source: string;
  status: LeadStatus;
  temp: Temp;
  score: number;
  lastContact: string;
  nextAction: string;
  value: number;
}

export interface Client {
  id: string;
  name: string;
  niche: string;
  retainer: number;
  startedAt: string;
  health: "on-track" | "at-risk" | "delivered";
  progress: number;
  deliverables: { title: string; status: "todo" | "doing" | "done" }[];
  notes: string;
}

export interface Campaign {
  id: string;
  name: string;
  channel: "WhatsApp" | "Email" | "Instagram DM" | "LinkedIn";
  status: "live" | "draft" | "paused";
  sent: number;
  opens: number;
  replies: number;
  meetings: number;
  startedAt: string;
}

export interface Proposal {
  id: string;
  client: string;
  package: string;
  amount: number;
  status: "draft" | "sent" | "won" | "lost";
  updatedAt: string;
}

export interface ContentItem {
  id: string;
  title: string;
  client: string;
  channel: "Instagram" | "TikTok" | "LinkedIn" | "Newsletter";
  status: "idea" | "draft" | "review" | "scheduled" | "published";
  scheduledFor: string;
}

const niches = ["Clinic", "Real Estate", "F&B", "Agency", "Local Business", "Creator"];
const sources = ["Instagram", "Cold Email", "Referral", "WhatsApp", "LinkedIn", "Inbound"];
const firstNames = ["Aria", "Devin", "Maya", "Rafa", "Sora", "Lina", "Kenji", "Noah", "Imelda", "Theo", "Yara", "Reza", "Sasha", "Marlon", "Nadia", "Bram", "Ines", "Omar"];
const lastNames = ["Hartono", "Reyes", "Okafor", "Lindgren", "Park", "Soto", "Bauer", "Nakamura", "Wijaya", "Costa", "Iqbal", "Romano", "Voss", "Ahmadi", "Larsen"];
const companies = ["Northline", "Studio Atlas", "Praxis & Co", "Halcyon", "Verdura", "Meridian", "Onyx Lab", "Folio", "Hinterland", "Rivièra", "Nocta", "Forma", "Cobalt House", "Ember"];

function rand<T>(arr: T[], i: number): T { return arr[i % arr.length]; }
function seedNum(i: number, mod: number, off = 0) { return ((i * 9301 + 49297 + off) % 233280) % mod; }

export const leads: Lead[] = Array.from({ length: 96 }, (_, i) => {
  const status: LeadStatus[] = ["new", "qualified", "contacted", "negotiating", "won", "lost"];
  const t: Temp[] = ["cold", "warm", "hot"];
  return {
    id: `L-${1000 + i}`,
    name: `${rand(firstNames, i)} ${rand(lastNames, i + 3)}`,
    company: rand(companies, i + 2),
    niche: rand(niches, i + 1),
    source: rand(sources, i),
    status: status[seedNum(i, status.length)],
    temp: t[seedNum(i, t.length, 7)],
    score: 30 + seedNum(i, 70, 11),
    lastContact: `${1 + seedNum(i, 28)} days ago`,
    nextAction: rand(["Send proposal", "Follow-up DM", "Schedule call", "Send case study", "Wait for reply"], i),
    value: 800 + seedNum(i, 12000, 5),
  };
});

export const clients: Client[] = [
  {
    id: "C-001", name: "Halcyon Clinic", niche: "Clinic", retainer: 4200, startedAt: "Jan 2026",
    health: "on-track", progress: 72,
    deliverables: [
      { title: "Q1 Lead-gen sprint", status: "doing" },
      { title: "WhatsApp funnel rebuild", status: "done" },
      { title: "Monthly performance report", status: "todo" },
    ],
    notes: "Wants to expand to second branch in March.",
  },
  {
    id: "C-002", name: "Verdura F&B Group", niche: "F&B", retainer: 3600, startedAt: "Nov 2025",
    health: "at-risk", progress: 40,
    deliverables: [
      { title: "TikTok content engine", status: "doing" },
      { title: "Influencer outreach (12)", status: "doing" },
      { title: "Loyalty automations", status: "todo" },
    ],
    notes: "Slow approval cycle — push for weekly sync.",
  },
  {
    id: "C-003", name: "Meridian Realty", niche: "Real Estate", retainer: 5800, startedAt: "Sep 2025",
    health: "on-track", progress: 88,
    deliverables: [
      { title: "Listing automation", status: "done" },
      { title: "Buyer-intent campaign", status: "doing" },
      { title: "Agent enablement deck", status: "done" },
    ],
    notes: "High-value account. Quarterly business review next week.",
  },
  {
    id: "C-004", name: "Onyx Lab", niche: "Agency", retainer: 2900, startedAt: "Feb 2026",
    health: "on-track", progress: 30,
    deliverables: [
      { title: "Cold email infrastructure", status: "doing" },
      { title: "Offer positioning", status: "todo" },
    ],
    notes: "White-label setup. Strict tone-of-voice rules.",
  },
];

export const campaigns: Campaign[] = [
  { id: "CMP-01", name: "Q1 — Clinic owners (Jakarta)", channel: "WhatsApp", status: "live", sent: 312, opens: 248, replies: 41, meetings: 9, startedAt: "Apr 12" },
  { id: "CMP-02", name: "Real estate brokers cold email", channel: "Email", status: "live", sent: 1840, opens: 642, replies: 58, meetings: 12, startedAt: "Mar 28" },
  { id: "CMP-03", name: "F&B founders — IG DM", channel: "Instagram DM", status: "paused", sent: 96, opens: 96, replies: 18, meetings: 3, startedAt: "Apr 02" },
  { id: "CMP-04", name: "Solo creators — LinkedIn", channel: "LinkedIn", status: "draft", sent: 0, opens: 0, replies: 0, meetings: 0, startedAt: "—" },
];

export const proposals: Proposal[] = [
  { id: "P-201", client: "Northline Dental", package: "Lead-gen retainer — 3mo", amount: 12600, status: "sent", updatedAt: "Yesterday" },
  { id: "P-202", client: "Studio Atlas", package: "Content engine — monthly", amount: 4800, status: "draft", updatedAt: "2 days ago" },
  { id: "P-203", client: "Praxis & Co", package: "Marketplace ops — 6mo", amount: 22500, status: "draft", updatedAt: "Today" },
  { id: "P-204", client: "Forma Realty", package: "Outreach sprint — 60 days", amount: 7400, status: "won", updatedAt: "Last week" },
];

export const contentQueue: ContentItem[] = [
  { id: "CT-1", title: "How a clinic doubled bookings in 21 days", client: "Halcyon Clinic", channel: "Instagram", status: "scheduled", scheduledFor: "Tue 09:00" },
  { id: "CT-2", title: "3 menu mistakes killing F&B repeat orders", client: "Verdura F&B Group", channel: "TikTok", status: "review", scheduledFor: "Wed 18:30" },
  { id: "CT-3", title: "The buyer-intent playbook (carousel)", client: "Meridian Realty", channel: "LinkedIn", status: "draft", scheduledFor: "Thu 10:00" },
  { id: "CT-4", title: "Weekly operator note #14", client: "Onyx Lab", channel: "Newsletter", status: "idea", scheduledFor: "Fri 07:00" },
  { id: "CT-5", title: "Behind the proposal — 22.5k deal", client: "Internal", channel: "LinkedIn", status: "published", scheduledFor: "Mon" },
  { id: "CT-6", title: "Clinic owner interview (reel)", client: "Halcyon Clinic", channel: "Instagram", status: "draft", scheduledFor: "Sat 16:00" },
];

export const overviewMetrics = {
  mrr: 16500,
  mrrDelta: 12.4,
  activeClients: clients.length,
  proposalsSent: proposals.filter(p => p.status === "sent").length,
  pipelineLeads: leads.filter(l => ["new", "qualified", "contacted", "negotiating"].includes(l.status)).length,
  meetingsBooked: campaigns.reduce((a, c) => a + c.meetings, 0),
  replyRate: 8.7,
  pendingTasks: 11,
};

export const activity = [
  { t: "2m", text: "Reply from Aria Hartono — Halcyon Clinic", tag: "OUTREACH" },
  { t: "18m", text: "Proposal P-203 opened by Praxis & Co", tag: "PROPOSAL" },
  { t: "1h", text: "Content CT-2 moved to review", tag: "CONTENT" },
  { t: "3h", text: "12 new leads imported from Instagram", tag: "LEADS" },
  { t: "Yesterday", text: "Forma Realty signed — P-204 won (USD 7,400)", tag: "WIN" },
  { t: "Yesterday", text: "Weekly report generated for Meridian Realty", tag: "REPORT" },
];

export const templates = [
  { id: "T-1", category: "Outreach", title: "Cold WhatsApp — clinic owners", uses: 18 },
  { id: "T-2", category: "Outreach", title: "LinkedIn intro — F&B founders", uses: 9 },
  { id: "T-3", category: "Proposal", title: "Lead-gen retainer (3 month)", uses: 24 },
  { id: "T-4", category: "Proposal", title: "Content engine (monthly)", uses: 11 },
  { id: "T-5", category: "Onboarding", title: "Client kickoff — 7 day", uses: 31 },
  { id: "T-6", category: "Report", title: "Monthly performance report", uses: 42 },
  { id: "T-7", category: "Playbook", title: "Real estate broker playbook", uses: 6 },
  { id: "T-8", category: "Offer", title: "Productized — local SEO sprint", uses: 14 },
];
