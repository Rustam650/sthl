import React from 'react';
import Link from 'next/link';
import { Home, Grid, Briefcase, Image, Phone } from 'react-feather';

const MobileNav = () => {
  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-[#1D1D1D] border-t border-gray-800">
      <div className="flex justify-between px-4 py-3">
        <Link href="/" className="flex flex-col items-center">
          <Home size={20} className="text-gray-100" />
          <span className="text-xs mt-1 text-gray-300">Главная</span>
        </Link>
        <Link href="/stones" className="flex flex-col items-center">
          <Grid size={20} className="text-gray-100" />
          <span className="text-xs mt-1 text-gray-300">Камни</span>
        </Link>
        <Link href="/services" className="flex flex-col items-center">
          <Briefcase size={20} className="text-gray-100" />
          <span className="text-xs mt-1 text-gray-300">Услуги</span>
        </Link>
        <Link href="/portfolio" className="flex flex-col items-center">
          <Image size={20} className="text-gray-100" />
          <span className="text-xs mt-1 text-gray-300">Работы</span>
        </Link>
        <Link href="/contacts" className="flex flex-col items-center">
          <Phone size={20} className="text-gray-100" />
          <span className="text-xs mt-1 text-gray-300">Контакты</span>
        </Link>
      </div>
    </nav>
  );
};

export default MobileNav;