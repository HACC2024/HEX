import React from 'react';
import { Search } from 'react-bootstrap-icons';

interface SearchBarProps {
    search: string;
    setSearch: (search: string) => void;
}

const SearchBar: React.FC<SearchBarProps> = ({ search, setSearch }) => {
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearch(e.target.value);
    };

    return (
        <div style={{ 
            width: '100%',
        }}>
            <div style={{
                position: 'relative',
                width: '100%'
            }}>
                <input
                    type="text"
                    placeholder="Search..."
                    value={search}
                    onChange={handleChange}
                    style={{
                        width: '100%',
                        padding: '8px 36px 8px 12px',
                        border: '1px solid #ddd',
                        borderRadius: '6px',
                        fontSize: '14px',
                        outline: 'none'
                    }}
                />
                <Search 
                    style={{
                        position: 'absolute',
                        right: '12px',
                        top: '50%',
                        transform: 'translateY(-50%)',
                        color: '#666'
                    }} 
                    size={20} 
                />
            </div>
        </div>
    );
};

export default SearchBar;