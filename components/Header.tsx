import Link from 'next/link';
import React from 'react';

const Header = () => {
  return (
    <header className="bg-[#1D1D1D] shadow-lg py-4">
      <nav className="container mx-auto px-4">
        <ul className="flex justify-between items-center">
          <li><Link href="/" className="text-gray-100 hover:text-[#F3B942]">Главная</Link></li>
          <li><Link href="/stones" className="text-gray-100 hover:text-[#F3B942]">Виды камней</Link></li>
          <li><Link href="/services" className="text-gray-100 hover:text-[#F3B942]">Услуги</Link></li>
          <li><Link href="/portfolio" className="text-gray-100 hover:text-[#F3B942]">Портфолио</Link></li>
          <li><Link href="/contacts" className="text-gray-100 hover:text-[#F3B942]">Контакты</Link></li>
        </ul>
      </nav>
    </header>
  );
};

export default Header;