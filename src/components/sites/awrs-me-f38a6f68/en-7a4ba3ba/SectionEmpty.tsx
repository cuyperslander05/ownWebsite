/**
 * Placeholder shown by a section that has no entries yet.
 *
 * The sections are kept in place (and in the nav, sitemap and 404 links) while
 * their content is being written, so this states plainly that there is nothing
 * here yet rather than filling the space with invented copy.
 */
export function SectionEmpty({ children }: { children: React.ReactNode }) {
  return (
    <div className="rounded-2xl border border-dashed border-[var(--awrs-border)] px-6 py-12 text-center">
      <p className="text-sm text-[var(--awrs-text-tertiary)]">{children}</p>
    </div>
  );
}
