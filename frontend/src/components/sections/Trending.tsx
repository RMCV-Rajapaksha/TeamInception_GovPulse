import useEmblaCarousel from "embla-carousel-react";
import { useCallback } from "react";
import { FiTrendingUp, FiChevronLeft, FiChevronRight } from "react-icons/fi";

export type TrendingItem = {
  id: string;
  title: string;
  imageUrl: string;
};

function Slide({ title, imageUrl }: { title: string; imageUrl: string }) {
  return (
    <div
      className="relative rounded-lg overflow-hidden aspect-[15/8] w-full"
      style={{
        backgroundImage: `url(${imageUrl})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <div className="absolute inset-0 bg-gradient-to-b from-black/0 to-black" />
      <div className="absolute inset-0 p-2 flex items-end">
        <div className="text-white text-xs font-bold leading-tight tracking-tight line-clamp-2">
          {title}
        </div>
      </div>
    </div>
  );
}

export default function Trending({ items }: { items: TrendingItem[] }) {
  const [emblaRef, emblaApi] = useEmblaCarousel({
    loop: false,
    align: "start",
    slidesToScroll: 1,
    dragFree: false,
  });

  const scrollPrev = useCallback(() => emblaApi?.scrollPrev(), [emblaApi]);
  const scrollNext = useCallback(() => emblaApi?.scrollNext(), [emblaApi]);

  return (
    <section className="w-full overflow-x-hidden pt-4">
      <div className="flex items-center gap-2 mb-4">
        <FiTrendingUp className="w-4 h-4 text-black" aria-hidden />
        <h2 className="text-base font-bold text-gray-900">Trending today</h2>
        <div className="ml-auto hidden md:flex items-center gap-1 px-1">
          <button
            type="button"
            aria-label="Previous"
            onClick={scrollPrev}
            className="p-2 rounded-full bg-white/80 shadow ring-1 ring-gray-200 hover:bg-white"
          >
            <FiChevronLeft className="h-5 w-5 text-gray-700" />
          </button>
          <button
            type="button"
            aria-label="Next"
            onClick={scrollNext}
            className="p-2 rounded-full bg-white/80 shadow ring-1 ring-gray-200 hover:bg-white"
          >
            <FiChevronRight className="h-5 w-5 text-gray-700" />
          </button>
        </div>
      </div>

      <div className="relative">
        <div className="embla" ref={emblaRef}>
          <div className="embla__container flex gap-2">
            {items.map((item) => (
              <div
                className="embla__slide shrink-0 basis-[85%] sm:basis-[60%] md:basis-[45%] lg:basis-[33%] xl:basis-[25%] 2xl:basis-[20%]"
                key={item.id}
              >
                <Slide title={item.title} imageUrl={item.imageUrl} />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
