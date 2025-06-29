import React, { FC } from "react";
import twFocusClass from "@/utils/twFocusClass";
import Link from "next/link";

export interface PaginationProps {
  currentPage: number;
  onPageChange: (page: number) => void;
  hasNextPage: boolean;
}

const Pagination: FC<PaginationProps> = ({ currentPage, onPageChange, hasNextPage }) => {
  const pageNumbers = Array.from({ length: currentPage + (hasNextPage ? 1 : 0) }, (_, i) => i + 1);

  return (
    <nav className="nc-Pagination inline-flex space-x-1 text-base font-medium">
      {pageNumbers.map((page) => (
        <button
          key={page}
          className={`inline-flex w-11 h-11 items-center justify-center rounded-none ${
            page === currentPage ? "bg-primary-6000 text-white" : "bg-white border border-neutral-200 text-neutral-6000"
          } ${twFocusClass()}`}
          onClick={() => onPageChange(page)}
        >
          {page}
        </button>
      ))}
    </nav>
  );
};

export default Pagination;
