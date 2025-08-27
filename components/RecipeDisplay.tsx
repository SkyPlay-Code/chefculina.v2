import React from 'react';

interface RecipeDisplayProps {
  recipeMarkdown: string;
  onSave: () => void;
  isSaved: boolean;
}

// Converts a string of Markdown from the AI into an HTML string for rendering.
const convertMarkdownToHTML = (markdown: string): string => {
  if (!markdown) return '';
  const lines = markdown.split('\n');
  let html = '';
  let listType: 'ul' | 'ol' | null = null;

  const closeList = () => {
    if (listType) {
      html += `</${listType}>`;
      listType = null;
    }
  };

  for (const line of lines) {
    let processedLine = line.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');

    if (processedLine.startsWith('## ')) {
      closeList();
      html += `<h2 class="font-display text-3xl md:text-4xl font-bold text-stone-800 mb-4">${processedLine.substring(3)}</h2>`;
    } else if (processedLine.startsWith('### ')) {
      closeList();
      html += `<h3 class="font-display text-xl md:text-2xl font-semibold text-stone-800 mt-6 mb-4 border-b-2 border-orange-200 pb-2">${processedLine.substring(4)}</h3>`;
    } else if (processedLine.match(/^\d+\. /)) {
      if (listType !== 'ol') {
        closeList();
        html += '<ol class="space-y-3 list-decimal list-inside text-stone-700">';
        listType = 'ol';
      }
      html += `<li class="pl-2">${processedLine.replace(/^\d+\. /, '')}</li>`;
    } else if (processedLine.startsWith('* ') || processedLine.startsWith('- ')) {
      if (listType !== 'ul') {
        closeList();
        html += '<ul class="space-y-2 list-disc list-inside text-stone-700">';
        listType = 'ul';
      }
      html += `<li class="pl-2">${processedLine.substring(2)}</li>`;
    } else {
      closeList();
      if (processedLine.trim() !== '') {
        html += `<p class="text-stone-700 leading-relaxed mb-4">${processedLine}</p>`;
      }
    }
  }

  closeList();
  return html;
};


const RecipeDisplay: React.FC<RecipeDisplayProps> = ({ recipeMarkdown, onSave, isSaved }) => {
  const recipeHtml = convertMarkdownToHTML(recipeMarkdown);

  return (
    <div className="mt-8">
      <div className="flex justify-end mb-4">
        <button
          onClick={onSave}
          disabled={isSaved}
          className="flex items-center gap-2 bg-teal-500 text-white font-semibold py-2 px-5 rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500 transition-transform hover:scale-105 active:scale-95 disabled:bg-stone-400 disabled:cursor-not-allowed disabled:transform-none"
        >
          {isSaved ? (
            <>
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path d="M5 4a2 2 0 012-2h6a2 2 0 012 2v14l-5-3.13L5 18V4z" />
              </svg>
              <span>Saved!</span>
            </>
          ) : (
            <>
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
              </svg>
              <span>Save Recipe</span>
            </>
          )}
        </button>
      </div>
      <div 
        className="bg-white/40 backdrop-blur-xl p-6 md:p-8 rounded-2xl shadow-2xl border border-white/30"
        dangerouslySetInnerHTML={{ __html: recipeHtml }}
      />
    </div>
  );
};

export default RecipeDisplay;
