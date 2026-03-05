import React from 'react';
import { Work } from '../types';

interface WorkFrameProps {
  work: Work;
  houseId?: string;
  onReadMore?: (work: Work) => void;
}

const WorkFrame: React.FC<WorkFrameProps> = ({ work, houseId, onReadMore }) => {
  const isRed = houseId === 'ai-systems';
  const isYellow = houseId === 'accessibility';
  const isHCI = houseId === 'hci';
  const isShorts = houseId === 'shorts';
  
  const bgColor = isRed ? '#B4251F' : isYellow ? '#CE3A2E' : isHCI ? '#4655F' : isShorts ? '#1A191A' : '#B07A47';
  const borderColor = isRed ? '#8B1A1A' : isYellow ? '#28567C' : isHCI ? '#272E37' : isShorts ? '#1A191A' : '#5A311E';
  const lightBg = isRed ? '#F5C4C2' : isYellow ? '#F8BD3E' : isShorts ? '#739DBC' : houseId === 'graphics' ? '#93B0D0' : '#F4F0EA';
  const buttonBg = isYellow ? '#28567C' : borderColor;
  
  return (
    <div className="flex flex-col items-center group cursor-pointer transform transition-all hover:scale-105 active:scale-95">
      {/* Ornate Painting Frame */}
      <div className="relative p-5 border-[8px]" style={{ background: bgColor, borderColor: borderColor }}>
         {/* Inner Frame Light Effect */}
         <div className="absolute inset-2 border-2 border-white/20 pointer-events-none" />
         
         <img 
            src={work.imageUrl} 
            alt={work.title} 
            className="w-64 h-48 object-cover image-rendering-pixelated"
         />
         
         {/* Hover Overlay with info */}
         <div className="absolute inset-5 bg-[#3e2723]/90 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center p-6 text-center border-4" style={{ borderColor: bgColor }}>
            <p className="text-lg font-bold leading-tight no-shadow" style={{ color: lightBg }}>{work.description}</p>
            <button 
              onClick={(e) => {
                e.stopPropagation();
                onReadMore?.(work);
              }}
              className="mt-4 px-4 py-1 text-[#3e2723] text-sm border-2 font-bold"
              style={{ background: lightBg, borderColor: bgColor }}
              onMouseEnter={(e) => e.currentTarget.style.background = bgColor}
              onMouseLeave={(e) => e.currentTarget.style.background = lightBg}
            >
              Read More
            </button>
         </div>
      </div>

      {/* Brass-like nameplate below the painting */}
      <div className="mt-6 px-6 py-2 border-4 no-shadow" style={{ background: lightBg, borderColor: bgColor }}>
        <h3 className="text-[#3e2723] font-bold text-2xl tracking-wide uppercase">
           {work.title}
        </h3>
      </div>
      
      {/* Enlarge tags */}
      <div className="flex flex-wrap justify-center gap-2 mt-3 no-shadow">
        {work.tags.map(t => (
          <span key={t} className="text-base px-3 py-1 font-bold uppercase tracking-tight" style={{ background: buttonBg, color: lightBg }}>
            {t}
          </span>
        ))}
      </div>
    </div>
  );
};

export default WorkFrame;