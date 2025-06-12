import React from 'react';

export const AppStyles: React.FC = () => {
  const customScrollbarStyle = `
    .custom-scrollbar::-webkit-scrollbar { display: none; }
    .custom-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
    .hide-scrollbar::-webkit-scrollbar { display: none; }
    .hide-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
    
    /* Verse transition animations */
    .verse-container {
      position: relative;
      overflow: hidden;
    }
    
    .verse-content {
      transition: transform 0.5s cubic-bezier(0.4, 0, 0.2, 1), opacity 0.3s ease;
      transform: translateX(0);
      opacity: 1;
    }
    
    .verse-content.slide-down {
      animation: slideOutUp 0.25s ease-in forwards, slideInDown 0.25s 0.25s ease-out forwards;
    }
    
    .verse-content.slide-up {
      animation: slideOutDown 0.25s ease-in forwards, slideInUp 0.25s 0.25s ease-out forwards;
    }
    
    @keyframes slideOutUp {
      from { transform: translateY(0); opacity: 1; }
      to { transform: translateY(-100%); opacity: 0; }
    }
    
    @keyframes slideInDown {
      from { transform: translateY(100%); opacity: 0; }
      to { transform: translateY(0); opacity: 1; }
    }
    
    @keyframes slideOutDown {
      from { transform: translateY(0); opacity: 1; }
      to { transform: translateY(100%); opacity: 0; }
    }
    
    @keyframes slideInUp {
      from { transform: translateY(-100%); opacity: 0; }
      to { transform: translateY(0); opacity: 1; }
    }
    
    /* Smooth highlight animations for completed analysis */
    .analysis-complete {
      animation: analysisGlow 0.8s ease-in-out;
    }
    
    @keyframes analysisGlow {
      0% { box-shadow: none; }
      50% { box-shadow: 0 0 20px rgba(59, 130, 246, 0.3); }
      100% { box-shadow: none; }
    }
    
    /* Floating translation icon popup animation */
    @keyframes floatingTranslationPop {
      0% { 
        transform: scale(0) rotate(0deg);
        opacity: 0;
      }
      50% { 
        transform: scale(1.2) rotate(180deg);
        opacity: 0.8;
      }
      100% { 
        transform: scale(1) rotate(360deg);
        opacity: 1;
      }
    }
    
    /* Translation working animation */
    .translation-working-indicator {
      animation: translationWorking 1.5s ease-in-out infinite;
    }
    
    @keyframes translationWorking {
      0%, 100% { 
        transform: scale(1);
        opacity: 1;
      }
      50% { 
        transform: scale(1.1);
        opacity: 0.7;
      }
    }
    
    /* Button hover effects */
    .hover\\:scale-130:hover {
      transform: scale(1.3);
    }
    
    /* Ensure text selection works properly across word buttons and spaces */
    .verse-word, .select-all {
      user-select: text;
      -webkit-user-select: text;
      -moz-user-select: text;
      -ms-user-select: text;
    }
    
    /* Make sure space spans are selectable and preserve whitespace */
    .select-all {
      white-space: pre;
      display: inline;
    }
    
    /* Smooth entrance and exit animations */
    .smooth-entrance {
      animation: smoothEnter 0.3s ease-out;
    }
    
    .smooth-exit {
      animation: smoothExit 0.3s ease-in;
    }
    
    @keyframes smoothEnter {
      from {
        opacity: 0;
        transform: translateY(-10px);
      }
      to {
        opacity: 1;
        transform: translateY(0);
      }
    }
    
    @keyframes smoothExit {
      from {
        opacity: 1;
        transform: translateY(0);
      }
      to {
        opacity: 0;
        transform: translateY(-10px);
      }
    }
  `;

  return <style dangerouslySetInnerHTML={{ __html: customScrollbarStyle }} />;
};

export default AppStyles; 