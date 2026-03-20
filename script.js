let userName = "";
let spinning = false;

// 🎯 segments (7 part)
const segments = [1, 2, 4, 5, 7, 10, 15];

// 🎯 canvas
let canvas, ctx;

// 👉 page switch
function next(step) {
  localStorage.setItem("step", step);

  document.querySelectorAll(".card").forEach(c => c.classList.remove("active"));
  document.getElementById("step" + step).classList.add("active");
}

// 👉 start button
function startGame() {
  let nameInput = document.getElementById("name").value.trim();

  if (nameInput === "") {
    alert("⚠️ Please enter your real name!");
    return;
  }

  userName = nameInput;
  next(5);
}

// 🎯 draw wheel
function drawWheel() {
  let arc = Math.PI * 2 / segments.length;

  for (let i = 0; i < segments.length; i++) {
    let angle = i * arc;

    ctx.beginPath();
    ctx.fillStyle = i % 2 === 0 ? "#00ffcc" : "#0099ff";
    ctx.moveTo(150, 150);
    ctx.arc(150, 150, 150, angle, angle + arc);
    ctx.fill();

    ctx.save();
    ctx.translate(150, 150);
    ctx.rotate(angle + arc / 2);

    ctx.fillStyle = "black";
    ctx.font = "bold 14px Arial";
    ctx.fillText(segments[i] + " tk", 60, 5);

    ctx.restore();
  }
}

// 🎯 result logic (low tk বেশি)
function getResult() {
  let rand = Math.random();

  if (rand < 0.25) return 1;
  if (rand < 0.45) return 2;
  if (rand < 0.65) return 4;
  if (rand < 0.80) return 5;
  if (rand < 0.92) return 7;
  if (rand < 0.97) return 10;
  return 15;
}

// 🎯 spin
function spinWheel() {

  if (localStorage.getItem("played")) {
    alert("You already played... Good Luck!");
    return;
  }

  let result = getResult();
  let index = segments.indexOf(result);

  let anglePerPart = 360 / segments.length;
  let finalAngle = (360 * 5) + (360 - (index * anglePerPart));

  let wheel = document.getElementById("wheel");

  wheel.style.transition = "transform 10s ease-out";
  wheel.style.transform = `rotate(${finalAngle}deg)`;

  setTimeout(() => {

    document.getElementById("result").innerHTML =
      `🎉 Congrats ${userName}! You got 💰 ${result} tk`;

    document.getElementById("screenshotText").style.display = "block";
    document.getElementById("claimBtn").style.display = "inline-block";

    // 🔊 sound 2টা একসাথে
    document.getElementById("sound1").play();
    document.getElementById("sound2").play();

    localStorage.setItem("played", "yes");

  }, 10000);
}

// 🎯 load হলে
window.onload = function () {

  let step = localStorage.getItem("step");
  if (step) next(step);

  canvas = document.getElementById("wheel");

  if (canvas) {
    ctx = canvas.getContext("2d");
    drawWheel();
  }
};
