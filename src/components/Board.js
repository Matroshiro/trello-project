import React from 'react';

function Board (props) {

    
    let dataLists = props.dataLists
    let listId = props.id


    function drop(e) {
        
        e.preventDefault();
//        e.stopPropagation();

        const card_id = e.dataTransfer.getData('card_id');
        const card = document.getElementById(card_id)
        card.style.display = 'block';
        const list = document.getElementById(listId)        
        console.log(listId)

        //faire une fonction qui update la base de donnée en déplacant la card dans la liste

//        console.log(card.id); id de la carte à déplacer
        list.appendChild(card)
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