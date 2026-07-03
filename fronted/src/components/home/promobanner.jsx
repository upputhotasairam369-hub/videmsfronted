import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';

const PromoBanner = ({
  text,
  subtext,
  bgColor = 'bg-red-600',
  textColor = 'text-white',
  link = '#',
}) => (
  <Link to={link} className="block">
    <div
      className={`${bgColor} ${textColor} py-3 md:py-4 px-4 text-center relative overflow-hidden group`}
    >
      <div className="relative z-10 flex flex-col sm:flex-row items-center justify-center gap-1 sm:gap-2">
        <p className="font-bold text-sm md:text-lg tracking-wide">{text}</p>
        {subtext && (
          <p className="text-xs md:text-sm opacity-90 flex items-center">
            {subtext}
            <ArrowRight className="w-4 h-4 ml-1 inline-block group-hover:translate-x-1 transition-transform" />
          </p>
        )}
      </div>
    </div>
  </Link>
);

export default PromoBanner;
