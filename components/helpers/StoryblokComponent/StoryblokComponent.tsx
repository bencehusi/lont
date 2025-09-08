import { storyblokEditable } from "@storyblok/react/rsc";

export function StoryblokComponent(props: any) {
  return (
    <div {...storyblokEditable(props.blok)} {...props}>
      {props.children}
    </div>
  );
}
