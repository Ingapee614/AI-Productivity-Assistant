import { createLovableAiGatewayProvider } from "@/lib/ai-gateway.server";
import { createServerFn } from "@tanstack/react-start";
import { generateText, Output } from "ai";
import { z } from "zod";

const EmailInput = z.object({
  purpose: z.string().min(1),
  recipient: z.string().min(1),
  tone: z.enum(["professional", "friendly", "formal", "casual"]),
  keyPoints: z.string().optional(),
});

export const generateEmail = createServerFn({ method: "POST" })
  .inputValidator((input: unknown) => EmailInput.parse(input))
  .handler(async ({ data }) => {
    const key = process.env.LOVABLE_API_KEY;
    if (!key) throw new Error("Missing LOVABLE_API_KEY");

    const gateway = createLovableAiGatewayProvider(key);
    const { text } = await generateText({
      model: gateway("google/gemini-3-flash-preview"),
      system:
        "You are a professional email writing assistant. Write clear, effective emails based on the user's requirements. Output only the email text with subject line and body. Do not include explanations or markdown formatting around the email.",
      prompt: `Write an email with the following details:\nPurpose: ${data.purpose}\nRecipient: ${data.recipient}\nTone: ${data.tone}\n${data.keyPoints ? `Key points to include: ${data.keyPoints}` : ""}`,
    });

    return { email: text };
  });

const MeetingInput = z.object({
  notes: z.string().min(1),
});

export const summarizeMeeting = createServerFn({ method: "POST" })
  .inputValidator((input: unknown) => MeetingInput.parse(input))
  .handler(async ({ data }) => {
    const key = process.env.LOVABLE_API_KEY;
    if (!key) throw new Error("Missing LOVABLE_API_KEY");

    const gateway = createLovableAiGatewayProvider(key);
    const { output } = await generateText({
      model: gateway("google/gemini-3-flash-preview"),
      output: Output.object({
        schema: z.object({
          summary: z.string(),
          actionItems: z.array(z.string()),
          keyDecisions: z.array(z.string()),
          attendees: z.array(z.string()).optional(),
        }),
      }),
      system:
        "You are a meeting notes summarizer. Analyze the provided meeting notes and extract a concise summary, action items, and key decisions. Return structured data.",
      prompt: `Summarize these meeting notes:\n\n${data.notes}`,
    });

    return output;
  });

const TaskInput = z.object({
  goal: z.string().min(1),
  constraints: z.string().optional(),
  deadline: z.string().optional(),
});

export const planTasks = createServerFn({ method: "POST" })
  .inputValidator((input: unknown) => TaskInput.parse(input))
  .handler(async ({ data }) => {
    const key = process.env.LOVABLE_API_KEY;
    if (!key) throw new Error("Missing LOVABLE_API_KEY");

    const gateway = createLovableAiGatewayProvider(key);
    const { output } = await generateText({
      model: gateway("google/gemini-3-flash-preview"),
      output: Output.object({
        schema: z.object({
          planTitle: z.string(),
          tasks: z.array(
            z.object({
              title: z.string(),
              description: z.string(),
              priority: z.enum(["high", "medium", "low"]),
              estimatedDuration: z.string().optional(),
            })
          ),
          timeline: z.string().optional(),
        }),
      }),
      system:
        "You are a task planning assistant. Break down the user's goal into actionable, prioritized tasks. Consider dependencies and realistic time estimates.",
      prompt: `Create a task plan for: ${data.goal}\n${data.constraints ? `Constraints: ${data.constraints}` : ""}\n${data.deadline ? `Deadline: ${data.deadline}` : ""}`,
    });

    return output;
  });

const ResearchInput = z.object({
  topic: z.string().min(1),
  depth: z.enum(["brief", "detailed", "comprehensive"]),
  focus: z.string().optional(),
});

export const researchTopic = createServerFn({ method: "POST" })
  .inputValidator((input: unknown) => ResearchInput.parse(input))
  .handler(async ({ data }) => {
    const key = process.env.LOVABLE_API_KEY;
    if (!key) throw new Error("Missing LOVABLE_API_KEY");

    const gateway = createLovableAiGatewayProvider(key);
    const { text } = await generateText({
      model: gateway("google/gemini-3-flash-preview"),
      system:
        "You are a research assistant. Provide well-structured, factual research on the requested topic. Include key findings, context, and actionable insights. Be thorough but concise. Do not hallucinate information.",
      prompt: `Research topic: ${data.topic}\nDepth: ${data.depth}\n${data.focus ? `Specific focus: ${data.focus}` : ""}`,
    });

    return { research: text };
  });
