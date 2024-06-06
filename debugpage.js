let isLoggedIn = false;
let SESSIONTOKEN;
let usernameLabel, usernameInput, passwordLabel, passwordInput;

function preload() {
  if (!isLoggedIn) {
    usernameLabel = createElement("p", "Username:");
    usernameInput = createInput("", "text");
    passwordLabel = createElement("p", "Password:");
    passwordInput = createInput("", "password");
    loginButton = createButton("Login");

    loginButton.mousePressed(login);
  }
}

function setup() {
  createCanvas(500, 500);
  fullscreen(true);

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

  const response = await fetch("/api/login", options);
  const json = await response.json();
  if (json.result) {
    isLoggedIn = true;
    SESSIONTOKEN = json.sessionToken;
    console.log(SESSIONTOKEN);
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
