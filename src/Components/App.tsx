import React from 'react';
import Routes from './Routes';

function App() {
    window.localStorage.setItem('wheel', 'true');

    return (
        <div className="App">
            <Routes />
        </div>
    );
}

export default App;
