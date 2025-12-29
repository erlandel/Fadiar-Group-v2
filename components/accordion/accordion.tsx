'use client';

import { useState } from 'react';
import { MaterialSymbolsAdd } from '@/icons/icons';

interface AccordionItemProps {
  question: string;
  answer: string;
  isOpen: boolean;
  onToggle: () => void;
}

function AccordionItem({ question, answer, isOpen, onToggle }: AccordionItemProps) {
  return (
    <div className="mb-4">
      <button
        onClick={onToggle}
        className={`w-full flex items-center justify-between py-6 px-8 text-left transition-colors rounded-t-lg ${
          isOpen 
            ? 'bg-[#022954] text-white' 
            : 'bg-[#F5F7FA] text-[#022954] hover:bg-gray-200'
        }`}
      >
        <span className="text-lg font-semibold pr-4">
          {question}
        </span>
        <div className="shrink-0">
          <div className={`w-7 h-7 cursor-pointer rounded-full border-2 flex items-center justify-center transition-transform ${
            isOpen 
              ? 'border-white rotate-45' 
              : 'border-[#777777]'
          }`}>
            <MaterialSymbolsAdd 
              style={{ color: isOpen ? '#FFFFFF' : '#777777' }}
              width={20}
              height={20}
            />
          </div>
        </div>
      </button>
      <div
        className={`overflow-hidden transition-all duration-300 ease-in-out ${
          isOpen ? 'max-h-[500px] opacity-100' : 'max-h-0 opacity-0'
        }`}
      >
        <div className="px-8 py-8 bg-[#F5F7FA] text-gray-600 leading-relaxed rounded-b-xl">
          {answer}
        </div>
      </div>
    </div>
  );
}

interface AccordionProps {
  items: Array<{ question: string; answer: string }>;
}

export default function Accordion({ items }: AccordionProps) {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const handleToggle = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <div className="w-full">
      {items.map((item, index) => (
        <AccordionItem
          key={index}
          question={item.question}
          answer={item.answer}
          isOpen={openIndex === index}
          onToggle={() => handleToggle(index)}
        />
      ))}
    </div>
  );
}
