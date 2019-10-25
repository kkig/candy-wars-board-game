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

const obstacleQuantity = Math.floor(totalNumberOfCells * .25);  // About 25% of map
const weaponQuantity = Math.floor(totalNumberOfCells * .10); // About 10% of cell will be candy



/* Icons */
class MapIcon {
    constructor(id, name, image) {
        this.id = id;
        this.name = name;
        this.image = image;
    }
}

const playerOne = new MapIcon(1, 'Squeaky', playerOneImage);
const playerTwo = new MapIcon(2, 'Mr.Pickles', playerTwoImage);

const weaponOne = new MapIcon(3, 'Blue Beans Bomb', weaponOneImage);
const weaponTwo = new MapIcon(4, 'Green Beans Bomb', weaponTwoImage);
const weaponThree = new MapIcon(5, 'Yellow Jelly Bomb', weaponThreeImage);
const weaponFour = new MapIcon(6, 'Red Candy Bomb', weaponFourImage);

const obstacleOne = new MapIcon(7, 'Dummy Rock', obstacleOneImage);



/* Map out the board */

// Map of all cell
let allCells = [];
let map = [];

// merge: allCells = [].concat(...map);

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
    if(icon.id < 3) {
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
        } else if (row > 0 && map[row - 1][column] != 1) {
            isHeadTouching = false;
        } else {
            isHeadTouching = true;
        }   

        // Check Below
        if(row >= maxRowIndex) {
            isFootTouching = false;
        } else if(row < maxRowIndex && map[row + 1][column] != 1) {
            isFootTouching = false;
        } else {
            isFootTouching = true;
        }

        // Check Left
        if(column < 1) {
            isLeftTouching = false;
        } else if(column > 0 && map[row][column - 1] != 1) {
            isLeftTouching = false;
        } else {
            isLeftTouching = true;
        }   

        // Check Right
        if(column >= maxColumnIndex) {
            isRightTouching = false;
        } else if(column < maxColumnIndex && map[row][column + 1] != 1) {
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
           case 1:
                cell.classList.add(`col-${columnDivide}`,'box', 'map-icon','player-one');
                break;
            case 2:
                cell.classList.add(`col-${columnDivide}`, 'box', 'map-icon', 'player-two');
                break;
            case 3:
                cell.classList.add(`col-${columnDivide}`, 'box', 'map-icon', 'weapon-one');
                break;
            case 4:
                cell.classList.add(`col-${columnDivide}`, 'box', 'map-icon', 'weapon-two');
                break;
            case 5:
                cell.classList.add(`col-${columnDivide}`, 'box', 'map-icon', 'weapon-three');
                break;
            case 6:
                cell.classList.add(`col-${columnDivide}`, 'box', 'map-icon', 'weapon-four');
                break;
            case 7:
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



/* Event Listener */
$('.start-button').on('click', function(e) {
    e.preventDefault();
    

    // reset board
    $('.board').html('');
    allCells = [];
    map = [];
    createMap();

    for(i = 0; i < totalNumberOfCells; i++) {
        generateCells();
    }

    // test to change life
    $('#player02-life').text('90');

});