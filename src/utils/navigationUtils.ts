export interface NavigationUtils {
  navigateToPreviousVerse: () => Promise<void>;
  navigateToNextVerse: () => Promise<void>;
  handleBookInfoNavigateToVerse: (reference: string) => void;
  handleQueueNavigate: (book: string, chapter: number, verse: number) => void;
  handleNavigateToOccurrence: (book: string, chapter: number, verse: number) => void;
}

export const createNavigationUtils = (
  book: string,
  chapter: number,
  verse: number,
  navigate: (path: string) => void,
  setLoadingMessage: (message: string) => void,
  loadCompleteAnalysis: () => Promise<void>
): NavigationUtils => {

  const navigateToPreviousVerse = async (): Promise<void> => {
    let newVerse = verse - 1;
    let newChapter = chapter;
    let newBook = book;

    if (newVerse < 1) {
      newChapter = chapter - 1;
      if (newChapter < 1) {
        // Move to previous book's last chapter
        // This would need book metadata to determine the last chapter
        // For now, just prevent going below 1:1
        return;
      } else {
        // Need to fetch the verse count for the new chapter
        // For now, assume verse 1
        newVerse = 1;
      }
    }

    const newPath = `/verse/${newBook}/${newChapter}/${newVerse}`;
    setLoadingMessage('Navigating to previous verse...');
    navigate(newPath);
    await loadCompleteAnalysis();
  };

  const navigateToNextVerse = async (): Promise<void> => {
    const newVerse = verse + 1;
    const newPath = `/verse/${book}/${chapter}/${newVerse}`;
    setLoadingMessage('Navigating to next verse...');
    navigate(newPath);
    await loadCompleteAnalysis();
  };

  const handleBookInfoNavigateToVerse = (reference: string): void => {
    const parts = reference.split(' ');
    if (parts.length >= 2) {
      const bookPart = parts[0];
      const chapterVerse = parts[1].split(':');
      if (chapterVerse.length === 2) {
        const targetChapter = parseInt(chapterVerse[0]);
        const targetVerse = parseInt(chapterVerse[1]);
        if (!isNaN(targetChapter) && !isNaN(targetVerse)) {
          navigate(`/verse/${bookPart}/${targetChapter}/${targetVerse}`);
        }
      }
    }
  };

  const handleQueueNavigate = (book: string, chapter: number, verse: number): void => {
    navigate(`/verse/${book}/${chapter}/${verse}`);
  };

  const handleNavigateToOccurrence = (book: string, chapter: number, verse: number): void => {
    navigate(`/verse/${book}/${chapter}/${verse}`);
  };

  return {
    navigateToPreviousVerse,
    navigateToNextVerse,
    handleBookInfoNavigateToVerse,
    handleQueueNavigate,
    handleNavigateToOccurrence
  };
}; 