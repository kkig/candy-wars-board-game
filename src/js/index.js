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

class MapIcon {
    constructor(row, column) {
        this.row = row;
        this.column = column;
    }
}

const generatePlayer = (image, place) => {
    const playerImage = document.createElement('img');
    playerImage.setAttribute('src', image);
    place.append(playerImage);
};

const pickCell = () => {
    const row = Math.floor(Math.random() * 9);
    const column = Math.floor(Math.random() * 10);
    
    console.log('Row: ' + row + ' Col: ' + column);
    return new MapIcon(row, column);
}

const generateIcons = () => {
    let playerOne = pickCell();
    let playerTwo = pickCell();

    const sameCell = playerTwo.row == playerOne.row && playerTwo.column == playerOne.column;
    //const cellsTouchXUp = playerTwo.column == playerOne.column && parseInt(playerTwo.row) - parseInt(playerOne.row) == 1;
    //const cellsTouchXDown = playerTwo.column == playerOne.column && parseInt(playerTwo.row) - parseInt(playerOne.row) == -1;

    //console.log(parseInt(playerTwo.row));
    /*
    while(sameCell) {
        playerTwo = pickCell();
    }
    */

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