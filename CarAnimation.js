let canvas = document.createElement("canvas");
let context;

let fps = 60;
let time = 0;

let gridNumRows = 8, gridNumCols = 8;
let gridCellSizeX, gridCellSizeY;

let trackOrder;

let currentTrackSegmentId = 0;
let currentTrackSegmentProgress = 0.5;

let currentTrackSegmentLength;
let distanceToNextCurve;

let lastLapTime = null;

let straightTopSpeed = 6;
let curveTopSpeed = 1;
let acceleration = 3;
let braking = 10;

let speed = 0;

function getGridIdToRowCol(gridId) {
    return [Math.floor(gridId / gridNumCols), gridId % gridNumCols];
}

function getGridRowColToId(gridRow, gridCol) {
    return gridCol + gridRow * gridNumCols;
}

function startGame() {
    context = canvas.getContext("2d");
    document.body.insertBefore(canvas, document.body.childNodes[0]);

    canvas.width  = window.innerWidth;
    canvas.height = window.innerHeight;

    gridCellSizeX = canvas.width / gridNumCols;
    gridCellSizeY = canvas.height / gridNumRows;

    generateTrack();
    getTrackSegmentInfo();

    runFrame();
}

function shuffle(array) {
    let currentIndex = array.length, randomIndex;
    while(currentIndex != 0) {
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex--;
        [array[currentIndex], array[randomIndex]] = [array[randomIndex], array[currentIndex]];
    }
    return array;
}

function generateTrack() {
    let startCell = getGridRowColToId(0, 0);
    let endCell = getGridRowColToId(gridNumRows - 1, gridNumCols - 1);

    function dfsStart(start, end) {
        let startNode = { id: start, visited: [] };
        return dfs(startNode, end);
    }

    function dfs(startNode, endId) {
        startNode.visited.push(startNode.id);

        if(startNode.id === endId) {
            return startNode;
        }

        let [row, col] = getGridIdToRowCol(startNode.id);
        let neighbors = [];
        for(let i = -1; i <= 1; i++) {
            for(let j = -1; j <= 1; j++) {
                if(i != 0 && j != 0) continue;
                let thisRow = row + i;
                let thisCol = col + j;
                if(thisRow < 0 || thisRow >= gridNumRows || thisCol < 0 || thisCol >= gridNumCols) continue;
                let thisId = getGridRowColToId(thisRow, thisCol);
                if(startNode.visited.includes(thisId)) continue;
                neighbors.push(thisId);
            }
        }
        shuffle(neighbors);

        for(let i = 0; i < neighbors.length; i++) {
            let neighborNode = { id: neighbors[i], visited: startNode.visited };
            let result = dfs(neighborNode, endId);
            if(result != null) {
                return result;
            }
        }

        return null;
    }

    trackOrder = dfsStart(startCell, endCell).visited;
}

function runFrame() {
    runPhysics();
    draw();

    time += 1 / fps;

    setTimeout(function() {
        requestAnimationFrame(runFrame);
    }, 1000 / fps);
}

function getTrackIsCurve(trackSegmentId) {
    let [prevGridRow, prevGridCol] = getGridIdToRowCol(trackOrder[(trackSegmentId + trackOrder.length - 1) % trackOrder.length]);
    let [gridRow, gridCol] = getGridIdToRowCol(trackOrder[trackSegmentId]);
    let [nextGridRow, nextGridCol] = getGridIdToRowCol(trackOrder[(trackSegmentId + 1) % trackOrder.length]);

    if((gridCol != prevGridCol && gridCol != nextGridCol) || (gridRow != prevGridRow && gridRow != nextGridRow)) {
        return false;
    }
    return true;
}

function getTrackDirectionId(trackSegmentId) {
    let [prevGridRow, prevGridCol] = getGridIdToRowCol(trackOrder[(trackSegmentId + trackOrder.length - 1) % trackOrder.length]);
    let [gridRow, gridCol] = getGridIdToRowCol(trackOrder[trackSegmentId]);
    let [nextGridRow, nextGridCol] = getGridIdToRowCol(trackOrder[(trackSegmentId + 1) % trackOrder.length]);

    if(!getTrackIsCurve(trackSegmentId)) { // Straight
        if(gridRow == nextGridRow) { // Horizontal
            if(nextGridCol > gridCol) return 1; // Horizontal right
            else return 2; // Horizontal left
        }
        else { // Vertical
            if(nextGridRow > gridRow) return 3; // Vertical down
            else return 4; // Vertical up
        }
    }
    else {
        return 5;
    }
}

function getTrackSegmentInfo() {
    if(getTrackIsCurve(currentTrackSegmentId)) {
        currentTrackSegmentLength = 100;
    }
    else {
        currentTrackSegmentLength = 2 * Math.PI * 50;
    }

    let trackSegmentId = currentTrackSegmentId;
    for(let i = 0; i < trackOrder.length; i++) {
        if(getTrackIsCurve(trackSegmentId)) {
            distanceToNextCurve = i * 100;
            break;
        }
        trackSegmentId = (trackSegmentId + 1) % trackOrder.length;
    }
}

function runPhysics() {
    getTrackSegmentInfo();

    let brake = false;
    if(speed < curveTopSpeed) brake = false;
    else if((speed - curveTopSpeed) / braking < 0) brake = true;
    else if((curveTopSpeed) <= (Math.sqrt((Math.pow(speed, 2)) + (2 * braking * distanceToNextCurve)))) brake = true;
    else brake = false;

    if(brake) {
        speed -= braking * time;
    }
    else if((distanceToNextCurve == 0 && speed < curveTopSpeed) || (distanceToNextCurve > 0 && speed < straightTopSpeed)) {
        speed += acceleration * time;
    }

    currentTrackSegmentProgress += speed / currentTrackSegmentLength;

    if(currentTrackSegmentProgress >= 1) {
        currentTrackSegmentProgress = 0;
        currentTrackSegmentId++;
        if(currentTrackSegmentId >= trackOrder.length) {
            currentTrackSegmentId = 0;
            lastLapTime = time;
            time = 0;
        }
    }
}

function draw() {
    context.clearRect(0, 0, canvas.width, canvas.height);

    context.fillStyle = "black";
    context.fillRect(0, 0, canvas.width, canvas.height);

    drawTrack();
    drawCar();
    drawTimer();
}

function drawTrack() {
    for(let row = 0; row < gridNumRows; row++) {
        for(let col = 0; col < gridNumCols; col++) {
            drawTrackTile(row, col);
        }
    }
}

let grassGreen = "#39b54a";
let lineWhite = "#fff";
let lineRed = "#ed1c24";
let tarmacGrey = "#808285";
function drawTrackTile(row, col) {
    let startX = col * gridCellSizeX;
    let startY = row * gridCellSizeY;
    let scaleFactor = gridCellSizeX / 500;

    context.strokeStyle = "";

    context.fillStyle = grassGreen;
    context.fillRect(startX, startY, gridCellSizeX, gridCellSizeY);

    let trackSegmentId = getGridRowColToId(row, col);
    if(!trackOrder.includes(trackSegmentId)) {
        return;
    }

    let trackDirectionId = getTrackDirectionId(trackSegmentId);
    if(trackDirectionId == 1 || trackDirectionId == 2) { // Horizontal
        context.fillStyle = lineWhite;
        context.fillRect(startX, startY + 65 * scaleFactor, gridCellSizeX, 345 * scaleFactor);
        context.fillStyle = lineRed;
        for(let x = 0; x < gridCellSizeX; x += 100 * scaleFactor) {
            context.fillRect(startX + x, startY + 65 * scaleFactor, 50 * scaleFactor, 25 * scaleFactor);
        }
        context.fillStyle = tarmacGrey;
        context.fillRect(startX, startY + 100 * scaleFactor, gridCellSizeX, 300 * scaleFactor);
    }
    else if(trackDirectionId == 3 || trackDirectionId == 4) { // Vertical
        context.fillStyle = lineWhite;
        context.fillRect(startX + 65 * scaleFactor, startY, 345 * scaleFactor, gridCellSizeY);
        context.fillStyle = lineRed;
        for(let y = 0; y < gridCellSizeY; y += 100 * scaleFactor) {
            context.fillRect(startX + 65 * scaleFactor, startY + y, 25 * scaleFactor, 50 * scaleFactor);
        }
        context.fillStyle = tarmacGrey;
        context.fillRect(startX + 100 * scaleFactor, startY, 300 * scaleFactor, gridCellSizeY);
    }
    else {
        context.fillStyle = lineWhite;
        context.fillRect(startX + 100 * scaleFactor, startY + 100 * scaleFactor, 300 * scaleFactor, 300 * scaleFactor);
    }
}

function lerp(min, max, s) {
    if(min > max) return max + (min - max) * (1 - s);
    return min + (max - min) * s;
}

function getCarPosition() {
    let [prevGridRow, prevGridCol] = getGridIdToRowCol(trackOrder[(currentTrackSegmentId + trackOrder.length - 1) % trackOrder.length]);
    let [gridRow, gridCol] = getGridIdToRowCol(trackOrder[currentTrackSegmentId]);
    let [nextGridRow, nextGridCol] = getGridIdToRowCol(trackOrder[(currentTrackSegmentId + 1) % trackOrder.length]);

    let gridLeastX = gridCol * gridCellSizeX;
    let gridLeastY = gridRow * gridCellSizeY;
    let gridMostX = (gridCol + 1) * gridCellSizeX;
    let gridMostY = (gridRow + 1) * gridCellSizeY;
    let gridCenterX = (gridLeastX + gridMostX) / 2;
    let gridCenterY = (gridLeastY + gridMostY) / 2;

    let segmentStartX, segmentStartY, segmentEndX, segmentEndY;

    if(gridCol < prevGridCol) {
        segmentStartX = gridMostX;
    }
    else if(gridCol > prevGridCol) {
        segmentStartX = gridLeastX;
    }
    else {
        segmentStartX = gridCenterX;
    }

    if(gridRow < prevGridRow) {
        segmentStartY = gridMostY;
    }
    else if(gridRow > prevGridRow) {
        segmentStartY = gridLeastY;
    }
    else {
        segmentStartY = gridCenterY;
    }

    if(gridCol < nextGridCol) {
        segmentEndX = gridMostX;
    }
    else if(gridCol > nextGridCol) {
        segmentEndX = gridLeastX;
    }
    else {
        segmentEndX = gridCenterX;
    }

    if(gridRow < nextGridRow) {
        segmentEndY = gridMostY;
    }
    else if(gridRow > nextGridRow) {
        segmentEndY = gridLeastY;
    }
    else {
        segmentEndY = gridCenterY;
    }

    if(segmentStartX != segmentEndX && segmentStartY != segmentEndY) {
        let circleCenterX, circleCenterY;
        let thetaStart, thetaEnd;
        if(segmentStartX == gridCenterX && segmentStartY == gridMostY && segmentEndX == gridMostX && segmentEndY == gridCenterY) {
            circleCenterX = gridMostX;
            circleCenterY = gridMostY;
            thetaStart = Math.PI;
            thetaEnd = 3 * Math.PI / 2;
        }
        else if(segmentStartX == gridLeastX && segmentStartY == gridCenterY && segmentEndX == gridCenterX && segmentEndY == gridMostY) {
            circleCenterX = gridLeastX;
            circleCenterY = gridMostY;
            thetaStart = 3 * Math.PI / 2;
            thetaEnd = 2 * Math.PI;
        }
        else if(segmentStartX == gridMostX && segmentStartY == gridCenterY && segmentEndX == gridCenterX && segmentEndY == gridLeastY) {
            circleCenterX = gridMostX;
            circleCenterY = gridLeastY;
            thetaStart = Math.PI / 2;
            thetaEnd = Math.PI;
        }
        else if(segmentStartX == gridCenterX && segmentStartY == gridLeastY && segmentEndX == gridLeastX && segmentEndY == gridCenterY) {
            circleCenterX = gridLeastX;
            circleCenterY = gridLeastY;
            thetaStart = 0;
            thetaEnd = Math.PI / 2;
        }
        else if(segmentStartX == gridMostX && segmentStartY == gridCenterY && segmentEndX == gridCenterX && segmentEndY == gridMostY) {
            circleCenterX = gridMostX;
            circleCenterY = gridMostY;
            thetaStart = 3 * Math.PI / 2;
            thetaEnd = Math.PI;
        }
        else if(segmentStartX == gridCenterX && segmentStartY == gridMostY && segmentEndX == gridLeastX && segmentEndY == gridCenterY) {
            circleCenterX = gridLeastX;
            circleCenterY = gridMostY;
            thetaStart = 2 * Math.PI;
            thetaEnd = 3* Math.PI / 2;
        }
        else if(segmentStartX == gridCenterX && segmentStartY == gridLeastY && segmentEndX == gridMostX && segmentEndY == gridCenterY) {
            circleCenterX = gridMostX;
            circleCenterY = gridLeastY;
            thetaStart = Math.PI;
            thetaEnd = Math.PI / 2;
        }
        else if(segmentStartX == gridLeastX && segmentStartY == gridCenterY && segmentEndX == gridCenterX && segmentEndY == gridLeastY) {
            circleCenterX = gridLeastX;
            circleCenterY = gridLeastY;
            thetaStart = Math.PI / 2;
            thetaEnd = 0;
        }

        let theta = lerp(thetaStart, thetaEnd, currentTrackSegmentProgress);
        let x = circleCenterX + Math.cos(theta) * gridCellSizeX / 2;
        let y = circleCenterY + Math.sin(theta) * gridCellSizeY / 2;
        return [x, y];
    }
    else {
        let x = lerp(segmentStartX, segmentEndX, currentTrackSegmentProgress);
        let y = lerp(segmentStartY, segmentEndY, currentTrackSegmentProgress);
        return [x, y];
    }
}

function drawCar() {
    let [x, y] = getCarPosition();
    context.fillStyle = "#000";
    context.fillRect(x - 5, y - 5, 10, 10);
}

function drawTimer() {
    context.font = "18px serif";
    context.textBaseline = "hanging";
    context.fillStyle = "rgb(255,255,0)";
    context.strokeStyle = "rgb(255,255,0)";
    context.fillText("Time: " + time.toFixed(2) + "s" + (lastLapTime != null ? " | Last: " + lastLapTime.toFixed(2) + "s" : ""), 10, 20);
}
