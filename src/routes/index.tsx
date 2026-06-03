import { createFileRoute } from "@tanstack/react-router";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  MessageSquare,
  Mail,
  FileText,
  ListTodo,
  Search,
  Sparkles,
  ShieldAlert,
} from "lucide-react";
import { Link } from "@tanstack/react-router";

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
    description: "General-purpose AI assistant for any workplace question.",
    icon: MessageSquare,
    href: "/chat",
    color: "bg-primary/10 text-primary",
  },
  {
    title: "Email Generator",
    description: "Draft professional emails tailored to any situation.",
    icon: Mail,
    href: "/email",
    color: "bg-emerald-500/10 text-emerald-600",
  },
  {
    title: "Meeting Summarizer",
    description: "Extract summaries, action items, and decisions from notes.",
    icon: FileText,
    href: "/meeting",
    color: "bg-amber-500/10 text-amber-600",
  },
  {
    title: "Task Planner",
    description: "Break goals into actionable, prioritized tasks.",
    icon: ListTodo,
    href: "/tasks",
    color: "bg-violet-500/10 text-violet-600",
  },
  {
    title: "Research Assistant",
    description: "Deep-dive research on any topic with structured insights.",
    icon: Search,
    href: "/research",
    color: "bg-sky-500/10 text-sky-600",
  },
];

function Dashboard() {
  return (
    <div className="flex flex-col gap-6 p-6 max-w-6xl mx-auto">
      <div className="flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary">
          <Sparkles className="h-5 w-5 text-primary-foreground" />
        </div>
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">
            Welcome to your AI Workplace
          </h1>
          <p className="text-sm text-muted-foreground">
            Automate tasks, draft emails, summarize meetings, and plan projects with AI.
          </p>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {tools.map((tool) => (
          <Link
            key={tool.title}
            to={tool.href}
            className="group block transition-colors"
          >
            <Card className="h-full transition-shadow hover:shadow-md">
              <CardHeader className="flex flex-row items-center gap-3 pb-2">
                <div
                  className={`flex h-9 w-9 items-center justify-center rounded-md ${tool.color}`}
                >
                  <tool.icon className="h-4 w-4" />
                </div>
                <CardTitle className="text-base">{tool.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-sm leading-relaxed">
                  {tool.description}
                </CardDescription>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>

      <Card className="border-amber-200 bg-amber-50/50">
        <CardHeader className="flex flex-row items-center gap-2 pb-2">
          <ShieldAlert className="h-4 w-4 text-amber-600" />
          <CardTitle className="text-sm font-medium text-amber-800">
            Responsible AI Disclaimer
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-xs text-amber-700 leading-relaxed">
            AI-generated outputs should be reviewed for accuracy and appropriateness before use.
            Do not input sensitive personal information, confidential business data, or proprietary
            materials into AI tools. Always verify facts, check for bias, and use your professional
            judgment. AI assists but does not replace human decision-making.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
