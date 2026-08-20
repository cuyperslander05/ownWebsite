"use client";

import { useEffect, useMemo, useState, type ComponentType, type CSSProperties } from "react";
import { ActivityCalendar } from "react-activity-calendar";
import { FileText, Star, Users } from "lucide-react";

import { GithubIcon } from "../shared/brand-icons";

/** One day of pseudo-realistic GitHub contribution activity. */
interface ContributionDay {
  date: string;
  count: number;
  level: number;
}

/**
 * Generates a full year (+ a bit, to fill the calendar's leading week) of
 * plausible-looking daily contribution counts. The source site fetches real
 * GitHub data client-side at runtime; this clone substitutes generated data
 * since the exact historical values aren't scrapeable static content.
 */
function generateContributionData(): ContributionDay[] {
  const days = 371;
  const today = new Date();
  const data: ContributionDay[] = [];

  for (let i = days; i >= 0; i--) {
    const d = new Date(today);
    d.setDate(d.getDate() - i);
    const count = Math.random() < 0.15 ? 0 : Math.floor(Math.random() * 12) + 1;
    const level = count === 0 ? 0 : count < 3 ? 1 : count < 6 ? 2 : count < 9 ? 3 : 4;
    data.push({ date: d.toISOString().slice(0, 10), count, level });
  }

  return data;
}

type StatIcon = ComponentType<{
  size?: number;
  style?: CSSProperties;
  className?: string;
}>;

interface StatCardData {
  label: string;
  value: number;
  icon: StatIcon;
  color: string;
}

const STATS: StatCardData[] = [
  { label: "Followers", value: 6, icon: Users, color: "#d4547e" },
  { label: "Repositories", value: 32, icon: FileText, color: "#10b981" },
  { label: "GitHub Stars", value: 9, icon: Star, color: "#f59e0b" },
];

export function GithubSection() {
  const [mounted, setMounted] = useState(false);
  const contributionData = useMemo(() => generateContributionData(), []);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <section id="github" className="py-20 md:py-28">
      <div className="max-w-6xl mx-auto px-6">
        <h2 className="text-4xl md:text-5xl font-black">Code &amp; Contributions</h2>
        <div className="w-10 h-1 bg-[var(--awrs-primary)] rounded-full mt-4 mb-10" />

        <div className="grid md:grid-cols-[1fr_260px] gap-6 items-start">
          <div className="rounded-2xl border border-[var(--awrs-border)] p-6 md:p-8">
            <div className="flex items-center gap-3">
              <div
                className="w-10 h-10 rounded-xl flex items-center justify-center"
                style={{
                  background:
                    "color-mix(in srgb, var(--awrs-primary) 10%, transparent)",
                }}
              >
                <GithubIcon
                  className="w-5 h-5"
                  style={{ color: "var(--awrs-primary)" }}
                />
              </div>
              <div>
                <p className="font-semibold">@abdulwahed-s</p>
                <p className="text-sm text-[var(--awrs-text-secondary)]">
                  Contribution activity on GitHub
                </p>
              </div>
            </div>

            <div className="mt-6 overflow-x-auto">
              {mounted ? (
                <ActivityCalendar
                  data={contributionData}
                  theme={{
                    light: ["#f3e8ec", "#f0b8c8", "#e07a9c", "#d4547e", "#a83d62"],
                  }}
                  colorScheme="light"
                  blockSize={12}
                  blockMargin={4}
                  fontSize={12}
                  showTotalCount={false}
                />
              ) : (
                <div className="h-[140px] rounded-xl bg-[var(--awrs-bg-secondary)] animate-pulse" />
              )}
            </div>

            <p className="mt-3 text-sm text-[var(--awrs-text-secondary)]">
              3,470 contributions in the last year
            </p>
          </div>

          <div className="grid grid-cols-3 md:grid-cols-1 gap-4">
            {STATS.map((stat) => (
              <div
                key={stat.label}
                className="rounded-2xl border border-[var(--awrs-border)] p-6 flex flex-col gap-2"
              >
                <stat.icon style={{ color: stat.color }} size={20} />
                <p className="text-3xl font-black">{stat.value}</p>
                <p className="text-sm text-[var(--awrs-text-secondary)]">
                  {stat.label}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
