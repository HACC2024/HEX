import React from 'react';
import { Search } from 'react-bootstrap-icons';
import '../styles/SearchFilter.Style.css'; // Make sure to import your CSS file

interface SearchBarProps {
    search: string;
    setSearch: (search: string) => void;
}

const SearchBar: React.FC<SearchBarProps> = ({ search, setSearch }) => {
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearch(e.target.value);
    };

    return (
        <div className="searchFilterDiv fluid">
            <div className="input-with-icon ">
                <input
                type="text"
                className="searchBarCategory"
                placeholder="Search..."
                value={search}
                onChange={handleChange}
                />
                <Search className="search-icon" size={20} />
            </div>
        </div>
    );
};

export default SearchBar;
