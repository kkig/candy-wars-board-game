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


/* Map out the board */
let map = [];

const createMapOverview = () => {
    // create array of 0 * total cells
    const allCells = [];
    for(i = 0; i < totalNumberOfCells; i++) {
        allCells.push(0);
    }

    // Split into array per row
    for(i = 0; i + numberOfColumns <= totalNumberOfCells; i += numberOfColumns) {
        map.push(allCells.slice(i, i + numberOfColumns));
    }
    console.log(map);
};

createMapOverview();



/* Set up board to start */
const generateCells = () => {
    const cell = document.createElement('div');
    cell.classList.add(`col-${columnDivide}`,'box', 'player-one');
    $('.board').append(cell);
};


/* Event Listener */
$('.start-button').on('click', function(e) {
    e.preventDefault();

    // reset board
    $('.board').html('');

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