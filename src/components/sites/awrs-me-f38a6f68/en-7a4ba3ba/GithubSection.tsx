import { ArrowUpRight } from "lucide-react";

import { GithubIcon } from "../shared/brand-icons";
import { SITE } from "@/lib/site";
import { Reveal } from "./Reveal";

/**
 * Link out to the GitHub profile.
 *
 * The cloned design showed a contribution calendar and follower/repo/star
 * counts. Those numbers were the original owner's, and the calendar was
 * generated with Math.random() rather than fetched, so both are gone: the
 * section now states only what is true and links to the live profile, which is
 * always current by definition.
 *
 * If you want the real calendar back, it needs a client-side fetch of GitHub's
 * contribution data (a third-party proxy — worth a line in the privacy policy).
 */
export function GithubSection() {
  return (
    <section id="github" className="py-20 md:py-28">
      <div className="max-w-6xl mx-auto px-6">
        <Reveal>
          <h2 className="text-4xl md:text-5xl font-black">Code &amp; Contributions</h2>
          <div className="w-10 h-1 bg-[var(--awrs-primary)] rounded-full mt-4 mb-10" />
        </Reveal>

        <Reveal delay={120}>
          <a
            href={SITE.github}
            target="_blank"
            rel="noopener noreferrer"
            className="group flex flex-col gap-4 rounded-2xl border border-[var(--awrs-border)] p-6 transition-colors hover:border-[var(--awrs-primary)] md:flex-row md:items-center md:justify-between md:p-8"
          >
            <div className="flex items-center gap-3">
              <div
                className="w-10 h-10 rounded-xl flex items-center justify-center"
                style={{
                  background: "color-mix(in srgb, var(--awrs-primary) 10%, transparent)",
                }}
              >
                <GithubIcon
                  className="w-5 h-5"
                  style={{ color: "var(--awrs-primary)" }}
                />
              </div>
              <div>
                <p className="font-semibold">@{SITE.githubHandle}</p>
                <p className="text-sm text-[var(--awrs-text-secondary)]">
                  Repositories, commits and contribution activity on GitHub
                </p>
              </div>
            </div>

            <span className="inline-flex items-center gap-2 self-start rounded-full border border-[var(--awrs-border)] px-5 py-2.5 text-sm font-medium transition-colors group-hover:border-[var(--awrs-primary)] group-hover:text-[var(--awrs-primary)] md:self-auto">
              View profile
              <ArrowUpRight size={16} aria-hidden="true" />
            </span>
          </a>
        </Reveal>
      </div>
    </section>
  );
}
