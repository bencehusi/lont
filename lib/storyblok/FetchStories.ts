import qs from "qs";
import { getStoryblokApi } from "@storyblok/react/rsc";

import { GetStoriesParams, GetStoriesResponse } from "@/@types/storyblok";
import { getErrorMessage } from "@/utils/errors";

/**
 * If a slug is provided, fetch a single story. Otherwise, fetch multiple stories.
 * The response will be an array of stories if multiple stories are fetched, or a single story
 * if a slug is provided.
 */
export async function fetchStories(
  params: GetStoriesParams,
): Promise<GetStoriesResponse> {
  const { slug, cv, ...storyblokApiParams } = params;
  const storyblokApi = getStoryblokApi();
  const sbParams: any = {
    /**
     * In dev mode, we want to fetch the latest, uncached data. We can achieve that by
     * passing the current time.
     */
    cv: cv
      ? cv
      : process.env.NODE_ENV === "production"
        ? undefined
        : Date.now(),
    token: process.env.SB_TOKEN,
  };
  /**
   * Transform each field from the params object into valid a query string.
   */
  Object.entries(storyblokApiParams).map(([key, value]) => {
    if (value) {
      sbParams[key] =
        ["string", "number"].indexOf(typeof value) > -1
          ? value
          : Array.isArray(value)
            ? value.join(",")
            : qs.stringify(value, { arrayFormat: "comma" });
    }
  });
  let storyUrl = `cdn/stories/`;
  if (slug) {
    storyUrl += slug?.join("/");
  }
  // If node env is not production, add preview param
  if (process.env.NODE_ENV !== "production") {
    sbParams["version"] = "draft";
  }
  try {
    const response = await storyblokApi.get(storyUrl, sbParams);
    const data = await response?.data;
    return data;
  } catch (error) {
    console.error("[error] FetchStories", { storyUrl }, { error });
    return {
      stories: [],
      story: null,
      cv: null,
      rels: [],
      links: [],
      error: getErrorMessage(error),
    };
  }
}
