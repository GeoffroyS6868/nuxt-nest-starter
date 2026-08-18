import { resolveCorsOrigins } from "./cors-origins";

describe("resolveCorsOrigins", () => {
  it("allows localhost in development even when extra origins are empty", () => {
    expect(
      resolveCorsOrigins({
        isProduction: false,
        frontUrl: "http://localhost:4000",
        extraOrigins: "",
      }),
    ).toEqual(["http://localhost:4000", "http://localhost:4001"]);
  });

  it("does not allow localhost in production unless listed", () => {
    expect(
      resolveCorsOrigins({
        isProduction: true,
        frontUrl: "https://www.example.com",
        extraOrigins: "https://admin.example.com",
      }),
    ).toEqual(["https://www.example.com", "https://admin.example.com"]);
  });

  it("ignores an invalid FRONT_URL", () => {
    expect(
      resolveCorsOrigins({
        isProduction: true,
        frontUrl: "not-a-url",
        extraOrigins: "https://www.example.com",
      }),
    ).toEqual(["https://www.example.com"]);
  });
});
