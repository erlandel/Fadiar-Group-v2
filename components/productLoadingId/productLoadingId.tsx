

export default function ProductLoadingId() {
    return( 
    <>
          <div >
            <div className="h-8 bg-gray-200 rounded w-1/4 mb-4  animate-shimmer"></div>
            <div className="h-10 bg-gray-200 rounded w-1/2 mb-10 animate-shimmer"></div>
            <div className="flex flex-col md:flex-row gap-16">
              <div className="md:w-1/3 h-[400px] bg-gray-200 rounded-xl animate-shimmer"></div>
              <div className="md:w-2/3 space-y-4">
                <div className="h-6 bg-gray-200 rounded w-1/3 animate-shimmer"></div>
                <div className="h-10 bg-gray-200 rounded w-1/2 animate-shimmer"></div>
                <div className="h-8 bg-gray-200 rounded w-1/4 animate-shimmer"></div>
              </div>
            </div>
          </div>
    </>
    );
       
    }
