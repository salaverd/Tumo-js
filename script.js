createCanvas(800, 600); // Create a canvas
drawStar(5, 100)
// width(20)   
// drawLine(200)
// goTo(200, 300)
// // left(30)
// strangeLine(200);

// rotate(0)

goTo(200, 500)
color('red')
width(2)
// strangeLine(150)
strangeSquare(100)
// strangeCircle(150)
// strangeGalaxy(150)

goTo(600, 200)
color('blue')
strangeGalaxy(100)




// const planets = [
//   { name: "Mercury", radiusX: 50, radiusY: 55, speed: 6, color: "gray", size: 10 },
//   { name: "Venus", radiusX: 90, radiusY: 95, speed: 3, color: "yellow", size: 16 },
//   { name: "Earth", radiusX: 140, radiusY: 130, speed: 2, color: "blue", size: 18 },
//   { name: "Mars", radiusX: 190, radiusY: 180, speed: 1.6, color: "red", size: 14 },
//   { name: "Jupiter", radiusX: 260, radiusY: 240, speed: 1, color: "orange", size: 28 },
//   { name: "Saturn", radiusX: 330, radiusY: 350, speed: 0.8, color: "gold", size: 25 },
//   { name: "Uranus", radiusX: 380, radiusY: 300, speed: 0.6, color: "lightblue", size: 22 },
//   // { name: "Neptune", radiusX: 470, radiusY: 460, speed: 0.4, color: "darkblue", size: 22 }
// ];

// // let angles = Array(planets.length).fill(0);

// let angles = planets.map(() => Math.random() * 360);

// let x = 400;
// let y = 400;

// createCanvas(900, 600);
// function drawSolarSystem() {
//   // erase();
//   fillColor('black')
//   goTo(900, 0)
//   left(180)
//   drawRectangle(600, 900)

//   color("white");
//   goTo(canvas.width / 2, canvas.height / 2)
//   strangeGalaxy(700);

//   goTo(canvas.width / 2, canvas.height / 2);
//   color("yellow");
//   strangeCircle(15);
//   rotate(0)

//   planets.forEach((planet, index) => {
//     angles[index] += (planet.speed * 20);
//     let radianAngle = (angles[index] * Math.PI) / 180;
//     let x = (canvas.width / 2) + planet.radiusX * Math.cos(radianAngle);
//     let y = (canvas.height / 2) + planet.radiusY * Math.sin(radianAngle);

//     goTo(x, y);
//     // fillColor(planet.color);
//     color(planet.color);
//     width(8);
//     drawEllipse(planet.size);
//     width(1);
//   });
//   requestAnimationFrame(drawSolarSystem);
// }

// // animate(drawSolarSystem, 1);
// requestAnimationFrame(drawSolarSystem)