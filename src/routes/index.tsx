import { createFileRoute, Link } from "@tanstack/react-router";
import {
  MessageSquare,
  Mail,
  FileText,
  ListTodo,
  Search,
  Sparkles,
  ShieldAlert,
  ArrowRight,
  Zap,
  Rocket,
  Wand2,
} from "lucide-react";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Dashboard — AI Workplace" },
      { name: "description", content: "Your AI-powered workplace productivity dashboard." },
    ],
  }),
  component: Dashboard,
});

const tools = [
  {
    title: "AI Chatbot",
    description: "A general-purpose assistant for any workplace question — fast, friendly, on-call.",
    icon: MessageSquare,
    href: "/chat",
    gradient: "bg-gradient-primary",
    tag: "Conversational",
  },
  {
    title: "Email Generator",
    description: "Draft polished, professional emails tailored to your tone and situation.",
    icon: Mail,
    href: "/email",
    gradient: "bg-gradient-cool",
    tag: "Writing",
  },
  {
    title: "Meeting Summarizer",
    description: "Turn messy notes into summaries, decisions, and clear action items.",
    icon: FileText,
    href: "/meeting",
    gradient: "bg-gradient-sun",
    tag: "Productivity",
  },
  {
    title: "Task Planner",
    description: "Break big goals into prioritized, actionable steps you can ship today.",
    icon: ListTodo,
    href: "/tasks",
    gradient: "bg-gradient-warm",
    tag: "Planning",
  },
  {
    title: "Research Assistant",
    description: "Deep, structured research on any topic — sources, insights, and takeaways.",
    icon: Search,
    href: "/research",
    gradient: "bg-gradient-mint",
    tag: "Insight",
  },
];

const stats = [
  { icon: Zap, label: "Avg. time saved / week", value: "8.4 hrs" },
  { icon: Rocket, label: "Tasks automated", value: "120+" },
  { icon: Wand2, label: "AI tools ready", value: "5" },
];

function Dashboard() {
  return (
    <div className="relative min-h-full bg-mesh">
      <div className="mx-auto flex max-w-6xl flex-col gap-10 p-6 md:p-10">
        {/* Hero */}
        <section className="relative overflow-hidden rounded-3xl bg-gradient-primary p-8 text-primary-foreground shadow-glow md:p-12">
          <div className="absolute -right-16 -top-16 h-64 w-64 rounded-full bg-white/10 blur-3xl" />
          <div className="absolute -bottom-20 -left-10 h-72 w-72 rounded-full bg-white/10 blur-3xl" />

          <div className="relative flex flex-col gap-6">
            <div className="inline-flex w-fit items-center gap-2 rounded-full bg-white/15 px-3 py-1 text-xs font-medium backdrop-blur-sm">
              <Sparkles className="h-3.5 w-3.5" />
              AI Workplace · v1.0
            </div>
            <div className="max-w-2xl space-y-3">
              <h1 className="text-3xl font-bold leading-tight tracking-tight md:text-5xl">
                Work smarter, not louder.
              </h1>
              <p className="text-base text-white/85 md:text-lg">
                Automate the boring parts of your day — emails, meeting notes, plans, and research —
                with a vibrant suite of AI tools designed for modern professionals.
              </p>
            </div>
            <div className="flex flex-wrap gap-3">
              <Link
                to="/chat"
                className="inline-flex items-center gap-2 rounded-full bg-white px-5 py-2.5 text-sm font-semibold text-primary shadow-lg transition-transform hover:scale-[1.02]"
              >
                Start chatting <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                to="/email"
                className="inline-flex items-center gap-2 rounded-full border border-white/30 bg-white/10 px-5 py-2.5 text-sm font-semibold text-white backdrop-blur-sm transition-colors hover:bg-white/20"
              >
                Draft an email
              </Link>
            </div>

            <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-3">
              {stats.map((s) => (
                <div
                  key={s.label}
                  className="flex items-center gap-3 rounded-2xl border border-white/20 bg-white/10 p-4 backdrop-blur-sm"
                >
                  <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-white/20">
                    <s.icon className="h-4 w-4" />
                  </div>
                  <div>
                    <div className="text-lg font-bold leading-none">{s.value}</div>
                    <div className="mt-1 text-xs text-white/80">{s.label}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Tools grid */}
        <section className="space-y-4">
          <div className="flex items-end justify-between">
            <div>
              <h2 className="text-2xl font-bold tracking-tight">Your AI toolkit</h2>
              <p className="text-sm text-muted-foreground">
                Five focused tools to compress hours into minutes.
              </p>
            </div>
          </div>

          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {tools.map((tool) => (
              <Link
                key={tool.title}
                to={tool.href}
                className="group relative overflow-hidden rounded-2xl border border-border bg-card p-5 shadow-sm transition-all hover:-translate-y-1 hover:shadow-glow"
              >
                <div
                  className={`absolute inset-x-0 top-0 h-1.5 ${tool.gradient}`}
                  aria-hidden
                />
                <div className="flex items-start justify-between">
                  <div
                    className={`flex h-12 w-12 items-center justify-center rounded-2xl text-white shadow-md ${tool.gradient}`}
                  >
                    <tool.icon className="h-5 w-5" />
                  </div>
                  <span className="rounded-full bg-muted px-2.5 py-1 text-[10px] font-medium uppercase tracking-wider text-muted-foreground">
                    {tool.tag}
                  </span>
                </div>
                <h3 className="mt-4 text-lg font-semibold tracking-tight">
                  {tool.title}
                </h3>
                <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">
                  {tool.description}
                </p>
                <div className="mt-4 inline-flex items-center gap-1 text-sm font-medium text-primary transition-transform group-hover:translate-x-1">
                  Open <ArrowRight className="h-3.5 w-3.5" />
                </div>
              </Link>
            ))}
          </div>
        </section>

        {/* Disclaimer */}
        <section className="relative overflow-hidden rounded-2xl border border-accent bg-gradient-to-br from-accent/40 via-card to-card p-5">
          <div className="flex items-start gap-3">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-gradient-warm text-white">
              <ShieldAlert className="h-4 w-4" />
            </div>
            <div>
              <h3 className="text-sm font-semibold text-foreground">
                Responsible AI Disclaimer
              </h3>
              <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
                AI-generated outputs should be reviewed for accuracy and appropriateness before use.
                Do not input sensitive personal information, confidential business data, or proprietary
                materials. Always verify facts, check for bias, and use your professional judgment.
                AI assists — it doesn't replace human decision-making.
              </p>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
