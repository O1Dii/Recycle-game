const Engine = Matter.Engine,
  World = Matter.World,
  Bodies = Matter.Bodies,
  Body = Matter.Body,
  Render = Matter.Render,
  Events = Matter.Events,
  Vector = Matter.Vector;

let score = 0;
let life = 5;

window.onload = () => {
  const canvas = document.getElementById('root');
  const images = document.getElementsByTagName('img');
  canvas.height = window.innerHeight;
  canvas.width = window.innerWidth;
  const c = canvas.getContext('2d');
  const engine = Engine.create();
  const ground = Bodies.rectangle(400, 610, 810, 60, { isStatic: true });
  const triangle = Bodies.polygon(50, 570, 3, 10, {
    isStatic: true,
    angle: Math.PI / 6 + 0.1,
  });
  const basket = Bodies.fromVertices(
    50,
    570,
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
    { isStatic: true },
  );
  const items = [];

  World.add(engine.world, [basket, ground, triangle]);

  render = Render.create({
    canvas: canvas,
    engine: engine,
    options: {
      wireframes: false,
    },
  });

  Engine.run(engine);
  Render.run(render);

  const interval = setInterval(() => {
    console.log('Your score: ' + score);
    console.log('Lifes left: ' + life);

    if (life < 1) {
      clearInterval(interval);
    }

    const box = Bodies.rectangle(Math.random() * 600, 10, 20, 20);
    items.push(box);
    World.add(engine.world, box);
  }, 2000);

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
        items.splice(items.indexOf(bodyA), 1);
        items.splice(items.indexOf(bodyB), 1);

        score += 1;
      }
    });
  });

  canvas.addEventListener('mousemove', e => {
    Body.setPosition(basket, Vector.create(e.clientX, basket.position.y));
    Body.setPosition(triangle, Vector.create(e.clientX, basket.position.y));
  });
};
