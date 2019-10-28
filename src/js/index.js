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

const obstacleQuantity = Math.floor(totalNumberOfCells * .35);  // About 35% of map
const weaponQuantity = 1; 

// Control which player starts turn
let isPlayerOne = true;


/* Icons */
class MapIcon {
    constructor(id, name, targetClass, image) {
        this.id = id;
        this.name = name;
        this.targetClass = targetClass;
        this.image = image;
    }
}

/*
** ID cand be change.
** Keep Unselectable cells after 'obstacleOne' to avoid error
** Check 'Available Cell Color' section
*/

const weaponOne = new MapIcon(1, 'Blue Beans Bomb', 'weapon-one', weaponOneImage);
const weaponTwo = new MapIcon(2, 'Green Beans Bomb', 'weapon-two', weaponTwoImage);
const weaponThree = new MapIcon(3, 'Yellow Jelly Bomb', 'weapon-three', weaponThreeImage);
const weaponFour = new MapIcon(4, 'Red Candy Bomb', 'weapon-four', weaponFourImage);

const obstacleOne = new MapIcon(5, 'Dummy Rock', 'obstacle-one', obstacleOneImage);

const playerOne = new MapIcon(6, 'Squeaky', 'player-one', playerOneImage);
const playerTwo = new MapIcon(7, 'Mr.Pickles', 'player-two', playerTwoImage);

// Add associated class to players
playerOne.colorClass = 'player-one-active';
playerOne.weapon = weaponOne;

playerTwo.colorClass = 'player-two-active';
playerTwo.weapon = weaponOne;

// Damage range to weapons
weaponOne.attacPoint = 10;
weaponTwo.attacPoint = 20;
weaponThree.attacPoint = 30;
weaponFour.attacPoint = 40;


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


/* Chekc If charactors are touching */
let isTouching = false;

const checkTouching = (row, column) => {
    isTouching = false;

    let isHeadTouching = false;
    let isRightTouching = false; 
    let isFootTouching = false;        
    let isLeftTouching = false;   

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

    isHeadTouching || isRightTouching || isLeftTouching || isFootTouching ? isTouching = true : isTouching = false;
};


const selectPlayerTwo = () => {
    let isViolation = true;

    while(isViolation) {
        selectRandomCells();

        let isDuplicate = false;

        map[row][column] > 0 ? isDuplicate = true : isDuplicate = false;

        checkTouching(row, column);
        isDuplicate || isTouching ? isViolation = true : isViolation = false;
    }

    updateMap(playerTwo);
};


const selectObstacleCells = () => {
    for(let i = 0; i < obstacleQuantity; i++) {
        selectIconCell(obstacleOne);
    }
};


const selectWeaponCells = () => {
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
    
    selectObstacleCells();    
    selectWeaponCells();
    selectIconCell(playerOne);
    selectPlayerTwo();    
    

    // Update allCell array
    allCells = [].concat(...map);

    
    for(let eachCell of allCells) {
        const cell = document.createElement('div');
        
       switch (eachCell) {
           case playerOne.id:
                cell.classList.add(`col-${columnDivide}`,'box', 'map-icon', playerOne.targetClass);
                break;
            case playerTwo.id:
                cell.classList.add(`col-${columnDivide}`, 'box', 'map-icon', playerTwo.targetClass);
                break;
            case weaponOne.id:
                cell.classList.add(`col-${columnDivide}`, 'box', 'map-icon', weaponOne.targetClass);
                break;
            case weaponTwo.id:
                cell.classList.add(`col-${columnDivide}`, 'box', 'map-icon', weaponTwo.targetClass);
                break;
            case weaponThree.id:
                cell.classList.add(`col-${columnDivide}`, 'box', 'map-icon', weaponThree.targetClass);
                break;
            case weaponFour.id:
                cell.classList.add(`col-${columnDivide}`, 'box', 'map-icon', weaponFour.targetClass);
                break;
            case obstacleOne.id:
                cell.classList.add(`col-${columnDivide}`, 'box', 'map-icon', obstacleOne.targetClass);
                break;

            default:
                    cell.classList.add(`col-${columnDivide}`,'box', 'map-icon');
                break;
       }
    
        $('.board').append(cell);
    }
    
};


/* Change Available Cell Color */
const colorAbove = player => {
    let moveCount = 0;

    for(i = player.row; i > 0; i -= 1) {
        if(map[i - 1][player.column] >= obstacleOne.id) {
            return;
        } else {
            if(moveCount < maxMovement) {
                domArray[i - 1][player.column].classList.add(player.colorClass);
                moveCount++;
            }
        }
    }

};

const colorBelow = player => {
    let moveCount = 0;

    for(i = player.row; i < maxRowIndex; i += 1) {
        if(map[i + 1][player.column] >= obstacleOne.id) {
            return;            
        } else {
            if(moveCount < maxMovement) {
                domArray[i + 1][player.column].classList.add(player.colorClass);
                moveCount++;
            }
        }
    }
};

const colorLeft = player => {
    //const playerIndex = $(player.targetClass).index();
    let moveCount = 0;

    for(i = player.column; 0 < i; i--) {
        if(map[player.row][i - 1] >= obstacleOne.id) {
            return;
        } else {
            if(moveCount < maxMovement) {
                domArray[player.row][i - 1].classList.add(player.colorClass);
                moveCount++;
            }
        }
    }
};

const colorRight = player => {
    let moveCount = 0;

    for(i = player.column; i < maxColumnIndex; i++) {
        if(map[player.row][i + 1] >= obstacleOne.id) {
            return;
        } else {
            if(moveCount < maxMovement) {
                domArray[player.row][i + 1].classList.add(player.colorClass);
                moveCount++;
            }
        }
    }
};

const changeCellColor = (player) => {
    // Change color of player cell
    domArray[player.row][player.column].classList.add(player.colorClass);

    colorAbove(player);
    colorBelow(player);
    colorRight(player);
    colorLeft(player);
};


/* Movement */
const addMovement = player => {

    $('.' + player.colorClass).on('click', function(e) {
        e.preventDefault();

        const clickedCellIndex = $(e.target).index();
        row = Math.floor(clickedCellIndex / numberOfColumns);
        column = Math.floor(clickedCellIndex % numberOfColumns);

        // Movements
        if(map[row][column] != 0) {

            // Cell player is moving out
            map[player.row][player.column] = player.weapon.id;

            $('.' + player.colorClass).removeClass(player.targetClass);
            domArray[player.row][player.column].classList.add(player.weapon.targetClass);

            // Cell player is entering
            switch (map[row][column]) {
                case weaponOne.id:
                    player.weapon = weaponOne;
                    break;

                case weaponTwo.id:
                    player.weapon = weaponTwo;
                    break;

                case weaponThree.id:
                    player.weapon = weaponThree;
                    break;

                case weaponFour.id:
                    player.weapon = weaponFour;
                    break;
            }

            // Update Map info
            updateMap(player);
            e.target.classList.remove(weaponOne.targetClass, weaponTwo.targetClass, weaponThree.targetClass, weaponFour.targetClass);
            e.target.classList.add(player.targetClass);

        } else {

            // Update Map
            map[player.row][player.column] = 0;
            updateMap(player);

            // Add Movement
            $('.' + player.colorClass).removeClass(player.targetClass);
            e.target.classList.add(player.targetClass);
            
        }

    evaluateBattle(player);

    })

};


/* Control Action Menu */
const disableAction = () => {
    $('#player01-checkbox').prop('checked', false).prop('disabled', true);
    $('#player02-checkbox').prop('checked', false).prop('disabled', true);
}

const enableAction = () => {

    isPlayerOne ? 
    $('#player02-checkbox').prop('disabled', false).prop('checked', true) : 
    $('#player01-checkbox').prop('disabled', false).prop('checked', true);    
};


/* Check Encounter */
const prepareAction = player => {
    $('.command-icon').on('click', function(e) {
        e.preventDefault();
        

        //const clickedClass = this.className;
        console.log($(e.target).hasClass('attack'));

    
        $('.' + player.colorClass).removeClass(player.colorClass).off(); 
        toggleTurn();

        $('.command-icon').off();
        disableAction();

    })

};

const evaluateBattle = player => {
    checkTouching(playerTwo.row, playerTwo.column);

    if(isTouching) {
        console.log('Touching!');
        
        enableAction();

        prepareAction(player);

    } else {

        $('.' + player.colorClass).removeClass(player.colorClass).off(); 
        toggleTurn();
    }
};


/* Control Turn */
const playerTurn = player => {
    changeCellColor(player);
    addMovement(player);
};

const toggleTurn = () => {
    if(isPlayerOne) {
        playerTurn(playerOne);
        isPlayerOne = false;
    } else {
        playerTurn(playerTwo);
        isPlayerOne = true;
    }
};

const evaluateLife = () => {
    const playerOneLife = $('#player01-life').text();
    const playerTwoLife = $('#player02-life').text();

};

const resetLife = () => {
    $('#player01-life').text('100');
    $('#player02-life').text('100');
};


/* Reset */
const resetBoard = () => {
    // Reset Board
    $('.board').html('');
    allCells = [];
    map = [];
  
    // Create Map
    createMap();
    for(i = 0; i < totalNumberOfCells; i++) {
        generateCells();
    }
    
    // Create array of DOM elements
    domArray = [];
    createDomArray();

    // Highlight Movable Cells
    isPlayerOne = true;
    toggleTurn();

    disableAction();

    resetLife();
};
  

/* Event Listener */
$('.start-button').on('click', function(e) {
    e.preventDefault();
    
    resetBoard();

});