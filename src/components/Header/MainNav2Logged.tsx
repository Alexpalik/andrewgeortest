"use client";

import React, { createRef, FC, useState, useEffect, useRef } from "react";
import Logo from "@/shared/Logo/Logo";
import MenuBar from "@/shared/MenuBar/MenuBar";
import AvatarDropdown from "./AvatarDropdown";
import Navigation from "@/shared/Navigation/Navigation";
import CartDropdown from "./CartDropdown";
import { XMarkIcon } from "@heroicons/react/24/outline";
import { useRouter } from "next/navigation";
import Image from 'next/image';

export interface MainNav2LoggedProps {}

const MainNav2Logged: FC<MainNav2LoggedProps> = () => {
  const inputRef = createRef<HTMLInputElement>();
  const [showSearchForm, setShowSearchForm] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const router = useRouter();
  
  const inputEl = useRef<HTMLInputElement>(null);
  useEffect(() => {
    if (showSearchForm && inputEl.current) {
      inputEl.current.focus();
    }
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setShowSearchForm(false);
    };
    document.addEventListener('keydown', handleEsc);
    return () => document.removeEventListener('keydown', handleEsc);
  }, [showSearchForm]);

  const [showProductMenu, setShowProductMenu] = useState(false);
  const [showHouseSubmenu, setShowHouseSubmenu] = useState(false);
  let submenuTimeout: NodeJS.Timeout;
  const isMobile = typeof window !== 'undefined' && window.innerWidth < 768;
  const [mobileProductOpen, setMobileProductOpen] = useState(false);
  const [mobileSubmenuOpen, setMobileSubmenuOpen] = useState(false);

  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    setMounted(true);
  }, []);
  
  const menuItems = [
    { label: 'Products', href: '/collection' },
    { label: 'Travel & Experiences', href: '/travel' },
    { label: 'How It Works', href: '/how-it-works' },
    { label: 'Funding', href: '/funding' },
    { label: 'Events', href: '/events' },
    { label: 'Inspiration', href: '/inspiration' },
    { label: 'Invitations', href: '/invitations' },
    { label: 'Registry', href: '/registries', active: true },
  ];

  const renderSearchModal = () => (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-60" onClick={() => setShowSearchForm(false)}>
      <div
        className="relative w-full max-w-lg mx-4 sm:mx-auto bg-white rounded-2xl shadow-2xl p-6 flex flex-col"
        onClick={e => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
      >
        <h2 className="text-lg font-semibold text-center mb-4 text-gray-800 z-10">Search Products</h2>
        <button
          className="absolute top-3 right-3 text-gray-500 hover:text-gray-700 text-2xl focus:outline-none z-20"
          onClick={() => setShowSearchForm(false)}
          aria-label="Close search"
        >
          &times;
        </button>
        <form
          className="flex items-center w-full"
          onSubmit={e => {
            e.preventDefault();
            if (searchQuery.trim()) {
              router.push(`/search?query=${encodeURIComponent(searchQuery)}`);
              setShowSearchForm(false);
            }
          }}
        >
          <input
            ref={inputEl}
            type="text"
            placeholder="Search products..."
            className="flex-1 px-4 py-3 rounded-none border border-gray-200 focus:ring-2 focus:ring-[#61C5C3] focus:outline-none text-base text-black placeholder-gray-400"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
          />
        </form>
      </div>
    </div>
  );

  const renderContent = () => {
    return (
      <div className="h-20 flex items-center justify-between px-2 sm:px-4">
        <div className="flex items-center flex-shrink-0">
          <Logo className="flex-shrink-0" />
        </div>
                <div className="hidden lg:flex flex-[3] justify-center mx-1">
          <nav className="flex items-center gap-x-2 xl:gap-x-4 2xl:gap-x-6">
            {menuItems.map((item) => (
              <a
                key={item.href}
                href={item.href}
                className={`font-medium text-white transition-colors duration-200 hover:underline text-xs lg:text-sm xl:text-base whitespace-nowrap ${item.active ? 'text-[#6ec1e4]' : ''}`}
                style={{ textDecorationColor: '#61C5C3' }}
              >
                {item.label}
              </a>
            ))}
          </nav>
        </div>
        <div className="hidden lg:flex items-center text-white flex-shrink-0" style={{gap: '4px'}}>
          {mounted && (
            <>
              {/* Search */}
              <button
                className="h-10 rounded-none items-center justify-center cursor-pointer flex"
                onClick={() => setShowSearchForm(true)}
                aria-label="Open search"
              >
                <Image src="/svg/search.svg" alt="Search" width={20} height={20} />
              </button>
              {/* Cart */}
              <CartDropdown />
              {/* Account */}
              <AvatarDropdown />
              {/* Web/Language */}
              <button className="h-10 flex items-center justify-center" aria-label="Language" onClick={() => alert('Language selector placeholder')}>
                <Image src="/svg/web.svg" alt="Web" width={20} height={20} />
              </button>
            </>
          )}
        </div>
        {/* Hamburger Menu (Drawer) */}
        <button
          onClick={() => setIsMobileMenuOpen(true)}
          className="flex lg:hidden w-10 h-10 sm:w-12 sm:h-12 rounded-none text-white focus:outline-none items-center justify-center cursor-pointer ml-2"
        >
          <svg
            className="h-6 w-6"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M4 6h16M4 12h16M4 18h16"
            />
          </svg>
        </button>
        {isMobileMenuOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-end">
            <div className="bg-white w-4/5 max-w-xs h-full p-6 relative flex flex-col">
              {/* Close button */}
              <button
                className="absolute top-4 right-4 text-gray-800 text-2xl"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                &times;
              </button>
              {/* Account and Cart actions */}
              <div className="flex flex-col gap-2 mt-2">
                <a href="/account" onClick={() => setIsMobileMenuOpen(false)} className="text-lg text-[#063B67] py-2" style={{ fontFamily: 'Gotham, sans-serif', fontWeight: 400 }}>
                  Account
                </a>
                <a href="/cart" onClick={() => setIsMobileMenuOpen(false)} className="text-lg text-[#063B67] py-2" style={{ fontFamily: 'Gotham, sans-serif', fontWeight: 400 }}>
                  Cart
                </a>
              </div>
              <hr className="border-[#063B67] border-t-2 my-4" />
              {/* Mobile Navigation Links */}
              <nav className="flex flex-col gap-5 text-[#063B67] text-lg mt-2">
                <a href="/collection" onClick={() => setIsMobileMenuOpen(false)} className="block">Products</a>
                <a href="/travel" onClick={() => setIsMobileMenuOpen(false)} className="block">Travel & Experiences</a>
                <a href="/how-it-works" onClick={() => setIsMobileMenuOpen(false)} className="block">How It Works</a>
                <a href="/funding" onClick={() => setIsMobileMenuOpen(false)} className="block">Funding</a>
                <a href="/events" onClick={() => setIsMobileMenuOpen(false)} className="block">Events</a>
                <a href="/inspiration" onClick={() => setIsMobileMenuOpen(false)} className="block">Inspiration</a>
                <a href="/invitations" onClick={() => setIsMobileMenuOpen(false)} className="block">Invitations</a>
                <a href="/registries" onClick={() => setIsMobileMenuOpen(false)} className="block">Registry</a>
              </nav>
            </div>
          </div>
        )}
        {showSearchForm && renderSearchModal()}
      </div>
    );
  };

  return (
    <div
      style={{ backgroundColor: '#063B67' }}
      className="nc-MainNav2Logged relative z-10 dark:bg-neutral-900 border-b border-slate-100 dark:border-slate-700 text-white"
    >
      <div className="container">{renderContent()}</div>
    </div>
  );
};

export default MainNav2Logged;
