class Bird {
  constructor(brain) {
    this.x = 25;
    this.y = height / 4;
    this.birdHeight = 25;
    this.birdWidth = 25;
    this.r = 12;

    this.gravity = 0.1;
    this.liftForce = -3;
    this.velocity = 0;

    this.score = 0;
    this.fitness = 0;

    if (brain) {
      this.brain = brain.copy();
    } else {
      this.brain = new NeuralNetwork(5, 8, 2);
    }
  }

  show() {
    stroke(255);
    fill(50, 190, 255);
    ellipse(this.x, this.y, this.birdWidth, this.birdHeight);
  }

  think() {
    // Get closest pipe
    let closest = null;
    let closestPipeDistance = Infinity;
    for (let i = 0; i < pipes.length; i++) {
      const d = pipes[i].x + pipes[i].w - this.x;
      if (d < closestPipeDistance && d > 0) {
        closest = pipes[i];
        closestPipeDistance = d;
      }
    }

    let inputs = [];
    inputs[0] = this.y / height;
    inputs[1] = closest.upperPipeEdge / height;
    inputs[2] = closest.bottomPipeEdge / height;
    inputs[3] = closest.x / width;
    inputs[4] = this.velocity / 10;

    let output = this.brain.predict(inputs);
    if (output[0] > output[1]) {
      this.up();
    }
  }

  update() {
    this.score++;
    this.velocity += this.gravity;
    this.y += this.velocity;

    if (this.y > height - this.birdHeight / 2) {
      this.y = height - this.birdHeight / 2;
      this.velocity = 0;
    }

    if (this.y < 0 + this.birdHeight / 2) {
      this.y = 0 + this.birdHeight / 2;
      this.velocity = 0;
    }
  }

  // when bird falls down
  offScreen() {
    return this.y >= height - this.birdHeight / 2;
  }

  up() {
    this.velocity = this.liftForce;
  }

  mutate() {
    this.brain.mutate(0.1);
  }
}
