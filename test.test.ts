import withRetry from "fetch-retry";
import { http, HttpResponse } from "msw";
import { it, describe, beforeAll, expect } from "vitest";
import { setupServer } from "msw/node";

const fetchWithRetry = withRetry(fetch, {
  retries: 1,
});

const handlers = [
  http.get("https://foobarbazzz.com/user", () => {
    return HttpResponse.json({ success: true });
  }),
];

describe("test", () => {
  const server = setupServer(...handlers);
  beforeAll(() => {
    server.listen();
  });

  it("should work with native fetch", async () => {
    const result = await (await fetch("https://foobarbazzz.com/user")).json();
    expect(result).toEqual({
      success: true,
    });
  });

  it("should work with fetch-retry", async () => {
    const result = await (
      await fetchWithRetry("https://foobarbazzz.com/user")
    ).json();
    expect(result).toEqual({
      success: true,
    });
  });
});
