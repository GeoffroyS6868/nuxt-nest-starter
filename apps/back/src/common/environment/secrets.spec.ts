import { getFrontUrl, getJwtToken } from "./secrets";

const ENV_KEYS = ["NODE_ENV", "JWT_KEY", "FRONT_URL"] as const;

describe("production secrets", () => {
  const snapshot: Partial<Record<(typeof ENV_KEYS)[number], string | undefined>> = {};

  beforeEach(() => {
    for (const key of ENV_KEYS) {
      snapshot[key] = process.env[key];
    }
  });

  afterEach(() => {
    for (const key of ENV_KEYS) {
      const value = snapshot[key];
      if (value === undefined) {
        delete process.env[key];
      } else {
        process.env[key] = value;
      }
    }
  });

  describe("getJwtToken", () => {
    it("accepts a short key outside production", () => {
      process.env.NODE_ENV = "development";
      process.env.JWT_KEY = "short";

      expect(getJwtToken()).toBe("short");
    });

    it("rejects a short key in production", () => {
      process.env.NODE_ENV = "production";
      process.env.JWT_KEY = "change-me-in-production";

      expect(() => getJwtToken()).toThrow(/32 characters/);
    });

    it("accepts a long key in production", () => {
      process.env.NODE_ENV = "production";
      process.env.JWT_KEY = "a".repeat(32);

      expect(getJwtToken()).toBe("a".repeat(32));
    });
  });

  describe("getFrontUrl", () => {
    it("defaults to localhost outside production", () => {
      process.env.NODE_ENV = "development";
      delete process.env.FRONT_URL;

      expect(getFrontUrl()).toBe("http://localhost:4000");
    });

    it("requires FRONT_URL in production", () => {
      process.env.NODE_ENV = "production";
      delete process.env.FRONT_URL;

      expect(() => getFrontUrl()).toThrow(/FRONT_URL/);
    });
  });
});
