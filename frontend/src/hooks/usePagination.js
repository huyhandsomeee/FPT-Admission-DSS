import { useState, useCallback } from "react";

export default function usePagination(initialPage = 0, initialSize = 20) {
  const [page, setPage] = useState(initialPage);
  const [size, setSize] = useState(initialSize);
  const [totalElements, setTotalElements] = useState(0);

  const totalPages = Math.ceil(totalElements / size);

  const nextPage = useCallback(() => {
    setPage(p => Math.min(p + 1, totalPages - 1));
  }, [totalPages]);

  const prevPage = useCallback(() => {
    setPage(p => Math.max(p - 1, 0));
  }, []);

  const goToPage = useCallback((p) => {
    setPage(Math.max(0, Math.min(p, totalPages - 1)));
  }, [totalPages]);

  const resetPage = useCallback(() => {
    setPage(0);
  }, []);

  return {
    page, setPage, size, setSize,
    totalElements, setTotalElements,
    totalPages, nextPage, prevPage, goToPage, resetPage,
  };
}
