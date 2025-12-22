interface CardSkeletonProps {
    position?: "horizontal" | "vertical";
    maxWidthVertical?: string;
  }
  
  export default function CardSkeleton({
    position = "horizontal",
    maxWidthVertical = "480px",
  }: CardSkeletonProps) {
    return (
      <>
        {position === "vertical" ? (
          <div className="bg-white  p-2 md:p-3 border border-gray-300 rounded-2xl shadow-sm w-45 sm:w-55  h-[500px] flex flex-col justify-between   ">
            {/* Imagen skeleton */}
            <div
              className="w-full h-4/12 bg-gray-200 rounded-2xl shrink-0  animate-shimmer"
              style={{ minHeight: "190px" }}
            />
  
            {/* Contenido skeleton */}
            <div className="flex flex-col h-2/12  ">
              <div className="h-4 bg-gray-200 rounded w-20 mb-2" />
              
              <div className="mb-10 space-y-2">
                <div className="h-5 bg-gray-200 rounded w-45 animate-shimmer" />
                <div className="h-5 bg-gray-200 rounded w-35 animate-shimmer" />
                <div className="h-5 bg-gray-200 rounded w-20 animate-shimmer" />
              </div>
            </div>
  
            {/* Precio y acciones skeleton */}
            <div className="space-y-2 mt-4">
              <div className="h-5 bg-gray-200 rounded w-40 mb-3 animate-shimmer" />
              <div className="h-8 bg-gray-200 rounded w-30 mb-4 animate-shimmer" />
            </div>

            <div className="flex flex-col h-3/12 justify-end  ">              
              <div className="mt-auto pt-4 flex items-center justify-between">
                <div className="h-10 bg-gray-200 rounded-2xl w-25 animate-shimmer" />
                <div className="h-10 bg-gray-200 rounded-2xl w-15 animate-shimmer" />
              </div>
            </div>
          </div>
        ) : (
          <div
            className={`bg-white p-2 sm:p-4 border border-gray-300 rounded-2xl shadow-sm h-full flex flex-row gap-3 lg:gap-8 max-w-[${maxWidthVertical}] `}
          >
            {/* Imagen skeleton */}
            <div className="w-35 sm:w-48 h-40 bg-gray-200 rounded-2xl shrink-0 animate-shimmer"  />
  
            <div className="flex-1 flex flex-col">
              {/* Categoría skeleton */}
              <div className="h-4 bg-gray-200 rounded w-45 mb-2 animate-shimmer" />
  
              {/* Título y marca skeleton */}
              <div className="mb-3 space-y-2">
                <div className="h-5 bg-gray-200 rounded w-35 animate-shimmer" />
                <div className="h-5 bg-gray-200 rounded w-20 animate-shimmer" />
                <div className="h-4 bg-gray-200 rounded w-40 animate-shimmer" />
              </div>
  
              {/* Garantía skeleton */}
              {/* <div className="h-4 bg-gray-200 rounded w-42 mb-2 animate-shimmer" /> */}
  
              {/* Precio skeleton */}
              <div className="h-8 bg-gray-200 rounded w-30 mb-4 animate-shimmer" />
  
              {/* Acciones skeleton */}
              <div className="mt-auto flex items-center justify-between gap-2">
                <div className="h-10 bg-gray-200 rounded-xl w-30 animate-shimmer" />
                <div className="h-10 bg-gray-200 rounded-xl w-15 animate-shimmer" />
              </div>
            </div>
          </div>
        )}
      </>
    );
  }