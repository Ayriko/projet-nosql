import SearchIcon from '@mui/icons-material/Search';
import { SetStateAction, useState } from 'react';
import { searchUsers } from '../client/client';
import { useSearchBarContext } from '../contexts/SearchBarContext';

const SearchBarComponent = () => {
  const [searchTerm, setSearchTerm] = useState('');


  const { setSearchBarResult } = useSearchBarContext();

  const handleChange = async (event: { target: { value: SetStateAction<string>; }; }) => {
    setSearchTerm(event.target.value);
    const results = await searchUsers(searchTerm);
    setSearchBarResult(results);
  };




  return (
    <div>
        <div style={{display:"flex", flexDirection:"row", paddingLeft:'20px'}}>
         <SearchIcon />
        <input
            type="text"
            placeholder="Search users"
            value={searchTerm}
            onChange={handleChange}
            style={{ border : 'none',background: 'black', color: 'white', fontSize: '16px'}}
        />
      </div>
    </div>
  );
};

export default SearchBarComponent;
