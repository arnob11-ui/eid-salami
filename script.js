let current = 1;
let userName = "";
let spinning = false;

function next(step) {
  document.querySelectorAll(".card").forEach(c => c.classList.remove("active"));
  document.getElementById("step" + step).classList.add("active");
}

function startGame() {
  let nameInput = document.getElementById("name").value.trim();

  if(nameInput === ""){
    alert("⚠️ Please enter your real name!");
    return;
  }

  userName = nameInput;
  next(5);
  drawWheel();
}

let canvas = document.getElementById("wheel");
let ctx = canvas.getContext("2d");

canvas.width = 300;
canvas.height = 300;

let options = [1,5,10,15,20,30,40,50,100];
let angle = 0;

function drawWheel() {
  let arc = Math.PI * 2 / options.length;

  for(let i=0;i<options.length;i++){
    ctx.beginPath();
    ctx.fillStyle = i % 2 == 0 ? "#00ffcc" : "#0099ff";
    ctx.moveTo(150,150);
    ctx.arc(150,150,150,i*arc,(i+1)*arc);
    ctx.fill();

    ctx.fillStyle="black";
    ctx.fillText(options[i]+" tk",120,150);
  }
}

function spin() {
  if(spinning) return;
  spinning = true;

  let weighted = [1,1,1,5,5,10,10,15,20,30,40,50,100];
  let win = weighted[Math.floor(Math.random()*weighted.length)];

  let spins = 360 * 5;
  let stopAngle = (options.indexOf(win) * (360/options.length));

  let final = spins + stopAngle;

  let start = 0;
  let timer = setInterval(()=>{
    start += 10;
    canvas.style.transform = `rotate(${start}deg)`;

    if(start >= final){
      clearInterval(timer);
      showResult(win);
      spinning = false;
    }
  },20);
}

function showResult(win){
  document.getElementById("result").innerText =
    `🎉 Congrats ${userName}! You got ${win} tk`;

  document.getElementById("claimBtn").style.display="block";

  confetti({
    particleCount:200,
    spread:80
  });

  let audio = new Audio("https://www.myinstants.com/media/sounds/tada.mp3");
  audio.play();
}
function showResult(win){
  document.getElementById("result").innerHTML =
    `🎉 Congrats ${userName}! You got 💰 ${win} tk`;

  document.getElementById("screenshotText").style.display = "block";
  document.getElementById("claimBtn").style.display = "inline-block";

  confetti({
    particleCount:200,
    spread:80
  });
}
const segments = [1, 2, 4, 5, 7, 10, 15];

// 🎯 Weighted random (low tk বেশি আসবে)
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
let hasPlayed = localStorage.getItem("played");

function spinWheel() {

  // ❌ Already played block
  if (hasPlayed) {
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

  // ⏱ 10 sec পরে result show
  setTimeout(() => {

    document.getElementById("result").innerHTML =
      `🎉 Congrats! You got 💰 ${result} tk`;

    // 🔊 SOUND PLAY
    document.getElementById("sound1").play();
    document.getElementById("sound2").play();

    // ✅ lock spin
    localStorage.setItem("played", "yes");

  }, 10000);
}
window.onload = function () {
  let step = localStorage.getItem("step");

  if (step) {
    next(step);
  }
};
