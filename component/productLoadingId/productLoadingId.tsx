

export default function ProductLoadingId() {
    return( 
    <>
     <main>
        <div className="px-4 md:px-20 2xl:px-36 mt-10">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-1/4 mb-4"></div>
            <div className="h-10 bg-gray-200 rounded w-1/2 mb-10"></div>
            <div className="flex flex-col md:flex-row gap-16">
              <div className="md:w-1/3 h-[400px] bg-gray-200 rounded-xl"></div>
              <div className="md:w-2/3 space-y-4">
                <div className="h-6 bg-gray-200 rounded w-1/3"></div>
                <div className="h-10 bg-gray-200 rounded w-1/2"></div>
                <div className="h-8 bg-gray-200 rounded w-1/4"></div>
              </div>
            </div>
          </div>
        </div>
      </main>
    
    </>
    );
       
    }
