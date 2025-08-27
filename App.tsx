import React, { useState, useCallback, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ActiveView, Recipe } from './types';
import { getRecipeByName, suggestRecipesByIngredients, suggestRecipesByMood } from './services/geminiService';
import LoadingSpinner from './components/LoadingSpinner';
import RecipeDisplay from './components/RecipeDisplay';
import RecipeSuggestions from './components/RecipeSuggestions';
import FloatingIcons from './components/FloatingIcons';
import SavedRecipesView from './components/SavedRecipesView';

const STORAGE_KEY = 'culina_saved_recipes';

const extractRecipeName = (markdown: string): string => {
    const match = markdown.match(/^##\s*(.*)/);
    return match ? match[1].trim() : 'Untitled Recipe';
};

const createRecipeId = (name: string): string => {
    return name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
};

const getSavedRecipesFromStorage = (): Recipe[] => {
    try {
        const saved = localStorage.getItem(STORAGE_KEY);
        return saved ? JSON.parse(saved) : [];
    } catch (e) {
        console.error("Failed to parse saved recipes from localStorage", e);
        return [];
    }
};

const saveRecipesToStorage = (recipes: Recipe[]) => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(recipes));
};


const Hero: React.FC = () => (
    <header className="text-center mb-10">
        <motion.div 
            className="flex justify-center items-center mb-4"
            initial={{ scale: 0, rotate: -45 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ type: 'spring', stiffness: 260, damping: 20, delay: 0.2 }}
        >
            <svg width="80" height="80" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-orange-600 drop-shadow-lg">
                <path d="M16 17.01V10H15V4.01C15 3.59239 14.8316 3.19236 14.5303 2.89104C14.2291 2.58971 13.829 2.42139 13.414 2.42139C12.164 2.42139 11.25 3.65139 11.25 5.25139V10H9.75V5.25139C9.75 3.65139 8.836 2.42139 7.586 2.42139C7.17103 2.42139 6.77095 2.58971 6.46967 2.89104C6.16839 3.19236 6 3.59239 6 4.01139V10H5V17.01C5 18.66 6.34 20.01 8 20.01H17C18.66 20.01 20 18.67 20 17.01H16Z" fill="currentColor" fillOpacity="0.2"/>
                <path d="M16 17.01V10H15V4.01C15 3.59239 14.8316 3.19236 14.5303 2.89104C14.2291 2.58971 13.829 2.42139 13.414 2.42139C12.164 2.42139 11.25 3.65139 11.25 5.25139V10H9.75V5.25139C9.75 3.65139 8.836 2.42139 7.586 2.42139C7.17103 2.42139 6.77095 2.58971 6.46967 2.89104C6.16839 3.19236 6 3.59239 6 4.01139V10H5V17.01C5 18.66 6.34 20.01 8 20.01H17C18.66 20.01 20 18.67 20 17.01H16Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M6 10H15" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
        </motion.div>
        <h1 className="font-display text-5xl md:text-6xl font-bold text-stone-800">
            Chef Culina’s Recipe Book
        </h1>
        <p className="text-stone-600 mt-3 text-lg">Your AI-powered kitchen companion.</p>
    </header>
);

const AnimatedButton: React.FC<{ children: React.ReactNode; onClick?: () => void; type?: "button" | "submit" | "reset"; className?: string; disabled?: boolean; }> = 
({ children, onClick, type = "button", className, disabled }) => (
    <motion.button
        type={type}
        onClick={onClick}
        className={className}
        disabled={disabled}
        whileHover={{ scale: disabled ? 1 : 1.05 }}
        whileTap={{ scale: disabled ? 1 : 0.95 }}
        transition={{ type: 'spring', stiffness: 400, damping: 17 }}
    >
        {children}
    </motion.button>
);


interface SearchByNameProps {
    onSearch: (dishName: string) => void;
    isLoading: boolean;
}

const SearchByName: React.FC<SearchByNameProps> = ({ onSearch, isLoading }) => {
    const [dishName, setDishName] = useState('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (dishName.trim()) {
            onSearch(dishName.trim());
        }
    };

    return (
        <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3">
            <input
                type="text"
                value={dishName}
                onChange={(e) => setDishName(e.target.value)}
                placeholder="e.g., Lemon Butter Chicken"
                className="flex-grow w-full px-4 py-3 text-lg bg-white/50 border-2 border-orange-200 rounded-full focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition"
                disabled={isLoading}
            />
            <AnimatedButton
                type="submit"
                className="bg-orange-600 text-white font-bold py-3 px-8 rounded-full hover:bg-orange-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-600 transition-colors disabled:bg-stone-400 disabled:cursor-not-allowed"
                disabled={isLoading}
            >
                Get Recipe
            </AnimatedButton>
        </form>
    );
};

interface SearchByIngredientsProps {
    onSearch: (ingredients: string) => void;
    isLoading: boolean;
}

const SearchByIngredients: React.FC<SearchByIngredientsProps> = ({ onSearch, isLoading }) => {
    const [ingredients, setIngredients] = useState('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (ingredients.trim()) {
            onSearch(ingredients.trim());
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <textarea
                value={ingredients}
                onChange={(e) => setIngredients(e.target.value)}
                placeholder="e.g., chicken breast, garlic, lemon, rosemary"
                className="w-full px-4 py-3 text-lg bg-white/50 border-2 border-orange-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition h-32 resize-none mb-3"
                disabled={isLoading}
            />
            <AnimatedButton
                type="submit"
                className="w-full bg-orange-600 text-white font-bold py-3 px-8 rounded-full hover:bg-orange-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-600 transition-colors disabled:bg-stone-400 disabled:cursor-not-allowed"
                disabled={isLoading}
            >
                Suggest Recipes
            </AnimatedButton>
        </form>
    );
};

interface MoodSearchProps {
  onSearch: (mood: string) => void;
  isLoading: boolean;
}

const MoodSearch: React.FC<MoodSearchProps> = ({ onSearch, isLoading }) => (
    <div className="bg-white/30 backdrop-blur-xl p-6 md:p-8 rounded-2xl shadow-2xl border border-white/20 mt-6">
        <h3 className="font-display text-xl text-stone-700 mb-4 text-center">Or, what are you in the mood for?</h3>
        <div className="flex justify-center flex-wrap gap-3 sm:gap-4">
            <AnimatedButton
                onClick={() => onSearch('Comfort Food')}
                className="bg-amber-500 text-white font-bold py-3 px-6 rounded-full hover:bg-amber-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-amber-500 transition-colors disabled:bg-stone-400 disabled:cursor-not-allowed flex items-center gap-2"
                disabled={isLoading}
            >
                <span role="img" aria-label="Pizza">🍕</span> Comfort
            </AnimatedButton>
            <AnimatedButton
                onClick={() => onSearch('Healthy')}
                className="bg-green-500 text-white font-bold py-3 px-6 rounded-full hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-colors disabled:bg-stone-400 disabled:cursor-not-allowed flex items-center gap-2"
                disabled={isLoading}
            >
                <span role="img" aria-label="Salad">🥗</span> Healthy
            </AnimatedButton>
            <AnimatedButton
                onClick={() => onSearch('Indulgent')}
                className="bg-pink-500 text-white font-bold py-3 px-6 rounded-full hover:bg-pink-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-pink-500 transition-colors disabled:bg-stone-400 disabled:cursor-not-allowed flex items-center gap-2"
                disabled={isLoading}
            >
                <span role="img" aria-label="Cake">🍰</span> Indulgent
            </AnimatedButton>
        </div>
    </div>
);


const resultsVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -20 },
};

const App: React.FC = () => {
    const [activeView, setActiveView] = useState<ActiveView>('name');
    const [recipe, setRecipe] = useState<string | null>(null);
    const [suggestions, setSuggestions] = useState<string[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [savedRecipes, setSavedRecipes] = useState<Recipe[]>([]);

    useEffect(() => {
        setSavedRecipes(getSavedRecipesFromStorage());
    }, []);
    
    const clearResults = () => {
        setRecipe(null);
        setSuggestions([]);
        setError(null);
    };

    const handleSearchByName = useCallback(async (dishName: string) => {
        clearResults();
        setIsLoading(true);
        try {
            const result = await getRecipeByName(dishName);
            setRecipe(result);
        } catch (err: unknown) {
            setError(err instanceof Error ? err.message : 'An unknown error occurred');
        } finally {
            setIsLoading(false);
        }
    }, []);

    const handleSearchByIngredients = useCallback(async (ingredients: string) => {
        clearResults();
        setIsLoading(true);
        try {
            const result = await suggestRecipesByIngredients(ingredients);
            setSuggestions(result);
        } catch (err: unknown) {
            setError(err instanceof Error ? err.message : 'An unknown error occurred');
        } finally {
            setIsLoading(false);
        }
    }, []);

    const handleSearchByMood = useCallback(async (mood: string) => {
        clearResults();
        setIsLoading(true);
        try {
            const result = await suggestRecipesByMood(mood);
            setSuggestions(result);
        } catch (err: unknown) {
            setError(err instanceof Error ? err.message : 'An unknown error occurred');
        } finally {
            setIsLoading(false);
        }
    }, []);

    const handleViewChange = (view: ActiveView) => {
        setActiveView(view);
        clearResults();
    };

    const handleSaveRecipe = useCallback(() => {
        if (!recipe) return;
        const name = extractRecipeName(recipe);
        const id = createRecipeId(name);
        if (savedRecipes.some(r => r.id === id)) return;

        const newRecipe: Recipe = { id, name, content: recipe };
        const updatedRecipes = [...savedRecipes, newRecipe];
        setSavedRecipes(updatedRecipes);
        saveRecipesToStorage(updatedRecipes);
    }, [recipe, savedRecipes]);

    const handleDeleteRecipe = useCallback((recipeId: string) => {
        const updatedRecipes = savedRecipes.filter(r => r.id !== recipeId);
        setSavedRecipes(updatedRecipes);
        saveRecipesToStorage(updatedRecipes);

        if (recipe) {
             const currentId = createRecipeId(extractRecipeName(recipe));
             if (currentId === recipeId) {
                setRecipe(null);
             }
        }
    }, [savedRecipes, recipe]);

    const handleViewSavedRecipe = useCallback((savedRecipe: Recipe) => {
        clearResults();
        setRecipe(savedRecipe.content);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }, []);

    const isCurrentRecipeSaved = useMemo(() => {
        if (!recipe) return false;
        const id = createRecipeId(extractRecipeName(recipe));
        return savedRecipes.some(r => r.id === id);
    }, [recipe, savedRecipes]);

    return (
        <div className="min-h-screen text-stone-800 relative">
            <FloatingIcons />
            <main className="container mx-auto px-4 py-8 md:py-12 max-w-4xl relative z-10">
                <Hero />

                <div className="bg-white/30 backdrop-blur-xl p-2 rounded-full shadow-lg flex items-center justify-center space-x-1 md:space-x-2 mb-6 max-w-lg mx-auto border border-white/20">
                    <button
                        onClick={() => handleViewChange('name')}
                        className={`w-1/3 py-2.5 px-4 rounded-full text-md md:text-lg font-semibold transition-colors relative ${activeView !== 'name' ? 'text-orange-800 hover:bg-orange-100/50' : ''}`}
                    >
                        {activeView === 'name' && <motion.div layoutId="active-tab-indicator" className="absolute inset-0 bg-orange-600 text-white shadow rounded-full z-0"/>}
                        <span className="relative z-10 text-white mix-blend-difference">By Name</span>
                    </button>
                    <button
                        onClick={() => handleViewChange('ingredients')}
                        className={`w-1/3 py-2.5 px-4 rounded-full text-md md:text-lg font-semibold transition-colors relative ${activeView !== 'ingredients' ? 'text-orange-800 hover:bg-orange-100/50' : ''}`}
                    >
                        {activeView === 'ingredients' && <motion.div layoutId="active-tab-indicator" className="absolute inset-0 bg-orange-600 text-white shadow rounded-full z-0"/>}
                        <span className="relative z-10 text-white mix-blend-difference">By Ingredients</span>
                    </button>
                     <button
                        onClick={() => handleViewChange('saved')}
                        className={`w-1/3 py-2.5 px-4 rounded-full text-md md:text-lg font-semibold transition-colors relative ${activeView !== 'saved' ? 'text-orange-800 hover:bg-orange-100/50' : ''}`}
                    >
                        {activeView === 'saved' && <motion.div layoutId="active-tab-indicator" className="absolute inset-0 bg-orange-600 text-white shadow rounded-full z-0"/>}
                        <span className="relative z-10 text-white mix-blend-difference">Saved Recipes</span>
                    </button>
                </div>

                {activeView === 'saved' ? (
                     <AnimatePresence mode="wait">
                        <motion.div key="saved-view" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                            <SavedRecipesView recipes={savedRecipes} onView={handleViewSavedRecipe} onDelete={handleDeleteRecipe} isLoading={isLoading} />
                        </motion.div>
                     </AnimatePresence>
                ) : (
                    <div className="bg-white/30 backdrop-blur-xl p-6 md:p-8 rounded-2xl shadow-2xl border border-white/20">
                        <AnimatePresence mode="wait">
                            <motion.div
                                key={activeView}
                                initial={{ opacity: 0, x: activeView === 'name' ? 10 : -10 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: activeView === 'name' ? -10 : 10 }}
                                transition={{ duration: 0.2 }}
                            >
                                {activeView === 'name' ? (
                                    <SearchByName onSearch={handleSearchByName} isLoading={isLoading} />
                                ) : (
                                    <SearchByIngredients onSearch={handleSearchByIngredients} isLoading={isLoading} />
                                )}
                            </motion.div>
                        </AnimatePresence>
                    </div>
                )}


                {activeView !== 'saved' && <MoodSearch onSearch={handleSearchByMood} isLoading={isLoading} />}

                <div className="mt-6 min-h-[120px]">
                    <AnimatePresence mode="wait">
                        {isLoading && (
                            <motion.div key="loader" variants={resultsVariants} initial="hidden" animate="visible" exit="exit">
                                <LoadingSpinner />
                            </motion.div>
                        )}
                        {error && (
                             <motion.div key="error" variants={resultsVariants} initial="hidden" animate="visible" exit="exit">
                                <div className="mt-8 bg-red-100/70 backdrop-blur-md border-l-4 border-red-500 text-red-700 p-4 rounded-lg shadow" role="alert">
                                    <p className="font-bold">Oops!</p>
                                    <p>{error}</p>
                                </div>
                             </motion.div>
                        )}
                        {!isLoading && !error && recipe && (
                            <motion.div key="recipe" variants={resultsVariants} initial="hidden" animate="visible" exit="exit">
                                <RecipeDisplay recipeMarkdown={recipe} onSave={handleSaveRecipe} isSaved={isCurrentRecipeSaved} />
                            </motion.div>
                        )}
                        {!isLoading && !error && suggestions.length > 0 && (
                             <motion.div key="suggestions" variants={resultsVariants} initial="hidden" animate="visible" exit="exit">
                                <RecipeSuggestions suggestions={suggestions} onSuggestionClick={handleSearchByName} />
                             </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </main>
        </div>
    );
};

export default App;
