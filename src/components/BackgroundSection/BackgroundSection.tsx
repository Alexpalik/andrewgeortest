import React, { FC } from "react";

export interface BackgroundSectionProps {
  className?: string;
}

const BackgroundSection: FC<BackgroundSectionProps> = ({
  className = "bg-neutral-100/70 dark:bg-black/20",
}) => {
  return (
    <div
      className={`nc-BackgroundSection absolute inset-y-0 w-full xl:max-w-[1340px] 2xl:max-w-screen-2xl left-1/2 transform -translate-x-1/2 xl:rounded-[40px] z-0 ${className}`}
    ></div>
  );
};

export default BackgroundSection;
