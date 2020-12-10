import { runInBrowser } from "./scraping/runInBrowser";
import ExtractorScraper from "./exactor/extractorScraper";

(async () => {
  const rootUrl = "https://billtech.pl/";

  const urls: string[] = await runInBrowser(async (browser) =>
    new ExtractorScraper(() => browser.newPage()).scrape(rootUrl)
  );

  console.table(urls);
})().catch((e) => console.error(e));
