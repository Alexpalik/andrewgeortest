import Logo from "@/shared/Logo/Logo";
import SocialsList1 from "@/shared/SocialsList1/SocialsList1";
import { CustomLink } from "@/data/types";
import React from "react";

export interface WidgetFooterMenu {
  id: string;
  title: string;
  menus: CustomLink[];
}

const widgetMenus: WidgetFooterMenu[] = [
  {
    id: "1",
    title: "Ας Ξεκινήσουμε",
    menus: [
      { href: "/", label: "Φτιάξε τη λίστα σου" },
      { href: "/registries", label: "Ανακάλυψε μια Λίστα" },
      { href: "/", label: "Αγόρασε Τώρα" },
      { href: "/blog", label: "Blog" },
    ],
  },
  {
    id: "2",
    title: "Σχετικά με την GrantDays",
    menus: [
      { href: "/about", label: "Η ιστορία μας" },
      { href: "/how-it-works", label: "Πως Λειτουργεί" },
      { href: "/", label: "Ανακάλυψε Περισσότερα Πλεονεκτήματα" },
      { href: "/events", label: "Events για να Γιορτάσεις" },
    ],
  },
  {
    id: "3",
    title: "Έχεις Απορίες",
    menus: [
      { href: "/", label: "Συχνές Ερωτήσεις" },
      { href: "/shipping-policy", label: "Αποστολή & Παράδοση" },
      { href: "/payment-delivery-returns-policy", label: "Πολιτική Επιστροφών" },
      { href: "/", label: "Παρακολούθησε την Παραγγελία σου" },
      { href: "/contact-us", label: "Επικοινώνησε Μαζί μας" },
    ],
  },
];

const Footer: React.FC = () => {
  const renderWidgetMenuItem = (menu: WidgetFooterMenu, index: number) => {
    return (
      <div key={index} className="text-sm">
        <h2 className=" mb-4" style={{ color: '#063B67' }}>
          {menu.title}
        </h2>
        <ul className="space-y-3">
          {menu.menus.map((item, index) => (
            <li key={index}>
              <a
                key={index}
                className="hover:text-blue-600 dark:hover:text-blue-400"
                href={item.href}
                rel="noopener noreferrer"
                style={{ color: '#063B67' }}
              >
                {item.label}
              </a>
            </li>
          ))}
        </ul>
      </div>
    );
  };

  return (
    <div className="nc-Footer relative bg-gray-50 dark:bg-neutral-900">
      {/* Header Section */}
      <div className="border-b border-neutral-200 dark:border-neutral-700 py-8">
        <div className="container text-center">
          <p className="text-sm mb-2 font-medium tracking-wider uppercase" style={{ color: '#063B67' }}>
            GRANT ACCESS TO THE NEW INTERACTIVE & INTERNATIONAL SHOPPING & GIFT REGISTRY E-PLATFORM
          </p>
          <h2 className="text-xl md:text-2xl font-medium" style={{ color: '#063B67' }}>
            Create your online gift list, Shop for you, Organize a group activity, Travel, Create memories!
          </h2>
        </div>
      </div>

      {/* Main Footer Content */}
      <div className="container py-16">
        <div className="flex justify-center">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 max-w-[100rem]">
            {/* Logo and Social Section */}
            <div className="lg:col-span-1">
              <div className="mb-6">
                <img 
                  src="https://grnds-registry-sandbox.s3.amazonaws.com/media/registries/264/2644c41a-bb03-4bdc-87c6-5c8599f2fb5a/Group%203433.png"
                  alt="Grant Days Logo"
                  className="h-24 w-auto mb-2"
                />
             
              </div>
              <div>
                <h3 className=" mb-4" style={{ color: '#063B67' }}>
                  FOLLOW US
                </h3>
                <div className="flex space-x-3">
                  <a href="#" className="w-8 h-8 bg-blue-600 rounded-none flex items-center justify-center text-white hover:bg-blue-700">
                    <i className="lab la-facebook-f"></i>
                  </a>
                  <a href="#" className="w-8 h-8 bg-pink-600 rounded-none flex items-center justify-center text-white hover:bg-pink-700">
                    <i className="lab la-instagram"></i>
                  </a>
                </div>
              </div>
            </div>

            {/* Menu Columns */}
            {widgetMenus.map(renderWidgetMenuItem)}

            {/* Newsletter Section */}
            <div className="lg:col-span-1">
              <h3 className=" mb-4" style={{ color: '#063B67' }}>
                Εγγραφή στο Newsletter μας
              </h3>
              <div className="flex">
                <input
                  type="email"
                  placeholder="e-mail"
                  className="flex-1 px-4 py-3 border border-neutral-300 dark:border-neutral-600 rounded-l-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-neutral-800 dark:text-white"
                />
                <button 
                  className="text-white px-6 py-3 rounded-r-md hover:bg-blue-700 font-medium"
                  style={{ backgroundColor: '#063B67' }}
                >
                  ΕΓΓΡΑΦΗ
                </button>
              </div>
              <div className="mt-6">
                <a href="#" className="hover:underline font-medium" style={{ color: '#063B67' }}>
                  Refer a friend
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Section */}
      <div className="border-t border-neutral-200 dark:border-neutral-700 py-6">
        <div className="container">
        </div>
      </div>
    </div>
  );
};

export default Footer;
