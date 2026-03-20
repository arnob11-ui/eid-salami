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
    `🎉 Congrats ${userName}! You got  ${win} tk 💵;

  document.getElementById("screenshotText").style.display = "block";
  document.getElementById("claimBtn").style.display = "inline-block";

  confetti({
    particleCount:200,
    spread:80
  });
}
