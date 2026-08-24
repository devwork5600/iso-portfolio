import React from "react";

/**
 * Split a string into words and characters for animation/layout purposes.
 */
export function textSplitter(text: string): React.ReactElement[] {
  if (!text) return [];

  const words = text.split(" ");

  return words.map((word, wIndex) => (
    <span key={`word-${wIndex}`} className="word-wrapper mr-[0.25em] inline-block whitespace-nowrap">
      {word.split("").map((char, cIndex) => (
        <span key={`char-${wIndex}-${cIndex}`} className="outer-span inline-block overflow-hidden align-top">
          <span className="inner-span inline-block">{char}</span>
        </span>
      ))}

      {wIndex < words.length - 1 && (
        <span className="outer-span inline-block overflow-hidden align-top">
          <span className="inner-span inline-block">&nbsp;</span>
        </span>
      )}
    </span>
  ));
}
