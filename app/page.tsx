import Image from "next/image";

const itemData = [
  {
    img: "https://images.unsplash.com/photo-1549388604-817d15aa0110",
    title: "Bed",
    author: "swabdesign",
  },
  {
    img: "https://images.unsplash.com/photo-1525097487452-6278ff080c31",
    title: "Books",
    author: "Pavel Nekoranec",
  },
  {
    img: "https://images.unsplash.com/photo-1523413651479-597eb2da0ad6",
    title: "Sink",
    author: "Charles Deluvio",
  },
  {
    img: "https://images.unsplash.com/photo-1563298723-dcfebaa392e3",
    title: "Kitchen",
    author: "Christian Mackie",
  },
  {
    img: "https://images.unsplash.com/photo-1588436706487-9d55d73a39e3",
    title: "Blinds",
    author: "Darren Richardson",
  },
  {
    img: "https://images.unsplash.com/photo-1574180045827-681f8a1a9622",
    title: "Chairs",
    author: "Taylor Simpson",
  },
  {
    img: "https://images.unsplash.com/photo-1530731141654-5993c3016c77",
    title: "Laptop",
    author: "Ben Kolde",
  },
  {
    img: "https://images.unsplash.com/photo-1481277542470-605612bd2d61",
    title: "Doors",
    author: "Philipp Berndt",
  },
  {
    img: "https://images.unsplash.com/photo-1517487881594-2787fef5ebf7",
    title: "Coffee",
    author: "Jen P.",
  },
  {
    img: "https://images.unsplash.com/photo-1516455207990-7a41ce80f7ee",
    title: "Storage",
    author: "Douglas Sheppard",
  },
  {
    img: "https://images.unsplash.com/photo-1597262975002-c5c3b14bbd62",
    title: "Candle",
    author: "Fi Bell",
  },
  {
    img: "https://images.unsplash.com/photo-1519710164239-da123dc03ef4",
    title: "Coffee table",
    author: "Hutomo Abrianto",
  },
];
export default function Home() {
  // number that reprepsents the aspcect ratio of the image, which is 266x396 with the padding-bottom hack
  const aspectRatio = (396 / 266) * 100;
  //const aspectRatio = 266 / 396;

  return (
    <div className="-mt-0.5 flex h-full md:mt-0 md:-space-x-0.5">
      <ul className="py-4 px-5 hidden w-full max-w-64 rounded-xl border-2 border-black md:block space-y-3">
        <li>Project 1</li>
        <li>Project 2</li>
        <li>Project 3</li>
        <li>Project 4</li>
      </ul>
      <div className="h-full grow overflow-y-auto overflow-x-hidden rounded-xl border-2 border-black">
        <div className="-mt-0.5 -mb-0.5 grid grid-cols-3 group w-[calc(100%+4px)]">
          {itemData.map((item) => (
            <li
              key={item.img}
              className="relative overflow-hidden rounded-xl border-2 border-black [&:nth-child(3n)]:-ml-0.5 [&:nth-child(3n+2)]:-ml-0.5 [&:nth-child(n+3)]:-mt-0.5"
              style={{ paddingBottom: `${aspectRatio}%` }}
            >
              <Image
                src={`${item.img}?w=248&fit=crop&auto=format`}
                fill={true}
                alt={item.title}
                loading="lazy"
                className="absolute inset-0 w-full h-full object-cover"
              />
            </li>
          ))}
        </div>
      </div>
    </div>
  );
}
