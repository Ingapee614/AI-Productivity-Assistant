"use client";

import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { researchTopic } from "@/lib/ai-tools.functions";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Search, Copy, RotateCcw, Sparkles, BookOpen } from "lucide-react";
import ReactMarkdown from "react-markdown";

export const Route = createFileRoute("/research")({
  head: () => ({
    meta: [
      { title: "AI Research Assistant — AI Workplace" },
      { name: "description", content: "Research any topic with AI-powered insights." },
    ],
  }),
  component: ResearchPage,
});

function ResearchPage() {
  const [topic, setTopic] = useState("");
  const [depth, setDepth] = useState<string>("detailed");
  const [focus, setFocus] = useState("");
  const [result, setResult] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const researchFn = useServerFn(researchTopic);

  const handleResearch = async () => {
    if (!topic.trim()) return;
    setLoading(true);
    setError(null);
    try {
      const data = await researchFn({
        data: {
          topic: topic.trim(),
          depth: depth as "brief" | "detailed" | "comprehensive",
          focus: focus.trim() || undefined,
        },
      });
      setResult(data.research);
    } catch (e) {
      setError("Failed to research. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = () => {
    if (result) navigator.clipboard.writeText(result);
  };

  const handleReset = () => {
    setResult(null);
    setError(null);
  };

  return (
    <div className="flex flex-col gap-6 p-6 max-w-4xl mx-auto">
      <div className="flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-sky-500/10">
          <Search className="h-5 w-5 text-sky-600" />
        </div>
        <div>
          <h1 className="text-xl font-semibold tracking-tight">AI Research Assistant</h1>
          <p className="text-sm text-muted-foreground">
            Deep-dive research on any topic with structured insights.
          </p>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <Sparkles className="h-4 w-4 text-primary" />
              Research Query
            </CardTitle>
            <CardDescription>
              Enter a topic and let AI gather insights.
            </CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col gap-4">
            <div className="space-y-2">
              <Label htmlFor="topic">Topic *</Label>
              <Input
                id="topic"
                placeholder="e.g., Trends in remote work productivity 2024"
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="depth">Research Depth</Label>
              <Select value={depth} onValueChange={setDepth}>
                <SelectTrigger id="depth">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="brief">Brief overview</SelectItem>
                  <SelectItem value="detailed">Detailed analysis</SelectItem>
                  <SelectItem value="comprehensive">Comprehensive report</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="focus">Specific Focus (optional)</Label>
              <Input
                id="focus"
                placeholder="e.g., Impact on software engineering teams"
                value={focus}
                onChange={(e) => setFocus(e.target.value)}
              />
            </div>
            <Button
              onClick={handleResearch}
              disabled={loading || !topic.trim()}
              className="w-full"
            >
              {loading ? (
                <span className="flex items-center gap-2">
                  <Sparkles className="h-4 w-4 animate-spin" />
                  Researching...
                </span>
              ) : (
                <span className="flex items-center gap-2">
                  <BookOpen className="h-4 w-4" />
                  Start Research
                </span>
              )}
            </Button>
            {error && <p className="text-sm text-destructive">{error}</p>}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-base">Research Results</CardTitle>
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
              <div className="prose-custom min-h-[200px] whitespace-pre-wrap rounded-md bg-muted/50 p-4 text-sm max-h-[600px] overflow-y-auto">
                <ReactMarkdown>{result}</ReactMarkdown>
              </div>
            ) : (
              <div className="flex h-[300px] flex-col items-center justify-center gap-2 rounded-md border border-dashed text-sm text-muted-foreground">
                <BookOpen className="h-8 w-8 opacity-50" />
                <p>Your research results will appear here</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
