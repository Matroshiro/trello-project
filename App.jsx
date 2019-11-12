import React from 'react';
import "./styles/style.scss";


class App extends React.Component {

    constructor() {
        super()
        this.state = {
            dataLists: [{
                id: 1,
                name: "To do"
            },
            {
                id: 2,
                name: "Doing"
            },
            {
                id: 3,
                name: "Done"
            },
            {
                id: 4,
                name: "Test"
            }
            ],
            dataCards: [{
                id: 1,
                cardTitle: "Push le projet",
                idList: 1,
            },
            {
                id: 2,
                cardTitle: "Faire le trello",
                idList: 2,
            },
            {
                id: 3,
                cardTitle: "Styliser le trello",
                idList: 2,
            },
            {
                id: 4,
                cardTitle: "Setup l'environnement",
                idList: 3,
            },
            {
                id: 5,
                cardTitle: "Setup l'environnement",
                idList: 4,
            }
            ]
        }
    }

    render() {
        return (
            <div>
                <h1 className="text-center p-4 main-title">My homemade trello</h1>
                <div className="card-deck container-fluid row margin-left">
                    {this.state.dataLists.map((list, index) => {
                        const cards = this.state.dataCards
                            .filter(card => card.idList == list.id);
                        return (
                            <div className="col-lg-2 list-content" key={index}>
                                <div className="card-title task-title text-center p-3">{list.name}</div>
                                <div className="card">
                                    {
                                        cards.map((card, index) => {
                                            console.log("card = " + JSON.stringify(card));
                                            return (
                                                <div className="card-body" key={index}>
                                                    <div className="card-title">{card.cardTitle}</div>
                                                    <div className="card-text">This is a longer card with supporting text below as a natural lead-in to additional content. This content is a little bit longer.</div>
                                                </div>
                                            )
                                        })
                                    }
                                    <div className="card-footer">
                                        <small className="text-muted">Last updated 3 mins ago</small>
                                    </div>
                                </div>
                            </div>
                        )
                    }
                    )}
                </div>
            </div>);
    }
}
export default App;