import React from 'react';

interface DialogueBoxProps {
  text: string;
  name?: string;
  onNext: () => void;
}

const DialogueBox: React.FC<DialogueBoxProps> = ({ text, name, onNext }) => {
  return (
    <div 
      className="relative w-[90%] max-w-4xl cursor-pointer select-none z-50 animate-bounce-in bg-contain bg-center bg-no-repeat"
      style={{ backgroundImage: "url('Dialogue.png')", aspectRatio: '3/2' }}
      onClick={onNext}
    >
      <div 
        className="absolute text-[#3e2723] leading-relaxed font-semibold no-shadow" 
        style={{ 
          left: '6%',
          top: '26%',
          width: '59.3%',
          height: '35%',
          padding: '1.5%',
          fontSize: 'clamp(0.75rem, 2vw, 2.5rem)'
        }}
      >
        {text}
      </div>
    </div>
  );
};

export default DialogueBox;