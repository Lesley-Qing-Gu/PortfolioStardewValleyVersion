
import React from 'react';
import { House } from '../types';

interface HouseNodeProps {
  house: House;
  onClick: (e: React.MouseEvent) => void;
  isNear: boolean;
}

const HouseNode: React.FC<HouseNodeProps> = ({ house, onClick, isNear }) => {
  return (
    <div 
      className={`absolute group cursor-pointer transition-all duration-300 z-10`}
      style={{ 
        left: `${house.x}%`, 
        top: `${house.y}%`,
        width: '140px',
        height: '140px',
        transform: 'translate(-50%, -50%)'
      }}
      onClick={onClick}
    >
      <div className="relative w-full h-full flex flex-col items-center justify-center">
        {/* Animated Arrow Pointer when hover OR near */}
        <div className={`absolute -top-12 animate-bounce transition-opacity duration-300 ${(isNear || true) ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'}`}>
           <div className={`text-3xl drop-shadow-[0_2px_0_#000] ${isNear ? 'text-[#e6c58d]' : 'text-white'}`}>▼</div>
        </div>

        {/* The House Icon - Pulse effect when character is near */}
        <div className={`text-8xl transition-transform duration-300 
          ${isNear ? 'scale-125 drop-shadow-[0_0_30px_rgba(255,215,0,1)] animate-pulse' : 'group-hover:scale-110'}`}>
          {house.icon.endsWith('.png') ? (
            <img src={house.icon} alt={house.category} style={{ width: 'auto', height: '80px', imageRendering: 'pixelated' }} />
          ) : (
            house.icon
          )}
        </div>
        
        {/* Tooltip-like label */}
        <div className={`absolute -bottom-10 px-4 py-2 text-[#3e2723] text-2xl transition-opacity duration-300 whitespace-nowrap z-30 pointer-events-none font-bold
          ${isNear ? 'opacity-100 scale-110' : 'opacity-0 group-hover:opacity-100'}`}
          style={{
            background: '#8B4A0F',
            padding: '3px',
            imageRendering: 'pixelated'
          }}>
          <div style={{
            background: '#E29A2D',
            padding: '2px'
          }}>
            <div style={{
              background: '#F6B24A',
              padding: '2px'
            }}>
              <div style={{
                background: '#C8751C',
                padding: '2px'
              }}>
                <div style={{
                  background: '#FFD692',
                  padding: '8px 16px'
                }}>
                  {house.category}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Entrance Glow */}
        {isNear && (
          <div className="absolute inset-0 bg-yellow-300/40 rounded-full blur-2xl animate-pulse pointer-events-none" />
        )}
      </div>
    </div>
  );
};

export default HouseNode;
