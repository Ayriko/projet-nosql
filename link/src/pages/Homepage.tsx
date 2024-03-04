import React from 'react';
import {Link} from "react-router-dom";

function Homepage(): React.JSX.Element {
    return (
        <div>
            <Link to={"/login"}>Se connecter</Link>
        </div>
    );
}

export default Homepage;