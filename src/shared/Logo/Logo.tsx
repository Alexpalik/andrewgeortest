import React from "react";
import Link from "next/link";
import Image from "next/image";

export interface LogoProps {
  className?: string;
}

const Logo: React.FC<LogoProps> = ({
  className = "flex-shrink-0",
}) => {
  return (
    <Link
      href="/"
      className={`ttnc-logo inline-block text-slate-600 ${className}`}
    >
      <Image
        className="block h-10 sm:h-12 w-auto" // slightly bigger height too
        src="/logo/LOGO-GRANTDAYS-1475.png"
        alt="Logo"
        width={300} // wider
        height={100} // proportional
        priority
      />
    </Link>
  );
};

export default Logo;
