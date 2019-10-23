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

// Number of each weapons
const weaponQuantity = 2;

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
const checkDuplicate = () => {
    let row;
    let column;

    const selectRandomCells = () => {
        row = Math.floor(Math.random() * numberOfRows);
        column = Math.floor(Math.random() * numberOfColumns);
    };

    const updateMap = iconId => {
        map[row][column] = iconId;
    };

    const selectWeaponCells = weaponID => {
        selectRandomCells();

        // Avoid duplicate
        while(map[row][column] != 0) {
            selectRandomCells();
        }

        updateMap(weaponID);
    };

    createMapOverview();
    selectWeaponCells(3);
    selectWeaponCells(3);
    selectWeaponCells(4);
    selectWeaponCells(4);
    selectWeaponCells(5);
    selectWeaponCells(5);
    selectWeaponCells(6);
    selectWeaponCells(6);
};


/* Set up board to start */
const generateCells = () => {
    checkDuplicate();
    
    // Update allCell array
    console.log(map);
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