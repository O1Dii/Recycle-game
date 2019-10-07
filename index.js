const Engine = Matter.Engine,
  World = Matter.World,
  Bodies = Matter.Bodies,
  Body = Matter.Body,
  Events = Matter.Events,
  Vector = Matter.Vector;

window.onload = () => {
  const canvas = document.getElementById('root');
  canvas.height = window.innerHeight;
  canvas.width = window.innerWidth;
  const c = canvas.getContext('2d');
  const engine = Engine.create();
  const ground = Bodies.rectangle(400, 610, 810, 60, { isStatic: true });
  const basket = Bodies.fromVertices(
    50,
    570,
    [
      Vector.create(40, 550),
      Vector.create(45, 570),
      Vector.create(55, 570),
      Vector.create(60, 550),
    ],
    { isStatic: true },
  );
  const items = [];

  World.add(engine.world, [basket, ground]);

  Engine.run(engine);

  requestAnimationFrame(loop);

  function loop() {
    c.clearRect(0, 0, 800, 800);

    c.fillStyle = 'grey';
    c.fillRect(ground.position.x - 405, ground.position.y - 30, 810, 60);

    c.fillStyle = 'green';
    c.fillRect(basket.position.x - 10, basket.position.y - 10, 20, 20);

    c.fillStyle = 'red';
    for (const item of items) {
      c.translate(item.position.x, item.position.y);
      c.rotate(item.angle);
      c.fillRect(-10, -10, 20, 20);
      c.rotate(-item.angle);
      c.translate(-item.position.x, -item.position.y);
    }

    requestAnimationFrame(loop);
  }

  setInterval(() => {
    const box = Bodies.rectangle(Math.random() * 600, 10, 20, 20);
    items.push(box);
    World.add(engine.world, box);
  }, 2000);

  Matter.Events.on(engine, 'collisionEnd', ({ pairs }) => {
    pairs.forEach(({ bodyA, bodyB }) => {
      if (bodyA != ground && bodyB != ground) {
        console.log(bodyA, bodyB);
        if (bodyA != basket) {
          Matter.World.remove(engine.world, bodyA);
        }
        if (bodyB != basket) {
          Matter.World.remove(engine.world, bodyB);
        }
        items.splice(items.indexOf(bodyA), 1);
        items.splice(items.indexOf(bodyB), 1);
      }
    });
  });

  canvas.addEventListener('mousemove', e => {
    Body.setPosition(basket, Vector.create(e.clientX, basket.position.y));
  });
};
