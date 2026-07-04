import { Search, SlidersHorizontal } from 'lucide-react';

export default function SearchBar({ value, onChange, placeholder, onFilterToggle, showFilterBtn = true }) {
  return (
    <div className="search-bar" id="recipe-search-bar">
      <Search size={20} color="var(--text-muted)" />
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder || 'Search recipes, ingredients, cuisines...'}
      />
      {showFilterBtn && (
        <button className="btn btn-ghost" onClick={onFilterToggle} aria-label="Toggle filters">
          <SlidersHorizontal size={20} />
        </button>
      )}
    </div>
  );
}
