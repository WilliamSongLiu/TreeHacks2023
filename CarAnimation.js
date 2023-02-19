let canvas = document.createElement("canvas");
let context;

let svgDataType = "data:image/svg+xml;base64,";

let emptyTrackImg = new Image();
emptyTrackImg.src = svgDataType + "PHN2ZyBkYXRhLW5hbWU9IkxheWVyIDEiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIgd2lkdGg9IjUwMCIgaGVpZ2h0PSI1MDAiIHZpZXdCb3g9IjAgMCA1MDAgNTAwIj48cGF0aCBzdHlsZT0iZmlsbDojMzliNTRhIiBkPSJNLjIgMGg1MDB2NTAwSC4yeiIvPjwvc3ZnPg==";

let straightTrackHorizontalImg = new Image();
straightTrackHorizontalImg.src = svgDataType + "PHN2ZyBkYXRhLW5hbWU9IkxheWVyIDEiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIgd2lkdGg9IjUwMCIgaGVpZ2h0PSI1MDAiIHZpZXdCb3g9IjAgMCA1MDAgNTAwIj48cGF0aCBzdHlsZT0iZmlsbDojMzliNTRhIiBkPSJNMCAwaDUwMHY1MDBIMHoiLz48cGF0aCBzdHlsZT0iZmlsbDojZmZmIiBkPSJNMCA3NWg1MDB2MzUwSDB6Ii8+PHBhdGggc3R5bGU9ImZpbGw6IzgwODI4NSIgZD0iTTAgMTAwaDUwMHYzMDBIMHoiLz48L3N2Zz4=";

let straightTrackVerticalImg = new Image();
straightTrackVerticalImg.src = svgDataType +
"PHN2ZyBkYXRhLW5hbWU9IkxheWVyIDEiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIgd2lkdGg9IjUwMCIgaGVpZ2h0PSI1MDAiIHZpZXdCb3g9IjAgMCA1MDAgNTAwIj48cGF0aCBzdHlsZT0iZmlsbDojMzliNTRhIiBkPSJNMCAwaDUwMHY1MDBIMHoiLz48cGF0aCBzdHlsZT0iZmlsbDojZmZmIiBkPSJNNzUgMGgzNTB2NTAwSDc1eiIvPjxwYXRoIHN0eWxlPSJmaWxsOiM4MDgyODUiIGQ9Ik0xMDAgMGgzMDB2NTAwSDEwMHoiLz48L3N2Zz4=";

let curvedTrackImg = new Image();
curvedTrackImg.src = svgDataType + "PHN2ZyBpZD0idXVpZC0zMzllMWE5My02OWYzLTQ1MzAtYWE0OC05NGNjZWQxY2M3OWYiIGRhdGEtbmFtZT0iTGF5ZXIgMSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiB3aWR0aD0iNTAwIiBoZWlnaHQ9IjUwMCIgdmlld0JveD0iMCAwIDUwMCA1MDAiPjxkZWZzPjxzdHlsZT4udXVpZC0wYzhkNGY4Zi1kMmNkLTQxYTktYjBkYS0yZWY4Yzk5NTI1Yjh7ZmlsbDojMzliNTRhfTwvc3R5bGU+PC9kZWZzPjxwYXRoIGNsYXNzPSJ1dWlkLTBjOGQ0ZjhmLWQyY2QtNDFhOS1iMGRhLTJlZjhjOTk1MjViOCIgZD0iTTAgMGg1MDB2NTAwSDB6Ii8+PHBhdGggZD0iTTQyNC45IDUwMEM0MjQuOSAyNjUuMyAyMzQuNiA3NSAwIDc1djQyNWg0MjVaIiBzdHlsZT0iZmlsbDojZmZmIi8+PHBhdGggZD0iTTk5LjkgNTAwaDMwMGMwLTIyMC45LTE3OS4xLTQwMC0zOTkuOS00MDB2MzAwYzU1LjIgMCAxMDAgNDQuOCAxMDAgMTAwWiIgc3R5bGU9ImZpbGw6IzgwODI4NSIvPjxwYXRoIGNsYXNzPSJ1dWlkLTBjOGQ0ZjhmLWQyY2QtNDFhOS1iMGRhLTJlZjhjOTk1MjViOCIgZD0iTTAgNDI1djc1aDc1LjFjMC00MS40LTMzLjYtNzUtNzUtNzVaIi8+PC9zdmc+";

let fps = 60;
let time = 0;

let gridNumRows = 4, gridNumCols = 4;
let gridCellSizeX, gridCellSizeY;

let trackOrder;

let currentTrackOrderId = 0;
let currentTrackSegmentProgress = 0.5;

let currentTrackSegmentLength;
let distanceToNextCurve;

let lastLapTime = null;

let straightTopSpeed = 15;
let curveTopSpeed = 3;
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

    context.strokeStyle = "rgba(0, 0, 0, 0)";

    generateTrack();
    getTrackSegmentInfo();

    for(let i = 0; i < trackOrder.length; i++) {
        console.log(`Id ${trackOrder[i]} curve ${getTrackIsCurve(i)}`);
    }

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
                if(i == 0 && j == 0) continue;
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
    console.log(trackOrder);
}

function runFrame() {
    runPhysics();
    draw();

    time += 1 / fps;

    setTimeout(function() {
        requestAnimationFrame(runFrame);
    }, 1000 / fps);
}

function getTrackIsCurve(trackOrderId) {
    if(trackOrderId == 0 || trackOrderId == trackOrder.length - 1) {
        return false;
    }

    let [prevGridRow, prevGridCol] = getGridIdToRowCol(trackOrder[(trackOrderId + trackOrder.length - 1) % trackOrder.length]);
    let [gridRow, gridCol] = getGridIdToRowCol(trackOrder[trackOrderId]);
    let [nextGridRow, nextGridCol] = getGridIdToRowCol(trackOrder[(trackOrderId + 1) % trackOrder.length]);

    let colsSame = gridCol == prevGridCol && gridCol == nextGridCol;
    let colsDifferent = gridCol != prevGridCol && gridCol != nextGridCol;
    let rowsSame = gridRow == prevGridRow && gridRow == nextGridRow;
    let rowsDifferent = gridRow != prevGridRow && gridRow != nextGridRow;

    if(colsSame && rowsDifferent || colsDifferent && rowsSame) {
        return false;
    }
    return true;
}

function getTrackDirection(trackOrderId) {
    let [prevGridRow, prevGridCol] = getGridIdToRowCol(trackOrder[(trackOrderId + trackOrder.length - 1) % trackOrder.length]);
    let [gridRow, gridCol] = getGridIdToRowCol(trackOrder[trackOrderId]);
    let [nextGridRow, nextGridCol] = getGridIdToRowCol(trackOrder[(trackOrderId + 1) % trackOrder.length]);

    if(!getTrackIsCurve(trackOrderId)) { // Straight
        if(gridRow == nextGridRow) { // Horizontal
            return "h";
        }
        else { // Vertical
            return "v";
        }
    }
    else { // Curved
        if((gridCol - 1 == prevGridCol && gridCol == nextGridCol
            && gridRow == prevGridRow && gridRow + 1 == nextGridRow)
            || (gridCol == prevGridCol && gridCol - 1 == nextGridCol
            && gridRow + 1 == prevGridRow && gridRow == nextGridRow)) { // Top right
            return "tr";
        }
        else if((gridCol == prevGridCol && gridCol + 1 == nextGridCol
            && gridRow + 1 == prevGridRow && gridRow == nextGridRow)
            || (gridCol + 1 == prevGridCol && gridCol == nextGridCol
            && gridRow == prevGridRow && gridRow + 1 == nextGridRow)) { // Top left
            return "tl";
        }
        else if((gridCol == prevGridCol && gridCol + 1 == nextGridCol
            && gridRow - 1 == prevGridRow && gridRow == nextGridRow)
            || (gridCol + 1 == prevGridCol && gridCol == nextGridCol
            && gridRow == prevGridRow && gridRow - 1 == nextGridRow)) { // Bottom left
            return "bl";
        }
        return "br";
    }
    return null;
}

function getTrackSegmentInfo() {
    if(getTrackIsCurve(currentTrackOrderId)) {
        currentTrackSegmentLength = 100;
    }
    else {
        currentTrackSegmentLength = 2 * Math.PI * 50;
    }

    let trackSegmentId = currentTrackOrderId;
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
    else if(curveTopSpeed <= Math.sqrt(Math.pow(speed, 2) + 2 * braking * distanceToNextCurve)) brake = true;
    else brake = false;

    if(brake) {
        speed -= braking / fps;
    }
    else if((distanceToNextCurve == 0 && speed < curveTopSpeed) || (distanceToNextCurve > 0 && speed < straightTopSpeed)) {
        speed += acceleration / fps;
    }

    currentTrackSegmentProgress += speed / currentTrackSegmentLength;

    if(currentTrackSegmentProgress >= 1) {
        currentTrackSegmentProgress = 0;
        currentTrackOrderId++;
        if(currentTrackOrderId >= trackOrder.length) {
            currentTrackOrderId = 0;
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

function drawTrackTile(row, col) {
    let startX = col * gridCellSizeX;
    let startY = row * gridCellSizeY;

    let trackSegmentId = getGridRowColToId(row, col);
    if(!trackOrder.includes(trackSegmentId)) {
        context.drawImage(emptyTrackImg, startX, startY, gridCellSizeX, gridCellSizeY);
        return;
    }
    let trackOrderId = trackOrder.indexOf(trackSegmentId);

    let trackDirection = getTrackDirection(trackOrderId);
    if(trackDirection == "h") {
        context.drawImage(straightTrackHorizontalImg, startX, startY, gridCellSizeX, gridCellSizeY);
    }
    else if(trackDirection == "v") {
        context.drawImage(straightTrackVerticalImg, startX, startY, gridCellSizeX, gridCellSizeY);
    }
    else if(trackDirection == "tl") {
        context.drawImage(curvedTrackImg, startX, startY, gridCellSizeX, gridCellSizeY);
    }
    else if(trackDirection == "tr") {
        context.drawImage(curvedTrackImg, startX, startY, gridCellSizeX, gridCellSizeY);
    }
    else if(trackDirection == "bl") {
        context.drawImage(curvedTrackImg, startX, startY, gridCellSizeX, gridCellSizeY);
    }
    else if(trackDirection == "br") {
        context.drawImage(curvedTrackImg, startX, startY, gridCellSizeX, gridCellSizeY);
    }
}

function lerp(min, max, s) {
    if(min > max) return max + (min - max) * (1 - s);
    return min + (max - min) * s;
}

function getCarPosition() {
    let [prevGridRow, prevGridCol] = getGridIdToRowCol(trackOrder[(currentTrackOrderId + trackOrder.length - 1) % trackOrder.length]);
    let [gridRow, gridCol] = getGridIdToRowCol(trackOrder[currentTrackOrderId]);
    let [nextGridRow, nextGridCol] = getGridIdToRowCol(trackOrder[(currentTrackOrderId + 1) % trackOrder.length]);

    if(currentTrackOrderId == 0) {
        prevGridRow = gridRow - 1;
        prevGridCol = gridCol;
    }
    else if(currentTrackOrderId == trackOrder.length - 1) {
        nextGridRow = gridRow + 1;
        nextGridCol = gridCol;
    }

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
    context.fillStyle = "rgb(255, 255, 0)";
    context.fillText("Time: " + time.toFixed(2) + "s" + (lastLapTime != null ? " | Last: " + lastLapTime.toFixed(2) + "s" : ""), 10, 20);
}
