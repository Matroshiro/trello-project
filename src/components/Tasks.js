import React from 'react';
import "../styles/style.scss";
import firebase from "../firebase/index";


class Tasks extends React.Component {

    constructor() {
        super()
        this.state = {
            dataLists: [],
            dataCards: [],
            listName: ""
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
                            listName : myListFromDatabase[key].listName
                        }
                    })
                            console.log("datalist = " + JSON.stringify(lists));

                    this.setState({
                        dataLists : lists
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
                            key : key,
                            cardName : myCardFromDataBase[key].cardName
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
            [e.target.name] : e.target.value
        })
    }

    _saveList(e) {
        console.log("passed")
        if (this.state.listName === '') {
            alert("this can not be empty")
        } else {
            const newListKey = firebase.database().ref('lists/').push().key;
            firebase
            .database()
            .ref('lists/')
            .update({
                [newListKey] : {
                    listName: this.state.listName
                }
            })
            this.setState({
                listName : ''
            })
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
                                <div className="card-title task-title text-center p-3">{list.listName}</div>
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
                                        <div className="row">
                                            <input 
                                            placeholder="Add a task"                                            
                                            />
                                            <button>Save</button>
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
                                    onChange={this._handleChange}/>
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