import { Page } from "puppeteer";
import { runInPage } from "../scraping/runInPage";
import { getAllLinks } from "./exactorFunctions";

export default class ExtractorScraper {
  constructor(private readonly pageFactory: () => Promise<Page>) {}

  async scrape(rootLink: string): Promise<string[]> {
    return runInPage(this.pageFactory, async (page: Page) => {
      const validLinks: string[] = [];
      let allLinks: string[] = [];
      allLinks.push(rootLink);

      while (allLinks.length) {
        const currentLink = allLinks.pop()!;
        if (!validLinks.includes(currentLink)) {
          const subLinks = await this.scrapeAllSubLinks(
            page,
            currentLink,
            rootLink
          );
          allLinks = [...new Set([...allLinks, ...subLinks])];
          validLinks.push(currentLink);
        }
      }

      return validLinks;
    });
  }

  async scrapeAllSubLinks(page: Page, link: string, rootLink: string) {
    const allLinks = await this.getAllLinks(page, link);
    return allLinks.filter((link) => link.includes(rootLink));
  }

  async getAllLinks(page: Page, link: string): Promise<string[]> {
    const httpResponse = await page.goto(link, {
      waitUntil: "networkidle0",
    });
    const status = httpResponse?.status();
    if (status && status >= 200 && status <= 399) {
      return await page.evaluate(getAllLinks);
    } else {
      return [];
    }
  }
}
