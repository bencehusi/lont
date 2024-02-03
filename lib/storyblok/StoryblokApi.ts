import qs from 'qs';

export function storyblokApi() {
  return {
    get: async (url: string | URL, params: any) => {
      const response = await fetch(
        `${process.env.STORYBLOK_API_URL}/${url}?${qs.stringify(params)}`
      );
      const data = await response?.json();
      return data;
    }
  };
}