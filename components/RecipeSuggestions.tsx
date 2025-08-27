import React from 'react';
import { motion } from 'framer-motion';

interface RecipeSuggestionsProps {
  suggestions: string[];
  onSuggestionClick: (suggestion: string) => void;
}

const RecipeSuggestions: React.FC<RecipeSuggestionsProps> = ({ suggestions, onSuggestionClick }) => {
  return (
    <div className="mt-8 bg-white/40 backdrop-blur-xl p-6 md:p-8 rounded-2xl shadow-2xl border border-white/30">
      <h2 className="font-display text-2xl font-bold text-stone-800 mb-4">Chef's Suggestions</h2>
      <p className="text-stone-600 mb-6">Here are a few ideas based on your ingredients. Click one to get the full recipe!</p>
      <div className="flex flex-wrap gap-3">
        {suggestions.map((suggestion, index) => (
          <motion.button
            key={index}
            onClick={() => onSuggestionClick(suggestion)}
            className="bg-orange-500/90 text-white font-semibold py-2 px-4 rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500"
            whileHover={{ scale: 1.05, y: -2 }}
            whileTap={{ scale: 0.95 }}
            transition={{ type: 'spring', stiffness: 300 }}
          >
            {suggestion}
          </motion.button>
        ))}
      </div>
    </div>
  );
};

export default RecipeSuggestions;