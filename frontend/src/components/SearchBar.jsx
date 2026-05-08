import React, { useState } from 'react';
import axios from 'axios';

const SearchBar = ({ onSearchResults }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSearch = async (e) => {
    const value = e.target.value;
    setSearchTerm(value);

    if (value.trim() === '') {
      onSearchResults([]); // Clear results if search term is empty
      return;
    }

    setIsLoading(true);

    try {
      const response = await axios.get(`/api/products/search`, {
        params: { search: value },
      });
      onSearchResults(response.data);
    } catch (error) {
      console.error('Error fetching search results:', error);
      onSearchResults([]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="relative w-full max-w-md mx-auto">
      <input
        type="text"
        value={searchTerm}
        onChange={handleSearch}
        placeholder="Search furniture..."
        className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
      {isLoading && <div className="absolute right-2 top-2">Loading...</div>}
    </div>
  );
};

export default SearchBar;