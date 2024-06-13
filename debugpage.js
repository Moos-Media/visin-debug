let isLoggedIn = false;
let SESSIONTOKEN;
let usernameLabel, usernameInput, passwordLabel, passwordInput;

function preload() {
  if (!isLoggedIn) createLoginUI();
}

function setup() {
  canvasUI = createCanvas(window.innerWidth, window.innerHeight - 250);

  if (!isLoggedIn) {
    drawLoginWarning();
  }
}

function draw() {
  if (isLoggedIn) background(255, 0, 0);
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
