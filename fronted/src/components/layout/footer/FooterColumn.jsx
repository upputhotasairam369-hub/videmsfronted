import React from 'react';
import { Link } from 'react-router-dom';

const FooterColumn = ({ title, links }) => {
  return (
    <div className="flex flex-col">
      <h4 className="text-[#FFFFFF] font-bold text-[14px] xs:text-[16px] md:text-[20px] lg:text-[24px] mb-4 xs:mb-6 tracking-wide uppercase">{title}</h4>
      <ul className="space-y-3 xs:space-y-4">
        {links.map((link, index) => (
          <li key={index}>
            <Link
              to={link.path}
              className="text-[#C8D0D8] hover:text-[#F97316] text-[12px] xs:text-[13px] md:text-[14px] lg:text-[16px] font-light transition-all duration-300 flex items-center group py-1 xs:py-0"
            >
              <span className="transform transition-transform duration-300 group-hover:translate-x-2">
                {link.label}
              </span>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default FooterColumn;
