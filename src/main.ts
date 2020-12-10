import { runInBrowser } from "./scraping/runInBrowser";
import ExtractorScraper from "./exactor/extractorScraper";
import { validateUrls } from "./validation/urlValidator";

(async () => {
  const rootUrl = "https://billtech.pl/";

  const urls: string[] = await runInBrowser(async (browser) =>
    new ExtractorScraper(() => browser.newPage()).scrape(rootUrl)
  );
  validateUrls(urls);
  console.table(urls);
})().catch((e) => console.error(e));
