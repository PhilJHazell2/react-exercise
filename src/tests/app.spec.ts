import { expect, test, type Page } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";

const NASA_SEARCH_ROUTE = "https://images-api.nasa.gov/search**";

// Test PNG so next/image requests never hit the network
const PIXEL_PNG = Buffer.from("TEST", "base64");

const imageItem = (id: string, title: string) => ({
  href: `https://images-assets.nasa.gov/image/${id}/collection.json`,
  data: [
    {
      center: "JSC",
      title,
      keywords: ["moon"],
      location: "",
      nasa_id: id,
      date_created: "1969-07-20T00:00:00Z",
      media_type: "image",
      description: title,
    },
  ],
  links: [
    {
      href: `https://images-assets.nasa.gov/image/${id}/${id}~thumb.jpg`,
      rel: "preview",
      render: "image",
    },
  ],
});

const nasaResponse = (items: ReturnType<typeof imageItem>[]) => ({
  collection: {
    version: "1.0",
    href: "https://images-api.nasa.gov/search",
    items,
  },
});

const mockNasaSearch = async (
  page: Page,
  items: ReturnType<typeof imageItem>[],
) => {
  const requests: URL[] = [];
  await page.route(NASA_SEARCH_ROUTE, async (route) => {
    requests.push(new URL(route.request().url()));
    await route.fulfill({ json: nasaResponse(items) });
  });
  await page.route("**/_next/image**", (route) =>
    route.fulfill({ contentType: "image/png", body: PIXEL_PNG }),
  );
  return requests;
};

// Click away rather than calling blur(): WebKit doesn't fire the blur that
// react-hook-form listens for when blur() is called programmatically
// This could be added to a utility function for reusability across tests if suite grows
const leaveField = (page: Page) =>
  page.getByRole("heading", { name: "React Exercise" }).click();

const fillValidForm = async (
  page: Page,
  {
    keywords = "moon",
    mediaType = "image",
    year = "1969",
  }: { keywords?: string; mediaType?: string; year?: string } = {},
) => {
  await page.getByLabel("Keywords").fill(keywords);
  await page.getByLabel("Media Type").selectOption(mediaType);
  await page.getByLabel("Year").fill(year);
  await leaveField(page);
};

test.describe("HomePage tests", () => {
  test("can view homepage correctly without any accessibility errors", async ({
    page,
  }) => {
    await page.goto(`/`, { waitUntil: "networkidle" });
    await expect(page.locator('h1:has-text("React Exercise")')).toBeVisible();

    const accessibilityScanResults = await new AxeBuilder({ page })
      .include("main")
      .analyze();
    expect(accessibilityScanResults.violations).toEqual([]);
  });

  test("renders the search form with empty fields and a disabled submit button", async ({
    page,
  }) => {
    await page.goto(`/`, { waitUntil: "networkidle" });

    await expect(page.getByLabel("Keywords")).toHaveValue("");
    await expect(page.getByLabel("Media Type")).toHaveValue("");
    await expect(page.getByLabel("Year")).toHaveValue("");
    await expect(page.getByRole("button", { name: "Submit" })).toBeDisabled();
  });

  test("offers audio, image and video media types", async ({ page }) => {
    await page.goto(`/`, { waitUntil: "networkidle" });

    const options = page.getByLabel("Media Type").locator("option");
    await expect(options).toHaveText([
      "Select an option",
      "Audio",
      "Image",
      "Video",
    ]);
  });
});

test.describe("Form validation", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(`/`, { waitUntil: "networkidle" });
  });

  test("shows an error when keywords are too short", async ({ page }) => {
    await page.getByLabel("Keywords").fill("a");
    await leaveField(page);

    await expect(
      page.getByText("Keywords must have at least 2 characters"),
    ).toBeVisible();
  });

  test("shows an error when keywords are too long", async ({ page }) => {
    await page.getByLabel("Keywords").fill("a".repeat(51));
    await leaveField(page);

    await expect(
      page.getByText("Keywords must have at most 50 characters"),
    ).toBeVisible();
  });

  test("treats whitespace-only keywords as too short", async ({ page }) => {
    await page.getByLabel("Keywords").fill("   ");
    await leaveField(page);

    await expect(
      page.getByText("Keywords must have at least 2 characters"),
    ).toBeVisible();
  });

  test("shows an error when no media type is selected", async ({ page }) => {
    await page.getByLabel("Media Type").click();
    await leaveField(page);

    await expect(page.getByText("Please select a media type")).toBeVisible();
  });

  test("shows an error when the year is empty", async ({ page }) => {
    await page.getByLabel("Year").click();
    await leaveField(page);

    await expect(page.getByText("Please enter a valid year")).toBeVisible();
  });

  test("shows an error when the year is before 1900", async ({ page }) => {
    await page.getByLabel("Year").fill("1899");
    await leaveField(page);

    await expect(
      page.getByText("Year start must be greater than 1900"),
    ).toBeVisible();
  });

  test("shows an error when the year is after 2100", async ({ page }) => {
    await page.getByLabel("Year").fill("2101");
    await leaveField(page);

    await expect(page.getByText("Year must be less than 2100")).toBeVisible();
  });

  test("clears the error once the field is corrected", async ({ page }) => {
    await page.getByLabel("Keywords").fill("a");
    await leaveField(page);
    const error = page.getByText("Keywords must have at least 2 characters");
    await expect(error).toBeVisible();

    await page.getByLabel("Keywords").fill("apollo");
    await leaveField(page);
    await expect(error).toBeHidden();
  });

  test("enables submit once every field is valid", async ({ page }) => {
    const submit = page.getByRole("button", { name: "Submit" });
    await expect(submit).toBeDisabled();

    await fillValidForm(page);

    await expect(submit).toBeEnabled();
  });
});

test.describe("Search results", () => {
  test("sends the form values to the NASA API", async ({ page }) => {
    const requests = await mockNasaSearch(page, []);
    await page.goto(`/`, { waitUntil: "networkidle" });

    await fillValidForm(page, {
      keywords: "apollo 11",
      mediaType: "image",
      year: "1969",
    });
    await page.getByRole("button", { name: "Submit" }).click();

    await expect.poll(() => requests.length).toBe(1);
    const params = requests[0]?.searchParams;
    expect(params?.get("keywords")).toBe("apollo 11");
    expect(params?.get("media_type")).toBe("image");
    expect(params?.get("year_start")).toBe("1969");
    expect(params?.get("page_size")).toBe("10");
  });

  test("trims whitespace from keywords before searching", async ({ page }) => {
    const requests = await mockNasaSearch(page, []);
    await page.goto(`/`, { waitUntil: "networkidle" });

    await fillValidForm(page, { keywords: "  mars  " });
    await page.getByRole("button", { name: "Submit" }).click();

    await expect.poll(() => requests.length).toBe(1);
    expect(requests[0]?.searchParams.get("keywords")).toBe("mars");
  });

  test("shows a message when no results are found", async ({ page }) => {
    await mockNasaSearch(page, []);
    await page.goto(`/`, { waitUntil: "networkidle" });

    await fillValidForm(page);
    await page.getByRole("button", { name: "Submit" }).click();

    await expect(page.getByText("No results found")).toBeVisible();
  });

  test("renders a card for each image result", async ({ page }) => {
    await mockNasaSearch(page, [
      imageItem("as11-40-5903", "Apollo 11 Aldrin on the Moon"),
      imageItem("as11-40-5874", "Apollo 11 flag on the Moon"),
    ]);
    await page.goto(`/`, { waitUntil: "networkidle" });

    await fillValidForm(page);
    await page.getByRole("button", { name: "Submit" }).click();

    await expect(page.getByText("Apollo 11 Aldrin on the Moon")).toBeVisible();
    await expect(page.getByText("Apollo 11 flag on the Moon")).toBeVisible();
    await expect(page.getByRole("img", { name: "Nasa Image" })).toHaveCount(2);
  });

  /* TODO: Add tests for video and audio results */
  /* TODO: Consider extending tests to cover edge cases and error handling */
});
