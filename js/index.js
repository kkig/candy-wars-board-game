/* Images */
const playerOneImage = "img/player/player_gr.png";
const playerTwoImage = "img/player/player_yr.png";

const weaponOneImage = "img/weapon/bean_blue.png";
const weaponTwoImage = "img/weapon/bean_green.png";
const weaponThreeImage = "img/weapon/jelly_yellow.png";
const weaponFourImage = "img/weapon/wrappedtrans_red.png";

const obstacleOneImage = "img/map/rock.png";

/* Setting */
const numberOfColumns = 10;
const numberOfRows = 7;
const totalNumberOfCells = numberOfColumns * numberOfRows;
const columnDivide = 12 / numberOfColumns; //class = `col-${columnDivide}`

const maxRowIndex = numberOfRows - 1;
const maxColumnIndex = numberOfColumns - 1;

const maxMovement = 3;

const obstacleQuantity = Math.floor(totalNumberOfCells * 0.12); // About 12% of map
const weaponQuantity = 3;

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

const weaponOne = new MapIcon(
  1,
  "Blue Beans Bomb",
  "weapon-one",
  weaponOneImage
);
const weaponTwo = new MapIcon(
  2,
  "Green Beans Bomb",
  "weapon-two",
  weaponTwoImage
);
const weaponThree = new MapIcon(
  3,
  "Yellow Jelly Bomb",
  "weapon-three",
  weaponThreeImage
);
const weaponFour = new MapIcon(
  4,
  "Red Candy Bomb",
  "weapon-four",
  weaponFourImage
);

const obstacleOne = new MapIcon(
  5,
  "Dummy Rock",
  "obstacle-one",
  obstacleOneImage
);

const playerOne = new MapIcon(6, "Player 1", "player-one", playerOneImage);
const playerTwo = new MapIcon(7, "Player 2", "player-two", playerTwoImage);

// Add associated class to players
playerOne.colorClass = "player-one-active";
playerOne.weapon = weaponOne;
playerOne.life = 100;
playerOne.isDefending = false;

playerTwo.colorClass = "player-two-active";
playerTwo.weapon = weaponOne;
playerTwo.life = 100;
playerTwo.isDefending = false;

// Damage range to weapons
weaponOne.attackPoint = 10;
weaponTwo.attackPoint = 20;
weaponThree.attackPoint = 30;
weaponFour.attackPoint = 40;

/* Map out the board */
let allCells = [];
let map = [];
let domArray = [];

const createMap = () => {
  // create array of all cells
  for (i = 0; i < totalNumberOfCells; i++) {
    allCells.push(0);
  }
};

const createMapOverview = () => {
  // Split into array per row
  for (i = 0; i + numberOfColumns <= totalNumberOfCells; i += numberOfColumns) {
    map.push(allCells.slice(i, i + numberOfColumns));
  }
};

const createDomArray = () => {
  let rowDom = [...document.querySelectorAll(".box")];

  // Split per row
  for (i = 0; i + numberOfColumns <= totalNumberOfCells; i += numberOfColumns) {
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

const updateMap = (icon) => {
  map[row][column] = icon.id;

  // Store placement info to player class
  if (icon.id >= playerOne.id) {
    icon.row = row;
    icon.column = column;
  }
};

const selectIconCell = (icon) => {
  selectRandomCells();

  // Avoid duplicate
  while (map[row][column] != 0) {
    selectRandomCells();
  }

  updateMap(icon);
};

/* Check if charactors are touching */
let isTouching = false;

const checkTouching = (row, column) => {
  isTouching = false;

  let isHeadTouching = false;
  let isRightTouching = false;
  let isFootTouching = false;
  let isLeftTouching = false;

  // Check Above
  if (row < 1) {
    isHeadTouching = false;
  } else if (row > 0 && map[row - 1][column] != playerOne.id) {
    isHeadTouching = false;
  } else {
    isHeadTouching = true;
  }

  // Check Below
  if (row >= maxRowIndex) {
    isFootTouching = false;
  } else if (row < maxRowIndex && map[row + 1][column] != playerOne.id) {
    isFootTouching = false;
  } else {
    isFootTouching = true;
  }

  // Check Left
  if (column < 1) {
    isLeftTouching = false;
  } else if (column > 0 && map[row][column - 1] != playerOne.id) {
    isLeftTouching = false;
  } else {
    isLeftTouching = true;
  }

  // Check Right
  if (column >= maxColumnIndex) {
    isRightTouching = false;
  } else if (column < maxColumnIndex && map[row][column + 1] != playerOne.id) {
    isRightTouching = false;
  } else {
    isRightTouching = true;
  }

  isTouching =
    isHeadTouching || isRightTouching || isLeftTouching || isFootTouching
      ? true
      : false;
};

const selectPlayerTwo = () => {
  let isViolation = true;

  while (isViolation) {
    selectRandomCells();

    let isDuplicate = false;

    isDuplicate = map[row][column] > 0 ? true : false;

    checkTouching(row, column);
    isViolation = isDuplicate || isTouching ? true : false;
  }

  updateMap(playerTwo);
};

const selectObstacleCells = () => {
  for (let i = 0; i < obstacleQuantity; i++) {
    selectIconCell(obstacleOne);
  }
};

const selectWeaponCells = () => {
  for (let i = 0; i < weaponQuantity; i++) {
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

  for (let eachCell of allCells) {
    const cell = document.createElement("div");

    switch (eachCell) {
      case playerOne.id:
        cell.classList.add("box", "map-icon", playerOne.targetClass);
        break;
      case playerTwo.id:
        cell.classList.add("box", "map-icon", playerTwo.targetClass);
        break;
      case weaponOne.id:
        cell.classList.add("box", "map-icon", weaponOne.targetClass);
        break;
      case weaponTwo.id:
        cell.classList.add("box", "map-icon", weaponTwo.targetClass);
        break;
      case weaponThree.id:
        cell.classList.add("box", "map-icon", weaponThree.targetClass);
        break;
      case weaponFour.id:
        cell.classList.add("box", "map-icon", weaponFour.targetClass);
        break;
      case obstacleOne.id:
        cell.classList.add("box", "map-icon", obstacleOne.targetClass);
        break;

      default:
        cell.classList.add("box", "map-icon");
        break;
    }

    $(".board").append(cell);
  }
};

/* Change Color of Available Cell */
const colorAbove = (player) => {
  let moveCount = 0;

  for (i = player.row; i > 0; i -= 1) {
    if (map[i - 1][player.column] >= obstacleOne.id) {
      return;
    } else {
      if (moveCount < maxMovement) {
        domArray[i - 1][player.column].classList.add(player.colorClass);
        moveCount++;
      }
    }
  }
};

const colorBelow = (player) => {
  let moveCount = 0;

  for (i = player.row; i < maxRowIndex; i += 1) {
    if (map[i + 1][player.column] >= obstacleOne.id) {
      return;
    } else {
      if (moveCount < maxMovement) {
        domArray[i + 1][player.column].classList.add(player.colorClass);
        moveCount++;
      }
    }
  }
};

const colorLeft = (player) => {
  let moveCount = 0;

  for (i = player.column; 0 < i; i--) {
    if (map[player.row][i - 1] >= obstacleOne.id) {
      return;
    } else {
      if (moveCount < maxMovement) {
        domArray[player.row][i - 1].classList.add(player.colorClass);
        moveCount++;
      }
    }
  }
};

const colorRight = (player) => {
  let moveCount = 0;

  for (i = player.column; i < maxColumnIndex; i++) {
    if (map[player.row][i + 1] >= obstacleOne.id) {
      return;
    } else {
      if (moveCount < maxMovement) {
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
const addMovement = (player) => {
  $("." + player.colorClass).on("click", function (e) {
    e.preventDefault();

    const clickedCellIndex = $(e.target).index();
    row = Math.floor(clickedCellIndex / numberOfColumns);
    column = Math.floor(clickedCellIndex % numberOfColumns);

    // Movements
    if (map[row][column] != 0) {
      // Cell player is moving out
      map[player.row][player.column] = player.weapon.id;

      $("." + player.colorClass).removeClass(player.targetClass);
      domArray[player.row][player.column].classList.add(
        player.weapon.targetClass
      );

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

      e.target.classList.remove(
        weaponOne.targetClass,
        weaponTwo.targetClass,
        weaponThree.targetClass,
        weaponFour.targetClass
      );
      e.target.classList.add(player.targetClass);

      updatePlayerWeapon(player);
    } else {
      // Update Map
      map[player.row][player.column] = 0;
      updateMap(player);

      // Add Movement
      $("." + player.colorClass).removeClass(player.targetClass);
      e.target.classList.add(player.targetClass);
    }

    $("." + player.colorClass)
      .removeClass(player.colorClass)
      .off();

    evaluateBattle(player);
  });
};

const updatePlayerWeapon = (player) => {
  if (player.id != playerTwo.id) {
    $("#player01-weapon").attr("src", player.weapon.image);
    $("#player01-atk-pt").text(player.weapon.attackPoint);
    $("#player01-atk-pt").css("width", `${player.weapon.attackPoint}%`);
  } else if (player.id != playerOne.id) {
    $("#player02-weapon").attr("src", player.weapon.image);
    $("#player02-atk-pt").text(player.weapon.attackPoint);
    $("#player02-atk-pt").css("width", `${player.weapon.attackPoint}%`);
  } else {
    alert("Error has occured!");
  }
};

const resetWeapon = () => {
  playerOne.weapon = weaponOne;
  updatePlayerWeapon(playerOne);

  playerTwo.weapon = weaponOne;
  updatePlayerWeapon(playerTwo);
};

/* Control Action Menu */
const disableAction = () => {
  $("#player01-checkbox").prop("checked", false).prop("disabled", true);
  $("#player02-checkbox").prop("checked", false).prop("disabled", true);
};

const enableAction = () => {
  const className = isPlayerOne ? "#player02-checkbox" : "#player01-checkbox";

  $(`${className}`).prop("disabled", false).prop("checked", true);
};

/* Check Encounter */
let isFighting = false;

const attack = (player) => {
  if (player.id != playerTwo.id) {
    const damage = playerOne.isDefending
      ? playerTwo.weapon.attackPoint / 2
      : playerTwo.weapon.attackPoint;

    playerOne.life -= damage;

    playerOne.life < 0 && (playerOne.life = 0);
  } else {
    const damage = playerTwo.isDefending
      ? playerOne.weapon.attackPoint / 2
      : playerOne.weapon.attackPoint;

    playerTwo.life -= damage;
    playerTwo.life < 0 && (playerTwo.life = 0);
  }

  updateLifePoint();
  isFighting = false;
};

const selectCommand = (player) => {
  $("." + player.targetClass).toggleClass(player.colorClass);

  $(".command-btn").on("click", function (e) {
    e.preventDefault();

    if ($(e.target).hasClass("attack")) {
      isFighting = true;
    } else if ($(e.target).hasClass("defend")) {
      player.isDefending = true;
    } else {
      alert("Error has occured!");
    }

    $("." + player.colorClass).off();
    $("." + player.targetClass).toggleClass(player.colorClass);
    toggleTurn();

    $(".command-btn").off();
    disableAction();
  });
};

const evaluateBattle = (player) => {
  checkTouching(playerTwo.row, playerTwo.column);

  if (isTouching) {
    enableAction();
    selectCommand(player);
  } else {
    toggleTurn();
  }
};

/* Control Turn */
const playerTurn = (player) => {
  if (isFighting) {
    attack(player);
  }
  evaluateLifePoint();

  if (isGameOver) {
    return;
  } else {
    player.isDefending = false;
    changeCellColor(player);
    addMovement(player);
  }
};

const toggleTurn = () => {
  if (isPlayerOne) {
    playerTurn(playerOne);
    isPlayerOne = false;
  } else {
    playerTurn(playerTwo);
    isPlayerOne = true;
  }
};

/* Life Poitns */
let isGameOver = false;

const resetLife = () => {
  playerOne.life = 100;
  playerTwo.life = 100;

  $("#player01-life").text(playerOne.life);
  $("#player01-life").css("width", `${playerOne.life}%`);
  $("#player02-life").text(playerTwo.life);
  $("#player02-life").css("width", `${playerTwo.life}%`);
};

const updateLifePoint = () => {
  if (isPlayerOne) {
    $("#player01-life").text(playerOne.life);
    $("#player01-life").css("width", `${playerOne.life}%`);
  } else {
    $("#player02-life").text(playerTwo.life);
    $("#player02-life").css("width", `${playerTwo.life}%`);
  }
};

const evaluateLifePoint = () => {
  let winner;
  if (playerOne.life <= 0 || playerTwo.life <= 0) {
    playerOne.life <= 0 ? (winner = playerTwo) : (winner = playerOne);

    alert(`The winner is ${winner.name}! Please reset the game.`);
    isGameOver = true;
  }
};

/* Reset */
const resetBoard = () => {
  disableAction();
  resetWeapon();
  resetLife();

  // Reset Board
  $(".board").html("");
  allCells = [];
  map = [];

  // Create Map
  createMap();
  for (i = 0; i < totalNumberOfCells; i++) {
    generateCells();
  }

  // Create array of DOM elements
  domArray = [];
  createDomArray();

  // Highlight Movable Cells
  isPlayerOne = true;
  toggleTurn();
};

/* Event Listener */
$(".start-button").on("click", function (e) {
  e.preventDefault();

  isGameOver = false;

  resetBoard();
});

resetBoard();
