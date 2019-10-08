const Engine = Matter.Engine,
  World = Matter.World,
  Bodies = Matter.Bodies,
  Body = Matter.Body,
  Composite = Matter.Composite,
  Render = Matter.Render,
  Events = Matter.Events,
  Vector = Matter.Vector;

let score = 0;
let life = 5;

window.onload = () => {
  const canvas = document.getElementById('root');

  const hearts = document.getElementsByClassName('heart');
  const score = document.getElementById('score-title');
  const gameOver = document.getElementById('game-over-container');
  const tryAgain = document.getElementById('again');

  game(canvas, hearts, score, gameOver, tryAgain);
};

function game(canvas, hearts, scoreTitle, gameOver, tryAgain) {
  const engine = Engine.create();

  render = Render.create({
    canvas: canvas,
    engine: engine,

    options: {
      background: 'transparent',
      wireframes: false,
      height: window.innerHeight,
      width: window.innerWidth,
    },
  });
  const ground = Bodies.rectangle(
    render.canvas.width / 2,
    render.canvas.height,
    render.canvas.width,
    60,
    {
      isStatic: true,
      render: {
        // fillStyle: 'transparent',
      },
    },
  );
  const triangle = Bodies.polygon(50, render.canvas.height - 50, 3, 10, {
    isStatic: true,
    render: {
      sprite: {
        texture: '../static/img/basket.png',
        xOffset: -0.17,
        yOffset: -0.05,
        xScale: 0.05,
        yScale: 0.05,
      },
    },
  });
  const basket = Bodies.fromVertices(
    50,
    render.canvas.height - 50,
    [
      Vector.create(30, 530),
      Vector.create(32, 530),
      Vector.create(46, 565),
      Vector.create(54, 565),
      Vector.create(68, 530),
      Vector.create(70, 530),
      Vector.create(55, 570),
      Vector.create(45, 570),
    ],
    {
      isStatic: true,
    },
  );

  World.add(engine.world, [ground, basket, triangle]);

  Engine.run(engine);
  Render.run(render);

  let interval = setInterval(
    () => intervalFunction(interval, engine, triangle, render.canvas.width),
    2000,
  );

  Matter.Events.on(engine, 'collisionStart', ({ pairs }) => {
    pairs.forEach(({ bodyA, bodyB }) => {
      if (
        (bodyA == ground || bodyB == ground) &&
        bodyA != basket &&
        bodyB != basket &&
        bodyA != triangle &&
        bodyB != triangle
      ) {
        if (bodyA != ground) {
          Matter.World.remove(engine.world, bodyA);
        } else {
          Matter.World.remove(engine.world, bodyB);
        }

        life -= 1;

        if (!life) {
          gameOver.className = '';
        }

        hearts[hearts.length - life - 1].className = 'heart hidden';

        return;
      }

      if (
        (bodyA === triangle || bodyB === triangle) &&
        bodyA != basket &&
        bodyB != basket &&
        bodyA != ground &&
        bodyB != ground
      ) {
        if (bodyA != basket && bodyA != triangle) {
          Matter.World.remove(engine.world, bodyA);
        }
        if (bodyB != basket && bodyB != triangle) {
          Matter.World.remove(engine.world, bodyB);
        }

        score += 1;

        scoreTitle.innerHTML = 'Your score: ' + score;
      }
    });
  });

  window.addEventListener('mousemove', e => {
    Body.setPosition(basket, Vector.create(e.clientX, basket.position.y));
    Body.setPosition(triangle, Vector.create(e.clientX, basket.position.y));
  });

  window.addEventListener('touchmove', e => {
    Body.setPosition(basket, Vector.create(e.clientX, basket.position.y));
    Body.setPosition(triangle, Vector.create(e.clientX, basket.position.y));
  });

  tryAgain.addEventListener('click', e => {
    score = 0;
    life = 5;
    [].forEach.call(hearts, heart => (heart.className = 'heart'));
    gameOver.className = 'hidden';
    scoreTitle.innerHTML = 'Your score: 0';
    interval = setInterval(
      () => intervalFunction(interval, engine, triangle, render.canvas.width),
      2000,
    );
  });

  window.addEventListener('resize', () => {
    render.canvas.height = window.innerHeight;
    render.canvas.width = window.innerWidth;
  });
}

function intervalFunction(interval, engine, triangle, width) {
  if (life < 1) {
    clearInterval(interval);
    return;
  }

  const box = Bodies.rectangle(Math.random() * width, 10, 20, 20);
  World.addBody(engine.world, box);
  World.remove(engine.world, triangle);
  World.addBody(engine.world, triangle);
}
