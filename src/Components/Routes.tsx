import React from 'react';
import {BrowserRouter as Router, Switch, Route, Redirect} from "react-router-dom";
import SaraStory from "../Routes/SaraStory";

const Routes = () => {
    return (
        <Router>
            <Switch>
                <Route path={"/"} component={SaraStory}/>
                <Redirect from={"*"} to={"/"}/>
            </Switch>
        </Router>
    );
};

export default Routes;