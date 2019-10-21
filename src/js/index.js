/* Select DOM element */
const cell = document.getElementsByClassName('cell');


/* Create array of cells */
let cells = [...cell];
let cellsArray = [];

// Device array by row
for (let i = 0; i + 10 <= cells.length; i += 10) {
    cellsArray.push(cells.slice(i, i + 10));
}


/* Generate Charactor */
const playerOneImage = 'img/player/player_gr.png';
const playerTwoImage = 'img/player/player_yr.png';

/* Select cells */
class MapIcon {
    constructor(row, column) {
        this.row = row;
        this.column = column;
    }
}

const pickCell = () => {
    const row = Math.floor(Math.random() * 9);
    const column = Math.floor(Math.random() * 10);
    
    console.log('Row: ' + row + ' Col: ' + column);
    return new MapIcon(row, column);
}

const generatePlayer = (image, place) => {
    const playerImage = document.createElement('img');
    playerImage.setAttribute('src', image);
    place.append(playerImage);
};


const generateIcons = () => {
    
    let isDuplicate = false;
    let isTouching = false;

    let playerOne = pickCell();
    let playerTwo;

    //const cellsTouchXUp = playerTwo.column == playerOne.column && parseInt(playerTwo.row) - parseInt(playerOne.row) == 1;
    //const cellsTouchXDown = playerTwo.column == playerOne.column && parseInt(playerTwo.row) - parseInt(playerOne.row) == -1;

    //console.log(parseInt(playerTwo.row));

    const evaluateCells = () => {
        playerTwo = pickCell();
        
        // Avoid picking same cells
        playerTwo.row == playerOne.row && playerTwo.column == playerOne.column ? isDuplicate = true : isDuplicate = false;

        // Avoid vertical touch
        if(playerTwo.column == playerOne.column && parseInt(playerTwo.row) - parseInt(playerOne.row) == 1) {
            return isTouching = true;
        } else if (playerTwo.column == playerOne.column && parseInt(playerTwo.row) - parseInt(playerOne.row) == -1) {
            return isTouching = true;
        } else {
            isTouching = false;
        }

        // Avoid horizontal touch
        if(playerTwo.row == playerOne.row && parseInt(playerTwo.column) - parseInt(playerOne.column) == 1) {
            return isTouching = true;
        } else if (playerTwo.row == playerOne.row && parseInt(playerTwo.column) - parseInt(playerOne.column) == -1) {
            return isTouching = true;
        } else {
            isTouching = false;
        }

    };

    evaluateCells();
    
    // Reselect cell
    while(isDuplicate || isTouching) {

        // Reset Values
        isDuplicate = false;
        isTouching = false;

        evaluateCells();
    }
    
    console.log('P1 row: ' + playerOne.row + ' col: ' + playerOne.column);
    console.log('P2 row: ' + playerTwo.row + ' col: ' + playerTwo.column);

    const generateCharactors = () => {
        generatePlayer(playerOneImage, cellsArray[playerOne.row][playerOne.column]);
        generatePlayer(playerTwoImage, cellsArray[playerTwo.row][playerTwo.column]);
    };

    generateCharactors();
};




/* Event Listener */
$('.start-button').on('click', function(e) {
    e.preventDefault();

    // Reset Cells
    for(let cell of cells) {
        cell.innerHTML = '';
    }

    generateIcons();
});