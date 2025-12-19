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
          <div className="bg-white max-w-[184px] md:max-w-[250px] p-2 md:p-3 border border-gray-300 rounded-2xl shadow-sm h-[500px] flex flex-col justify-between animate-pulse">
            {/* Imagen skeleton */}
            <div
              className="w-full h-4/12 bg-gray-200 rounded-2xl shrink-0"
              style={{ minHeight: "190px" }}
            />
  
            {/* Contenido skeleton */}
            <div className="flex flex-col h-2/12">
              <div className="h-4 bg-gray-200 rounded w-20 mb-2" />
              
              <div className="mb-4 space-y-2">
                <div className="h-5 bg-gray-200 rounded w-full" />
                <div className="h-5 bg-gray-200 rounded w-3/4" />
                <div className="h-4 bg-gray-200 rounded w-1/2" />
              </div>
            </div>
  
            {/* Precio y acciones skeleton */}
            <div className="flex flex-col h-3/12 justify-end">
              <div className="h-4 bg-gray-200 rounded w-32 mb-3" />
              <div className="h-8 bg-gray-200 rounded w-40 mb-4" />
              
              <div className="mt-auto pt-4 flex items-center justify-between">
                <div className="h-10 bg-gray-200 rounded-2xl w-28" />
                <div className="h-10 bg-gray-200 rounded-2xl w-16" />
              </div>
            </div>
          </div>
        ) : (
          <div
            className={`bg-white p-2 sm:p-4 border border-gray-300 rounded-2xl shadow-sm h-full flex flex-row gap-3 lg:gap-8 max-w-[${maxWidthVertical}] animate-pulse`}
          >
            {/* Imagen skeleton */}
            <div className="w-35 sm:w-48 h-40 bg-gray-200 rounded-2xl shrink-0" />
  
            <div className="flex-1 flex flex-col">
              {/* Categoría skeleton */}
              <div className="h-4 bg-gray-200 rounded w-24 mb-2" />
  
              {/* Título y marca skeleton */}
              <div className="mb-3 space-y-2">
                <div className="h-5 bg-gray-200 rounded w-full" />
                <div className="h-5 bg-gray-200 rounded w-4/5" />
                <div className="h-4 bg-gray-200 rounded w-1/3" />
              </div>
  
              {/* Garantía skeleton */}
              <div className="h-4 bg-gray-200 rounded w-32 mb-2" />
  
              {/* Precio skeleton */}
              <div className="h-8 bg-gray-200 rounded w-40 mb-4" />
  
              {/* Acciones skeleton */}
              <div className="mt-auto flex items-center justify-between gap-2">
                <div className="h-10 bg-gray-200 rounded-xl w-32" />
                <div className="h-10 bg-gray-200 rounded-xl w-20" />
              </div>
            </div>
          </div>
        )}
      </>
    );
  }