/**
 * Emits a JSON-LD block. Server-rendered, so the structured data is present in
 * the page source for crawlers that do not execute JavaScript.
 *
 * The payload is our own data, never user input, and `<` is escaped so a value
 * containing markup cannot close the script tag early.
 */
export function JsonLd({ data }: { data: object }) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(data).replace(/</g, "\\u003c"),
      }}
    />
  );
}
