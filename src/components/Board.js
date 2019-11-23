import React from 'react';

function Board (props) {

    let dataCards = props.dataCards;
    let listId = props.id
    let _editTaskList = props._editTaskList


    function drop(e) {
        
        e.preventDefault();
        const card_id = e.dataTransfer.getData('card_id');
        const card = document.getElementById(card_id)
        card.style.display = 'block';
        const index = dataCards.findIndex(element => element.key == card.id);
        const name = dataCards[index].cardName;      
        _editTaskList(card.id, name, listId, dataCards);
    }

    const dragOver = e => {
        e.preventDefault();
    }

    return (
        <div
            id={props.id}
            className={props.className}
            onDrop={drop}
            onDragOver={dragOver}
        >
            {props.children}
        </div>
    )
}

export default Board;