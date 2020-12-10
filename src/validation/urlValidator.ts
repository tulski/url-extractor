import * as assert from "assert";

export function validateUrls(urls: string[]) {
  assert.ok(urls.length);
  for (const url of urls) {
    try {
      assert.ok(url !== undefined);
      assert.ok(url !== null);
      assert.ok(url != "");
    } catch (e) {
      const message = `Invalid url:  ${url}`;
      const stack = new Error(message).stack || "";
      e.stack =
        e.stack +
        "\nCaused by: " +
        stack.split("\n").slice(0, 2).join("\n") +
        "\n";
      throw e;
    }
  }
}
