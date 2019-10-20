/* Select DOM element */
const cell = document.getElementsByClassName('cell');

/* Create array of cells */
let cells = [...cell];
let cellsArray = [];
for (let i = 0; i + 10 <= cells.length; i += 10) {
    cellsArray.push(cells.slice(i, i + 10));
}

/* Generate Charactor */
const playerOneImage = 'img/player/player_gr.png';
const playerTwoImage = 'img/player/player_yr.png';

let playerOneCell;
let playerTwoCell;

// Make deep copy of arrays
//let newCellMap = JSON.parse(JSON.stringify(cellsArray));

//let newCellMap = [...cellsArray];
//let newCellMap = Array.from(cellsArray);

const pickCells = () => {
    

    const setPlayerCell = array => {
        const row = Math.floor(Math.random() * 9);
        const column = Math.floor(Math.random() * 10);
        
        console.log('Row: ' + row + ' Col: ' + column);
        //newCellMap[row][column] = null;
        //console.log(newCellMap);
        //console.log(cellsArray);
        return array[row][column];
    }

    // Select Player One Cell
    playerOneCell = setPlayerCell(cellsArray);
    generatePlayer(playerOneImage, playerOneCell);
    
    // Select Player Two Cell
    playerTwoCell = setPlayerCell(cellsArray);
    /*
    while(playerTwoCell = playerOneCell) {
        playerTwoCell = setPlayerCell(cellsArray);
    }
    */

    generatePlayer(playerTwoImage, playerTwoCell);


    
    /*
    // Select Player Two Cell
    let isCellNull = setPlayerCell(newCellMap);
    while(isCellNull = null) {
        setPlayerCell(newCellMap, playerTwoCell);
    }
    generatePlayer(playerTwoImage, playerTwoCell);    
    */    
};



const generatePlayer = (image, place) => {
    const playerImage = document.createElement('img');
    playerImage.setAttribute('src', image);
    place.append(playerImage);
};



/* Event Listener */
$('.start-button').on('click', function(e) {
    e.preventDefault();

    // Reset Cells
    for(let cell of cells) {
        cell.innerHTML = '';
    }

    pickCells();
});
