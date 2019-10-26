const boardDomArray = document.getElementsByClassName('box');

/* Images */
const playerOneImage = 'img/player/player_gr.png';
const playerTwoImage = 'img/player/player_yr.png';

const weaponOneImage = 'img/weapon/bean_blue.png';
const weaponTwoImage = 'img/weapon/bean_green.png';
const weaponThreeImage = 'img/weapon/jelly_yellow.png';
const weaponFourImage = 'img/weapon/wrappedtrans_red.png';

const obstacleOneImage = 'img/map/rock.png';


/* Setting */
const numberOfColumns = 6;
const numberOfRows = 5;
const totalNumberOfCells = numberOfColumns * numberOfRows;
const columnDivide = 12 / numberOfColumns; //class = `col-${columnDivide}`

const maxRowIndex = numberOfRows - 1;
const maxColumnIndex = numberOfColumns - 1;

const maxMovement = 3;

const obstacleQuantity = Math.floor(totalNumberOfCells * .15);  // About 25% of map
const weaponQuantity = Math.floor(totalNumberOfCells * .10); // About 10% of cell will be candy

let isPlayerOne = true;

/* Icons */
class MapIcon {
    constructor(id, name, image) {
        this.id = id;
        this.name = name;
        this.image = image;
    }
}

// ID cand be change.
// Please keep players and obstacles at the end of this list. 
const weaponOne = new MapIcon(1, 'Blue Beans Bomb', weaponOneImage);
const weaponTwo = new MapIcon(2, 'Green Beans Bomb', weaponTwoImage);
const weaponThree = new MapIcon(3, 'Yellow Jelly Bomb', weaponThreeImage);
const weaponFour = new MapIcon(4, 'Red Candy Bomb', weaponFourImage);

const obstacleOne = new MapIcon(5, 'Dummy Rock', obstacleOneImage);

const playerOne = new MapIcon(6, 'Squeaky', playerOneImage);
const playerTwo = new MapIcon(7, 'Mr.Pickles', playerTwoImage);


playerOne.colorClass = 'player-one-active';
playerOne.targetClass = '.player-one';

playerTwo.colorClass = 'player-two-active';
playerTwo.targetClass = '.player-two';


/* Map out the board */
let allCells = [];
let map = [];
let domArray = [];

const createMap = () => {
    // create array of all cells
    for(i = 0; i < totalNumberOfCells; i++) {
        allCells.push(0);
    }
};

const createMapOverview = () => {  
    // Split into array per row
    for(i = 0; i + numberOfColumns <= totalNumberOfCells; i += numberOfColumns) {
        map.push(allCells.slice(i, i + numberOfColumns));
    }

};

const createDomArray = () => {
    let rowDom = [...document.querySelectorAll('.box')];

    // Split per row
    for(i = 0; i + numberOfColumns <= totalNumberOfCells; i += numberOfColumns) {
        domArray.push(rowDom.slice(i, i + numberOfColumns));
    }
};

/* select cells to generate icons */
let row;
let column;

const selectRandomCells = () => {
    row = Math.floor(Math.random() * numberOfRows);
    column = Math.floor(Math.random() * numberOfColumns);
};


const updateMap = icon => {
    map[row][column] = icon.id;

    // Store placement info to player class
    if(icon.id >= playerOne.id) {
        icon.row = row;
        icon.column = column;
    }
};


const selectIconCell = icon => {
    selectRandomCells();

    // Avoid duplicate
    while(map[row][column] != 0) {
        selectRandomCells();
    }

    updateMap(icon);
};

const selectPlayerTwo = () => {
    let isViolation = true;

    while(isViolation) {
        selectRandomCells();

        // Reset Values
        let isDuplicate = false;

        let isHeadTouching = false;
        let isRightTouching = false; 
        let isFootTouching = false;        
        let isLeftTouching = false;   


        // Check Duplicate
        map[row][column] > 0 ? isDuplicate = true : isDuplicate = false;

        // Check Above
        if(row < 1) {
            isHeadTouching = false;
        } else if (row > 0 && map[row - 1][column] != playerOne.id) {
            isHeadTouching = false;
        } else {
            isHeadTouching = true;
        }   

        // Check Below
        if(row >= maxRowIndex) {
            isFootTouching = false;
        } else if(row < maxRowIndex && map[row + 1][column] != playerOne.id) {
            isFootTouching = false;
        } else {
            isFootTouching = true;
        }

        // Check Left
        if(column < 1) {
            isLeftTouching = false;
        } else if(column > 0 && map[row][column - 1] != playerOne.id) {
            isLeftTouching = false;
        } else {
            isLeftTouching = true;
        }   

        // Check Right
        if(column >= maxColumnIndex) {
            isRightTouching = false;
        } else if(column < maxColumnIndex && map[row][column + 1] != playerOne.id) {
            isRightTouching = false;
        } else {
            isRightTouching = true;
        }

        // Chell all the violations
        isDuplicate || isHeadTouching || isRightTouching || isLeftTouching || isFootTouching ? isViolation = true : isViolation = false;
    }

    updateMap(playerTwo);

};

const selectObstacleCells = () => {
    for(let i = 0; i < obstacleQuantity; i++) {
        selectIconCell(obstacleOne);
    }
};

const selectWeaponCells = () => {
    // Generate weapons
    for(let i = 0; i < weaponQuantity; i++) {
        selectIconCell(weaponOne);
        selectIconCell(weaponTwo);
        selectIconCell(weaponThree);
        selectIconCell(weaponFour);
    }
   
};


/* Set up board to start */
const generateCells = () => {
    // Devide all cells per row
    createMapOverview();
    
    // Place Obstacles
    selectObstacleCells();    
    
    // Select Weapon cells
    selectWeaponCells();

    // Select Player One cell
    selectIconCell(playerOne);

    // Select Player Two cell
    selectPlayerTwo();    
    

    // Update allCell array
    allCells = [].concat(...map);

    
    for(let eachCell of allCells) {
        const cell = document.createElement('div');
        
       switch (eachCell) {
           case playerOne.id:
                cell.classList.add(`col-${columnDivide}`,'box', 'map-icon','player-one');
                break;
            case playerTwo.id:
                cell.classList.add(`col-${columnDivide}`, 'box', 'map-icon', 'player-two');
                break;
            case weaponOne.id:
                cell.classList.add(`col-${columnDivide}`, 'box', 'map-icon', 'weapon-one');
                break;
            case weaponTwo.id:
                cell.classList.add(`col-${columnDivide}`, 'box', 'map-icon', 'weapon-two');
                break;
            case weaponThree.id:
                cell.classList.add(`col-${columnDivide}`, 'box', 'map-icon', 'weapon-three');
                break;
            case weaponFour.id:
                cell.classList.add(`col-${columnDivide}`, 'box', 'map-icon', 'weapon-four');
                break;
            case obstacleOne.id:
                cell.classList.add(`col-${columnDivide}`, 'box', 'map-icon', 'obstacle-one');
                break;

            default:
                    cell.classList.add(`col-${columnDivide}`,'box');
                break;
       }
    
        $('.board').append(cell);
    }
    
};


/* Movements */
const colorAbove = player => {
    const playerIndex = $(player.targetClass).index();
    let moveCount = 0;

    for(i = playerIndex; 0 <= i - numberOfColumns; i -= numberOfColumns) {
        if (allCells[i - numberOfColumns] < obstacleOne.id) {
            if(moveCount < maxMovement) {
                boardDomArray[i - numberOfColumns].classList.add(player.colorClass);
                moveCount ++;
            }
        } else {
            return;
        }
    }
};

const colorBelow = player => {
    const playerIndex = $(player.targetClass).index();
    let moveCount = 0;

    for(i = playerIndex; i + numberOfColumns < totalNumberOfCells; i += numberOfColumns) {
        
        if(allCells[i + numberOfColumns] < obstacleOne.id) {
            if(moveCount < maxMovement) {
                boardDomArray[i + numberOfColumns].classList.add(player.colorClass);
                moveCount++;
            }
        } else {
            return;
        }
    }
};

const colorLeft = player => {
    const playerIndex = $(player.targetClass).index();
    let moveCount = 0;

    for(i = player.column; 0 < i; i--) {
        if(map[player.row][i - 1] < obstacleOne.id) {
            if(moveCount < maxMovement) {
                boardDomArray[playerIndex - moveCount - 1].classList.add(player.colorClass);
                moveCount++;
                console.log(i - 1);
                console.log('map: ' + map[player.row][i - 1]);    
            }
        } else {
            return;
        }
    }
};


const changeCellColor = (player) => {
    // Change color of player cells
    $(player.targetClass).addClass(player.colorClass);

    // Change color of movable cells
    activateMovable(player);
};

const activateMovable = player => {


    // Index of total cells
    const playerIndex = $(player.targetClass).index();
    //const colorClass = 'player-one-active';
    //console.log(boardDomArray[playerIndex]);
    //console.log(playerIndex);
    //console.log(playerIndex - numberOfColumns);
    console.log('playerIndex: ' + playerIndex);

    colorAbove(player);
    colorBelow(player);
    colorLeft(player);
    
    //console.log($('.box').children());
};



/* Event Listener */

$('.start-button').on('click', function(e) {
    e.preventDefault();
    

    // Reset Board
    $('.board').html('');
    allCells = [];
    map = [];

    // Create Map
    createMap();

    for(i = 0; i < totalNumberOfCells; i++) {
        generateCells();
    }

    createDomArray();

    // Highlight Movable Cells
    if(isPlayerOne) {
        changeCellColor(playerOne);
    }

    // test to change life
    $('#player02-life').text('90');

});