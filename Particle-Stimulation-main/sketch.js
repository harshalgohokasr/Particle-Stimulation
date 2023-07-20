
// texture for the particle
let particle_texture = null;

// variable holding our particle system
let ps = null;

function preload() {
  particle_texture = loadImage("particle_texture.png");
}

function setup() {

  //set the canvas size
  createCanvas(1480, 700);

  //initialize our particle system
  ps = new ParticleSystem(0, createVector(width / 2, height - 60), particle_texture);
}

function draw() {
  background(0);

  let dx = map(mouseX, 0, width, -0.2, 0.2);
  let wind = createVector(dx, 0);

  ps.applyForce(wind);
  ps.run();
  for (let i = 0; i < 2; i++) {
    ps.addParticle();
  }

  // Draw an arrow representing the wind force
  drawVector(wind, createVector(width / 2, 50, 0), 500);
}

/**
 *  This function draws an arrow showing the direction our "wind" is blowing.
 */
function drawVector(v, loc, scale){
  push();
  let arrowsize = 4;
  translate(loc.x, loc.y);
  stroke(255);
  rotate(v.heading());

  let len = v.mag() * scale;
  line(0, 0, len,0);
  line(len, 0, len-arrowsize, +arrowsize / 2);
  line(len, 0, len-arrowsize, -arrowsize / 2);
  pop();
}

let ParticleSystem = function(num, v, img_) {

  this.particles = [];
  this.origin = v.copy(); 
  this.img = img_
  for(let i = 0; i < num; ++i){
    this.particles.push(new Particle(this.origin, this.img));
  }
};

/**
 * This function runs the entire particle system.
 */
ParticleSystem.prototype.run = function() {

  
  let len = this.particles.length;

  //loop through and run particles
  for (let i = len - 1; i >= 0; i--) {
    let particle = this.particles[i];
    particle.run();

    
    if (particle.isDead()) {
      this.particles.splice(i, 1);
    }
  }
}


ParticleSystem.prototype.applyForce = function(dir) {
  let len = this.particles.length;
  for(let i = 0; i < len; ++i){
    this.particles[i].applyForce(dir);
  }
}

/**
 * Adds a new particle to the system at the origin of the system and with
 * the originally set texture.
 */
ParticleSystem.prototype.addParticle = function() {
    this.particles.push(new Particle(this.origin, this.img));
}


/**
 *  A simple Particle class, renders the particle as an image
 */
let Particle = function (pos, img_) {
  this.loc = pos.copy();

  let vx = randomGaussian() * 0.3;
  let vy = randomGaussian() * 0.3 - 1.0;

  this.vel = createVector(vx, vy);
  this.acc = createVector();
  this.lifespan = 100.0;
  this.texture = img_;
}

/**
 *  Simulataneously updates and displays a particle.
 */
Particle.prototype.run = function() {
  this.update();
  this.render();
}

/**
 *  A function to display a particle
 */
Particle.prototype.render = function() {
  imageMode(CENTER);
  tint(255, this.lifespan);
  image(this.texture, this.loc.x, this.loc.y);
}

/**
 *  A method to apply a force vector to a particle.
 */
Particle.prototype.applyForce = function(f) {
  this.acc.add(f);
}

/**
 *  This method checks to see if the particle has reached the end of it's lifespan,
 *  if it has, return true, otherwise return false.
 */
Particle.prototype.isDead = function () {
  if (this.lifespan <= 0.0) {
    return true;
  } else {
      return false;
    }
}

/**
 *  This method updates the position of the particle.
 */
Particle.prototype.update = function() {
  this.vel.add(this.acc);
  this.loc.add(this.vel);
  this.lifespan -= 2.5;
  this.acc.mult(0);
}
