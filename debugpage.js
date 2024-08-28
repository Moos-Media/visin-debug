let isLoggedIn = false;
let SESSIONTOKEN;
let CURRENTBOARD, BOARDWIDTH, BOARDHEIGHT;
let usernameLabel, usernameInput, passwordLabel, passwordInput, newBrightness;
let finishedSetup = false;

function preload() {
  if (!isLoggedIn) createLoginUI();
}

function setup() {
  var socket = io.connect();
  canvasUI = createCanvas(window.innerWidth, window.innerHeight - 250);
  frameRate(30);

  if (!isLoggedIn) {
    drawLoginWarning();
  }
}

async function draw() {
  if (isLoggedIn) {
    getCurrentBoardInfo().then(drawCurrentBoard);

    if (!finishedSetup) {
      let newBrighntessLabel = createElement(
        "p",
        "Helligkeit des Modells ändern (0-255):"
      );
      newBrightness = createElement("input", "0");
      let newBrightnessButton = createButton("Bestätigen");

      newBrightness.changed(changeBrightness);
      newBrightnessButton.mousePressed(changeBrightness);
      finishedSetup = true;
    }
  }
}

const login = async (e) => {
  //Prevent default button behavior
  e.preventDefault();
  const username = usernameInput.value();
  const passkey = passwordInput.value();

  const data = { username, passkey };
  const options = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  };

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
  resizeCanvas(window.innerWidth, window.innerHeight);
};

function windowResized() {
  resizeCanvas(window.innerWidth, window.innerHeight);
}

async function getCurrentBoardInfo() {
  const data = { sessionToken: SESSIONTOKEN };
  const options = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  };

  const response = await fetch("/api/debug/getCurrentBoard", options);
  const json = await response.json();

  if (json.status == "success") {
    CURRENTBOARD = json.boardInfo.board;
    BOARDHEIGHT = json.boardInfo.height;
    BOARDWIDTH = json.boardInfo.width;
  }
}

function drawCurrentBoard() {
  background(0);
  let cellSize = min(floor(width / BOARDWIDTH), floor(height / BOARDHEIGHT));
  for (let i = 0; i < BOARDHEIGHT; i++) {
    for (let j = 0; j < BOARDWIDTH; j++) {
      let index = i * BOARDWIDTH + j;
      stroke(0);
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
      rect(j * cellSize, i * cellSize, cellSize, cellSize);
    }
  }
}

const changeBrightness = async (e) => {
  //Prevent default button behavior
  e.preventDefault();

  let inputValue = Math.floor(newBrightness.value());
  if (typeof inputValue == "number") {
    if (inputValue <= 255) {
      const data = { inputValue };
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
      }
    }
  }
};
