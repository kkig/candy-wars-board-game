/* Charactor Images */
const playerOneImage = 'img/player/player_gr.png';
const playerTwoImage = 'img/player/player_yr.png';

/* Weapon Images */
const weaponOneImage = 'img/weapon/bean_blue.png';
const weaponTwoImage = 'img/weapon/bean_green.png';
const weaponThreeImage = 'img/weapon/jelly_yellow.png';
const weaponFourImage = 'img/weapon/wrappedtrans_red.png';

/* Setting */
const numberOfColumns = 6;
const numberOfRows = 5;
const totalNumberOfCells = numberOfColumns * numberOfRows;
const columnDivide = 12 / numberOfColumns; //class = `col-${columnDivide}`

const maxRowIndex = numberOfRows - 1;
const maxColumnIndex = numberOfColumns - 1;

// Number of each weapons
const weaponQuantity = Math.floor(totalNumberOfCells * .15); // About 15% of cell will be candy


/* Icons */
class MapIcon {
    constructor(id, image) {
        this.id = id;
        this.image = image;
    }
}

const playerOne = new MapIcon(1, playerOneImage);
const playerTwo = new MapIcon(2, playerTwoImage);

const weaponOne = new MapIcon(3, weaponOneImage);
const weaponTwo = new MapIcon(4, weaponTwoImage);
const weaponThree = new MapIcon(5, weaponThreeImage);
const weaponFour = new MapIcon(6, weaponFourImage);


/* Map out the board */

// Map of avairable cell
let allCells = [];
let map = [];

// merge: allCells = [].concat(...map);


const createMap = () => {
    // create array of 0 * total cells
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


const updateMap = iconId => {
    map[row][column] = iconId;
};


const selectIconCell = iconID => {
    selectRandomCells();

    // Avoid duplicate
    while(map[row][column] != 0) {
        selectRandomCells();
    }

    updateMap(iconID);
};

const selectPlayerTwo = () => {

    let isViolation = true;

    while(isViolation) {
        selectRandomCells();

        //const leftColumn = map[row][column - 1];
        //const rightColumn = map[row][column + 1];

        //console.log(map[row - 1][column]);
        //console.log('row: ' + row + ' Col: ' + column);
        //console.log(map);

        let isDuplicate = false;

        // Check Duplicate
        map[row][column] > 0 ? isDuplicate = true : isDuplicate = false;


        let isHeadTouching = false;
        let isRightTouching = false; 
        let isFootTouching = false;        
        let isLeftTouching = false;       

        // Check Above
        if(row < 1) {
            isHeadTouching = false;
            console.log('row < 1');
            console.log('Row: ' + row + ' Col: ' + column);
            console.log(map);
        } else if (row > 0 && map[row - 1][column] != 1) {
            console.log(row > 0 && map[row - 1][column] != 1);
            console.log('Row: ' + row + ' Col: ' + column);
            console.log(map);
            isHeadTouching = false;
        } else {
            console.log('Head is touching!');
            console.log('row: ' + row + ' Col: ' + column);
            console.log(map);
            isHeadTouching = true;
        }   



        // Check Below
        if(row >= maxRowIndex) {
            isFootTouching = false;
            console.log('row >= maxRowIndex');
            console.log('Row: ' + row + ' Col: ' + column);
            console.log(map);
        } else if(row < maxRowIndex && map[row + 1][column] != 1) {
            console.log('Row: ' + row + ' Col: ' + column);
            console.log('Below:' + map[row + 1][column]);
            console.log(map);
            isFootTouching = false;
        } else {
            console.log('Foot is touching!');
            console.log('row: ' + row + ' Col: ' + column);
            console.log(map);
            isFootTouching = true;
        }

        // Check Left
        if(column < 1) {
            isLeftTouching = false;
            console.log('column < 1');
            console.log('Row: ' + row + ' Col: ' + column);
            console.log(map);
        } else if(column > 0 && map[row][column - 1] != 1) {
            console.log(column > 0 && map[row][column - 1] != 1);
            console.log('leftColumn: ' + map[row][column - 1]);
            console.log('Row: ' + row + ' Col: ' + column);
            console.log(map);
            isLeftTouching = false;
        } else {
            console.log('Left is touching!');
            console.log('row: ' + row + ' Col: ' + column);
            console.log(map);
            isLeftTouching = true;
        }   

        // Check Right
        if(column >= maxColumnIndex) {
            console.log('column >= maxColumnIndex');
            console.log('Row: ' + row + ' Col: ' + column);
            console.log(map);
            isRightTouching = false;
        } else if(column < maxColumnIndex && map[row][column + 1] != 1) {
            console.log(map[row][column + 1]);
            console.log('rightColumn: ' + map[row][column + 1]);
            console.log('Row: ' + row + ' Col: ' + column);
            console.log(map);
            isRightTouching = false;
        } else {
            isRightTouching = true;
            console.log('Right is touching!');
            console.log('row: ' + row + ' Col: ' + column);
            console.log(map);
        }

        /*

        !isHeadTouching && !isRightTouching && !isFootTouching && !isLeftTouching ? isViolation = false : isViolation = true;        
        isDuplicate || isFootTouching || isLeftTouching ? isViolation = true : isViolation = false;
        */
        isDuplicate || isHeadTouching || isRightTouching || isLeftTouching || isFootTouching ? isViolation = true : isViolation = false;
    }
    //console.log(map);
    updateMap(2);
    

};


const selectWeaponCells = () => {
    // Generate weapons
    for(let i = 0; i < weaponQuantity; i++) {
        selectIconCell(3);
        selectIconCell(4);
        selectIconCell(5);
        selectIconCell(6);
    }
   
};


/* Set up board to start */
const generateCells = () => {
    // Devide all cells per row
    createMapOverview();
    
    // Select Weapon cells
    selectWeaponCells();

    // Select Player One cell
    selectIconCell(1);

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
            default:
                    cell.classList.add(`col-${columnDivide}`,'box');
                break;
       }
        /*
       if(eachCell = 1) {
           console.log('hello');
       }
       */
    
        $('.board').append(cell);
    }
    
};


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

    /*
    // Reset Cells
    for(let cell of cells) {
        cell.innerHTML = '';
    }

    displayIcons();
    */
});