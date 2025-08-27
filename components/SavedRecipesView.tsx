import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Recipe } from '../types';

interface SavedRecipesViewProps {
  recipes: Recipe[];
  onView: (recipe: Recipe) => void;
  onDelete: (recipeId: string) => void;
  isLoading: boolean;
}

const SavedRecipesView: React.FC<SavedRecipesViewProps> = ({ recipes, onView, onDelete, isLoading }) => {
  if (recipes.length === 0) {
    return (
      <div className="text-center py-10 px-6 bg-white/30 backdrop-blur-xl rounded-2xl shadow-2xl border border-white/20">
        <motion.div initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ delay: 0.2 }}>
          <svg className="mx-auto h-16 w-16 text-orange-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
          </svg>
          <h3 className="mt-2 text-xl font-semibold text-stone-700">Your Recipe Box is Empty</h3>
          <p className="mt-1 text-stone-600">
            Start searching for recipes to save your favorites here!
          </p>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="bg-white/30 backdrop-blur-xl p-6 md:p-8 rounded-2xl shadow-2xl border border-white/20">
        <h2 className="font-display text-2xl font-bold text-stone-800 mb-4">Saved Recipes</h2>
        <div className="space-y-3">
        <AnimatePresence>
        {recipes.map((recipe, index) => (
            <motion.div
            key={recipe.id}
            layout
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, x: -30, transition: { duration: 0.2 } }}
            transition={{ delay: index * 0.05, type: 'spring', stiffness: 400, damping: 25 }}
            className="bg-white/60 p-4 rounded-lg shadow-sm border border-white/40 flex justify-between items-center"
            >
            <span className="font-semibold text-stone-800 truncate pr-4">{recipe.name}</span>
            <div className="flex-shrink-0 flex gap-2">
                <motion.button
                    onClick={() => onView(recipe)}
                    disabled={isLoading}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="bg-orange-500 text-white text-sm font-semibold py-1.5 px-4 rounded-full hover:bg-orange-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500 transition-colors disabled:bg-stone-300"
                >
                    View
                </motion.button>
                <motion.button
                    onClick={() => onDelete(recipe.id)}
                    disabled={isLoading}
                     whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="bg-red-500 text-white text-sm font-semibold py-1.5 px-4 rounded-full hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-colors disabled:bg-stone-300"
                >
                    Delete
                </motion.button>
            </div>
            </motion.div>
        ))}
        </AnimatePresence>
        </div>
    </div>
  );
};

export default SavedRecipesView;
