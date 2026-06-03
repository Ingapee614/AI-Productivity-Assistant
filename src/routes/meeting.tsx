"use client";

import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { summarizeMeeting } from "@/lib/ai-tools.functions";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { FileText, Copy, RotateCcw, Sparkles, CheckCircle, Users, Lightbulb } from "lucide-react";

export const Route = createFileRoute("/meeting")({
  head: () => ({
    meta: [
      { title: "Meeting Notes Summarizer — AI Workplace" },
      { name: "description", content: "Summarize meeting notes with AI." },
    ],
  }),
  component: MeetingPage,
});

function MeetingPage() {
  const [notes, setNotes] = useState("");
  const [result, setResult] = useState<{
    summary: string;
    actionItems: string[];
    keyDecisions: string[];
    attendees?: string[];
  } | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const summarizeFn = useServerFn(summarizeMeeting);

  const handleSummarize = async () => {
    if (!notes.trim()) return;
    setLoading(true);
    setError(null);
    try {
      const data = await summarizeFn({ data: { notes: notes.trim() } });
      setResult(data);
    } catch (e) {
      setError("Failed to summarize. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = () => {
    if (result) {
      const text = [
        `Summary:\n${result.summary}`,
        `\nAction Items:\n${result.actionItems.map((item) => `- ${item}`).join("\n")}`,
        `\nKey Decisions:\n${result.keyDecisions.map((d) => `- ${d}`).join("\n")}`,
      ].join("\n");
      navigator.clipboard.writeText(text);
    }
  };

  const handleReset = () => {
    setResult(null);
    setError(null);
  };

  return (
    <div className="flex flex-col gap-6 p-6 max-w-4xl mx-auto">
      <div className="flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-amber-500/10">
          <FileText className="h-5 w-5 text-amber-600" />
        </div>
        <div>
          <h1 className="text-xl font-semibold tracking-tight">Meeting Notes Summarizer</h1>
          <p className="text-sm text-muted-foreground">
            Extract summaries, action items, and key decisions from your meeting notes.
          </p>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <Sparkles className="h-4 w-4 text-primary" />
              Meeting Notes
            </CardTitle>
            <CardDescription>
              Paste your raw meeting notes here.
            </CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col gap-4">
            <div className="space-y-2">
              <Label htmlFor="notes">Notes *</Label>
              <Textarea
                id="notes"
                placeholder="Paste your meeting notes here..."
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                rows={12}
              />
            </div>
            <Button
              onClick={handleSummarize}
              disabled={loading || !notes.trim()}
              className="w-full"
            >
              {loading ? (
                <span className="flex items-center gap-2">
                  <Sparkles className="h-4 w-4 animate-spin" />
                  Analyzing...
                </span>
              ) : (
                <span className="flex items-center gap-2">
                  <Sparkles className="h-4 w-4" />
                  Summarize Meeting
                </span>
              )}
            </Button>
            {error && <p className="text-sm text-destructive">{error}</p>}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-base">Meeting Summary</CardTitle>
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
          <CardContent className="flex flex-col gap-4">
            {result ? (
              <>
                <div>
                  <h3 className="flex items-center gap-2 text-sm font-semibold mb-2">
                    <FileText className="h-4 w-4 text-primary" />
                    Summary
                  </h3>
                  <p className="text-sm leading-relaxed bg-muted/50 rounded-md p-3">
                    {result.summary}
                  </p>
                </div>

                {result.attendees && result.attendees.length > 0 && (
                  <div>
                    <h3 className="flex items-center gap-2 text-sm font-semibold mb-2">
                      <Users className="h-4 w-4 text-primary" />
                      Attendees
                    </h3>
                    <div className="flex flex-wrap gap-1">
                      {result.attendees.map((a) => (
                        <span key={a} className="text-xs bg-secondary px-2 py-1 rounded-full">
                          {a}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                <div>
                  <h3 className="flex items-center gap-2 text-sm font-semibold mb-2">
                    <CheckCircle className="h-4 w-4 text-emerald-500" />
                    Action Items ({result.actionItems.length})
                  </h3>
                  <ul className="space-y-1">
                    {result.actionItems.map((item, i) => (
                      <li key={i} className="flex items-start gap-2 text-sm">
                        <span className="mt-1.5 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-emerald-500" />
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>

                <div>
                  <h3 className="flex items-center gap-2 text-sm font-semibold mb-2">
                    <Lightbulb className="h-4 w-4 text-amber-500" />
                    Key Decisions ({result.keyDecisions.length})
                  </h3>
                  <ul className="space-y-1">
                    {result.keyDecisions.map((d, i) => (
                      <li key={i} className="flex items-start gap-2 text-sm">
                        <span className="mt-1.5 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-amber-500" />
                        {d}
                      </li>
                    ))}
                  </ul>
                </div>
              </>
            ) : (
              <div className="flex h-[300px] flex-col items-center justify-center gap-2 rounded-md border border-dashed text-sm text-muted-foreground">
                <FileText className="h-8 w-8 opacity-50" />
                <p>Your meeting summary will appear here</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
