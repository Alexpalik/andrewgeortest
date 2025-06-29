"use client";

import React, { FC, useState } from "react";
import Nav from "@/shared/Nav/Nav";
import NavItem from "@/shared/NavItem/NavItem";
import { ChevronDownIcon } from "@heroicons/react/24/outline";
import ButtonPrimary from "@/shared/Button/ButtonPrimary";
import TabFilters from "@/components/TabFilters";
import { Transition } from "@/app/headlessui";

export interface HeaderFilterSearchPageProps {
  className?: string;
}

const HeaderFilterSearchPage: FC<HeaderFilterSearchPageProps> = ({
  className = "mb-12",
}) => {
  const [isOpen, setIsOpen] = useState(true);
  const [tabActive, setTabActive] = useState("All items");

  return (
    <div className={`flex flex-col relative ${className}`}>
 
      <Transition
        show={isOpen}
        as={"div"}
        enter="transition-opacity duration-150"
        enterFrom="opacity-0"
        enterTo="opacity-100"
        leave="transition-opacity duration-150"
        leaveFrom="opacity-100"
        leaveTo="opacity-0"
      >
        <div className="w-full border-b border-neutral-200/70 dark:border-neutral-700 my-8"></div>
      </Transition>
    </div>
  );
};

export default HeaderFilterSearchPage;
