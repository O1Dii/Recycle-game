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
const defaultSpawnSpeed = 2000;
let currentSpawnSpeed = 2000;

const items = [
  {
    w: 20,
    h: 20,
    options: {
      good: false,
      render: {
        sprite: {
          texture: '../static/img/can.png',
          xOffset: -0.17,
          yOffset: -0.05,
          xScale: 0.05,
          yScale: 0.05,
        },
      },
    },
  },
  {
    w: 20,
    h: 20,
    options: {
      good: true,
      render: {
        sprite: {
          texture: '../static/img/cheetos.png',
          xOffset: -0.17,
          yOffset: -0.05,
          xScale: 0.05,
          yScale: 0.05,
        },
      },
    },
  },
];

window.onload = () => {
  const canvas = document.getElementById('root');

  const hearts = document.getElementsByClassName('heart');
  const score = document.getElementById('score-title');
  const gameOver = document.getElementById('game-over-container');
  const highestScore = document.getElementById('highest-score');
  const tryAgain = document.getElementById('again');

  game(canvas, hearts, score, gameOver, highestScore, tryAgain);
};

function game(canvas, hearts, scoreTitle, gameOver, highestScore, tryAgain) {
  const engine = Engine.create();
  let highestScoreNumber = localStorage.getItem('highestScore');

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

  const { groundObject, basketObject, triangleObject } = createBase(
    render.canvas.height,
    render.canvas.width,
  );

  let ground = groundObject,
    basket = basketObject,
    triangle = triangleObject;

  World.add(engine.world, [ground, basket, triangle]);

  Engine.run(engine);
  Render.run(render);

  let interval = setInterval(
    () => intervalFunction(interval, engine, triangle, render.canvas.width),
    defaultSpawnSpeed,
  );

  setInterval(() => {
    clearInterval(interval);
    currentSpawnSpeed /= 1.2;

    interval = setInterval(
      () => intervalFunction(interval, engine, triangle, render.canvas.width),
      currentSpawnSpeed,
    );
  }, 10000);

  const decrLifes = () => {
    life -= 1;

    if (!life) {
      gameOver.className = '';

      if (score > highestScoreNumber || !highestScoreNumber) {
        localStorage.setItem('highestScore', score);
        highestScoreNumber = score;
      }

      highestScore.innerHTML = 'Your highest score: ' + highestScoreNumber;
    }

    if (life > -1) {
      hearts[hearts.length - life - 1].className = 'heart hidden';
    }
  };

  const incrScore = () => {
    if (life > -1) {
      score += 1;
    }

    scoreTitle.innerHTML = 'Your score: ' + score;
  };

  Matter.Events.on(engine, 'collisionStart', ({ pairs }) => {
    pairs.forEach(({ bodyA, bodyB }) => {
      if (
        (bodyA == ground || bodyB == ground) &&
        bodyA != basket &&
        bodyB != basket &&
        bodyA != triangle &&
        bodyB != triangle
      ) {
        const targetObject = bodyA != ground ? bodyA : bodyB;

        Matter.World.remove(engine.world, targetObject);

        if (targetObject.good) {
          decrLifes();
        } else {
          incrScore();
        }

        return;
      }

      if (
        (bodyA === triangle || bodyB === triangle) &&
        bodyA != basket &&
        bodyB != basket &&
        bodyA != ground &&
        bodyB != ground
      ) {
        const targetObject =
          bodyA != basket && bodyA != triangle ? bodyA : bodyB;

        Matter.World.remove(engine.world, targetObject);

        if (targetObject.good) {
          incrScore();
        } else {
          decrLifes();
        }
      }
    });
  });

  window.addEventListener('mousemove', e => {
    Body.setPosition(basket, Vector.create(e.clientX, basket.position.y));
    Body.setPosition(triangle, Vector.create(e.clientX, basket.position.y));
  });

  window.addEventListener('touchmove', e => {
    Body.setPosition(
      basket,
      Vector.create(e.touches[0].clientX, basket.position.y),
    );
    Body.setPosition(
      triangle,
      Vector.create(e.touches[0].clientX, basket.position.y),
    );
  });

  tryAgain.addEventListener('click', e => {
    score = 0;
    life = 5;
    currentSpawnSpeed = defaultSpawnSpeed;
    [].forEach.call(hearts, heart => (heart.className = 'heart'));
    gameOver.className = 'hidden';
    scoreTitle.innerHTML = 'Your score: 0';
    interval = setInterval(
      () => intervalFunction(interval, engine, triangle, render.canvas.width),
      defaultSpawnSpeed,
    );
  });

  window.addEventListener('resize', () => {
    render.canvas.height = window.innerHeight;
    render.canvas.width = window.innerWidth;

    World.clear(engine.world);

    const { groundObject, basketObject, triangleObject } = createBase(
      render.canvas.height,
      render.canvas.width,
    );

    ground = groundObject;
    basket = basketObject;
    triangle = triangleObject;

    World.add(engine.world, [ground, basket, triangle]);
  });
}

function createRandomItem(width) {
  const chosenItem = items[Math.round(Math.random() * items.length - 0.5)];
  const object = Bodies.rectangle(
    Math.random() * width,
    10,
    chosenItem.w,
    chosenItem.h,
    chosenItem.options,
  );

  return object;
}

function createBase(height, width) {
  const drawHeight = height > width ? height * 0.9 : height;
  const groundHeight = screen.height - drawHeight;

  const groundObject = Bodies.rectangle(
    width / 2,
    drawHeight,
    width + 60,
    groundHeight,
    {
      isStatic: true,
    },
  );

  const basketObject = Bodies.fromVertices(
    50,
    drawHeight - groundHeight / 2,
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

  const triangleObject = Bodies.polygon(
    50,
    drawHeight - groundHeight / 2,
    3,
    10,
    {
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
    },
  );

  return { groundObject, basketObject, triangleObject };
}

function intervalFunction(interval, engine, triangle, width) {
  if (life < 1) {
    clearInterval(interval);
    return;
  }

  const box = createRandomItem(width);
  World.addBody(engine.world, box);
  World.remove(engine.world, triangle);
  World.addBody(engine.world, triangle);
}
