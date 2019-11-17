import React from 'react';
import "../styles/style.scss";
import firebase from "../firebase/index";

class Tasks extends React.Component {

    constructor() {
        super()
        this.state = {
            dataLists: [],
            dataCards: [],
            listName: "",
            cardName: ""
        }
    }

    componentDidMount() {
        const myList = firebase.database().ref('lists/');

        myList
            .on('value', (snapshot) => {

                const myListFromDatabase = snapshot.val()

                if (myListFromDatabase === null) {
                    console.log("List in the database is null")
                } else {
                    const lists = Object.keys(snapshot.val()).map(key => {
                        return {
                            key: key,
                            listName: myListFromDatabase[key].listName
                        }
                    })
                    this.setState({
                        dataLists: lists
                    })
                }
            })

        const myCard = firebase.database().ref('cards/')

        myCard
            .on('value', (snapshot) => {
                const myCardFromDataBase = snapshot.val()
                if (myCardFromDataBase === null) {
                    console.log("Card in the database is null")
                } else {
                    const cards = Object.keys(snapshot.val()).map(key => {
                        return {
                            key: key,
                            cardName: myCardFromDataBase[key].cardName,
                            listKey: myCardFromDataBase[key].listKey
                        }
                    })
                    this.setState({
                        dataCards: cards
                    })
                }
            })
    }

    _handleChange = (e) => {
        this.setState({
            [e.target.name]: e.target.value
        })
    }

    _saveList = (e) => {
        console.log("saved list")
        if (this.state.listName === '') {
            alert("this can not be empty")
        } else {
            const newListKey = firebase.database().ref('lists/').push().key;
            firebase
                .database()
                .ref('lists/')
                .update({
                    [newListKey]: {
                        listName: this.state.listName
                    }
                })
            this.setState({
                listName: ''
            })
        }
    }

    _saveCard = (key, title, index, e) => {
        if (this.state.cardName === '') {
            alert("this can not be empty")
        } else {
            const newCardKey = firebase.database().ref('cards/').push().key;
            firebase
                .database()
                .ref('cards/')
                .update({
                    [newCardKey]: {
                        listKey: key.key,
                        cardName: title.title
                    }
                })
            this.setState({
                cardName: ''
            })
        }
    }

    _handleDeleteList = (key) => {

        const { dataCards } = this.state;
        console.log(dataCards)
        let cardsNbr = 0;

        for (let i = 0; i < dataCards.length; i++) {
            if (key === dataCards[i].listKey) {
                cardsNbr++;
            }
        }

        console.log("cardsNbr = " + cardsNbr)
        if (cardsNbr > 0) {
            for (let i = 0; i < dataCards.length; i++) {
                if (key === dataCards[i].listKey) {
                    this._handleDeleteCard(dataCards[i].key)
                }
            }
        }

        firebase
            .database()
            .ref(`lists/${key}`)
            .remove()
        const listLenght = this.state.dataLists.length
        if (listLenght === 1) {
            this.setState({ dataLists: [] })
        }

    }

    _handleDeleteCard = key => {
        firebase
            .database()
            .ref(`cards/${key}`)
            .remove()
        const cardsLenght = this.state.dataCards.length
        if (cardsLenght === 1 || cardsLenght) {
            this.setState({ dataCards: [] })
        }
    }

    _handleMoveCard = (cardKey, moveByIndex) => {
        const { dataLists, dataCards} = this.state;
        const moveToAnotherList = dataLists[moveByIndex].key
        let newKeyOfCard;
        for (let i = 0; i < dataCards.length; i++) {
            if (cardKey === dataCards[i].key) {
                newKeyOfCard = i;
            }
        }

        const newCard = dataCards[newKeyOfCard]

        firebase
        .database()
        .ref("cards/")
        .update({
            [newCard.key] : {
                listKey : moveToAnotherList,
                cardName : newCard.cardName
            }
        });
    }

    render() {
        return (
            <div>
                <h1 className="text-center p-4 main-title">My homemade trello</h1>
                <div className="card-deck container-fluid row margin-left">
                    {this.state.dataLists.map((list, index) => {
                        
                        const cards = this.state.dataCards
                            .filter(card => card.listKey == list.key);
                        return (
                            <div className="col-lg-2 list-content" key={index}>
                                <div className="card-title task-title text-center p-3">
                                    {list.listName}
                                    <i className="fa fa-window-close" onClick={() => {
                                        this._handleDeleteList(list.key)
                                    }} style={{ float: "right" }}></i>
                                </div>
                                <div className="card">
                                    {
                                        cards.map((card, indexTask) => {
                                            return (
                                                <div className="card-body" key={indexTask}>
                                                    <div className="card-title">{card.cardName}<i className="fa fa-window-close" style={{ float: "right" }}></i></div>
                                                    <div className="card-text">This is a longer card with supporting text below as a natural lead-in to additional content. This content is a little bit longer.</div>
                                                {
                                                    index >= 1 ? (
                                                        <button className="bg-custom-primary" onClick={() => {
                                                            this._handleMoveCard(card.key, index - 1)
                                                        }}><i className="fa fa-arrow-circle-left secondary-color"></i></button>
                                                    ) : (<button className="bg-custom-primary" disabled><i className="fa fa-arrow-circle-left"></i></button>)
                                                }
                                                {
                                                    index < this.state.dataLists.length - 1 ? (
                                                        <button className="bg-custom-primary" onClick={() => {
                                                            this._handleMoveCard(card.key, index + 1)
                                                        }}><i className="fa fa-arrow-circle-right secondary-color"></i></button>
                                                    ) : (<button className="bg-custom-primary" disabled><i className="fa fa-arrow-circle-right"></i></button>)
                                                }
                                                
                                                </div>
                                            )
                                        })
                                    }
                                    <div className="card-footer">
                                        <div className="row">
                                            <input
                                                placeholder="Add a task"
                                                type="text"
                                                name="cardName"
                                                value={this.state.cardName}
                                                onChange={this._handleChange}
                                            />
                                            <button onClick={(key, title, index, e) =>

                                                this._saveCard(
                                                    { key: list.key },
                                                    { title: this.state.cardName },
                                                    { index: list.index },
                                                    { e }
                                                )

                                            }>Save</button>
                                        </div>

                                        <small className="text-muted">Last updated 3 mins ago</small>
                                    </div>
                                </div>
                            </div>
                        )
                    }
                    )}
                    <div>
                        <div className="card">
                            <div className="card-header">
                                <div className="row">
                                    <input
                                        placeholder="Add a List"
                                        type="text"
                                        name="listName"
                                        value={this.state.listName}
                                        onChange={this._handleChange} />
                                    <button
                                        onClick={() => this._saveList()}
                                    >Save</button>
                                </div>
                            </div>
                        </div>
                    </div>

                </div>
            </div>);
    }
}

export default Tasks;