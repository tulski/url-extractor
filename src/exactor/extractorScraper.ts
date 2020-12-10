import { Page } from "puppeteer";
import { runInPage } from "../scraping/runInPage";
import { getAllLinks } from "./exactorFunctions";

export default class ExtractorScraper {
  constructor(private readonly pageFactory: () => Promise<Page>) {}

  /**
   * Extract all links bellow given rootLink
   * @param rootLink
   */
  async scrape(rootLink: string): Promise<string[]> {
    return runInPage(this.pageFactory, async (page: Page) => {
      const validLinks: string[] = [];
      let allLinks: string[] = [];
      allLinks.push(rootLink);

      while (allLinks.length) {
        const currentLink = allLinks.pop()!;
        if (
          !validLinks.includes(currentLink) &&
          (await this.isUrlValid(page, currentLink))
        ) {
          const subLinks = await this.scrapeAllSubLinks(page, rootLink);
          allLinks = [...new Set([...allLinks, ...subLinks])];
          validLinks.push(currentLink);
        }
      }

      return validLinks;
    });
  }

  /**
   * Goes to the site and checks the response status. If status is in the range 200-399 returns true
   * @param page
   * @param link to validate
   */
  async isUrlValid(page: Page, link: string): Promise<boolean> {
    const httpResponse = await page.goto(link);
    const status = httpResponse?.status();
    return !!(status && status >= 200 && status <= 399);
  }

  /**
   * Returns all links from already loaded page that includes rootLink
   * @param page (already loaded)
   * @param rootLink
   */
  async scrapeAllSubLinks(page: Page, rootLink: string) {
    const allLinks = await this.getAllLinks(page);
    return allLinks.filter((link) => link.includes(rootLink));
  }

  /**
   * Get all links from already loaded page. Links are trimmed and without any parameters (such as # or ?foo=bar) at the end
   * @param page (already loaded)
   */
  async getAllLinks(page: Page): Promise<string[]> {
    return await page.evaluate(getAllLinks);
  }
}
