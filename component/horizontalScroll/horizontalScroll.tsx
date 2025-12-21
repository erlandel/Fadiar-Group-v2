import { RefObject } from "react";

interface PaginationDotsProps {
  totalPages: number;
  activeIndex: number;scrollRef: React.RefObject<HTMLDivElement | null>;

}

export function HorizontalScroll({
  totalPages,
  activeIndex,
  scrollRef,
}: PaginationDotsProps) {
  if (totalPages <= 1) return null;

  return (
    <div className="flex justify-center gap-2 mt-4">
      {Array.from({ length: totalPages }).map((_, index) => (
        <button
          key={index}
          className={`w-2 h-2 rounded-full transition-colors ${
            index === activeIndex ? "bg-accent" : "bg-gray-300"
          }`}
          onClick={() => {
            if (!scrollRef.current) return;

            const containerWidth = scrollRef.current.clientWidth;
            scrollRef.current.scrollTo({
              left: index * containerWidth,
              behavior: "smooth",
            });
          }}
        />
      ))}
    </div>
  );
}
