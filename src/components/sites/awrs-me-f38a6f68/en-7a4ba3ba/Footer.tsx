import Link from "next/link";
import { Mail } from "lucide-react";
import { LogoMark } from "../shared/icons";
import { GithubIcon, LinkedinIcon } from "../shared/brand-icons";
import { SITE } from "@/lib/site";
import { Reveal } from "./Reveal";

export function Footer() {
  return (
    <footer className="border-t border-[var(--awrs-border)] py-14">
      <div className="max-w-6xl mx-auto px-6 grid grid-cols-1 gap-8 md:grid-cols-[1.5fr_1fr_1fr_1fr] md:gap-10">
        <Reveal>
          <LogoMark size={28} />
          <p className="mt-4 text-sm text-[var(--awrs-text-secondary)] max-w-xs leading-relaxed">
            {`${SITE.jobTitle} based in ${SITE.countryName}, working with people anywhere.`}
          </p>
        </Reveal>

        <Reveal delay={80}>
          <p className="text-xs font-semibold uppercase tracking-wide text-[var(--awrs-text-tertiary)] mb-3">
            Links
          </p>
          <ul className="flex flex-col gap-2 text-sm text-[var(--awrs-text-secondary)]">
            <li>
              <Link href="/" className="hover:text-[var(--awrs-text)]">
                Home
              </Link>
            </li>
            <li>
              <Link href="/#projects" className="hover:text-[var(--awrs-text)]">
                Projects
              </Link>
            </li>
            <li>
              <Link href="/#experience" className="hover:text-[var(--awrs-text)]">
                Experience
              </Link>
            </li>
            <li>
              <Link href="/#contact" className="hover:text-[var(--awrs-text)]">
                Contact
              </Link>
            </li>
          </ul>
        </Reveal>

        <Reveal delay={160}>
          <p className="text-xs font-semibold uppercase tracking-wide text-[var(--awrs-text-tertiary)] mb-3">
            Legal
          </p>
          <ul className="flex flex-col gap-2 text-sm text-[var(--awrs-text-secondary)]">
            <li>
              <Link href="/privacy" className="hover:text-[var(--awrs-text)]">
                Privacy Policy
              </Link>
            </li>
            <li>
              <Link href="/terms" className="hover:text-[var(--awrs-text)]">
                Terms of Use
              </Link>
            </li>
          </ul>
        </Reveal>

        <Reveal delay={240}>
          <p className="text-xs font-semibold uppercase tracking-wide text-[var(--awrs-text-tertiary)] mb-3">
            Social
          </p>
          <div className="flex gap-3">
            <a
              href={SITE.github}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="GitHub profile"
              className="w-9 h-9 rounded-lg bg-[var(--awrs-bg-secondary)] flex items-center justify-center hover:bg-[var(--awrs-text)] hover:text-white transition-colors"
            >
              <GithubIcon width={16} height={16} />
            </a>
            <a
              href={SITE.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="LinkedIn profile"
              className="w-9 h-9 rounded-lg bg-[var(--awrs-bg-secondary)] flex items-center justify-center hover:bg-[#0077b5] hover:text-white transition-colors"
            >
              <LinkedinIcon width={16} height={16} />
            </a>
            <a
              href={`mailto:${SITE.email}`}
              aria-label={`Email ${SITE.name}`}
              className="w-9 h-9 rounded-lg bg-[var(--awrs-bg-secondary)] flex items-center justify-center hover:bg-[var(--awrs-text)] hover:text-white transition-colors"
            >
              <Mail size={16} />
            </a>
          </div>
        </Reveal>
      </div>

      <div className="max-w-6xl mx-auto px-6 mt-10 pt-6 border-t border-[var(--awrs-border)] text-center text-sm text-[var(--awrs-text-tertiary)]">
        © {new Date().getFullYear()} {SITE.name}. All rights reserved.
      </div>
    </footer>
  );
}
