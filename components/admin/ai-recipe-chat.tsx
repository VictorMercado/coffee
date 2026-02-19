"use client";

import { useState, useRef, useEffect } from "react";
import { useChat } from "@ai-sdk/react";
import { DefaultChatTransport } from "ai";
import { X, Send, Sparkles, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";

const transport = new DefaultChatTransport({ api: "/api/chat" });

export function AiRecipeChat() {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const { messages, sendMessage, status, setMessages } = useChat({ transport });

  const isLoading = status === "streaming" || status === "submitted";

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;
    const text = input;
    setInput("");
    await sendMessage({ text });
  };

  return (
    <>
      {/* Floating toggle button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 z-50 flex h-12 w-12 sm:h-14 sm:w-14 items-center justify-center rounded-full bg-[#FF6B35] text-[#1A0F08] shadow-lg transition-all hover:bg-[#FF6B35]/90 hover:scale-105"
      >
        {isOpen ? (
          <X className="h-6 w-6" />
        ) : (
          <Sparkles className="h-6 w-6" />
        )}
      </button>

      {/* Chat panel */}
      {isOpen && (
        <div className="fixed bottom-24 right-4 sm:right-6 z-50 flex h-[500px] w-[calc(100vw-2rem)] sm:w-[400px] max-w-[400px] flex-col border border-[#FF6B35]/30 bg-card shadow-2xl">
          {/* Header */}
          <div className="flex items-center justify-between border-b border-[#FF6B35]/30 px-4 py-3">
            <div className="flex items-center gap-2">
              <Sparkles className="h-4 w-4 text-[#FF6B35]" />
              <span className="font-mono text-sm text-[#D4AF37]">
                RECIPE AI
              </span>
            </div>
            <button
              onClick={() => setMessages([])}
              className="text-[#F5F5DC]/40 transition-colors hover:text-[#F5F5DC]"
              title="Clear chat"
            >
              <Trash2 className="h-4 w-4" />
            </button>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {messages.length === 0 && (
              <div className="flex h-full flex-col items-center justify-center gap-3 text-center">
                <Sparkles className="h-8 w-8 text-[#FF6B35]/40" />
                <p className="font-mono text-sm text-[#F5F5DC]/40">
                  Ask me for recipe ideas, ingredient combos, or menu
                  inspiration
                </p>
                <div className="mt-2 space-y-2">
                  {[
                    "Vanilla latte recipe",
                    "Seasonal fall drink ideas",
                    "Iced coffee variations",
                  ].map((suggestion) => (
                    <button
                      key={suggestion}
                      onClick={() => setInput(suggestion)}
                      className="block w-full border border-[#FF6B35]/20 px-3 py-2 font-mono text-xs text-[#FF6B35] transition-colors hover:bg-[#FF6B35]/10"
                    >
                      {suggestion}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${message.role === "user" ? "justify-end" : "justify-start"
                  }`}
              >
                <div
                  className={`max-w-[85%] px-3 py-2 font-mono text-sm ${message.role === "user"
                    ? "bg-[#FF6B35] text-[#1A0F08]"
                    : "border border-[#FF6B35]/20 bg-[#2D1810] text-[#F5F5DC]"
                    }`}
                >
                  <div className="whitespace-pre-wrap">
                    {message.parts
                      .filter((part): part is { type: "text"; text: string; } => part.type === "text")
                      .map((part, i) => (
                        <span key={i}>{part.text}</span>
                      ))}
                  </div>
                </div>
              </div>
            ))}

            {isLoading && messages[messages.length - 1]?.role === "user" && (
              <div className="flex justify-start">
                <div className="border border-[#FF6B35]/20 bg-[#2D1810] px-3 py-2">
                  <div className="flex gap-1">
                    <span className="h-2 w-2 animate-bounce rounded-full bg-[#FF6B35]" style={{ animationDelay: "0ms" }} />
                    <span className="h-2 w-2 animate-bounce rounded-full bg-[#FF6B35]" style={{ animationDelay: "150ms" }} />
                    <span className="h-2 w-2 animate-bounce rounded-full bg-[#FF6B35]" style={{ animationDelay: "300ms" }} />
                  </div>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <form
            onSubmit={handleSubmit}
            className="flex items-center gap-2 border-t border-[#FF6B35]/30 p-3"
          >
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask about recipes..."
              className="flex-1 border border-[#FF6B35]/30 bg-[#2D1810] px-3 py-2 font-mono text-sm text-[#F5F5DC] placeholder-[#F5F5DC]/30 outline-none focus:border-[#FF6B35]"
            />
            <Button
              type="submit"
              disabled={isLoading || !input.trim()}
              size="sm"
              className="bg-[#FF6B35] text-[#1A0F08] hover:bg-[#FF6B35]/90 disabled:opacity-30"
            >
              <Send className="h-4 w-4" />
            </Button>
          </form>
        </div>
      )}
    </>
  );
}
