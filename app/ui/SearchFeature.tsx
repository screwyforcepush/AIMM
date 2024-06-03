import React, { useState } from 'react';

interface SearchFeatureProps {
  onSearch: (query: string) => void;
}

const SearchFeature: React.FC<SearchFeatureProps> = ({ onSearch }) => {
  const [query, setQuery] = useState('');

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(event.target.value);
  };

  const handleSearch = () => {
    onSearch(query);
  };

  return (
    <div className="search-feature">
      <input
        type="text"
        value={query}
        onChange={handleInputChange}
        placeholder="Search messages..."
        className="search-input"
      />
      <button onClick={handleSearch} className="search-button">
        Search
      </button>
    </div>
  );
};

export default SearchFeature;
