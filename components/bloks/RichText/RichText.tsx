import { StoryblokComponent } from "@/components/helpers/StoryblokComponent";
/* eslint-disable react/display-name */
import { createElement } from "react";
import cn from "classnames";
import slugify from "slugify";
import {
  render,
  NODE_HEADING,
  NODE_OL,
  NODE_UL,
  NODE_LI,
} from "storyblok-rich-text-react-renderer";

import Styles from "./RichText.module.scss";

export function RichText({
  blok = {} as any,
  className,
  locale,
  story,
  ...rest
}: any) {
  let { type, content } = blok.component ? blok.content : blok;
  return (
    <div className={cn("rich-text space-y-4", className, Styles.RichText)}>
      {render(
        { type, content },
        {
          nodeResolvers: {
            [NODE_HEADING]: function RenderHeadings(children: any, { level }) {
              const props = {
                // Generate a nice and valid ID for each title
                id: children?.reduce((acc: any, child: any) => {
                  if (
                    Object.prototype.toString.call(child) === "[object String]"
                  ) {
                    const cleanedChild = slugify(child);
                    if (acc) {
                      acc = `${acc}-${cleanedChild}`;
                    } else {
                      acc = cleanedChild;
                    }
                  }
                  return acc;
                }, ""),
                className: `heading-${level || 2}`,
              };
              return createElement(`h${level || 2}`, props, children);
            },
            [NODE_OL]: (children) => (
              <ol className="list ordered">{children}</ol>
            ),
            [NODE_UL]: (children) => (
              <ul className="list unordered">{children}</ul>
            ),
            [NODE_LI]: (children) => <li>{children}</li>,
          },
          defaultBlokResolver: (name, props) => {
            console.log("RESOLVER name", locale);
            return (
              <div>
                <StoryblokComponent
                  key={props._uid}
                  blok={{ component: name, ...props }}
                  story={story}
                  locale={locale}
                />
              </div>
            );
          },
        },
      )}
    </div>
  );
}
