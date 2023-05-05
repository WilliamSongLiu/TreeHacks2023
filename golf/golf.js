const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

const ball = {
    x: canvas.width / 2,
    y: canvas.height / 2,
    radius: 10,
    dx: 0,
    dy: 0,
    friction: 0.99
};

let isMouseDown = false;
let arrowStart = { x: 0, y: 0 };
let arrowEnd = { x: 0, y: 0 };

function drawBall() {
    ctx.beginPath();
    ctx.arc(ball.x, ball.y, ball.radius, 0, 2 * Math.PI);
    ctx.fillStyle = 'white';
    ctx.fill();
    ctx.stroke();
}

function drawArrow() {
    if (isMouseDown) {
        ctx.beginPath();
        ctx.moveTo(arrowStart.x, arrowStart.y);
        ctx.lineTo(arrowEnd.x, arrowEnd.y);
        ctx.strokeStyle = 'black';
        ctx.stroke();
    }
}

function updateBall() {
    ball.x += ball.dx;
    ball.y += ball.dy;

    ball.dx *= ball.friction;
    ball.dy *= ball.friction;

    if (Math.abs(ball.dx) < 0.01) ball.dx = 0;
    if (Math.abs(ball.dy) < 0.01) ball.dy = 0;
}

function getMousePos(canvas, event) {
    const rect = canvas.getBoundingClientRect();
    return {
        x: event.clientX - rect.left,
        y: event.clientY - rect.top
    };
}

canvas.addEventListener('mousedown', (event) => {
    const mousePos = getMousePos(canvas, event);
    isMouseDown = true;
    arrowStart.x = mousePos.x;
    arrowStart.y = mousePos.y;
    arrowEnd.x = mousePos.x;
    arrowEnd.y = mousePos.y;
});

canvas.addEventListener('mousemove', (event) => {
    if (isMouseDown) {
        const mousePos = getMousePos(canvas, event);
        arrowEnd.x = mousePos.x;
        arrowEnd.y = mousePos.y;
    }
});

canvas.addEventListener('mouseup', () => {
    isMouseDown = false;
    const dx = (arrowStart.x - arrowEnd.x) / 10;
    const dy = (arrowStart.y - arrowEnd.y) / 10;

    ball.dx += dx;
    ball.dy += dy;
});

function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    drawBall();
    drawArrow();

    updateBall();

    requestAnimationFrame(draw);
}

draw();
