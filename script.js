// ================================
// ⚡ Firebase Config
// ================================
const firebaseConfig = {
  apiKey: "AIzaSyByX9i2WaOoM98K5ikFiU7Q4CRcF1F35XU",
  authDomain: "eid-salami-11.firebaseapp.com",
  projectId: "eid-salami-11",
  storageBucket: "eid-salami-11.appspot.com",
  messagingSenderId: "682125208870",
  appId: "1:682125208870:web:276cda6f764f58fc2d65e7"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);
const database = firebase.database();

// ================================
// 🔹 Variables
// ================================
let userName = "";
const segments = [1, 2, 4, 5, 7, 10, 15];
let spinning = false;

// ================================
// 🔹 Step navigation
// ================================
function next(step) {
  document.querySelectorAll(".card").forEach(c => c.classList.remove("active"));
  document.getElementById("step" + step).classList.add("active");
}

// ================================
// 🔹 Start Game (Name Input)
// ================================
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

// ================================
// 🔹 Wheel Drawing
// ================================
let canvas = document.getElementById("wheel");
let ctx = canvas.getContext("2d");
canvas.width = 300;
canvas.height = 300;

function drawWheel() {
  let arc = Math.PI * 2 / segments.length;
  ctx.clearRect(0,0,canvas.width,canvas.height);

  for(let i=0; i<segments.length; i++){
    ctx.beginPath();
    ctx.fillStyle = i % 2 === 0 ? "#00ffcc" : "#0099ff";
    ctx.moveTo(150,150);
    ctx.arc(150,150,150,i*arc,(i+1)*arc);
    ctx.fill();

    ctx.fillStyle="black";
    ctx.font = "16px Arial";
    ctx.fillText(segments[i]+" tk", 120, 150);
  }
}

// ================================
// 🔹 Weighted Random (Low tk frequent)
// ================================
function getResult() {
  let rand = Math.random();
  if(rand < 0.25) return 1;
  if(rand < 0.45) return 2;
  if(rand < 0.65) return 4;
  if(rand < 0.80) return 5;
  if(rand < 0.92) return 7;
  if(rand < 0.97) return 10;
  return 15;
}

// ================================
// 🔹 Spin Wheel with Firebase Check
// ================================
function spinWheel() {
  if(spinning) return;
  spinning = true;

  // ✅ Already played check
  database.ref("users/" + userName).get().then((snapshot) => {
    if(snapshot.exists()){
      alert("You already played... Good Luck!");
      spinning = false;
      return;
    } else {
      runSpin(); // spin start
    }
  });
}

// ================================
// 🔹 Run Spin
// ================================
function runSpin() {
  let result = getResult();
  let index = segments.indexOf(result);
  let anglePerPart = 360 / segments.length;
  let finalAngle = (360*5) + (360 - (index*anglePerPart));

  let wheel = document.getElementById("wheel");
  wheel.style.transition = "transform 10s ease-out";
  wheel.style.transform = `rotate(${finalAngle}deg)`;

  setTimeout(() => {
    // 🎉 Show Result
    document.getElementById("result").innerHTML =
      `🎉 Congrats ${userName}! You got 💰 ${result} tk`;

    document.getElementById("screenshotText").style.display = "block";
    document.getElementById("claimBtn").style.display = "inline-block";

    // 🔊 Play Sounds
    document.getElementById("sound1").play();
    document.getElementById("sound2").play();

    // 🎊 Confetti
    confetti({
      particleCount:200,
      spread:80
    });

    // 💾 Save to Firebase
    database.ref("users/" + userName).set({
      name: userName,
      amount: result,
      timestamp: Date.now()
    });

    spinning = false;
  }, 10000);
}

// ================================
// 🔹 Load Step from localStorage
// ================================
window.onload = function () {
  let step = localStorage.getItem("step");
  if(step){
    next(step);
  }
};
