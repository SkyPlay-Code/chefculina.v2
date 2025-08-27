
export type ActiveView = 'name' | 'ingredients' | 'saved';

export interface Recipe {
  id: string;
  name: string;
  content: string; // The full markdown content
}
