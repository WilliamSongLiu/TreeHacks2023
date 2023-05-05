const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

let isMouseDown = false;
let dragStart = { x: 0, y: 0 };
let dragEnd = { x: 0, y: 0 };

const friction = 0.99;
const hitForce = 30;
const cancelThreshold = 5;
const velocityThreshold = 0.2;

const ball = {
    x: canvas.width / 2,
    y: canvas.height / 2,
    radius: 10,
    dx: 0,
    dy: 0,
    lastCollidedObject: null
};

const objects = [
    {
        x: 100,
        y: 100,
        width: 50,
        height: 50,
        rotation: Math.PI / 4 // 45 degrees
    },
    {
        x: 200,
        y: 200,
        width: 50,
        height: 50,
        rotation: Math.PI / 6 // 30 degrees
    }
];

function drawBall() {
    ctx.beginPath();
    ctx.arc(ball.x, ball.y, ball.radius, 0, 2 * Math.PI);
    ctx.fillStyle = 'white';
    ctx.fill();
    ctx.stroke();
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

function drawObjects() {
    ctx.fillStyle = 'blue';
    objects.forEach((object) => {
        ctx.save();
        ctx.translate(object.x + object.width / 2, object.y + object.height / 2);
        ctx.rotate(object.rotation);
        ctx.fillRect(-object.width / 2, -object.height / 2, object.width, object.height);
        ctx.restore();
    });
}


function updateBall() {
    const numSteps = 10;
    for (let i = 0; i < numSteps; i++) {
        ball.x += ball.dx / numSteps;
        ball.y += ball.dy / numSteps;

        detectCollision();
    }

    ball.dx *= friction;
    ball.dy *= friction;

    if (Math.abs(ball.dx) < velocityThreshold && Math.abs(ball.dy) < velocityThreshold) {
        ball.dx = 0;
        ball.dy = 0;
    }

    ball.lastCollidedObject = null;
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

function linesIntersect(A, B, C, D) {
    const a1 = B.y - A.y;
    const b1 = A.x - B.x;
    const c1 = a1 * A.x + b1 * A.y;
    const a2 = D.y - C.y;
    const b2 = C.x - D.x;
    const c2 = a2 * C.x + b2 * C.y;

    const det = a1 * b2 - a2 * b1;
    if (det === 0) return false;

    const x = (b2 * c1 - b1 * c2) / det;
    const y = (a1 * c2 - a2 * c1) / det;

    const within = (p, q, r) => p >= Math.min(q, r) && p <= Math.max(q, r);
    return within(x, A.x, B.x) && within(x, C.x, D.x) && within(y, A.y, B.y) && within(y, C.y, D.y);
}

function getRotatedRectVertices(object) {
    const hw = object.width / 2;
    const hh = object.height / 2;

    const topLeft = { x: -hw, y: -hh };
    const topRight = { x: hw, y: -hh };
    const bottomRight = { x: hw, y: hh };
    const bottomLeft = { x: -hw, y: hh };

    const vertices = [topLeft, topRight, bottomRight, bottomLeft];

    return vertices.map((vertex) => {
        const rotatedX = object.x + hw + (vertex.x * Math.cos(object.rotation) - vertex.y * Math.sin(object.rotation));
        const rotatedY = object.y + hh + (vertex.x * Math.sin(object.rotation) + vertex.y * Math.cos(object.rotation));
        return { x: rotatedX, y: rotatedY };
    });
}

function detectCollision() {
    objects.forEach((object) => {
        if (object === ball.lastCollidedObject) {
            return;
        }

        const vertices = getRotatedRectVertices(object);
        const ballCenter = { x: ball.x, y: ball.y };

        for (let i = 0; i < vertices.length; i++) {
            const nextIndex = (i + 1) % vertices.length;

            const A = vertices[i];
            const B = vertices[nextIndex];

            const C = {
                x: ballCenter.x - ball.radius * (B.y - A.y) / Math.hypot(B.x - A.x, B.y - A.y),
                y: ballCenter.y + ball.radius * (B.x - A.x) / Math.hypot(B.x - A.x, B.y - A.y)
            };

            const D = {
                x: ballCenter.x + ball.radius * (B.y - A.y) / Math.hypot(B.x - A.x, B.y - A.y),
                y: ballCenter.y - ball.radius * (B.x - A.x) / Math.hypot(B.x - A.x, B.y - A.y)
            };

            if (linesIntersect(A, B, C, D)) {
                const dx = ball.dx;
                const dy = ball.dy;

                const normalX = B.y - A.y;
                const normalY = A.x - B.x;
                const normalLength = Math.hypot(normalX, normalY);
                const normalizedNormalX = normalX / normalLength;
                const normalizedNormalY = normalY / normalLength;

                const dotProduct = dx * normalizedNormalX + dy * normalizedNormalY;
                ball.dx -= 2 * dotProduct * normalizedNormalX;
                ball.dy -= 2 * dotProduct * normalizedNormalY;

                const offset = 1; // To avoid the ball getting stuck in the object
                ball.x += (ball.radius + offset) * normalizedNormalX;
                ball.y += (ball.radius + offset) * normalizedNormalY;

                ball.lastCollidedObject = object;
                break;
            }
        }
    });
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
    drawRestIndicator();
    drawDrag();
    drawObjects();

    updateBall();

    requestAnimationFrame(draw);
}

draw();
