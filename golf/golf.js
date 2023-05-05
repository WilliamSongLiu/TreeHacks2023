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
let dragStart = { x: 0, y: 0 };
let dragEnd = { x: 0, y: 0 };
const hitForce = 20;
const cancelThreshold = 5;
const velocityThreshold = 0.2;

function drawBall() {
    ctx.beginPath();
    ctx.arc(ball.x, ball.y, ball.radius, 0, 2 * Math.PI);
    ctx.fillStyle = 'white';
    ctx.fill();
    ctx.stroke();
}

function drawDrag() {
    if (isMouseDown) {
        const numDots = 10;
        for (let i = 1; i <= numDots; i++) {
            const t = i / (numDots + 1);
            const x = ball.x + t * -(dragEnd.x - dragStart.x);
            const y = ball.y + t * -(dragEnd.y - dragStart.y);

            ctx.beginPath();
            ctx.arc(x, y, 2, 0, 2 * Math.PI);
            ctx.fillStyle = 'black';
            ctx.fill();
        }
    }
}

function updateBall() {
    ball.x += ball.dx;
    ball.y += ball.dy;

    ball.dx *= ball.friction;
    ball.dy *= ball.friction;

    if (Math.abs(ball.dx) < velocityThreshold && Math.abs(ball.dy) < velocityThreshold) {
        ball.dx = 0;
        ball.dy = 0;
    }
}

function getMousePos(canvas, event) {
    const rect = canvas.getBoundingClientRect();
    return {
        x: event.clientX - rect.left,
        y: event.clientY - rect.top
    };
}

function isBallAtRest() {
    return ball.dx === 0 && ball.dy === 0;
}

function drawRestIndicator() {
    if (isBallAtRest()) {
        ctx.beginPath();
        ctx.arc(ball.x, ball.y, ball.radius + 5, 0, 2 * Math.PI);
        ctx.strokeStyle = 'rgba(0, 0, 0, 0.2)';
        ctx.lineWidth = 2;
        ctx.stroke();
    }
}

canvas.addEventListener('mousedown', (event) => {
    if (isBallAtRest()) {
        const mousePos = getMousePos(canvas, event);
        isMouseDown = true;
        dragStart.x = mousePos.x;
        dragStart.y = mousePos.y;
        dragEnd.x = mousePos.x;
        dragEnd.y = mousePos.y;
    }
});

canvas.addEventListener('mousemove', (event) => {
    if (isMouseDown && isBallAtRest()) {
        const mousePos = getMousePos(canvas, event);
        dragEnd.x = mousePos.x;
        dragEnd.y = mousePos.y;
    }
});

canvas.addEventListener('mouseup', () => {
    if (isBallAtRest()) {
        isMouseDown = false;
        const dx = (dragStart.x - dragEnd.x) / hitForce;
        const dy = (dragStart.y - dragEnd.y) / hitForce;
        const distance = Math.sqrt(Math.pow(dx, 2) + Math.pow(dy, 2));

        if (distance > cancelThreshold / hitForce) {
            ball.dx += dx;
            ball.dy += dy;
        }
    }
});

canvas.addEventListener('mouseout', () => {
    isMouseDown = false;
    dragStart = { x: 0, y: 0 };
    dragEnd = { x: 0, y: 0 };
});

function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    drawBall();
    drawDrag();
    drawRestIndicator();

    updateBall();

    requestAnimationFrame(draw);
}

draw();
