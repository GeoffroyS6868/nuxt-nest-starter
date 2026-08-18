const LOCAL_DEV_ORIGINS = ["http://localhost:4000", "http://localhost:4001"] as const;

export type CorsOriginOptions = {
  isProduction: boolean;
  frontUrl: string;
  extraOrigins: string;
};

function parseOrigin(url: string): string | undefined {
  try {
    return new URL(url).origin;
  } catch {
    return undefined;
  }
}

function splitOrigins(value: string): string[] {
  return value
    .split(",")
    .map((origin) => origin.trim())
    .filter((origin) => origin.length > 0);
}

export function resolveCorsOrigins(input: CorsOriginOptions): string[] {
  const extra = splitOrigins(input.extraOrigins);
  const frontOrigin = parseOrigin(input.frontUrl);
  const origins = input.isProduction
    ? [...(frontOrigin ? [frontOrigin] : []), ...extra]
    : [...LOCAL_DEV_ORIGINS, ...(frontOrigin ? [frontOrigin] : []), ...extra];

  return [...new Set(origins)];
}
