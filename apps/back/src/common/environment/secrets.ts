import { readFileSync } from "fs";

function readOptionalSecret(envName: string, fileName: string): string {
  const fromEnv = process.env[envName];
  if (fromEnv !== undefined) {
    return fromEnv;
  }

  try {
    return readFileSync(`/run/secrets/${fileName}`, "utf8").trim();
  } catch {
    return "";
  }
}

function readRequiredSecret(envName: string, fileName: string, label: string): string {
  const value = readOptionalSecret(envName, fileName);
  if (value) {
    return value;
  }
  throw new Error(`${label} not found`);
}

export function getDatabasePassword(): string {
  return readRequiredSecret("DB_PASSWORD", "starter_db_password", "Database password");
}

export function getJwtToken(): string {
  return readRequiredSecret("JWT_KEY", "starter_jwt_key", "JWT key");
}

export function getGoogleClientSecret(): string {
  return readOptionalSecret("GOOGLE_CLIENT_SECRET", "starter_google_secret");
}

export function getGoogleClientId(): string {
  return readOptionalSecret("GOOGLE_CLIENT_ID", "starter_google_id");
}

export function getGoogleRedirectUri(): string {
  return process.env.GOOGLE_REDIRECT_URI ?? "http://localhost:4001/auth/google/callback";
}

export function getFrontUrl(): string {
  return process.env.FRONT_URL ?? "http://localhost:4000";
}

export function getCookieDomain(): string {
  return process.env.COOKIE_DOMAIN ?? "";
}
