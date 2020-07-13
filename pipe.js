class Pipe {
  constructor() {
    // How big is the empty space
    let spacing = 170;
    // Where is th center of the empty space
    let centery = random(spacing, height - spacing);

    // Top and bottom of pipe
    this.upperPipeEdge = centery - spacing / 2;
    this.bottomPipeEdge = height - (centery + spacing / 2);

    // this.upperPipeEdge = random(100, height - 200);
    // this.bottomPipeEdge = this.upperPipeEdge + 100;
    this.x = width;
    this.w = 50;
    this.speed = 2;
    this.highlight = false;
  }

  show() {
    fill(0, 255, 0);
    if (this.highlight) {
      fill(255, 0, 0);
    }
    rect(this.x, 0, this.w, this.upperPipeEdge);
    rect(this.x, height - this.bottomPipeEdge, this.w, this.bottomPipeEdge);
  }

  update() {
    this.x -= this.speed;
  }

  offscreen() {
    return this.x < -this.w;
  }

  // Did this pipe hit a bird?
  hits(bird) {
    if (
      bird.y - bird.r < this.upperPipeEdge ||
      bird.y + bird.r > height - this.bottomPipeEdge
    ) {
      if (bird.x > this.x && bird.x < this.x + this.w) {
        return true;
      }
    }
    return false;
  }
}
