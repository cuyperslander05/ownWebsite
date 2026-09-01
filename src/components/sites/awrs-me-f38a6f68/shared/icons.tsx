import Image from "next/image";

const LOGO_SRC = "/sites/awrs-me-f38a6f68/en-7a4ba3ba/images/logo.svg";

export function LogoMark({
  size = 24,
  className,
}: {
  size?: number;
  className?: string;
}) {
  return (
    <Image
      src={LOGO_SRC}
      // Decorative: the logo repeats a name the surrounding link or heading
      // already gives, and it now shares the page with an actual portrait
      // whose alt is the name. Empty alt keeps screen readers from saying it
      // four times over.
      alt=""
      width={size}
      height={size}
      className={className}
      priority
    />
  );
}
