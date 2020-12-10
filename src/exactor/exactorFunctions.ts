export function getAllLinks() {
  return Array.from(document.querySelectorAll("a[href]"), (element) =>
    (element as HTMLAnchorElement).href.trim().replace(/[#;?].*$/, "")
  );
}
