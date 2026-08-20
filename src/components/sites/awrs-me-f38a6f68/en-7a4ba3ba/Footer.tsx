import { Mail } from "lucide-react";
import { LogoMark } from "../shared/icons";
import { GithubIcon, LinkedinIcon } from "../shared/brand-icons";

export function Footer() {
  return (
    <footer className="border-t border-[var(--awrs-border)] py-14">
      <div className="max-w-6xl mx-auto px-6 grid grid-cols-1 gap-8 md:grid-cols-[1.5fr_1fr_1fr_1fr] md:gap-10">
        <div>
          <LogoMark size={28} />
          <p className="mt-4 text-sm text-[var(--awrs-text-secondary)] max-w-xs leading-relaxed">
            {
              "{ Work, for Allah will observe your deeds, and so will His Messenger and the believers. }"
            }
          </p>
        </div>

        <div>
          <p className="text-xs font-semibold uppercase tracking-wide text-[var(--awrs-text-tertiary)] mb-3">
            Links
          </p>
          <ul className="flex flex-col gap-2 text-sm text-[var(--awrs-text-secondary)]">
            <li>
              <a href="/">Home</a>
            </li>
            <li>
              <a href="#projects">Projects</a>
            </li>
            <li>
              <a href="#">Blog</a>
            </li>
            <li>
              <a href="#">The Wall</a>
            </li>
          </ul>
        </div>

        <div>
          <p className="text-xs font-semibold uppercase tracking-wide text-[var(--awrs-text-tertiary)] mb-3">
            Legal
          </p>
          <ul className="flex flex-col gap-2 text-sm text-[var(--awrs-text-secondary)]">
            <li>
              <a href="#">Privacy Policy</a>
            </li>
            <li>
              <a href="#">Terms of Use</a>
            </li>
          </ul>
        </div>

        <div>
          <p className="text-xs font-semibold uppercase tracking-wide text-[var(--awrs-text-tertiary)] mb-3">
            Social
          </p>
          <div className="flex gap-3">
            <a
              href="https://github.com/abdulwahed-s"
              target="_blank"
              rel="noopener noreferrer"
              className="w-9 h-9 rounded-lg bg-[var(--awrs-bg-secondary)] flex items-center justify-center hover:bg-[var(--awrs-text)] hover:text-white transition-colors"
            >
              <GithubIcon width={16} height={16} />
            </a>
            <a
              href="https://linkedin.com/in/abdulwahed-s"
              target="_blank"
              rel="noopener noreferrer"
              className="w-9 h-9 rounded-lg bg-[var(--awrs-bg-secondary)] flex items-center justify-center hover:bg-[#0077b5] hover:text-white transition-colors"
            >
              <LinkedinIcon width={16} height={16} />
            </a>
            <a
              href="mailto:abdulwahedaldaghir0@gmail.com"
              className="w-9 h-9 rounded-lg bg-[var(--awrs-bg-secondary)] flex items-center justify-center hover:bg-[var(--awrs-text)] hover:text-white transition-colors"
            >
              <Mail size={16} />
            </a>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-6 mt-10 pt-6 border-t border-[var(--awrs-border)] text-center text-sm text-[var(--awrs-text-tertiary)]">
        © 2026 Abdulwahed Aldaghir. All rights reserved.
      </div>
    </footer>
  );
}
