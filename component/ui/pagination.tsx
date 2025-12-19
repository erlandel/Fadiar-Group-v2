import { useState, useEffect } from 'react';

interface PaginationProps {
  totalPages: number;
  currentPage?: number;
  onPageChange?: (page: number) => void;
}

export default function Pagination({
  totalPages,
  currentPage = 1,
  onPageChange,
}: PaginationProps) {
  const [activePage, setActivePage] = useState(currentPage);
  const [isMobile, setIsMobile] = useState(false);

  // Sincronizar activePage cuando currentPage cambia desde fuera
  useEffect(() => {
    setActivePage(currentPage);
  }, [currentPage]);

  // Detectar breakpoint md
  useEffect(() => {
    const mediaQuery = window.matchMedia('(max-width: 767px)');

    const handleChange = () => {
      setIsMobile(mediaQuery.matches);
    };

    handleChange();
    mediaQuery.addEventListener('change', handleChange);

    return () => {
      mediaQuery.removeEventListener('change', handleChange);
    };
  }, []);

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setActivePage(page);
      onPageChange?.(page);
    }
  };

  const handleNext = () => {
    if (activePage < totalPages) {
      const nextPage = activePage + 1;
      setActivePage(nextPage);
      onPageChange?.(nextPage);
    }
  };

  const handlePrev = () => {
    if (activePage > 1) {
      const prevPage = activePage - 1;
      setActivePage(prevPage);
      onPageChange?.(prevPage);
    }
  };

  const renderPageNumbers = () => {
    const pages: number[] = [];

    if (isMobile) {
      if (totalPages <= 3) {
        for (let i = 1; i <= totalPages; i++) {
          pages.push(i);
        }
      } else if (activePage === 1) {
        pages.push(1, 2, 3);
      } else if (activePage === totalPages) {
        pages.push(totalPages - 2, totalPages - 1, totalPages);
      } else {
        pages.push(activePage - 1, activePage, activePage + 1);
      }
    } else {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    }

    return pages.map((page) => (
      <button
        key={page}
        onClick={() => handlePageChange(page)}
        className={`
          w-12 h-12 rounded-2xl font-medium transition-all duration-300
          ${
            page === activePage
              ? 'bg-[#D69F04] text-black'
              : 'text-[#777777] hover:bg-gray-100'
          }
        `}
      >
        {page}
      </button>
    ));
  };

  return (
    <div className="flex items-center gap-4">
      {/* Botón anterior */}
      <button
        onClick={handlePrev}
        disabled={activePage === 1}
        className={`
          w-12 h-12 rounded-2xl flex items-center justify-center transition-all
          ${
            activePage === 1
              ? 'opacity-0 pointer-events-none'
              : 'text-gray-400 hover:text-gray-600 hover:bg-gray-100'
          }
        `}
      >
        <svg
          className="w-5 h-5"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M15 19l-7-7 7-7"
          />
        </svg>
      </button>

      <div className="flex items-center gap-2 flex-wrap justify-center">
        {renderPageNumbers()}
      </div>

      {/* Botón siguiente */}
      <button
        onClick={handleNext}
        disabled={activePage === totalPages}
        className={`
          w-12 h-12 rounded-2xl flex items-center justify-center transition-all
          ${
            activePage === totalPages
              ? 'opacity-0 pointer-events-none'
              : 'text-gray-400 hover:text-gray-600 hover:bg-gray-100'
          }
        `}
      >
        <svg
          className="w-5 h-5"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M9 5l7 7-7 7"
          />
        </svg>
      </button>
    </div>
  );
}
