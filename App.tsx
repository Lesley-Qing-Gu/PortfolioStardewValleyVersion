import React, { useState, useEffect, useCallback, useRef, useMemo } from 'react';
import { Scene, House, Work, Language } from './types';
import { TRANSLATIONS, getLocalizedHouses } from './constants';
import DialogueBox from './components/DialogueBox';
import HouseNode from './components/HouseNode';
import WorkFrame from './components/WorkFrame';

const MOVE_SPEED = 0.3; // Percent per frame
const INTERACTION_DISTANCE = 8; // Percent distance to trigger interaction

const App: React.FC = () => {
  const [lang, setLang] = useState<Language>('en');
  const [scene, setScene] = useState<Scene>(Scene.TITLE);
  const [dialogueIndex, setDialogueIndex] = useState(0);
  const [activeHouse, setActiveHouse] = useState<House | null>(null);
  const [selectedWork, setSelectedWork] = useState<Work | null>(null);
  const [isFading, setIsFading] = useState(false);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [logoError, setLogoError] = useState(false);

  // Character movement state
  const [charPos, setCharPos] = useState({ x: 50, y: 60 });
  const [facingLeft, setFacingLeft] = useState(false);
  const [isWalking, setIsWalking] = useState(false);
  const [targetPos, setTargetPos] = useState<{ x: number, y: number } | null>(null);
  const [autoEnterHouseId, setAutoEnterHouseId] = useState<string | null>(null);
  const [direction, setDirection] = useState<'up' | 'down' | 'left' | 'right'>('down');
  const [animFrame, setAnimFrame] = useState(1);

  // Animation frame toggle
  useEffect(() => {
    if (!isWalking) return;
    const interval = setInterval(() => {
      setAnimFrame(prev => prev === 1 ? 2 : 1);
    }, 200);
    return () => clearInterval(interval);
  }, [isWalking]);

  const keysPressed = useRef<Set<string>>(new Set());
  const requestRef = useRef<number>(null);

  const snowflakes = useMemo(() => 
    Array.from({ length: 50 }, (_, i) => ({
      id: i,
      left: Math.random() * 100,
      delay: -(Math.random() * 10),
      duration: 8 + Math.random() * 4
    })), []
  );

  const t = TRANSLATIONS[lang];
  const houses = getLocalizedHouses(lang);

  // Real-time clock update
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const formattedTime = currentTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  const dayNames = lang === 'cn' ? ['周日', '周一', '周二', '周三', '周四', '周五', '周六'] : ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const dayLabel = dayNames[currentTime.getDay()];

  const transitionTo = (newScene: Scene) => {
    setIsFading(true);
    setTimeout(() => {
      setScene(newScene);
      setIsFading(false);
    }, 800);
  };

  const handleNextDialogue = useCallback(() => {
    if (dialogueIndex < t.dialogues.length - 1) {
      setDialogueIndex(prev => prev + 1);
    } else {
      transitionTo(Scene.FARM);
    }
  }, [dialogueIndex, t.dialogues.length]);

  const handleHouseClick = (house: House) => {
    setTargetPos({ x: house.x, y: house.y });
    setAutoEnterHouseId(house.id);
  };

  const enterHouse = (house: House) => {
    // Re-localize house based on ID to ensure current language
    const localizedActive = houses.find(h => h.id === house.id) || house;
    setActiveHouse(localizedActive);
    setTargetPos(null);
    setAutoEnterHouseId(null);
    transitionTo(Scene.INTERIOR);
  };

  const handleBackToFarm = useCallback(() => {
    transitionTo(Scene.FARM);
    setTimeout(() => setActiveHouse(null), 800);
  }, []);

  const update = useCallback(() => {
    if (scene !== Scene.FARM) return;

    setCharPos(prev => {
      let dx = 0;
      let dy = 0;

      if (keysPressed.current.has('arrowup') || keysPressed.current.has('w')) {
        dy -= MOVE_SPEED;
        setDirection('up');
      }
      if (keysPressed.current.has('arrowdown') || keysPressed.current.has('s')) {
        dy += MOVE_SPEED;
        setDirection('down');
      }
      if (keysPressed.current.has('arrowleft') || keysPressed.current.has('a')) {
        dx -= MOVE_SPEED;
        setDirection('left');
      }
      if (keysPressed.current.has('arrowright') || keysPressed.current.has('d')) {
        dx += MOVE_SPEED;
        setDirection('right');
      }

      if (dx !== 0 || dy !== 0) {
        setTargetPos(null);
        setAutoEnterHouseId(null);
      }

      if (targetPos) {
        const tx = targetPos.x - prev.x;
        const ty = targetPos.y - prev.y;
        const dist = Math.sqrt(tx * tx + ty * ty);
        
        if (dist > 1) {
          dx = (tx / dist) * MOVE_SPEED;
          dy = (ty / dist) * MOVE_SPEED;
          
          // Set direction based on movement
          if (Math.abs(tx) > Math.abs(ty)) {
            setDirection(tx > 0 ? 'right' : 'left');
          } else {
            setDirection(ty > 0 ? 'down' : 'up');
          }
        } else {
          setTargetPos(null);
          if (autoEnterHouseId) {
            const h = houses.find(h => h.id === autoEnterHouseId);
            if (h) enterHouse(h);
          }
        }
      }

      setIsWalking(dx !== 0 || dy !== 0);

      const newX = Math.max(5, Math.min(95, prev.x + dx));
      const newY = Math.max(10, Math.min(90, prev.y + dy));

      return { x: newX, y: newY };
    });

    requestRef.current = requestAnimationFrame(update);
  }, [scene, targetPos, autoEnterHouseId, houses]);

  useEffect(() => {
    if (scene === Scene.FARM) {
      requestRef.current = requestAnimationFrame(update);
    } else {
      if (requestRef.current) cancelAnimationFrame(requestRef.current);
    }
    return () => {
      if (requestRef.current) cancelAnimationFrame(requestRef.current);
    };
  }, [scene, update]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      keysPressed.current.add(e.key.toLowerCase());

      if (scene === Scene.TITLE && (e.key === ' ' || e.key === 'Enter')) {
        transitionTo(Scene.DIALOGUE);
      } else if (scene === Scene.DIALOGUE && (e.key === ' ' || e.key === 'Enter')) {
        handleNextDialogue();
      } else if (scene === Scene.FARM && (e.key === 'e' || e.key === 'Enter' || e.key === ' ')) {
        const nearbyHouse = houses.find(h => {
          const dist = Math.sqrt(Math.pow(h.x - charPos.x, 2) + Math.pow(h.y - charPos.y, 2));
          return dist < INTERACTION_DISTANCE;
        });
        if (nearbyHouse) enterHouse(nearbyHouse);
      } else if (scene === Scene.INTERIOR) {
        if (selectedWork && e.key === 'Escape') {
          setSelectedWork(null);
        } else if (e.key === 'Escape') {
          handleBackToFarm();
        }
      }
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      keysPressed.current.delete(e.key.toLowerCase());
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, [scene, handleNextDialogue, charPos, handleBackToFarm, selectedWork, houses]);

  const onFarmClick = (e: React.MouseEvent) => {
    if (scene !== Scene.FARM) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    setTargetPos({ x, y });
    setAutoEnterHouseId(null);
  };

  return (
    <div className="relative w-screen h-screen overflow-hidden bg-black select-none">
      <div className={`fixed inset-0 bg-black z-[100] pointer-events-none transition-opacity duration-700 ${isFading ? 'opacity-100' : 'opacity-0'}`} />

      {scene === Scene.TITLE && (
        <div 
          className="absolute inset-0 flex flex-col items-center justify-center transition-all duration-1000 bg-cover bg-center"
          style={{ backgroundImage: "url('Background.png')" }}
          onClick={() => transitionTo(Scene.DIALOGUE)}
        >
          {/* Twinkling Stars */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            {[...Array(50)].map((_, i) => (
              <div
                key={i}
                className="absolute w-1 h-1 bg-white rounded-full animate-pulse"
                style={{
                  top: `${Math.random() * 100}%`,
                  left: `${Math.random() * 100}%`,
                  animationDelay: `${Math.random() * 3}s`,
                  animationDuration: `${2 + Math.random() * 2}s`
                }}
              />
            ))}
          </div>
          {/* Language Switcher */}
          <div className="absolute top-8 flex gap-4 z-50 no-shadow" onClick={(e) => e.stopPropagation()}>
            {(['en', 'cn', 'sv'] as Language[]).map(l => (
              <button
                key={l}
                onClick={() => setLang(l)}
                className={`px-4 py-1 text-xl font-bold uppercase transition-all text-[#CC574F] ${lang === l ? 'opacity-100' : 'opacity-50 hover:opacity-75'}`}
                style={{ 
                  backgroundImage: "url('Button.PNG')",
                  backgroundSize: 'cover',
                  backgroundPosition: 'center'
                }}
              >
                {l}
              </button>
            ))}
          </div>

          {!logoError && (
            <img 
              src="LesleyGu.PNG" 
              alt="Lesley Gu" 
              className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] max-w-[90%]"
              style={{ imageRendering: 'pixelated' }}
              onError={() => setLogoError(true)}
            />
          )}
          {logoError && (
             <h1 className="relative z-10 text-9xl text-white text-pixel font-bold drop-shadow-[0_10px_10px_rgba(0,0,0,1)] mb-8 tracking-widest text-center animate-pulse-slow">
              {t.title}<br/><span className="text-4xl block mt-4 text-[#e6c58d]">{t.subtitle}</span>
            </h1>
          )}
          <p className="absolute bottom-8 w-full text-3xl text-[#e6c58d] animate-bounce text-pixel font-bold text-center">{t.pressStart}</p>
        </div>
      )}

      {scene === Scene.DIALOGUE && (
        <div className="absolute inset-0 flex items-center justify-center bg-cover bg-center" style={{ backgroundImage: "url('cityhouse.PNG')" }}>
          <div className="absolute inset-0 bg-black/60" />
          {/* Falling snow */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            {snowflakes.map((flake) => (
              <div
                key={flake.id}
                className="absolute w-2 h-2 bg-white rounded-full opacity-80"
                style={{
                  top: '-10%',
                  left: `${flake.left}%`,
                  animation: `fallDown ${flake.duration}s linear infinite`,
                  animationDelay: `${flake.delay}s`
                }}
              />
            ))}
          </div>
          <style>{`
            @keyframes fallDown {
              from { transform: translateY(-10vh); }
              to { transform: translateY(110vh); }
            }
          `}</style>
          <DialogueBox 
            text={t.dialogues[dialogueIndex]} 
            name={dialogueIndex === 1 ? (lang === 'cn' ? '顾清' : 'Lesley') : undefined}
            onNext={handleNextDialogue} 
          />
        </div>
      )}

      {scene === Scene.FARM && (
        <div 
          className="absolute inset-0 bg-cover bg-center transition-all duration-1000 cursor-crosshair"
          style={{ 
            backgroundImage: `url('worktown.PNG')`,
            backgroundSize: 'cover',
            backgroundPosition: 'center'
          }}
          onClick={onFarmClick}
        >
          <div className="absolute inset-0 bg-green-900/10 pointer-events-none" />

          <div className="absolute top-8 left-8 z-20 pointer-events-none no-shadow">
            <div className="relative inline-block">
              <img src="title.PNG" alt="Title" style={{ imageRendering: 'pixelated', width: '300px', height: 'auto', display: 'block' }} />
              <div className="absolute inset-0 flex flex-col items-center justify-center px-4">
                <h2 className="text-2xl font-bold tracking-wide text-pixel text-center uppercase text-[#542b08] no-shadow">{t.farmTitle}</h2>
                <p className="text-base text-center font-bold text-[#8b4513] no-shadow">{t.farmSubtitle}</p>
              </div>
            </div>
          </div>

          {houses.map(h => {
            const dist = Math.sqrt(Math.pow(h.x - charPos.x, 2) + Math.pow(h.y - charPos.y, 2));
            const isNear = dist < INTERACTION_DISTANCE;
            return (
              <HouseNode 
                key={h.id} 
                house={h} 
                onClick={(e) => {
                  e.stopPropagation();
                  handleHouseClick(h);
                }} 
                isNear={isNear}
              />
            );
          })}

          <div 
            className={`absolute transition-all duration-75 pointer-events-none z-30 flex flex-col items-center`}
            style={{ 
                left: `${charPos.x}%`, 
                top: `${charPos.y}%`,
                transform: `translate(-50%, -80%)`,
            }}
          >
            <div className={`drop-shadow-[0_5px_10px_rgba(0,0,0,0.5)] relative`}>
              <div className="absolute inset-0 bg-yellow-300/30 rounded-full blur-xl animate-pulse" style={{ width: '100px', height: '100px', left: '50%', top: '50%', transform: 'translate(-50%, -50%)' }} />
              <img 
                src={`${direction}${isWalking ? animFrame : 1}.png`} 
                alt="character" 
                style={{ height: '80px', width: 'auto', imageRendering: 'pixelated', position: 'relative', zIndex: 1, filter: 'drop-shadow(0 0 10px rgba(255, 255, 255, 0.8))' }}
              />
            </div>
            <div className="w-12 h-4 bg-black/20 rounded-full mt-[-10px] blur-sm" />
          </div>
        </div>
      )}

      {scene === Scene.INTERIOR && activeHouse && (
        <div className="absolute inset-0 bg-black flex items-center justify-center p-8">
           <div className="w-full max-w-7xl h-full flex flex-col relative border-[6px] overflow-hidden" style={{ borderColor: activeHouse.id === 'ai-systems' ? '#8B1A1A' : activeHouse.id === 'accessibility' ? '#28567C' : activeHouse.id === 'hci' ? '#272E37' : activeHouse.id === 'shorts' ? '#1A191A' : '#264E76' }}>
              <div className="flex-grow p-12 relative overflow-y-auto scrollbar-hide" style={{ background: activeHouse.id === 'ai-systems' ? '#F5C4C2' : activeHouse.id === 'accessibility' ? '#F8BD3E' : activeHouse.id === 'hci' ? '#F4F0EA' : activeHouse.id === 'shorts' ? '#739DBC' : '#93B0D0' }}>
                <div className="relative z-10 max-w-6xl mx-auto">
                  <header className="flex justify-between items-start mb-16 pb-8 no-shadow">
                    <div>
                      <h2 className="text-5xl text-[#3e2723] font-bold uppercase tracking-widest">{activeHouse.category}</h2>
                      <p className="text-2xl text-[#5a3a2a] mt-2 italic font-bold">{activeHouse.description}</p>
                    </div>
                    <button 
                      onClick={handleBackToFarm}
                      className="px-6 py-2 text-2xl font-bold transition-all active:scale-95 border-4"
                      style={{ 
                        background: activeHouse.id === 'ai-systems' ? '#F5C4C2' : activeHouse.id === 'accessibility' ? '#F8BD3E' : activeHouse.id === 'hci' ? '#F4F0EA' : activeHouse.id === 'shorts' ? '#739DBC' : '#93B0D0',
                        borderColor: activeHouse.id === 'ai-systems' ? '#B4251F' : activeHouse.id === 'accessibility' ? '#CE3A2E' : activeHouse.id === 'hci' ? '#4655F' : activeHouse.id === 'shorts' ? '#1A191A' : '#B07A47',
                        color: '#3e2723'
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.background = activeHouse.id === 'ai-systems' ? '#8B1A1A' : activeHouse.id === 'accessibility' ? '#28567C' : activeHouse.id === 'hci' ? '#272E37' : activeHouse.id === 'shorts' ? '#1A191A' : '#264E76';
                        e.currentTarget.style.color = '#F4F0EA';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.background = activeHouse.id === 'ai-systems' ? '#F5C4C2' : activeHouse.id === 'accessibility' ? '#F8BD3E' : activeHouse.id === 'hci' ? '#F4F0EA' : activeHouse.id === 'shorts' ? '#739DBC' : '#93B0D0';
                        e.currentTarget.style.color = '#3e2723';
                      }}
                    >
                      {t.exitBuilding}
                    </button>
                  </header>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-16 justify-items-center mb-12">
                    {activeHouse.works.map(work => (
                      <WorkFrame 
                        key={work.id} 
                        work={work} 
                        houseId={activeHouse.id}
                        onReadMore={(w) => setSelectedWork(w)}
                      />
                    ))}
                  </div>
                </div>
              </div>
              <div className="h-16 border-t-[4px]" style={{ borderColor: activeHouse.id === 'ai-systems' ? '#8B1A1A' : activeHouse.id === 'accessibility' ? '#28567C' : activeHouse.id === 'hci' ? '#272E37' : activeHouse.id === 'shorts' ? '#1A191A' : '#264E76', background: activeHouse.id === 'ai-systems' ? '#B4251F' : activeHouse.id === 'accessibility' ? '#CE3A2E' : activeHouse.id === 'hci' ? '#4655F' : activeHouse.id === 'shorts' ? '#1A191A' : '#2C5A85' }} />
           </div>

           {selectedWork && (
             <div className="fixed inset-0 z-[110] flex items-center justify-center p-4 bg-black/80 animate-fade-in" onClick={() => setSelectedWork(null)}>
                <div 
                  className="w-full max-w-4xl p-10 relative animate-bounce-in max-h-[90vh] overflow-y-auto border-4"
                  style={{
                    background: activeHouse.id === 'ai-systems' ? '#F5C4C2' : activeHouse.id === 'accessibility' ? '#F8BD3E' : activeHouse.id === 'hci' ? '#F4F0EA' : activeHouse.id === 'shorts' ? '#739DBC' : '#93B0D0',
                    borderColor: activeHouse.id === 'ai-systems' ? '#B4251F' : activeHouse.id === 'accessibility' ? '#CE3A2E' : activeHouse.id === 'hci' ? '#4655F' : activeHouse.id === 'shorts' ? '#1A191A' : '#B07A47'
                  }}
                  onClick={e => e.stopPropagation()}
                >
                  <button className="absolute top-4 right-4 text-4xl text-[#3e2723] hover:scale-110 transition-transform font-bold" onClick={() => setSelectedWork(null)}>✕</button>
                  <div className="flex flex-col md:flex-row gap-8 no-shadow">
                    <div className="w-full md:w-1/2">
                      <div className="border-[3px] p-3" style={{ background: activeHouse.id === 'ai-systems' ? '#B4251F' : activeHouse.id === 'accessibility' ? '#CE3A2E' : activeHouse.id === 'hci' ? '#4655F' : activeHouse.id === 'shorts' ? '#1A191A' : '#B07A47', borderColor: activeHouse.id === 'ai-systems' ? '#8B1A1A' : activeHouse.id === 'accessibility' ? '#28567C' : activeHouse.id === 'hci' ? '#272E37' : activeHouse.id === 'shorts' ? '#1A191A' : '#5A311E' }}>
                        <img src={selectedWork.imageUrl} alt={selectedWork.title} className="w-full h-auto object-cover" />
                      </div>
                    </div>
                    <div className="w-full md:w-1/2 flex flex-col">
                      <h3 className="text-5xl text-[#3e2723] font-bold mb-4 uppercase">{selectedWork.title}</h3>
                      <div className="flex flex-wrap gap-3 mb-6">
                        {selectedWork.tags.map(t => (
                          <span key={t} className="text-xl px-4 py-1 font-bold uppercase" style={{ background: activeHouse.id === 'ai-systems' ? '#8B1A1A' : activeHouse.id === 'accessibility' ? '#28567C' : activeHouse.id === 'hci' ? '#272E37' : activeHouse.id === 'shorts' ? '#1A191A' : '#5A311E', color: activeHouse.id === 'ai-systems' ? '#F5C4C2' : activeHouse.id === 'accessibility' ? '#F8BD3E' : activeHouse.id === 'graphics' ? '#93B0D0' : '#F4F0EA' }}>{t}</span>
                        ))}
                      </div>
                      <p className="text-2xl text-[#3e2723] leading-relaxed mb-8">{selectedWork.description}</p>
                      <button className="px-8 py-3 border-4 text-[#3e2723] text-2xl font-bold self-start transition-colors" style={{ background: activeHouse.id === 'ai-systems' ? '#F5C4C2' : activeHouse.id === 'accessibility' ? '#F8BD3E' : activeHouse.id === 'hci' ? '#F4F0EA' : activeHouse.id === 'shorts' ? '#739DBC' : '#93B0D0', borderColor: activeHouse.id === 'ai-systems' ? '#B4251F' : activeHouse.id === 'accessibility' ? '#CE3A2E' : activeHouse.id === 'hci' ? '#4655F' : activeHouse.id === 'shorts' ? '#1A191A' : '#B07A47' }} onMouseEnter={(e) => e.currentTarget.style.background = activeHouse.id === 'ai-systems' ? '#8B1A1A' : activeHouse.id === 'accessibility' ? '#28567C' : activeHouse.id === 'hci' ? '#272E37' : activeHouse.id === 'shorts' ? '#1A191A' : '#264E76'} onMouseLeave={(e) => e.currentTarget.style.background = activeHouse.id === 'ai-systems' ? '#F5C4C2' : activeHouse.id === 'accessibility' ? '#F8BD3E' : activeHouse.id === 'hci' ? '#F4F0EA' : activeHouse.id === 'shorts' ? '#739DBC' : '#93B0D0'}>{t.viewLive}</button>
                    </div>
                  </div>
                </div>
             </div>
           )}
        </div>
      )}

      {scene === Scene.FARM && (
        <div className="fixed top-8 right-4 z-[90] no-shadow">
          <div className="relative inline-block">
            <img src="title.PNG" alt="Time" style={{ imageRendering: 'pixelated', width: '180px', height: 'auto', display: 'block' }} />
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-lg font-bold text-[#542b08] uppercase tabular-nums">
                {dayLabel}. {currentTime.getDate()} {formattedTime}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default App;App;