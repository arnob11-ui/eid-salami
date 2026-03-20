let current = 1;
let userName = "";
let spinning = false;
const segments = [1,2,4,5,7,10,15];

function next(step){
    document.querySelectorAll(".card").forEach(c=>c.classList.remove("active"));
    document.getElementById("step"+step).classList.add("active");
    localStorage.setItem("step", step);
}

function startGame(){
    let nameInput = document.getElementById("name").value.trim();
    if(nameInput===""){ alert("⚠️ Please enter your real name!"); return;}
    userName=nameInput;
    next(5);
    drawWheel();
}

// Spinner
let canvas=document.getElementById("wheel");
let ctx=canvas.getContext("2d");
canvas.width=300; canvas.height=300;

function drawWheel(){
    let arc=Math.PI*2/segments.length;
    ctx.clearRect(0,0,300,300);
    for(let i=0;i<segments.length;i++){
        let angle=i*arc;
        ctx.beginPath();
        ctx.fillStyle = i%2==0 ? "#00ffcc" : "#0099ff";
        ctx.moveTo(150,150);
        ctx.arc(150,150,150,angle,angle+arc);
        ctx.fill();

        ctx.save();
        ctx.translate(150,150);
        ctx.rotate(angle+arc/2);
        ctx.fillStyle="black";
        ctx.font="bold 16px Arial";
        ctx.fillText(segments[i]+" tk", 60,5);
        ctx.restore();
    }
}

// Weighted random
function getResult(){
    let rand=Math.random();
    if(rand<0.25)return 1;
    if(rand<0.45)return 2;
    if(rand<0.65)return 4;
    if(rand<0.80)return 5;
    if(rand<0.92)return 7;
    if(rand<0.97)return 10;
    return 15;
}

// Spin wheel with 1-time restriction
function spinWheel(){
    if(localStorage.getItem("played")){ alert("You already played... Good Luck!"); return;}

    let result=getResult();
    let index=segments.indexOf(result);
    let anglePer=360/segments.length;
    let finalAngle=(360*5)+(360-(index*anglePer));
    canvas.style.transition="transform 10s ease-out";
    canvas.style.transform=`rotate(${finalAngle}deg)`;

    setTimeout(()=>{
        document.getElementById("result").innerHTML=`🎉 Congrats ${userName}! You got 💰 ${result} tk`;
        document.getElementById("screenshotText").style.display="block";
        document.getElementById("claimBtn").style.display="inline-block";

        document.getElementById("sound1").play();
        document.getElementById("sound2").play();

        confetti({particleCount:200, spread:80});
        localStorage.setItem("played","yes");
    },10000);
}

// Front page show first
window.onload=function(){
    let step=localStorage.getItem("step");
    if(step && document.getElementById("step"+step) && step!=5){
        next(step);
    } else {
        document.getElementById("step1").classList.add("active");
        localStorage.removeItem("step");
    }
}

document.getElementById("spinBtn").onclick=spinWheel;
