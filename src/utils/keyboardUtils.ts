export interface KeyboardUtils {
  setupKeyboardHandlers: () => () => void;
}

export const createKeyboardUtils = (
  navigateToPreviousVerse: () => Promise<void>,
  navigateToNextVerse: () => Promise<void>,
  handleRecordClick: () => void,
  playAudioWithWordHighlighting: () => Promise<void>,
  handleEnhanceClick: (event: React.MouseEvent) => Promise<void>
): KeyboardUtils => {

  const setupKeyboardHandlers = (): (() => void) => {
    const handleKeyDown = (event: KeyboardEvent): void => {
      // Don't trigger shortcuts when typing in inputs
      if (event.target instanceof HTMLInputElement || event.target instanceof HTMLTextAreaElement) {
        return;
      }

      // Don't trigger if any modifier keys are pressed except for specific combinations
      const isSpecialCombo = event.shiftKey && !event.ctrlKey && !event.altKey && !event.metaKey;
      if ((event.ctrlKey || event.altKey || event.metaKey) && !isSpecialCombo) {
        return;
      }

      switch (event.key.toLowerCase()) {
        case 'arrowleft':
          event.preventDefault();
          navigateToPreviousVerse();
          break;
        case 'arrowright':
          event.preventDefault();
          navigateToNextVerse();
          break;
        case 'r':
          if (!event.shiftKey && !event.ctrlKey && !event.altKey && !event.metaKey) {
            event.preventDefault();
            handleRecordClick();
          }
          break;
        case 'p':
          if (!event.shiftKey && !event.ctrlKey && !event.altKey && !event.metaKey) {
            event.preventDefault();
            playAudioWithWordHighlighting();
          }
          break;
        case 'g':
          if (!event.shiftKey && !event.ctrlKey && !event.altKey && !event.metaKey) {
            event.preventDefault();
            // Create a mock event for handleEnhanceClick
            const mockEvent = {
              preventDefault: () => {},
              stopPropagation: () => {},
              target: null,
              currentTarget: null,
              type: 'click',
              bubbles: false,
              cancelable: false,
              defaultPrevented: false,
              eventPhase: 0,
              isTrusted: false,
              nativeEvent: event,
              timeStamp: Date.now(),
              button: 0,
              buttons: 0,
              clientX: 0,
              clientY: 0,
              pageX: 0,
              pageY: 0,
              screenX: 0,
              screenY: 0,
              detail: 0,
              getModifierState: () => false,
              relatedTarget: null,
              movementX: 0,
              movementY: 0,
              altKey: false,
              ctrlKey: false,
              metaKey: false,
              shiftKey: false,
              view: null,
              isDefaultPrevented: () => false,
              isPropagationStopped: () => false,
              persist: () => {}
            } as unknown as React.MouseEvent;
            handleEnhanceClick(mockEvent);
          }
          break;
        default:
          break;
      }
    };

    // Add event listener
    document.addEventListener('keydown', handleKeyDown);

    // Return cleanup function
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  };

  return {
    setupKeyboardHandlers
  };
}; 