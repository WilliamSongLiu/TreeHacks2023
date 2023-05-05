let gridNumRows = 3, gridNumCols = 3;
let startCell = getGridRowColToId(0, 0);
let endCell = getGridRowColToId(2, 2);

let path = dfsStart(startCell, endCell);
console.log(path)

function getGridIdToRowCol(gridId) {
    return [Math.floor(gridId / gridNumCols), gridId % gridNumCols];
}

function getGridRowColToId(gridRow, gridCol) {
    return gridCol + gridRow * gridNumCols;
}

function shuffle(array) {
    let currentIndex = array.length,  randomIndex;

    // While there remain elements to shuffle.
    while (currentIndex != 0) {
        // Pick a remaining element.
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex--;

        // And swap it with the current element.
        [array[currentIndex], array[randomIndex]] = [
        array[randomIndex], array[currentIndex]];
    }

    return array;
}

function dfsStart(start, end) {
    let startNode = { id: start, visited: [] };
    return dfs(startNode, end);
}

function dfs(startNode, endId) {
    console.log(`Visiting node ${startNode.id}`);
    startNode.visited.push(startNode.id);

    if (startNode.id === endId) {
        console.log(`Found end node ${endId}`);
        return startNode;
    }

    // Recurse with all children
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
    console.log(`Neighbors: ${neighbors}`);

    for (var i = 0; i < neighbors.length; i++) {
        let neighborNode = { id: neighbors[i], visited: startNode.visited };
        var result = dfs(neighborNode, endId);
        if (result != null) {
            // We've found the goal node while going down that child
            return result;
        }
    }

    // We've gone through all children and not found the goal node
    console.log(`Not found after ${startNode.id} path ${startNode.visited}`);
    return null;
};
