"use client"
import { Dialog, Transition, TransitionChild } from "@/app/headlessui"
import React, { useState } from "react"
import ButtonClose from "@/shared/ButtonClose/ButtonClose"
import ProductQuickView from "./ProductQuickView"
import { usePathname } from "next/navigation"

const ModalQuickView = ({ show, onCloseModalQuickView, product }) => {
  const pathname = usePathname()
  const [variantActive, setVariantActive] = useState(0)

  return (
    <Transition appear show={show}>
      <Dialog
        as="div"
        className="fixed inset-0 z-50"
        onClose={onCloseModalQuickView}
      >
        <div className="flex items-stretch md:items-center justify-center h-full text-center md:px-4">
          <TransitionChild
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-black/40 dark:bg-black/70" />
          </TransitionChild>

          <span className="inline-block align-middle" aria-hidden="true">
            &#8203;
          </span>

          <TransitionChild
            enter="ease-out duration-300"
            enterFrom="opacity-0 scale-95"
            enterTo="opacity-100 scale-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100 scale-100"
            leaveTo="opacity-0 scale-95"
          >
            <div className="relative inline-flex xl:py-8 w-full max-w-5xl max-h-full">
              <div className="flex-1 flex overflow-hidden max-h-full p-8 w-full text-left align-middle transition-all transform lg:rounded-2xl bg-white dark:bg-neutral-900 dark:border dark:border-slate-700 dark:text-slate-100 shadow-xl">
                <span className="absolute end-3 top-3 z-50">
                  <ButtonClose onClick={onCloseModalQuickView} />
                </span>

                <div className="flex-1 overflow-y-auto rounded-none hiddenScrollbar">
                  <ProductQuickView
                    product={product}
                    variantActive={variantActive}
                    onVariantChange={setVariantActive}
                  />
                </div>
              </div>
            </div>
          </TransitionChild>
        </div>
      </Dialog>
    </Transition>
  )
}

export default ModalQuickView
