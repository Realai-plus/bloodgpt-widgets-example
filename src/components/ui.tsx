"use client";

import { useState, type ReactNode } from "react";

import { Check, Copy } from "lucide-react";

/** Small rounded chip used in the header. */
export function Badge({
  children,
  tone = "neutral",
}: {
  children: ReactNode;
  tone?: "neutral" | "brand" | "muted";
}) {
  const tones = {
    neutral:
      "bg-white/10 text-white/90 ring-1 ring-inset ring-white/20",
    brand: "bg-emerald-400/15 text-emerald-200 ring-1 ring-inset ring-emerald-300/30",
    muted: "bg-white/5 text-white/60 ring-1 ring-inset ring-white/10",
  } as const;
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-medium ${tones[tone]}`}
    >
      {children}
    </span>
  );
}

/** White card with a soft border + shadow — the demo's content surface. */
export function Card({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div
      className={`rounded-2xl border border-gray-200 bg-white shadow-sm ${className}`}
    >
      {children}
    </div>
  );
}

/** Uppercase eyebrow label. */
export function Eyebrow({ children }: { children: ReactNode }) {
  return (
    <div className="text-[11px] font-semibold uppercase tracking-wider text-gray-400">
      {children}
    </div>
  );
}

/** A monospace code block with a copy button. */
export function CodeBlock({ code }: { code: string }) {
  const [copied, setCopied] = useState(false);
  return (
    <div className="group relative">
      <pre className="overflow-x-auto rounded-xl border border-gray-800 bg-gray-950 p-4 text-[12.5px] leading-relaxed text-gray-100">
        <code>{code}</code>
      </pre>
      <button
        type="button"
        onClick={() => {
          void navigator.clipboard?.writeText(code);
          setCopied(true);
          setTimeout(() => setCopied(false), 1500);
        }}
        className="absolute right-2 top-2 inline-flex items-center gap-1 rounded-lg bg-white/10 px-2 py-1 text-[11px] font-medium text-gray-200 opacity-0 ring-1 ring-inset ring-white/15 transition hover:bg-white/20 focus:outline-none focus:ring-2 focus:ring-emerald-400 group-hover:opacity-100"
        aria-label="Copy code"
      >
        {copied ? (
          <>
            <Check className="h-3.5 w-3.5" /> Copied
          </>
        ) : (
          <>
            <Copy className="h-3.5 w-3.5" /> Copy
          </>
        )}
      </button>
    </div>
  );
}

export interface TabItem {
  id: string;
  label: string;
}

/** Pill-style tab bar. */
export function Tabs({
  tabs,
  active,
  onChange,
}: {
  tabs: TabItem[];
  active: string;
  onChange: (id: string) => void;
}) {
  return (
    <div className="flex flex-wrap gap-1 rounded-xl border border-gray-200 bg-white p-1">
      {tabs.map((tab) => {
        const isActive = tab.id === active;
        return (
          <button
            key={tab.id}
            type="button"
            onClick={() => onChange(tab.id)}
            className={`rounded-lg px-3.5 py-1.5 text-sm font-medium transition focus:outline-none focus:ring-2 focus:ring-emerald-500 ${
              isActive
                ? "bg-gray-900 text-white shadow-sm"
                : "text-gray-600 hover:bg-gray-100"
            }`}
          >
            {tab.label}
          </button>
        );
      })}
    </div>
  );
}
