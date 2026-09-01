import Image from "next/image";

import { SITE } from "@/lib/site";

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
      alt={SITE.name}
      width={size}
      height={size}
      className={className}
      priority
    />
  );
}
