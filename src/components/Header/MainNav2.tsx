"use client";

import React, { createRef, FC, useState } from "react";
import Logo from "@/shared/Logo/Logo";
import MenuBar from "@/shared/MenuBar/MenuBar";
import AvatarDropdown from "./AvatarDropdown";
import Navigation from "@/shared/Navigation/Navigation";
import CartDropdown from "./CartDropdown";
import { useRouter } from "next/navigation";
import { XMarkIcon } from "@heroicons/react/24/outline";
import Image from 'next/image';

export interface MainNav2Props {}

const MainNav2: FC<MainNav2Props> = () => {
  const inputRef = createRef<HTMLInputElement>();
  const [showSearchForm, setShowSearchForm] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const router = useRouter();
  const handleLogoClick = () => {
    router.push("/");
  };
  const redirect = () => {
    window.location.assign('/login');
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/search?query=${encodeURIComponent(searchQuery)}`);
      setShowSearchForm(false);
    }
  };

  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const renderMagnifyingGlassIcon = () => {
    return (
      <svg
        width={22}
        height={22}
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M11.5 21C16.7467 21 21 16.7467 21 11.5C21 6.25329 16.7467 2 11.5 2C6.25329 2 2 6.25329 2 11.5C2 16.7467 6.25329 21 11.5 21Z"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M22 22L20 20"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    );
  };

  const renderSearchForm = () => {
    return (
      <div className="relative flex-1 py-2 text-black">
        <form
          className="flex items-center space-x-1.5 px-5 h-full rounded bg-slate-50 relative"
          onSubmit={handleSearchSubmit}
        >
          <input
            type="text"
            placeholder="Search products..."
            className="border-none bg-transparent focus:outline-none focus:ring-0 w-full text-base text-black placeholder-black"
            autoFocus
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />

          <button
            type="button"
            onClick={() => setShowSearchForm(false)}
            className="absolute right-4 text-black hover:text-gray-700 focus:outline-none"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M10 8.586l4.95-4.95a1 1 0 111.414 1.414L11.414 10l4.95 4.95a1 1 0 01-1.414 1.414L10 11.414l-4.95 4.95a1 1 0 01-1.414-1.414L8.586 10l-4.95-4.95a1 1 0 011.414-1.414L10 8.586z"
                clipRule="evenodd"
              />
            </svg>
          </button>
        </form>
      </div>
    );
  };

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

  const renderContent = () => {
    return (
      <div className="h-20 flex justify-between items-center">
        <div className="flex items-center lg:hidden flex-1">
          <button
            onClick={() => setIsMobileMenuOpen(true)}
            className="flex lg:hidden  h-10 sm:w-12 sm:h-12 rounded-none text-white focus:outline-none items-center justify-center cursor-pointer"
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
        </div>

        <div onClick={handleLogoClick} className="lg:flex-1 flex items-center cursor-pointer">
          <Logo className="flex-shrink-0" />
        </div>

        <div className="flex-[3] hidden lg:flex justify-center mx-1">
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

        <div className="flex-1 flex items-center justify-end text-white flex-shrink-0" style={{gap: '4px'}}>
          {/* Search */}
          {!showSearchForm && (
            <button
              className="hidden lg:flex w-10 h-10 rounded-none items-center justify-center cursor-pointer"
              onClick={() => setShowSearchForm(!showSearchForm)}
              aria-label="Open search"
            >
              <Image src="/svg/search.svg" alt="Search" width={20} height={20} />
            </button>
          )}
          {/* Account */}
          <button
            className="w-10 h-10 flex items-center justify-center"
            aria-label="Account"
            onClick={redirect}
          >
            <Image src="/svg/account.svg" alt="Account" width={20} height={20} />
          </button>
          {/* Web/Language */}
          <button className="w-10 h-10 flex items-center justify-center" aria-label="Language" onClick={() => alert('Language selector placeholder')}>
            <Image src="/svg/web.svg" alt="Web" width={20} height={20} />
          </button>
          {/* Cart */}
          <CartDropdown />
        </div>

      </div>
    );
  };

  const [showProductMenu, setShowProductMenu] = useState(false);
  const [showHouseSubmenu, setShowHouseSubmenu] = useState(false);
  let submenuTimeout: NodeJS.Timeout;
  
  const renderWhiteButtonBar = () => {
    const houseCategories = [
      "Οικιακός Εξοπλισμός",
      "Ηλεκτρονικά Μέσα Ψυχαγωγίας",
      "Αξεσουάρ",
      "Βρεφικά & Παιδικά",
      "Αθλητισμός & Άλλες Δραστηριότητες",
    ];
  
    const subCategories = {
      "Διακόσμηση Σπιτιού": [
        "Διακοσμητικά Είδη", "Ρολόγια", "Καθρέπτες", "Κουρτίνες", "Εικόνες σε Καμβά",
        "Διακοσμητικά Μαξιλάρια", "Γλυπτά/Βάζα", "Κεριά/Αρωματικά", "Φανάρια",
        "Γραφείο & Διαχωριστικά", "Χαλιά"
      ],
      "Έπιπλα Σπιτιού": [
        "Καναπέδες", "Πολυθρόνες", "Κομοδίνα", "Βιτρίνες", "Ράφια Τοίχου",
        "Τραπέζια", "Καρέκλες", "Μπαρ", "Γραφείο", "Κρεβάτια", "Ντουλάπες", "Αξεσουάρ"
      ],
      "Υφασμάτινα Είδη": [
        "Σεντόνια", "Κουβέρτες", "Καλύμματα", "Μαξιλάρια", "Τραπεζομάντηλα",
        "Είδη Μπάνιου", "Πετσέτες"
      ],
      "Φωτισμός": [
        "Smart & Deco", "Επιτραπέζια", "Προβολείς", "Φωτιστικά Οροφής",
        "Φωτιστικά Γραφείου", "Φωτιστικά Τοίχου", "Παιδικά", "Εξωτερικά"
      ],
      "Σπίτι - Εξωτερικός Χώρος": [
        "Έπιπλα Κήπου", "Διακόσμηση Κήπου", "Συντήρηση", "Αντηλιακή Προστασία"
      ]
    };
  
    return (
      <div className="bg-white shadow-sm border-t border-slate-200 relative">
        <div className="container flex flex-wrap justify-center gap-2 py-2 relative">
          {/* Προϊόντα with dropdown */}
          <div
            className="relative"
            onMouseEnter={() => {
              clearTimeout(submenuTimeout);
              setShowProductMenu(true);
            }}
            onMouseLeave={() => {
              submenuTimeout = setTimeout(() => {
                setShowProductMenu(false);
                setShowHouseSubmenu(false);
              }, 200); // delay for user to move to submenu
            }}
          >
            <button className="border border-slate-300 px-4 py-2 text-[#063B67] font-medium rounded-none hover:bg-slate-100 transition whitespace-nowrap">
              Προϊόντα
            </button>
  
            {showProductMenu && (
              <div
                className="absolute top-full left-0 mt-1 bg-white text-black shadow-lg border w-64 p-4 z-50"
                onMouseEnter={() => {
                  clearTimeout(submenuTimeout);
                  setShowHouseSubmenu(true);
                }}
                onMouseLeave={() => {
                  submenuTimeout = setTimeout(() => setShowHouseSubmenu(false), 200);
                }}
              >
                <h3 className=" border-b pb-2 mb-2">Σπίτι - Χώροι</h3>
                <ul className="space-y-2">
                  {houseCategories.map((cat) => (
                    <li key={cat} className="hover:text-blue-700 cursor-pointer">
                      {cat}
                    </li>
                  ))}
                </ul>
  
                {/* Submenu (to the right) */}
                {showHouseSubmenu && (
                  <div
                    className="hidden lg:block absolute top-0 left-full ml-2 w-full max-w-md xl:max-w-lg bg-white border shadow-lg p-4 z-50 grid grid-cols-1 xl:grid-cols-2 gap-x-6 gap-y-4"
                    onMouseEnter={() => clearTimeout(submenuTimeout)}
                    onMouseLeave={() => {
                      submenuTimeout = setTimeout(() => {
                        setShowProductMenu(false);
                        setShowHouseSubmenu(false);
                      }, 200);
                    }}
                  >
                    {Object.entries(subCategories).map(([title, items]) => (
                      <div key={title}>
                        <h4 className=" mb-2">{title}</h4>
                        <ul className="space-y-1 text-sm">
                          {items.map((item) => (
                            <li key={item} className="hover:text-blue-700 cursor-pointer">
                              {item}
                            </li>
                          ))}
                        </ul>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
  
          {/* Other menu buttons */}
          <button className="border border-slate-300 px-4 py-2 text-[#063B67] font-medium rounded-none hover:bg-slate-100 transition whitespace-nowrap">
            Ταξίδια & Εμπειρίες
          </button>
          <button className="border border-slate-300 px-4 py-2 text-[#063B67] font-medium rounded-none hover:bg-slate-100 transition whitespace-nowrap">
            'Χρηματικά' Δώρα
          </button>
          <button className="border border-slate-300 px-4 py-2 text-[#063B67] font-medium rounded-none hover:bg-slate-100 transition whitespace-nowrap">
            Έτοιμες Λίστες
          </button>
        </div>
      </div>
    );
  };
  

  // Main (top) menu items
  const mainMenuItems = [
    { label: 'Γάμος', href: '#' },
    { label: 'Βάπτιση', href: '#' },
    { label: 'Special moments', href: '#' },
    { label: 'Προσωπικές αγορές', href: '#' },
  ];

  // Secondary (bottom) menu items
  const secondaryMenuItems = [
    { label: 'Προϊόντα', href: '#' },
    { label: 'Ταξίδια & Εμπειρίες', href: '#' },
    { label: 'Χρηματικά Δώρα', href: '#' },
    { label: 'Έτοιμες Λίστες', href: '#' },
  ];

  return (
    <div className="w-full">
      {/* Main header */}
      <div
        style={{ backgroundColor: '#0A3A65' }}
        className="w-full border-b border-white"
      >
        <div className="container mx-auto flex items-center justify-between h-[96px] px-4">
          {/* Logo */}
          <div className="flex-1 flex justify-center lg:justify-start">
            <Logo className="flex-shrink-0" />
          </div>
          {/* Main menu */}
          <nav className="flex-1 flex justify-center">
            <ul className="flex gap-8 items-center text-base whitespace-nowrap">
              {mainMenuItems.map((item) => (
                <li key={item.label}>
                  <a
                    href={item.href}
                    className="text-white text-lg font-normal hover:underline transition-all whitespace-nowrap"
                  >
                    {item.label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>
          {/* Icons */}
          <div className="flex-1 flex justify-end items-center gap-8">
            {/* Search Icon */}
            {!showSearchForm && (
              <button className="bg-transparent border-none p-0 m-0 flex items-center" aria-label="Search" onClick={() => setShowSearchForm(true)}>
                <img src="/svg/search2.svg" alt="Search" className="w-6 h-6" />
              </button>
            )}
            {/* Search Form */}
            {showSearchForm && (
              <form onSubmit={handleSearchSubmit} className="flex items-center space-x-1.5 px-2 h-10 rounded bg-white relative">
                <input
                  type="text"
                  placeholder="Search products..."
                  className="border-none bg-transparent focus:outline-none focus:ring-0 w-full text-base text-black placeholder-black"
                  autoFocus
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
                <button type="button" onClick={() => setShowSearchForm(false)} className="text-black hover:text-gray-700 focus:outline-none">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 8.586l4.95-4.95a1 1 0 111.414 1.414L11.414 10l4.95 4.95a1 1 0 01-1.414 1.414L10 11.414l-4.95 4.95a1 1 0 01-1.414-1.414L8.586 10l-4.95-4.95a1 1 0 011.414-1.414L10 8.586z" clipRule="evenodd" />
                  </svg>
                </button>
              </form>
            )}
            {/* User Icon */}
            <button className="bg-transparent border-none p-0 m-0 flex items-center" aria-label="Account" onClick={redirect}>
              <img src="/svg/acoount2.svg" alt="Account" className="w-6 h-6" />
            </button>
            {/* Cart Icon */}
            <CartDropdown />
          </div>
        </div>
      </div>
      {/* Secondary bar */}
      <div style={{ backgroundColor: '#DDF2F8' }} className="w-full">
        <div className="container mx-auto flex justify-center items-center h-[48px] px-4">
          <nav className="flex gap-0 items-center w-full justify-center">
            {secondaryMenuItems.map((item, idx) => (
              <React.Fragment key={item.label}>
                <a
                  href={item.href}
                  className="text-[#0A3A65] text-base font-normal px-4 whitespace-nowrap text-sm"
                  style={{ fontFamily: 'inherit' }}
                >
                  {item.label}
                </a>
                {idx < secondaryMenuItems.length - 1 && (
                  <span className="h-6 border-l border-[#0A3A65] mx-1" />
                )}
              </React.Fragment>
            ))}
          </nav>
        </div>
      </div>
    </div>
  );
};

export default MainNav2;
