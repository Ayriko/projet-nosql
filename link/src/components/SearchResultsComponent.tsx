import { Link } from "react-router-dom";
import { useSearchBarContext } from "../contexts/SearchBarContext";

const SearchResultsComponent = () => {

    const { searchBarResult } = useSearchBarContext();

    return (
        <div style={{border:'0.5px solid grey', position:'fixed', top:'50px', left:'100px', borderRadius:'5px'}}>
        {searchBarResult.map((result, index) => {
        return (
            <div key={index} style={{borderTop:'0.5px solid grey'}}>
                <Link to={`/profil/${result.id}`}>
                    <p style={{color:'white', textAlign:'start', paddingLeft:'10px', width:'200px'}}>@ {result.username}</p>
                </Link>
            </div>
        );
        })}
    </div>

    );
     
    
};

export default SearchResultsComponent;