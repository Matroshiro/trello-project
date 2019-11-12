import React from 'react';
import "./styles/style.scss";


class App extends React.Component {

    constructor() {
        super()
        this.state = {
            dataList: [{
                id: 1,
                name: "To do"
            },
            {
                id:2,
                name: "Doing"
            },
            {
                id:3,
                name: "Done"
            }
        ],
        dataCards : [{
            id: 2   ,
            cardTitle: "Push le projet",
            idList : 1,
        },
        {
            id: 2,
            cardTitle: "Faire le trello",
            idList : 2,
        },
        {
            id: 3,
            cardTitle: "Styliser le trello",
            idList : 2,
        },
        {
            id: 4,
            cardTitle: "Setup l'environnement",
            idList : 3,
        }
        ]
        }
    }

    render() {
        return (
            <div>
                <h1>My homemade trello</h1>
                <div className="card" style={{width: "18rem"}}>
                    <img src="https://www.sciencesetavenir.fr/assets/img/2016/09/02/cover-r4x3w1000-5834b11017175-elon-musk.jpg" className="card-img-top" alt="..."></img>
                    <div className="card-body">
                        <h5 className="card-title">Card title</h5>
                        <p className="card-text">Some quick example text to build on the card title and make up the bulk of the card's content.</p>
                        <a href="#" className="btn btn-primary">Go somewhere</a>
                    </div>
                </div>
            </div>);
        }
    }
export default App;