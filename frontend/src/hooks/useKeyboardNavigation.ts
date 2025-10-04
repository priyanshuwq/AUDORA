import { useEffect } from "react";

interface UseKeyboardNavigationOptions {
  onEscape?: () => void;
  onEnter?: () => void;
  onArrowUp?: () => void;
  onArrowDown?: () => void;
  onSearch?: () => void; // Ctrl/Cmd + F
  enabled?: boolean;
}

export const useKeyboardNavigation = (
  options: UseKeyboardNavigationOptions
) => {
  const {
    onEscape,
    onEnter,
    onArrowUp,
    onArrowDown,
    onSearch,
    enabled = true,
  } = options;

  useEffect(() => {
    if (!enabled) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      // Prevent shortcuts when user is typing in an input
      if (
        event.target instanceof HTMLInputElement ||
        event.target instanceof HTMLTextAreaElement
      ) {
        // Only allow Escape when in input to clear it
        if (event.key === "Escape" && onEscape) {
          onEscape();
        }
        return;
      }

      switch (event.key) {
        case "Escape":
          if (onEscape) {
            event.preventDefault();
            onEscape();
          }
          break;

        case "Enter":
          if (onEnter) {
            event.preventDefault();
            onEnter();
          }
          break;

        case "ArrowUp":
          if (onArrowUp) {
            event.preventDefault();
            onArrowUp();
          }
          break;

        case "ArrowDown":
          if (onArrowDown) {
            event.preventDefault();
            onArrowDown();
          }
          break;

        case "f":
        case "F":
          if ((event.ctrlKey || event.metaKey) && onSearch) {
            event.preventDefault();
            onSearch();
          }
          break;
      }
    };

    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [enabled, onEscape, onEnter, onArrowUp, onArrowDown, onSearch]);
};
