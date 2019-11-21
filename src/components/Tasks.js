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
            cardName: "",
            adding: -1,
            editingCard: -1,
            editingCardInList: -1,
            editingList: -1,    
            textEdited: ""
        }
        this._handleClick = this._handleClick.bind(this);
        this.setWrapperRef = this.setWrapperRef.bind(this);
        this._handleClickOutside = this._handleClickOutside.bind(this);
    }

    componentDidMount() {
        const myList = firebase.database().ref('lists/');
        document.addEventListener('mousedown', this._handleClickOutside);

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

    componentWillUnmount() {
        document.removeEventListener('mousedown', this._handleClickOutside);
    }

    componentDidUpdate() {

    }

    _handleChange = (e) => {
        console.log("e.target.key = " + e.target.key)
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
                cardName: "",
                adding: -1
            })
        }
    }

    setWrapperRef(node) {
        this.wrapperRef = node;
    }

    _handleClickOutside(event) {
        if (this.wrapperRef && !this.wrapperRef.contains(event.target)) {
          this.setState({
            listName: "",
            cardName: "",
            adding: -1,
            editingCard: -1,
            editingList: -1,
            textEdited: ""
          })
        }
      }

    _handleClick(index, e) {
        console.log(this.state.index);
        this.setState({
            adding: index,
            editingList: -1,
            textEdited: ""
        });
    }

    _handleEditList(index) {
        console.log("_handkeEditList && index = " + index)
        this.setState({
            editingList: index,
            textEdited: this.state.dataLists[index].listName
        });
    }

    _editListName(e, index) {
        console.log("saving new listName && index = " + index)
        console.log(JSON.stringify(this.state.dataLists[index]))
        if (this.state.textEdited === '') {
            alert("this can not be empty")
        } else {
            firebase
                .database()
                .ref('lists/' + this.state.dataLists[index].key)
                .set({
                    listName: this.state.textEdited
                })
            this.setState({
                editingList: -1,
                textEdited: ""
            })
        }
    }

    _handleEditTask(index, indexTask, key) {
        console.log("key = " + key)
       console.log("this.state.dataCards = " + JSON.stringify(this.state.dataCards))
        const posTask = this.state.dataCards.findIndex(element => element.key == key);
        console.log("indexTask = " + indexTask)
        console.log("this.state.dataCards[posTask].cardName = " + this.state.dataCards[posTask].cardName)
        console.log("index = " + index)
   //     console.log("posTask = " + posTask)
        this.setState({
            editingCard: indexTask,
            textEdited: this.state.dataCards[posTask].cardName,
            editingCardInList: index
        });
    }

    _editTaskName(e, key, listKey) {
        console.log("key = " + key + "  && listKey = " + listKey)
        if (this.state.textEdited === '') {
            alert("this can not be empty")
        } else {
            firebase
                .database()
                .ref('cards/' + key)
                .set({
                    cardName: this.state.textEdited,
                    listKey: listKey
                })
            this.setState({
                editingCard: -1,
                textEdited: "",
                editingCardInList: -1
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
        if (cardsLenght === 1) {
            this.setState({ dataCards: [] })
        }
    }

    _handleMoveCard = (cardKey, moveByIndex) => {
        const { dataLists, dataCards } = this.state;
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
                [newCard.key]: {
                    listKey: moveToAnotherList,
                    cardName: newCard.cardName
                }
            });
    }

    render() {
        return (
            <div>
                <h1 className="text-center p-4 main-title">My homemade trello</h1>
                <div ref={this.setWrapperRef} className="card-deck container-fluid row margin-left">
                    {this.state.dataLists.map((list, index) => {

                        const cards = this.state.dataCards
                            .filter(card => card.listKey == list.key);
                        return (
                            <div className="col-lg-2 list-content" key={index}>

                                {
                                    this.state.editingList == index ?


                                        <div className="card-title list-title text-center">
                                            <div className="card-header add-list">
                                                <i className="fa fa-edit" onClick={(e) => {
                                                    this._editListName(e, index)
                                                }} style={{ position: "fixed" }}></i>
                                                <input
                                                    className="bg-custom-primary add-list-input "
                                                    placeholder="Add a List"
                                                    type="text"
                                                    name="textEdited"
                                                    value={this.state.textEdited}
                                                    onChange={this._handleChange}
                                                    onKeyDown={(e) => {
                                                        if (e.key === 'Enter') {
                                                            console.log("index inline = " + index)
                                                            this._editListName(e, index)
                                                        }
                                                    }}
                                                />
                                            </div>
                                        </div>


                                        :
                                        <div className="card-title list-title text-center p-3" onClick={this._handleEditList.bind(this, index)}>
                                            {list.listName}
                                            <i className="fa fa-window-close" onClick={() => {
                                                this._handleDeleteList(list.key)
                                            }} style={{ float: "right" }}></i>
                                        </div>
                                }

                                <div className="my-custom-card">
                                    {
                                        cards.map((card, indexTask) => {
                                            return (
                                                <div className="card-body primary-shadow card-content bg-white" key={indexTask}>
                                                    <i onClick={() => {
                                                        this._handleDeleteCard(card.key)
                                                    }} className="fa fa-window-close" style={{ float: "right" }}></i>
                                                    {console.log(this.state.editingCard + " " + indexTask + " && " + this.state.editingCardInList + " " + index)}
                                                    {
                                                        this.state.editingCard == indexTask && this.state.editingCardInList == index ?
                                                        <textarea
                                                            className="add-task task-text no-shadow"
                                                            placeholder="Add a Task"
                                                            type="text"
                                                            name="textEdited"
                                                            value={this.state.textEdited}
                                                            onChange={this._handleChange}
                                                            onKeyDown={(e) => {
                                                            if (e.key === 'Enter') {
                                                                console.log("index inline = " + index)
                                                                this._editTaskName(e, card.key, card.listKey)
                                                            }
                                                            }} 
                                                        >
                                                        </textarea>
                                                        :
                                                        <div className="card-title task-text" onClick={this._handleEditTask.bind(this, index, indexTask, card.key)}>
                                                            {card.cardName}
                                                        </div>

                                                    }
                                                    {/*<div className="card-text"></div>*/}
                                                    <div className="row" style={{ display: "block" }}>
                                                        {
                                                            index >= 1 ? (
                                                                <button className="bg-custom-primary" onClick={() => {
                                                                    this._handleMoveCard(card.key, index - 1)
                                                                }}><i className="fa fa-arrow-left secondary-color"></i></button>
                                                            ) : (<button className="" disabled>
                                                                <i className="grey fa fa-arrow-left"></i></button>)
                                                        }
                                                        {
                                                            index < this.state.dataLists.length - 1 ? (
                                                                <button className="bg-custom-primary pull-right" onClick={() => {
                                                                    this._handleMoveCard(card.key, index + 1)
                                                                }}><i className="fa fa-arrow-right secondary-color"></i></button>
                                                            ) : (<button className="pull-right" disabled>
                                                                <i className="grey fa fa-arrow-right"></i></button>)
                                                        }


                                                    </div>

                                                </div>
                                            )
                                        })
                                    }
                                    {
                                        this.state.adding == index ?
                                            <div className="card-footer custom-footer">
                                                <div className="row">
                                                    <textarea
                                                        className="add-task"
                                                        key={index}
                                                        placeholder="Add a task"
                                                        type="text"
                                                        name="cardName"
                                                        value={this.state.cardName}
                                                        onChange={this._handleChange}
                                                        onKeyDown={(e) => {
                                                            if (e.key === 'Enter') {
                                                                this._saveCard(
                                                                    { key: list.key },
                                                                    { title: this.state.cardName },
                                                                    { index: list.index },
                                                                    { e }
                                                                )
                                                            }
                                                        }}
                                                    />
                                                    <div className="new-task-footer">
                                                        <button type="button" className="save-button" onClick={(e) => {
                                                            this._saveCard(
                                                                { key: list.key },
                                                                { title: this.state.cardName },
                                                                { index: list.index },
                                                                { e }
                                                            )
                                                        }}>Save</button>
                                                        <i onClick={this._handleClick.bind(this, -1)} className="fa fa-2x fa-times" style={{ float: "right" }}></i>                                                    </div>
                                                </div>
                                                <small className="text-muted">zapptax technical test</small>
                                            </div>
                                            :
                                            <div className="add-task-toggle-off" onClick={this._handleClick.bind(this, index)}>
                                                Add a task
                                            </div>
                                    }

                                </div>
                            </div>
                        )
                    }
                    )}
                    <div>
                        <div className="card border-custom">
                            <div className="card-header add-list">
                                <div className="row">
                                    <input
                                        className="bg-custom-primary add-list-input "
                                        placeholder="Add a List"
                                        type="text"
                                        name="listName"
                                        value={this.state.listName}
                                        onChange={this._handleChange}
                                        onKeyDown={(e) => {
                                            if (e.key === 'Enter') {
                                                this._saveList()
                                            }
                                        }}
                                    />
                                    {/*<button
                                        onClick={() => this._saveList()}
                                    >Save</button>*/}
                                </div>
                            </div>
                        </div>
                    </div>

                </div>
            </div>);
    }
}

export default Tasks;