import React from 'react';
import "./src/styles/style.scss";
import Tasks from './src/components/Tasks';


class App extends React.Component {

    render() {
        return (
            <div>
                <Tasks />
            </div>
            );
    }
}
export default App;