export interface GetStoriesParams {
  /**
   * This is the only non-official parameter. It's used to make getting content easier.
   * It needs to match how params are returned from a dynamic route in nextjs.
   * @example
   * `slug=['blog', 'hello-world']`
   * Which equals to `/blog/hello-world`.
   */
  slug?: string[];
  language?: string;
  /**
   * Filter by full_slug. Can be used to retrieve all entries form a specific folder.
   * @example
   * `starts_with=de/beitraege`
   * `starts_with=en/posts`
   * Attention: If you use field level translations and a root folder with the same name of a
   * language code you need to prepend [default] to the path to retrieve the default language
   * @example
   * `starts_with=[default]/de/home`
   */
  starts_with?: string;
  /**
   * Default: published. Possible values: draft, published
   */
  version?: string;
  /**
   * Search content items by full text.
   */
  search_term?: string;
  /**
   * Default: 25, max: 100. Read more at [Pagination](https://www.storyblok.com/docs/api/content-delivery/v2#topics/pagination)
   */
  per_page?: number;
  /**
   * Default: 1. Read more at [Pagination](https://www.storyblok.com/docs/api/content-delivery/v2#topics/pagination)
   */
  page?: number;
  /**
   * Get stories by comma separated full_slug. You can also specify wildcards with *.
   * @example
   * `by_slugs=authors/john,authors/max`
   * `by_slugs=authors/*,articles/*`
   */
  by_slugs?: string | string[];
  content_type?: string;
  /**
   * Resolve relationships to other Stories of a multi-option or single-option field-type.
   * Provide the component name and the field key as comma separated string. Resolved
   * relations can be found in root of response under the property rels. The limit
   * of resolved relationships is 100 Stories. You can't use this filter to
   * resolve relations of resolved entries (eg. nested relationships).
   * @example
   * `resolve_relations=page.author,page.categories`
   */
  resolve_relations?: string | string[];
  /**
   * The parameter resolve_links will automatically resolve internal links of the multilink
   * field type. Resolved links can be found in the links property of the response.
   * Learn more in this [developer guide](https://www.storyblok.com/docs/guide/in-depth/rendering-the-link-field).
   * You can resolve entries going one level deep.
   */
  resolve_links?: "story" | "url" | "link";
  /**
   * Get stories by comma separated uuid.
   * To get a specific language you need to combine it with the parameter language=en
   * (replace en with your langauge)
   * @example
   * `by_uuids=9aa72a2f-04ae-48df-b71f-25f53044dc97,84550816-245d-4fe6-8ae8-b633d4a328f4`
   */
  by_uuids?: string | string[];
  /**
   * Filter by specific attribute(s) of your content type - it will not work for default
   * Story properties. The filter query parameter needs to contain the query operation
   * key. Separate the values by a comma , to filter by multiple values.
   * @example
   * ```typescript
   * const filter_query = {
   *   component: {
   *     in: 'page,article'
   *  },
   * }
   * ```
   * It'll be automatically converted to the following query string using the qs module:
   * filter_query[ATTRIBUTE][OPERATION]=VALUE,...
   * Read more about the [filter query](https://www.storyblok.com/docs/api/content-delivery/v2#filter-queries/overview)
   */
  filter_query?: any;
  /**
   * Only the first (root) level fields are excluded, not the nested attributes
   */
  excluding_fields?: string;
  /**
   * Manage caching of your content.
   */
  cv?: number | undefined;
  preview?: string | undefined;
  /**
   * Sort entries by specific attribute and order with content.YOUR_FIELD:asc and
   * content.YOUR_FIELD:desc. Possible values are all attributes of the entry and all fields of
   * your content type inside content with the dot as seperator. Example: position:desc,
   * content.your_custom_field:asc, content.field_type_xy.field_xy:asc, created_at:desc. If you
   * want to use the sorting provided by the user in the Storyblok admin interface you need to
   * use position:desc. By default all custom fields are sorted as strings. To sort custom
   * fields with numeric values you need to provide the type information (float or int)
   * like following: content.YOUR_FIELD:asc:float or content.YOUR_FIELD:asc:int.
   */
  sort_by?: string | undefined;
}

export interface GetLinksParams {
  language?: string;
  page?: number;
  per_page?: number;
  starts_with?: string;
  paginated?: 1 | null | undefined | 0;
  version?: "draft" | "published";
  cv?: number | undefined;
}

export interface GetLinksResponse {
  links: {
    [key: string]: StoryLink;
  };
  total: number;
  per_page: number;
  page: number;
  error?: string;
}

export interface StoryLink {
  /**
   * Numeric id of the referenced content entry
   */
  id: number;
  /**
   * UUID of the referenced content entry
   */
  uuid: string;
  /**
   * The full_slug of the content entry, including the deployment name (root folder slug)
   * @example
   * `lendahand-com/blog/hello-world`
   */
  slug: string;
  /**
   * Given name of the content entry. IMPORTANT: Do not use it as title for your content.
   * It is only used for internal purposes.
   */
  name: string;
  /**
   * Is this content entry a folder (true/false)
   */
  is_folder: boolean;
  /**
   * Parent folder numeric id
   */
  parent_id: number;
  /**
   * Is this story published (true/false).
   */
  published: boolean;
  /**
   * Numeric position value of the content entry.
   */
  position: number;
  /**
   * The uuid of the content entry.
   */
  uuid: string;
  /**
   * Is this story a startpage (true/false).
   */
  is_startpage: boolean;
  alternates: LinkAlternate[];
  /**
   * The real path of the content entry. This is the path you can use to link to the content entry.
   * @example
   * `/blog/hello-world`
   */
  real_path: string;
}

export type LinkAlternate = {
  path: string;
  name: string | null;
  lang: string;
  published: boolean | null;
  translated_slug: string;
};

export interface Story<StoryContentProps = any> {
  id: string;
  name: string;
  slug: string;
  full_slug: string;
  uuid: string;
  content: StoryContentProps extends unknown
    ? GeneralBlokProps
    : StoryContentProps;
  is_startpage: boolean;
  parent_id: string;
  group_id: string;
  first_published_at: string;
  release_id: string;
  lang: string;
  path: string;
  position: number;
  tag_list: string[];
  meta_data: any;
  translated_slugs: StoryTranslatedSlugs[];
  alternates: any[];
  is_folder: boolean;
  is_page: boolean;
  children: any[];
  sort_by_date: null;
  created_at: string;
  updated_at: string;
  published_at: string;
  default_full_slug: string;
}

export interface StoryTranslatedSlugs {
  path: string;
  name: string;
  lang: string;
  published: boolean;
}

export interface GeneralStoryContent {
  _uid: string;
  content: GeneralBlokProps[];
  seo: StorySeoProps;
  component: string;
}

export interface StorySeoProps {
  _uid: string;
  title: string;
  plugin: string;
  og_image: string;
  og_title: string;
  description: string;
  twitter_image: string;
  twitter_title: string;
  og_description: string;
  twitter_description: string;
}

/**
 * To get local typing, pass the type of the blok as a param.
 */
export interface GeneralBlokProps {
  _uid: string;
  component: string;
  [key: string]: any;
}

export interface GetStoriesResponse {
  stories?: Story[] | undefined;
  story?: Story | null | undefined;
  cv?: string | null;
  rels: any[];
  links: any[];
  error?: string;
}

export interface ResolvedStoryProps<ResolvedStoryProps> {
  id: string;
  url: string;
  linktype: string;
  fieldtype: string;
  cached_url: string;
  story: ResolvedStoryProps extends unknown ? Story : Story<ResolvedStoryProps>;
}

export interface StoryblokAssetProps {
  id: string;
  alt: string;
  name: string;
  focus: string;
  title: string;
  source: string;
  filename: string;
  fieldtype: string;
  meta_data: any;
  is_external_url: boolean;
}

export interface StoryblokRichTextProps {
  type: "doc";
  content: StoryblokRichTextProps[];
}

/**
 * Content type component props
 */

export type PageContentType = Story<{
  _uid: string;
  component: "Page";
}>;
