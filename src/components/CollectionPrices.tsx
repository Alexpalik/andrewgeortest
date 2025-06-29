import React, { FC } from "react";

export interface PricesProps {
  className?: string;
  price?: number;
  contentClass?: string;
}

const CollectionPrices: FC<PricesProps> = ({
  className = "",
  price = 33,
  contentClass = "text-lg font-medium text-neutral-900 dark:text-white",
}) => {
  return (
    <div className={className}>
      <span className={contentClass}>${price.toFixed(2)}</span>
    </div>
  );
};

export default CollectionPrices;
