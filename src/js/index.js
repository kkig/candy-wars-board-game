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
    //$('.' + player.colorClass).on('click', function(e) {
    //console.log('hello');
    
    $('.' + player.colorClass).on('click', function(e) {
        e.preventDefault();

        // Stop Running when color of cell disappeared
        if($('.' + player.colorClass).length <= 0) {
            return;
        } 

        //console.log($('.' + player.colorClass).length = 0);

        const clickedCellIndex = $(e.target).index();
        row = Math.floor(clickedCellIndex / numberOfColumns);
        column = Math.floor(clickedCellIndex % numberOfColumns);

        /* Evaluate Movable Cell */
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
            console.log(map[player.row][player.column]);
            console.log('player.row: ' + player.row);
            console.log('player.column: ' + player.column);

            map[player.row][player.column] = 0;
            updateMap(player);

            console.log(map[player.row][player.column]);
            console.log('player.row: ' + player.row);
            console.log('player.column: ' + player.column);

            // Add Movement
            $('.' + player.colorClass).removeClass(player.targetClass);
            e.target.classList.add(player.targetClass);
            
        }

        $('.' + player.colorClass).removeClass(player.colorClass);        
        toggleTurn();
    })

};

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
    /*
    else {
        isPlayerOne = true;
        return playerTurn(playerOne);
    }
    */
};

const evaluateLife = () => {
    const playerOneLife = $('#player01-life').text();
    const playerTwoLife = $('#player02-life').text();

    let count = 0;
    while(count != 5) {
        toggleTurn();
        count++;
    }
};

/* Reset board */
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
  };
  

/* Event Listener */
$('.start-button').on('click', function(e) {
    e.preventDefault();
    
    resetBoard();

    // Highlight Movable Cells
    toggleTurn();


    // test to change life
    $('#player02-life').text('90');

});