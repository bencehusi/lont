/**
 * Workaround for https://github.com/storyblok/storyblok-react/issues/582#issuecomment-1619113128
 */
declare module '@storyblok/react/rsc' {
  export * from '@storyblok/react';
}