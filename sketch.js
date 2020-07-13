let birds = [];
let savedBirds = [];
let pipes = [];
let score;
let paused = false;
let counter = 0;
let slider;
let record = 0;
let birdBrainUploaded;
let preloadActive;

let POPULATION;

function preload() {
  if (localStorage.getItem("PRELOAD")) {
    POPULATION = 1;
    birdBrainUploaded = loadJSON("birdBrain.json");
  }
}

function setup() {
  createCanvas(1200, 600);
  slider = createSlider(1, 100, 1.1);
  record = 0;

  init();
}

function init() {
  clear();

  checkbox = createCheckbox(
    "Check / Uncheck to use a trained bird or a population of untrained birds",
    localStorage.getItem("PRELOAD")
  );
  checkbox.changed(myCheckedEvent);

  score = 0;
  pipes = [];

  if (birdBrainUploaded) {
    let birdBrain = NeuralNetwork.deserialize(birdBrainUploaded);
    bird = new Bird(birdBrain);
    birds.push(bird);
  } else {
    POPULATION = 50;
    for (let i = 0; i < POPULATION; i++) {
      birds[i] = new Bird();
    }
  }
}

function draw() {
  for (let n = 0; n < slider.value(); n++) {
    if (counter % 175 === 0) {
      pipes.push(new Pipe());
    }
    counter++;

    for (let i = pipes.length - 1; i >= 0; i--) {
      // remove pipes passed
      pipes[i].update();

      if (pipes[i].offscreen()) {
        pipes.splice(i, 1);
        score++;
        if (score > record) {
          record = score;
        }
      }

      pipes[i].show();

      for (let j = birds.length - 1; j >= 0; j--) {
        if (pipes[i].hits(birds[j])) {
          savedBirds.push(birds.splice(j, 1)[0]);
        }
      }
    }

    for (let i = birds.length - 1; i >= 0; i--) {
      if (birds[i].offScreen()) {
        savedBirds.push(birds.splice(i, 1)[0]);
      }
    }

    for (let bird of birds) {
      bird.think(pipes);
      bird.update();
    }

    if (birds.length === 0) {
      counter = 0;
      score = 0;
      nextGeneration();
      pipes = [];
    }
  }

  // drawing stuff
  background(0);

  for (let bird of birds) {
    bird.show();
  }

  for (let pipe of pipes) {
    pipe.show();
  }

  // Display score
  textSize(24);
  fill(255, 0, 0);
  text("Score: " + score, 10, 30);
  textSize(24);
  fill(255, 0, 0);
  text("Record: " + record, 150, 30);

  // console.log(frameCount % 100)
}

function keyPressed() {
  // jump
  // if (key == " ") {
  //   bird.up();
  // }

  // pause
  if (key == "p") {
    if (paused) {
      loop();
    } else {
      noLoop();
    }
    paused = !paused;
  }

  if (key == "s") {
    let bird = birds[0];
    console.log(bird);
    saveJSON(bird.brain, "birdBrain.json");
  }
}

function myCheckedEvent() {
  if (this.checked()) {
    localStorage.setItem("PRELOAD", "true");
  } else {
    localStorage.removeItem("PRELOAD", "true");
  }
  window.location.reload();
}
