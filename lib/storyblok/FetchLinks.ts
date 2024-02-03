import qs from 'qs';
// @ts-ignore
import { getStoryblokApi } from '@storyblok/react/rsc';

import { GetLinksParams, GetLinksResponse } from '@/@types/storyblok';
import { getErrorMessage } from '@/utils/errors';

/**
 * If a slug is provided, fetch a single story. Otherwise, fetch multiple stories.
 * The response will be an array of stories if multiple stories are fetched, or a single story
 * if a slug is provided.
 */
export async function fetchLinks(params: GetLinksParams = {}): Promise<GetLinksResponse> {
  const storyblokApi = getStoryblokApi();
  const sbParams: any = {};
  // Transform each field from the params object into a query string
  Object.entries(params).map(([key, value]) => {
    if (value) {
      sbParams[key] =
        ['string', 'number'].indexOf(typeof value) > -1
          ? value
          : Array.isArray(value)
          ? value.join(',')
          : qs.stringify(value, { arrayFormat: 'comma' });
    }
  });
  try {
    const results = await storyblokApi.get('cdn/links/', sbParams);
    const response = {
      // Should only contain links
      ...results?.data,
      error: getErrorMessage(results?.data?.error),
      // storyblokApi includes these for us, normally they're in the response headers.
      total: results?.total || 0,
      per_page: results?.perPage || 0,
      page: params?.page || 1
    };
    return response;
  } catch (error) {
    console.error('fetchLinks error', error);
    return {
      links: {},
      total: 0,
      page: 1,
      per_page: 0,
      error: getErrorMessage(error)
    };
  }
}