import React from 'react';
import "../styles/style.scss";
import firebase from "../firebase/index";
import List from "./List";
import Card from "./Card";

class Tasks extends React.Component {

    constructor() {
        super()
        this.state = {
            dataBoards: [],
            currentBoard: "",
            dataLists: [],
            dataCards: [],
            boardName: "",
            listName: "",
            cardName: "",
            adding: -1,
            editingBoard: -1,
            editingCard: -1,
            editingCardInList: -1,
            editingList: -1,
            addList: "",
            addBoard: "",
            textEdited: ""
        }
        this._handleClick = this._handleClick.bind(this);
        this.setWrapperRef = this.setWrapperRef.bind(this);
        this._handleClickOutside = this._handleClickOutside.bind(this);
        this._selectBoard = this._selectBoard.bind(this)
    }

    componentDidMount() {
        document.addEventListener('mousedown', this._handleClickOutside);

        const myBoard = firebase.database().ref('boards/');

        myBoard
            .on('value', (snapshot) => {

                const myBoardFromDatabase = snapshot.val()

                if (myBoardFromDatabase === null) {
                    console.log("Board in the database is null")
                } else {
                    const boards = Object.keys(snapshot.val()).map(key => {
                        return {
                            key: key,
                            boardName: myBoardFromDatabase[key].boardName
                        }
                    })
                    if (this.state.currentBoard == "") {
                        this.setState({
                            dataBoards: boards,
                            currentBoard: boards[boards.length - 1].key
                        })
                    } else {
                        this.setState({
                            dataBoards: boards,
                        })

                    }
                }
            })

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
                            listName: myListFromDatabase[key].listName,
                            boardKey: myListFromDatabase[key].boardKey
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
        this.setState({
            [e.target.name]: e.target.value
        })
    }

    _saveBoard = (e) => {
        if (this.state.addBoard === '') {
            alert("this can not be empty")
        } else {
            const newBoardKey = firebase.database().ref('boards/').push().key;
            firebase
                .database()
                .ref('boards/')
                .update({
                    [newBoardKey]: {
                        boardName: this.state.addBoard
                    }
                })
            this.setState({
                addBoard: '',
                editingBoard: -1,
                currentBoard: newBoardKey
            })
        }
    }

    _saveList = (e) => {
        if (this.state.addList === '') {
            alert("this can not be empty")
        } else {
            const newListKey = firebase.database().ref('lists/').push().key;
            firebase
                .database()
                .ref('lists/')
                .update({
                    [newListKey]: {
                        listName: this.state.addList,
                        boardKey: this.state.currentBoard
                    }
                })
            this.setState({
                addList: ''
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
                editingBoard: -1,
                textEdited: "",
                listName: "",
                boardName: ""
            })
        }
    }

    _handleClick(index, e) {
        this.setState({
            adding: index,
            cardName: "",
            boardName: "",
            editingCard: -1,
            editingList: -1,
            editingBoard: -1,
            textEdited: "",
            listName: "",
            boardName: ""
        });
    }

    _selectBoard(key, e) {
        this.setState({
            currentBoard: key,
            editingBoard: -1
        })
    }

    _handleEditBoard(index, name, key) {
        this.setState({
            editingBoard: index,
            boardName: name
        });
    }

    _editBoardName(e, key) {
        if (this.state.boardName === '') {
            alert("this can not be empty")
        } else {
            firebase
                .database()
                .ref('boards/' + key)
                .set({
                    boardName: this.state.boardName
                })
            this.setState({
                editingBoard: -1,
                boardName: "",
            })
        }
    }

    _handleEditList(index, name) {

        this.setState({
            editingList: index,
            listName: name
        });
    }

    _editListName(e, key) {
        if (this.state.listName === '') {
            alert("this can not be empty")
        } else {
            firebase
                .database()
                .ref('lists/' + key)
                .set({
                    listName: this.state.listName,
                    boardKey: this.state.currentBoard
                })
            this.setState({
                editingList: -1,
                listName: ""
            })
        }
    }

    _handleEditTask(index, indexTask, key) {
        const posTask = this.state.dataCards.findIndex(element => element.key == key);
        this.setState({
            editingCard: indexTask,
            cardName: this.state.dataCards[posTask].cardName,
            editingCardInList: index,
            adding : -1
        });
    }

    _editTaskName(e, key, listKey) {
        if (this.state.cardName === '') {
            alert("this can not be empty")
        } else {
            firebase
                .database()
                .ref('cards/' + key)
                .set({
                    cardName: this.state.cardName,
                    listKey: listKey
                })
            this.setState({
                editingCard: -1,
                cardName: "",
                editingCardInList: -1
            })
        }
    }

    _editTaskList(key, name, listKey, dataCards) {

        const index = dataCards.findIndex(element => element.key == key);
        if (dataCards[index].listKey === listKey || !key || !name || !listKey || !dataCards) {
            console.log("Missing or incorrect parameter to move the card")
        } else {
            firebase
                .database()
                .ref('cards/' + key)
                .set({
                    cardName: name,
                    listKey: listKey
                })
        }
    }

    _handleDeleteBoard = (e, key) => {
        e.stopPropagation();
        let listsNbr = 0;
        let listInBoard = this.state.dataLists.filter(list => list.boardKey == key);
        for (let i = 0; i < listInBoard.length; i++) {
            listsNbr++;
        }
        if (listsNbr > 0) {
            for (let i = 0; i < listInBoard.length; i++) {
                this._handleDeleteList(listInBoard[i].key)
            }
        }

        firebase
            .database()
            .ref(`boards/${key}`)
            .remove()
            .then(() => {
                if (key == this.state.currentBoard && this.state.dataBoards.length > 0) {
                    this.setState({
                        currentBoard: this.state.dataBoards[this.state.dataBoards.length - 1].key
                    })
                }
            })
        const boardLenght = this.state.dataBoards.length
        if (boardLenght === 1) {
            this.setState({ dataBoards: [], currentBoard: "", editingBoard: -1 })
        }
    }



    _handleDeleteList = (key) => {
        const { dataCards } = this.state;
        let cardsNbr = 0;

        for (let i = 0; i < dataCards.length; i++) {
            if (key === dataCards[i].listKey) {
                cardsNbr++;
            }
        }
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

    _handleMoveCard = (cardKey, moveByIndex, listInBoard) => {
        const { dataCards } = this.state;
        const moveToAnotherList = listInBoard[moveByIndex].key
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
        let listInBoard = this.state.dataLists.filter(list => list.boardKey == this.state.currentBoard);
        return (
            <div>
                <h1 className="text-center p-4 main-title">My homemade trello</h1>
                <div ref={this.setWrapperRef} className="container-fuid">
                    <div ref={this.setWrapperRef} className="card-deck" style={{ marginLeft: "15px" }}>
                        {
                            this.state.dataBoards.map((board, index) => {



                                if (board.key == this.state.currentBoard) {

                                    if (this.state.editingBoard != -1 && this.state.editingBoard == index) {
                                        return (
                                            <div className="card-header add-board border-custom text-center board-selected-title" key={index}>
                                                <input
                                                    id={board.key}
                                                    className="bg-custom-secondary add-list-input"
                                                    placeholder="Add a Board"
                                                    type="text"
                                                    name="boardName"
                                                    value={this.state.boardName}
                                                    onChange={this._handleChange}
                                                    onKeyDown={(e) => {
                                                        if (e.key === 'Enter') {
                                                            this._editBoardName(e, board.key)
                                                        }
                                                    }}
                                                    autoFocus={true}
                                                >
                                                </input>
                                            </div>
                                        )
                                    } 
                                        return (
                                            <div className="card-header add-board border-custom text-center board-selected-title" key={index} onClick={this._handleEditBoard.bind(this, index, board.boardName, board.key)}>
                                                {board.boardName}
                                                <i className="fa fa-window-close" onClick={(e) => {
                                                    this._handleDeleteBoard(e, board.key)
                                                }} style={{ float: "right" }}></i>
                                            </div>
                                        )   
                                } else {
                                    return (
                                        <div className="card-header add-board border-custom text-center board-title" key={index} onClick={this._selectBoard.bind(this, board.key)}>
                                            {board.boardName}
                                        </div>
                                    )
                                }

                            }
                            )}
                        {
                            <div className="">
                                <div className="card-header add-board border-custom">
                                    <div className="row">
                                        <input
                                            className="bg-custom-primary add-board-input "
                                            placeholder="Add a board"
                                            type="text"
                                            name="addBoard"
                                            value={this.state.addBoard}
                                            onChange={this._handleChange}
                                            onKeyDown={(e) => {
                                                if (e.key === 'Enter') {
                                                    this._saveBoard()
                                                }
                                            }}
                                            autoFocus={true}
                                        />
                                    </div>
                                </div>
                            </div>
                        }
                    </div>


                    <div className="card-deck container-fluid row margin-left">
                        {listInBoard.map((list, index) => {

                            const cards = this.state.dataCards
                                .filter(card => card.listKey == list.key);
                            return (
                                <div className="col-lg-2 list-content" id={list.key} key={index}>
                                    <List id={list.key} key={index} _editTaskList={this._editTaskList} dataCards={this.state.dataCards}>

                                        {
                                            this.state.editingList == index ?


                                                <div className="card-title list-title text-center">
                                                    <div className="card-header add-list">
                                                        <i className="fa fa-edit" onClick={(e) => {
                                                            this._editListName(e, list.key)
                                                        }} style={{ position: "fixed" }}></i>
                                                        <input
                                                            className="bg-custom-secondary add-list-input "
                                                            placeholder="Name the list"
                                                            type="text"
                                                            name="listName"
                                                            value={this.state.listName}
                                                            onChange={this._handleChange}
                                                            onKeyDown={(e) => {
                                                                if (e.key === 'Enter') {
                                                                    this._editListName(e, list.key)
                                                                }
                                                            }}
                                                            autoFocus={true}
                                                        />
                                                    </div>
                                                </div>


                                                :
                                                <div className="card-title list-title text-center p-3" onClick={this._handleEditList.bind(this, index, list.listName)}>
                                                    {list.listName}
                                                    <i className="fa fa-window-close" onClick={(e) => {
                                                        e.stopPropagation();
                                                        this._handleDeleteList(list.key)
                                                    }} style={{ float: "right" }}></i>
                                                </div>
                                        }
                                        {
                                            cards.map((card, indexTask) => {
                                                return (
                                                    <Card
                                                        id={card.key}
                                                        className="card-body primary-shadow card-content bg-white"
                                                        key={indexTask}
                                                        draggable="true"
                                                    >
                                                        <i onClick={() => {
                                                            this._handleDeleteCard(card.key)
                                                        }} className="fa fa-window-close" style={{ float: "right", fontSize: "20px" }}></i>
                                                        {
                                                            this.state.editingCard == indexTask && this.state.editingCardInList == index ?
                                                                <textarea
                                                                    className="add-task task-text no-shadow"
                                                                    placeholder="Add a Task"
                                                                    type="text"
                                                                    name="cardName"
                                                                    value={this.state.cardName}
                                                                    onChange={this._handleChange}
                                                                    onKeyDown={(e) => {
                                                                        if (e.key === 'Enter') {
                                                                            this._editTaskName(e, card.key, card.listKey)
                                                                        }
                                                                    }}
                                                                    autoFocus={ true }
                                                                >
                                                                </textarea>
                                                                :
                                                                <div className="card-title task-text" onClick={this._handleEditTask.bind(this, index, indexTask, card.key)}>
                                                                    {card.cardName}
                                                                </div>

                                                        }
                                                        <div className="row" style={{ display: "flow-root" }}>
                                                            {
                                                                index >= 1 ? (
                                                                    <button className="bg-custom-primary" onClick={() => {
                                                                        this._handleMoveCard(card.key, index - 1, listInBoard)
                                                                    }} style={{ float: "left" }}><i className="fa fa-arrow-left secondary-color"></i></button>
                                                                ) : ""
                                                            }
                                                            {
                                                                index < listInBoard.length - 1 ? (
                                                                    <button className="bg-custom-primary" onClick={() => {
                                                                        this._handleMoveCard(card.key, index + 1, listInBoard)
                                                                    }} style={{ float: "right" }}><i className="fa fa-arrow-right secondary-color"></i></button>
                                                                ) : ""
                                                            }


                                                        </div>

                                                    </Card>
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
                                                            autoFocus={ true }
                                                        />
                                                        <div className="new-task-footer">
                                                            <button type="button" className="save-button" style={{ "fontWeight": 500 }} onClick={(e) => {
                                                                this._saveCard(
                                                                    { key: list.key },
                                                                    { title: this.state.cardName },
                                                                    { index: list.index },
                                                                    { e }
                                                                )
                                                            }}>Save</button>
                                                            <i onClick={this._handleClick.bind(this, -1)} className="fa fa-2x fa-trash" style={{ float: "right", margin: "10px" }}></i>                                                    </div>
                                                    </div>
                                                    <small className="text-muted">zapptax technical test</small>
                                                </div>
                                                :
                                                <div className="add-task-toggle-off" onClick={this._handleClick.bind(this, index)}>
                                                    Add a task
                                            </div>
                                        }
                                    </List>

                                </div>
                            )
                        }
                        )}
                        {
                            this.state.currentBoard != "" ?
                                (<div>
                                    <div className="card border-custom" style={{ marginLeft: "0" }}>
                                        <div className="card-header add-list">
                                            <div className="row">
                                                <input
                                                    className="bg-custom-primary add-list-input "
                                                    placeholder="Add a List"
                                                    type="text"
                                                    name="addList"
                                                    value={this.state.addList}
                                                    onChange={this._handleChange}
                                                    onKeyDown={(e) => {
                                                        if (e.key === 'Enter') {
                                                            this._saveList()
                                                        }
                                                    }}
                                                    autoFocus={true}
                                                />
                                            </div>
                                        </div>
                                    </div>
                                </div>) : ""
                        }


                    </div>
                </div>
                )
            </div>);
    }
}

export default Tasks;