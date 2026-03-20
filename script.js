let userName = "";
let spinning = false;

// 🎯 Spinner values (7 parts)
const segments = [1, 2, 4, 5, 7, 10, 15];

// 🎯 Weighted random
function getResult() {
  let r = Math.random();

  if (r < 0.25) return 1;
  if (r < 0.45) return 2;
  if (r < 0.65) return 4;
  if (r < 0.80) return 5;
  if (r < 0.92) return 7;
  if (r < 0.97) return 10;
  return 15;
}

// 📌 Page control
function next(step) {
  localStorage.setItem("step", step);

  document.querySelectorAll(".card").forEach(c => c.classList.remove("active"));
  document.getElementById("step" + step).classList.add("active");
}

// 🔄 Refresh fix
window.onload = function () {
  let step = localStorage.getItem("step");
  if (step) next(step);
};

// ▶ Start Game
function startGame() {
  let nameInput = document.getElementById("name").value.trim();

  if (nameInput === "") {
    alert("⚠️ Please enter your real name!");
    return;
  }

  userName = nameInput;
  next(5);
}

// 🎡 SPIN FUNCTION (MAIN)
function spinWheel() {

  if (spinning) return;

  // ❌ already played
  if (localStorage.getItem("played")) {
    alert("You already played... Good Luck!");
    return;
  }

  spinning = true;

  let result = getResult();
  let index = segments.indexOf(result);

  let angle = 360 / segments.length;
  let final = (360 * 5) + (360 - (index * angle));

  let wheel = document.getElementById("wheel");

  wheel.style.transition = "transform 10s ease-out";
  wheel.style.transform = `rotate(${final}deg)`;

  setTimeout(() => {

    // 🎉 RESULT SHOW
    document.getElementById("result").innerHTML =
      `🎉 Congrats ${userName}! You got 💰 ${result} tk`;

    document.getElementById("screenshotText").style.display = "block";
    document.getElementById("claimBtn").style.display = "inline-block";

    // 🔊 SOUND (2টা একসাথে)
    document.getElementById("sound1").play();
    document.getElementById("sound2").play();

    // 🎊 CONFETTI
    confetti({
      particleCount: 150,
      spread: 80
    });

    // 🔒 LOCK
    localStorage.setItem("played", "yes");

    spinning = false;

  }, 10000);
}
