import {
  StoryblokComponent as OriginalStoryblokComponent,
  storyblokEditable,
} from "@storyblok/react/rsc";

export function StoryblokComponent(props: any) {
  return (
    <OriginalStoryblokComponent {...props} {...storyblokEditable(props.blok)} />
  );
}
