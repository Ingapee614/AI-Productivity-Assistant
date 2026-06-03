"use client";

import { createFileRoute } from "@tanstack/react-router";
import { useChat } from "@ai-sdk/react";
import { DefaultChatTransport } from "ai";
import { useState, useRef, useEffect } from "react";
import { Copy, RefreshCcw, Send } from "lucide-react";

import {
  Conversation,
  ConversationContent,
  ConversationScrollButton,
} from "@/components/ai-elements/conversation";
import {
  Message,
  MessageContent,
  MessageResponse,
  MessageActions,
  MessageAction,
} from "@/components/ai-elements/message";
import {
  PromptInput,
  PromptInputTextarea,
  PromptInputSubmit,
  PromptInputFooter,
} from "@/components/ai-elements/prompt-input";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/chat")({
  head: () => ({
    meta: [
      { title: "AI Chatbot — AI Workplace" },
      { name: "description", content: "Chat with your AI workplace assistant." },
    ],
  }),
  component: ChatPage,
});

function ChatPage() {
  const chatTransport = new DefaultChatTransport({ api: "/api/chat" });
  const { messages, sendMessage, status, regenerate } = useChat({
    transport: chatTransport,
  });
  const [input, setInput] = useState("");
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    textareaRef.current?.focus();
  }, [status]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const text = input.trim();
    if (!text) return;
    sendMessage({ text });
    setInput("");
  };

  const isLoading = status === "submitted" || status === "streaming";

  return (
    <div className="flex h-[calc(100vh-3.5rem)] flex-col">
      <Conversation className="flex-1">
        <ConversationContent className="px-4 py-6 max-w-3xl mx-auto w-full">
          {messages.length === 0 ? (
            <div className="flex flex-col items-center justify-center gap-4 py-20 text-center">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10">
                <Send className="h-6 w-6 text-primary" />
              </div>
              <div>
                <h2 className="text-lg font-semibold">How can I help you today?</h2>
                <p className="text-sm text-muted-foreground mt-1">
                  Ask me anything — from drafting emails to analyzing data.
                </p>
              </div>
            </div>
          ) : (
            messages.map((message, messageIndex) => (
              <Message key={message.id} from={message.role}>
                {message.parts.map((part, i) => {
                  switch (part.type) {
                    case "text":
                      return (
                        <MessageContent key={i}>
                          <MessageResponse>{part.text}</MessageResponse>
                          {message.role === "assistant" &&
                            messageIndex === messages.length - 1 && (
                              <MessageActions className="mt-2 opacity-0 transition-opacity group-hover:opacity-100">
                                <MessageAction
                                  onClick={() => regenerate()}
                                  label="Retry"
                                  tooltip="Regenerate response"
                                >
                                  <RefreshCcw className="h-3.5 w-3.5" />
                                </MessageAction>
                                <MessageAction
                                  onClick={() =>
                                    navigator.clipboard.writeText(part.text)
                                  }
                                  label="Copy"
                                  tooltip="Copy response"
                                >
                                  <Copy className="h-3.5 w-3.5" />
                                </MessageAction>
                              </MessageActions>
                            )}
                        </MessageContent>
                      );
                    default:
                      return null;
                  }
                })}
              </Message>
            ))
          )}
        </ConversationContent>
        <ConversationScrollButton />
      </Conversation>

      <div className="border-t bg-background p-4">
        <form
          onSubmit={handleSubmit}
          className="mx-auto flex max-w-3xl items-end gap-2"
        >
          <PromptInput
            onSubmit={() => {
              /* handled by form */
            }}
            className="flex-1"
          >
            <PromptInputTextarea
              ref={textareaRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Type your message..."
              className="min-h-[60px] max-h-[200px] pr-12"
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  handleSubmit(e);
                }
              }}
            />
            <PromptInputFooter className="justify-end pt-2">
              <PromptInputSubmit
                status={status}
                disabled={!input.trim() || isLoading}
              />
            </PromptInputFooter>
          </PromptInput>
        </form>
        <p className="mt-2 text-center text-[10px] text-muted-foreground">
          AI-generated responses may be inaccurate. Please verify important information.
        </p>
      </div>
    </div>
  );
}
