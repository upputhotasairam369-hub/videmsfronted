import React from 'react';
import { Facebook, Instagram, MessageCircle } from 'lucide-react';

const SocialIcons = () => {
  const icons = [
    { name: 'Facebook', Icon: Facebook, href: '#', hoverClass: 'hover:bg-[#1877F2]' },
    { name: 'Instagram', Icon: Instagram, href: 'https://www.instagram.com/videmsfurnituree/', hoverClass: 'hover:bg-[#E4405F]' },
    { name: 'WhatsApp', Icon: MessageCircle, href: 'https://wa.me/919676781007', hoverClass: 'hover:bg-[#25D366]' },
  ];

  return (
    <div className="flex flex-wrap justify-start gap-4 xs:gap-6 md:gap-8 mt-2">
      {icons.map((item, index) => (
        <a
          key={index}
          href={item.href}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={item.name}
          className={`w-9 h-9 xs:w-10 xs:h-10 rounded-full bg-[#1E272E] flex items-center justify-center text-[#C8D0D8] transition-all duration-300 transform hover:scale-110 hover:text-[#FFFFFF] ${item.hoverClass} shadow-sm hover:shadow-md`}
        >
          <item.Icon className="w-4 h-4 xs:w-5 xs:h-5" />
        </a>
      ))}
    </div>
  );
};

export default SocialIcons;
