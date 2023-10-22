// elements
const c = document.getElementById("canvas")
const ctx = c.getContext("2d")
// game framework varibles
var clockSpeed = 1
var ticks = 0
var sizeResetTime = 10;
var sizeResets = 0;
var bounceCool = 0;
// game objects
var ball = {
    xPos: 50,
    yPos: 50,
    velocity: {
        dir: (40 * Math.PI) / 180,
        speed: 0
    }
}
var hole = {
    x: 200,
    y: 20
}
var wall = {
    x: 200,
    y: 0,
    height: 200,
    width: 5,
    angle: 90,
}
var wall2 = {
    x: 150,
    y: 260,
    height: 10,
    width: 150,
    angle: 180,
}
// Mouse Varibles
var mousePos = {
    x: 0,
    y: 0
}
var dragX
var dragY
var drag = false
// Setup
frame();
c.width = window.screen.availWidth * .7
c.height = window.screen.availHeight * .6
//Random Varibles
const urlStuff = new URLSearchParams(window.location.search)
if (urlStuff.has("data")){
    const data = urlStuff.get("data")
    console.log(data)
}
// Functions
function frame() {
    ticks++;
    if (ticks == (sizeResetTime * (sizeResets + 1))) {
        sizeResets++;
        c.width = window.screen.availWidth * .7
        c.height = window.screen.availHeight * .6
    }
    testColisions();
    ctx.clearRect(0, 0, c.width, c.height)
    ball.xPos = ball.xPos + (Math.cos(ball.velocity.dir) * ball.velocity.speed);
    ball.yPos = ball.yPos + (Math.sin(ball.velocity.dir) * ball.velocity.speed);
    ctx.beginPath();
    ctx.arc(ball.xPos, ball.yPos, 10, 0, 2 * Math.PI);
    ctx.fillStyle = "white";
    ctx.closePath();
    ctx.fill();
    ctx.beginPath();
    ctx.fillStyle = "gray";
    ctx.rect(wall.x, wall.y, wall.width, wall.height);
    ctx.rect(wall.x, wall.y, wall.width * -1, wall.height);
    ctx.rect(wall2.x, wall2.y, wall2.width, wall2.height);
    ctx.rect(wall2.x, wall2.y, wall2.width * -1, wall2.height);
    ctx.fill();
    ctx.closePath();
    ball.velocity.speed = ball.velocity.speed / 1.0025
    setTimeout(() => { frame(); }, clockSpeed);
    if (ball.velocity.speed > 0) {
        ball.velocity.speed = ball.velocity.speed / 1.00001
        if (ball.velocity.speed < .1) {
            ball.velocity.speed = 0
        }
    }
    if (drag == true){
        c.globalAlpha = 0.5;
        ctx.beginPath();
        ctx.arc((ball.xPos*4+(mousePos.x - c.offsetLeft))/5, (ball.yPos*4 +((mousePos.y-c.offsetTop)))/5, 8, 0, 2 * Math.PI);
        ctx.arc((ball.xPos*3+((mousePos.x - c.offsetLeft)*2))/5, (ball.yPos*3 +((mousePos.y-c.offsetTop)*2))/5, 8, 0, 2 * Math.PI);
        ctx.arc((ball.xPos*2+((mousePos.x - c.offsetLeft)*3))/5, (ball.yPos*2 +((mousePos.y-c.offsetTop)*3))/5, 8, 0, 2 * Math.PI);
        ctx.arc((ball.xPos*1+((mousePos.x - c.offsetLeft)*4))/5, (ball.yPos*1 +((mousePos.y-c.offsetTop)*4))/5, 8, 0, 2 * Math.PI);
        ctx.arc((mousePos.x - c.offsetLeft), (mousePos.y-c.offsetTop), 9, 0, 2 * Math.PI);
        ctx.fillStyle = "lightgray";
        ctx.fill();
        ctx.closePath();
        //ctx.stroke();
        c.globalAlpha = 1;
    }
}
function testColisions() {
    if (bounceCool < 1) {
        if ((Math.abs(ball.xPos - wall.x) <= (wall.width + 10)) && ball.yPos > wall.y - 10 && ball.yPos < (wall.y + wall.height + 10)) {
            ball.velocity.dir = bounceOffWall(ball.velocity.dir, wall.angle)
            bounceCool = 1
            return;
        }
        if ((Math.abs(ball.xPos - wall2.x) <= (wall2.width + 10)) && ball.yPos > wall2.y - 10 && ball.yPos < (wall2.y + wall2.height + 10)) {
            ball.velocity.dir = bounceOffWall(ball.velocity.dir, wall2.angle)
            bounceCool = 1
            return;
        }
        if ((Math.abs(ball.xPos - 0) <= (10))) {
            ball.velocity.dir = bounceOffWall(ball.velocity.dir, 90)
            bounceCool = 1
            return
        }

        if ((Math.abs(ball.xPos - c.width) <= (10))) {
            ball.velocity.dir = bounceOffWall(ball.velocity.dir, 90)
            bounceCool = 1
            return
        }
        if (ball.yPos < 10) {
            ball.velocity.dir = bounceOffWall(ball.velocity.dir, 0)
            bounceCool = 1
            return
        }
        if (ball.yPos > c.height - 10) {
            ball.velocity.dir = bounceOffWall(ball.velocity.dir, 0)
            bounceCool = 1
            return
        }

    } else {
        bounceCool = bounceCool - 1
    }
}
function bounceOffWall(ballDirection, wallAngle) {
    // Convert wallAngle to radians
    wallAngle = wallAngle * (Math.PI / 180);

    // Calculate the angle of incidence
    const angleOfIncidence = wallAngle - ballDirection;

    // Calculate the angle of reflection
    let angleOfReflection = 2 * wallAngle - ballDirection;

    // Ensure the angle of reflection is within the range [0, 2π]
    if (angleOfReflection < 0) {
        angleOfReflection += 2 * Math.PI;
    } else if (angleOfReflection >= 2 * Math.PI) {
        angleOfReflection -= 2 * Math.PI;
    }
    ball.velocity.speed = ball.velocity.speed / 1.1;
    return angleOfReflection;
}

function launch(direction, speed){
    ball.velocity.dir = (direction * Math.PI)/180;
    ball.velocity.speed = speed;
}
function dragStart(event){
    if (ball.velocity.speed != 0)
        return
    dragX = event.offsetX;
    dragY = event.offsetY;
    if (Math.sqrt(((dragX-ball.xPos)*(dragX-ball.xPos))+((dragY-ball.yPos)*(dragY-ball.yPos)))<=10){
        drag = true
    }
    
}
function dragEnd(event){
    if (ball.velocity.speed != 0 || drag == false)
        return
    dragX =ball.xPos
    dragY = ball.yPos
   launch((((Math.atan2(dragY-event.offsetY,dragX-event.offsetX))*180)/Math.PI)%360,findPower(dragX,dragY,event.offsetX,event.offsetY,10))
    drag = false
}
function findPower(x1,y1,x2,y2,max){
    var power = Math.sqrt(((x2-x1)*(x2-x1))+((y2-y1)*(y2-y1)))
    if (power/10 > max){
        power = max *1000
    }
    return(power/1000)
}
onmousemove = function(e){ mousePos.x = e.clientX, mousePos.y = e.clientY}
/* just some test functions
Math.atan2(Math.sin(ball.velocity.dir, Math.cos(ball.velocity.dir)))
(Math.atan2(Math.cos(ball.velocity.dir), Math.sin(ball.velocity.dir))+3.31612557879)==ball.velocity.dir
console.log((Math.atan2(Math.cos(ball.velocity.dir), Math.sin(ball.velocity.dir))+3.31612557879), ball.velocity.dir)
*/