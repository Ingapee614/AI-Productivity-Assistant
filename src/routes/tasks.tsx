"use client";

import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { planTasks } from "@/lib/ai-tools.functions";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  ListTodo,
  Copy,
  RotateCcw,
  Sparkles,
  Clock,
  Flag,
  Calendar,
} from "lucide-react";

export const Route = createFileRoute("/tasks")({
  head: () => ({
    meta: [
      { title: "AI Task Planner — AI Workplace" },
      { name: "description", content: "Plan and break down tasks with AI." },
    ],
  }),
  component: TasksPage,
});

function TasksPage() {
  const [goal, setGoal] = useState("");
  const [constraints, setConstraints] = useState("");
  const [deadline, setDeadline] = useState("");
  const [result, setResult] = useState<{
    planTitle: string;
    tasks: Array<{
      title: string;
      description: string;
      priority: "high" | "medium" | "low";
      estimatedDuration?: string;
    }>;
    timeline?: string;
  } | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const planFn = useServerFn(planTasks);

  const handlePlan = async () => {
    if (!goal.trim()) return;
    setLoading(true);
    setError(null);
    try {
      const data = await planFn({
        data: {
          goal: goal.trim(),
          constraints: constraints.trim() || undefined,
          deadline: deadline.trim() || undefined,
        },
      });
      setResult(data);
    } catch (e) {
      setError("Failed to generate plan. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = () => {
    if (result) {
      const text = [
        `# ${result.planTitle}`,
        result.timeline ? `\nTimeline: ${result.timeline}` : "",
        "\n## Tasks",
        ...result.tasks.map(
          (t, i) =>
            `${i + 1}. ${t.title}\n   Priority: ${t.priority}${t.estimatedDuration ? ` | Duration: ${t.estimatedDuration}` : ""}\n   ${t.description}`
        ),
      ].join("\n");
      navigator.clipboard.writeText(text);
    }
  };

  const handleReset = () => {
    setResult(null);
    setError(null);
  };

  const priorityColor = (p: string) => {
    switch (p) {
      case "high":
        return "bg-red-100 text-red-700 border-red-200";
      case "medium":
        return "bg-amber-100 text-amber-700 border-amber-200";
      case "low":
        return "bg-emerald-100 text-emerald-700 border-emerald-200";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  return (
    <div className="flex flex-col gap-6 p-6 max-w-4xl mx-auto">
      <div className="flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-violet-500/10">
          <ListTodo className="h-5 w-5 text-violet-600" />
        </div>
        <div>
          <h1 className="text-xl font-semibold tracking-tight">AI Task Planner</h1>
          <p className="text-sm text-muted-foreground">
            Break goals into actionable, prioritized tasks.
          </p>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <Sparkles className="h-4 w-4 text-primary" />
              Project Goal
            </CardTitle>
            <CardDescription>
              Describe what you want to accomplish.
            </CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col gap-4">
            <div className="space-y-2">
              <Label htmlFor="goal">Goal *</Label>
              <Input
                id="goal"
                placeholder="e.g., Launch a new product landing page"
                value={goal}
                onChange={(e) => setGoal(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="constraints">Constraints (optional)</Label>
              <Textarea
                id="constraints"
                placeholder="Budget limits, team size, dependencies..."
                value={constraints}
                onChange={(e) => setConstraints(e.target.value)}
                rows={3}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="deadline">Deadline (optional)</Label>
              <Input
                id="deadline"
                placeholder="e.g., End of Q3"
                value={deadline}
                onChange={(e) => setDeadline(e.target.value)}
              />
            </div>
            <Button
              onClick={handlePlan}
              disabled={loading || !goal.trim()}
              className="w-full"
            >
              {loading ? (
                <span className="flex items-center gap-2">
                  <Sparkles className="h-4 w-4 animate-spin" />
                  Planning...
                </span>
              ) : (
                <span className="flex items-center gap-2">
                  <Sparkles className="h-4 w-4" />
                  Generate Plan
                </span>
              )}
            </Button>
            {error && <p className="text-sm text-destructive">{error}</p>}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-base">Task Plan</CardTitle>
            {result && (
              <div className="flex gap-1">
                <Button variant="ghost" size="icon-sm" onClick={handleCopy}>
                  <Copy className="h-3.5 w-3.5" />
                </Button>
                <Button variant="ghost" size="icon-sm" onClick={handleReset}>
                  <RotateCcw className="h-3.5 w-3.5" />
                </Button>
              </div>
            )}
          </CardHeader>
          <CardContent>
            {result ? (
              <div className="flex flex-col gap-4">
                <div>
                  <h3 className="text-sm font-semibold">{result.planTitle}</h3>
                  {result.timeline && (
                    <p className="flex items-center gap-1.5 text-xs text-muted-foreground mt-1">
                      <Calendar className="h-3 w-3" />
                      {result.timeline}
                    </p>
                  )}
                </div>
                <div className="space-y-3">
                  {result.tasks.map((task, i) => (
                    <div
                      key={i}
                      className="rounded-lg border bg-card p-3 text-sm"
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex items-start gap-2">
                          <span className="mt-0.5 flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full bg-primary/10 text-xs font-medium text-primary">
                            {i + 1}
                          </span>
                          <div>
                            <p className="font-medium">{task.title}</p>
                            <p className="mt-1 text-muted-foreground text-xs leading-relaxed">
                              {task.description}
                            </p>
                            {task.estimatedDuration && (
                              <p className="mt-1 flex items-center gap-1 text-xs text-muted-foreground">
                                <Clock className="h-3 w-3" />
                                {task.estimatedDuration}
                              </p>
                            )}
                          </div>
                        </div>
                        <span
                          className={`flex-shrink-0 inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-[10px] font-medium uppercase ${priorityColor(task.priority)}`}
                        >
                          <Flag className="h-2.5 w-2.5" />
                          {task.priority}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="flex h-[300px] flex-col items-center justify-center gap-2 rounded-md border border-dashed text-sm text-muted-foreground">
                <ListTodo className="h-8 w-8 opacity-50" />
                <p>Your task plan will appear here</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
