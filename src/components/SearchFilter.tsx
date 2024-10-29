import React from 'react';

interface SearchBarProps {
    search: string;
    setSearch: (search: string) => void;
}

const SearchBar: React.FC<SearchBarProps> = ({ search, setSearch }) => {
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearch(e.target.value);
    };

    return (
        <div className="container mt-4">
            <input
                type="text"
                className="form-control"
                placeholder="Search..."
                value={search}
                onChange={handleChange}
            />
        </div>
    );
};

export default SearchBar;
