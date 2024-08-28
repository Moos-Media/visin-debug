let isLoggedIn = false;
let SESSIONTOKEN;
let CURRENTBOARD, BOARDWIDTH, BOARDHEIGHT;
let usernameLabel,
  usernameInput,
  passwordLabel,
  passwordInput,
  newBrightness,
  newTime;
let finishedSetup = false;

//Setup page beforehand
function preload() {
  if (!isLoggedIn) createLoginUI();
}

function setup() {
  //Connect to socket
  var socket = io.connect();

  //create Canvas for Login page and game debug animation
  canvasUI = createCanvas(window.innerWidth, window.innerHeight - 250);
  //Set framerate for redrawnig of game
  frameRate(30);

  // Draw login warning to canvas
  if (!isLoggedIn) {
    drawLoginWarning();
  }
}

async function draw() {
  if (isLoggedIn) {
    //Update Game Debug screen
    getCurrentBoardInfo().then(drawCurrentBoard);

    //Setup Elements on Scrren, only on first run through
    if (!finishedSetup) {
      let newBrighntessLabel = createElement(
        "p",
        "Helligkeit des Modells ändern (0-255):"
      );
      newBrightness = createElement("input", "0");
      let newBrightnessButton = createButton("Bestätigen");

      newBrightness.changed(changeBrightness);
      newBrightnessButton.mousePressed(changeBrightness);

      let newTimeLabel = createElement(
        "p",
        "Zeitbeschränkung pro Spiel ändern (in Minuten):"
      );
      newTime = createElement("input", "0");
      let newTimeButton = createButton("Bestätigen");

      newTime.changed(changeTime);
      newTimeButton.mousePressed(changeTime);
      finishedSetup = true;
    }
  }
}

const login = async (e) => {
  //Prevent default button behavior
  e.preventDefault();

  //Get data from input fields
  const username = usernameInput.value();
  const passkey = passwordInput.value();

  //Setup POST request
  const data = { username, passkey };
  const options = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  };

  //Send request and handle result
  const response = await fetch("/api/debug/login", options);
  const json = await response.json();
  if (json.result) {
    isLoggedIn = true;
    SESSIONTOKEN = json.sessionToken;
    cleanLoginUI();
  }
};

const drawLoginWarning = () => {
  background(0);
  noStroke();
  fill(255);
  ellipse(width / 2, 150, 100, 100);
  fill(0);
  ellipse(width / 2, 150, 75, 75);
  fill(255);
  rect(width / 2 - 75, 150, 150, 150);
  textAlign(CENTER);
  textSize(32);
  text("Login to access Debug Mode", width / 2, 350);
};

const createLoginUI = () => {
  usernameLabel = createElement("p", "Username:");
  usernameInput = createInput("", "text");
  passwordLabel = createElement("p", "Password:");
  passwordInput = createInput("", "password");
  loginButton = createButton("Login");

  passwordInput.changed(login);
  loginButton.mousePressed(login);
};

const cleanLoginUI = () => {
  usernameInput.remove();
  usernameLabel.remove();
  passwordLabel.remove();
  passwordInput.remove();
  loginButton.remove();
};

//Handle resizing of browser window
function windowResized() {
  resizeCanvas(window.innerWidth, window.innerHeight - 250);
}

async function getCurrentBoardInfo() {
  // Prepare request
  const data = { sessionToken: SESSIONTOKEN };
  const options = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  };

  //POST request and handle result
  const response = await fetch("/api/debug/getCurrentBoard", options);
  const json = await response.json();

  if (json.status == "success") {
    CURRENTBOARD = json.boardInfo.board;
    BOARDHEIGHT = json.boardInfo.height;
    BOARDWIDTH = json.boardInfo.width;
  }
}

function drawCurrentBoard() {
  // Set background to white
  background(255);
  //calculate cell size based on size of canvas
  let cellSize = min(floor(width / BOARDWIDTH), floor(height / BOARDHEIGHT));
  // Loop through all rectangles
  for (let i = 0; i < BOARDHEIGHT; i++) {
    for (let j = 0; j < BOARDWIDTH; j++) {
      let index = i * BOARDWIDTH + j;
      stroke(0);
      //get color
      switch (CURRENTBOARD.at(index).color) {
        case "GREEN":
          fill(128, 186, 36);
          break;
        case "WHITE":
          fill(255, 255, 255);
          break;
        case "COLOR1":
          fill("#186ba2");
          break;
        case "COLOR2":
          fill("#c01111");
          break;
        case "COLOR3":
          fill("#dfb234");
          break;
        case "COLOR4":
          fill("#d8317f");
          break;
        case "COLOR5":
          fill("#e6662f");
          break;
        case "COLOR6":
          fill("#00b8ac");
          break;
        default:
          fill(0, 0, 0);
          break;
      }
      //draw individual rectangles
      rect(j * cellSize, i * cellSize, cellSize, cellSize);
    }
  }
}

const changeBrightness = async (e) => {
  //Prevent default button behavior
  e.preventDefault();

  //Setup Post request
  let inputValue = Math.floor(newBrightness.value());
  if (typeof inputValue == "number") {
    //Validate number is in range
    if (inputValue <= 255) {
      const data = { inputValue, SESSIONTOKEN };
      const options = {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      };

      const response = await fetch("/api/show/setBrightness", options);
      const json = await response.json();
      if (json.success) {
        console.log("Success!");
        newBrightness.value("");
      }
    }
  }
};

const changeTime = async (e) => {
  //Prevent default button behavior
  e.preventDefault();

  //Setup POST request and validate input
  let inputValue = Math.floor(newTime.value());
  if (typeof inputValue == "number") {
    if (inputValue <= 255) {
      const data = { inputValue, SESSIONTOKEN };
      const options = {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      };

      const response = await fetch("/api/debug/setTime", options);
      const json = await response.json();
      if (json.success) {
        console.log("Success!");
        newBrightness.value("");
      }
    }
  }
};
