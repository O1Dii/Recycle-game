const Engine = Matter.Engine,
  World = Matter.World,
  Bodies = Matter.Bodies;

window.onload = () => {
  const canvas = document.getElementById('root');
  canvas.clientHeight = window.innerHeight;
  canvas.clientWidth = window.innerWidth;
  const c = canvas.getContext('2d');
  const engine = Engine.create();
  const boxA = Bodies.rectangle(10, 50, 20, 20);
  const ground = Bodies.rectangle(400, 610, 810, 60, { isStatic: true });

  World.add(engine.world, [boxA, ground]);

  Engine.run(engine);

  requestAnimationFrame(loop);

  function loop() {
    c.clearRect(0, 0, 800, 800);
    c.fillStyle = 'red';
    c.fillRect(boxA.position.x, boxA.position.y, 80, 80);
    c.fillRect(ground.position.x, ground.position.y, 80, 80);
    requestAnimationFrame(loop);
  }
};
