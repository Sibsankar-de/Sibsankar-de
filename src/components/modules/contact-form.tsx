"use client";

import { useState, type FormEvent } from "react";
import { Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";

export function ContactForm() {
  const [status, setStatus] = useState<"idle" | "sending" | "success" | "error">("idle");
  const [message, setMessage] = useState("");

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus("sending");
    setMessage("");
    const form = event.currentTarget;
    const formData = new FormData(form);
    const payload = Object.fromEntries(formData.entries());
    const response = await fetch("/api/contact", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    const data = (await response.json()) as { error?: string };
    if (!response.ok) {
      setStatus("error");
      setMessage(data.error ?? "Something went wrong. Please try again.");
      return;
    }
    form.reset();
    setStatus("success");
    setMessage("Message sent. I will get back to you soon.");
  }

  return (
    <Card className="p-5 text-ink shadow-[5px_5px_0_var(--line)] sm:p-6">
      <form onSubmit={handleSubmit}>
        <div className="grid gap-4 sm:grid-cols-2">
          <Label>
            Name
            <Input name="name" required />
          </Label>
          <Label>
            Email
            <Input name="email" required type="email" />
          </Label>
        </div>
        <Label className="mt-4">
          Subject
          <Input name="subject" required />
        </Label>
        <Label className="mt-4">
          Message
          <Textarea name="message" required rows={5} />
        </Label>
        <Label className="sr-only" aria-hidden="true">
          Website
          <Input autoComplete="off" name="website" tabIndex={-1} />
        </Label>
        <div className="mt-5 flex flex-wrap items-center justify-between gap-4">
          <Button disabled={status === "sending"} type="submit">
            <Send size={16} />
            {status === "sending" ? "Sending" : "Send message"}
          </Button>
          {message && (
            <p className={cn("text-sm", status === "error" ? "text-danger" : "text-success")} role="status">
              {message}
            </p>
          )}
        </div>
      </form>
    </Card>
  );
}
