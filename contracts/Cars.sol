pragma solidity ^0.8.17;

import "erc721a/contracts/ERC721A.sol";
import "@openzeppelin/contracts/utils/Base64.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "./Utilities.sol";

contract Cars is ERC721A, Ownable {
    uint public price = 0.01 ether;
    uint public maxSupply = 1000;

    struct Car {
        string color;
    }
    mapping(uint => Car) cars;

    constructor() ERC721A("Cars", "Cars") {
        _mint(msg.sender, 1);
    }

    function setPrice(uint _price) external onlyOwner {
        price = _price;
    }

    function reduceSupply(uint _lowerSupply) external onlyOwner {
        require(_lowerSupply < maxSupply, "New supply must be lower than the current supply");
        maxSupply = _lowerSupply;
    }

    function mint(uint256 quantity) external payable {
        require(msg.value >= price * quantity, "Insufficient fee");
        require(totalSupply() + quantity <= maxSupply, "Exceeds max supply");
        _mint(msg.sender, quantity);
    }

    function tokenURI(uint256 tokenId) public view virtual override returns (string memory) {
        if(!_exists(tokenId)) {
            revert URIQueryForNonexistentToken();
        }

        string memory name = string(abi.encodePacked("Car #", utils.uint2str(tokenId)));
        string memory image = makeImage(tokenId);
        string memory animation = makeAnimation(tokenId);

        string memory json = string(
            abi.encodePacked(
                '{'
                    '"name": "', name, '",'
                    '"description": "Car",'
                    '"attributes": [],'
                    '"image": "data:image/svg+xml;base64,', Base64.encode(bytes(image)), '",'
                    '"animation_url": "data:text/html;base64,', Base64.encode(bytes(animation)), '"'
                '}'
            )
        );
        return string(abi.encodePacked('data:application/json;base64,', Base64.encode(bytes(json))));
    }

    function makeImage(uint tokenId) private view returns (string memory image) {
        image = string.concat(
            '<svg id="car" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMinYMin meet" viewBox="0 0 200 100" fill="#000">'
            '<rect x="0" y="0" width="200" height="100" fill="#000"></rect>'
        );

        image = string.concat(
            image,
            '<path fill="none" stroke="lightgrey" d="M20,50 C20,-50 180,150 180,50 C180-50 20,150 20,50 z" />'
            '<circle r="5" fill="red"><animateMotion dur="10s" repeatCount="indefinite" path="M20,50 C20,-50 180,150 180,50 C180-50 20,150 20,50 z" /></circle>'
        );

        image = string.concat(
            image,
            '</svg>'
        );

        return image;
    }

    function makeAnimation(uint tokenId) private view returns (string memory animation) {
        animation = string.concat(
            '<head>'
                '<meta charset="UTF-8">'
                '<meta name="viewport" content="width=device-width, initial-scale=1.0">'
                '<title>Animation</title>'
                '<style>'
                    '* { box-sizing: border-box; }'
                    'html, body { width: 100vw; height: 100vh; margin: 0; }'
                '</style>'
            '</head>'
            '<body onload="startGame()">'
                '<script type="text/javascript">'
                    'let canvas = document.createElement("canvas");'
                    'let context;'

                    'let fps = 60;'
                    'let time = 0;'

                    'let gridNumRows = 3, gridNumCols = 3;'
                    'let gridCellSizeX, gridCellSizeY;'

                    'let trackOrder;'

                    'let currentTrackSegmentId = 0;'
                    'let currentTrackSegmentProgress = 0.5;'

                    'let currentTrackSegmentLength;'
                    'let distanceToNextCurve;'

                    'let lastLapTime = null;'

                    'let straightTopSpeed = 6;'
                    'let curveTopSpeed = 1;'
                    'let acceleration = 3;'
                    'let braking = 10;'

                    'let speed = 0;'

                    'function getGridIdToRowCol(gridId) {'
                        'return [Math.floor(gridId / gridNumCols), gridId % gridNumCols];'
                    '}'

                    'function getGridRowColToId(gridRow, gridCol) {'
                        'return gridCol + gridRow * gridNumCols;'
                    '}'

                    'function startGame() {'
                        'context = canvas.getContext("2d");'
                        'document.body.insertBefore(canvas, document.body.childNodes[0]);'

                        'canvas.width  = window.innerWidth;'
                        'canvas.height = window.innerHeight;'

                        'gridCellSizeX = canvas.width / gridNumCols;'
                        'gridCellSizeY = canvas.height / gridNumRows;'

                        'generateTrack();'
                        'getTrackSegmentInfo();'

                        'runFrame();'
                    '}'

                    'function shuffle(array) {'
                        'let currentIndex = array.length, randomIndex;'
                        'while(currentIndex != 0) {'
                            'randomIndex = Math.floor(Math.random() * currentIndex);'
                            'currentIndex--;'
                            '[array[currentIndex], array[randomIndex]] = [array[randomIndex], array[currentIndex]];'
                        '}'
                        'return array;'
                    '}'

                    'function generateTrack() {'
                        'let startCell = getGridRowColToId(0, 0);'
                        'let endCell = getGridRowColToId(gridNumRows - 1, gridNumCols - 1);'

                        'function dfsStart(start, end) {'
                            'let startNode = { id: start, visited: [] };'
                            'return dfs(startNode, end);'
                        '}'

                        'function dfs(startNode, endId) {'
                            'startNode.visited.push(startNode.id);'

                            'if(startNode.id === endId) {'
                                'return startNode;'
                            '}'

                            'let [row, col] = getGridIdToRowCol(startNode.id);'
                            'let neighbors = [];'
                            'for(let i = -1; i <= 1; i++) {'
                                'for(let j = -1; j <= 1; j++) {'
                                    'if(i != 0 && j != 0) continue;'
                                    'let thisRow = row + i;'
                                    'let thisCol = col + j;'
                                    'if(thisRow < 0 || thisRow >= gridNumRows || thisCol < 0 || thisCol >= gridNumCols) continue;'
                                    'let thisId = getGridRowColToId(thisRow, thisCol);'
                                    'if(startNode.visited.includes(thisId)) continue;'
                                    'neighbors.push(thisId);'
                                '}'
                            '}'
                            'shuffle(neighbors);'

                            'for(let i = 0; i < neighbors.length; i++) {'
                                'let neighborNode = { id: neighbors[i], visited: startNode.visited };'
                                'let result = dfs(neighborNode, endId);'
                                'if(result != null) {'
                                    'return result;'
                                '}'
                            '}'

                            'return null;'
                        '}'

                        'trackOrder = dfsStart(startCell, endCell).visited;'
                    '}'

                    'function runFrame() {'
                        'runPhysics();'
                        'draw();'

                        'time += 1 / fps;'

                        'setTimeout(function() {'
                            'requestAnimationFrame(runFrame);'
                        '}, 1000 / fps);'
                    '}'

                    'function getTrackIsCurve(trackSegmentId) {'
                        'let [prevGridRow, prevGridCol] = getGridIdToRowCol(trackOrder[(trackSegmentId + trackOrder.length - 1) % trackOrder.length]);'
                        'let [gridRow, gridCol] = getGridIdToRowCol(trackOrder[trackSegmentId]);'
                        'let [nextGridRow, nextGridCol] = getGridIdToRowCol(trackOrder[(trackSegmentId + 1) % trackOrder.length]);'

                        'if((gridCol != prevGridCol && gridCol != nextGridCol) || (gridRow != prevGridRow && gridRow != nextGridRow)) {'
                            'return false;'
                        '}'
                        'return true;'
                    '}'

                    'function getTrackSegmentInfo() {'
                        'if(getTrackIsCurve(currentTrackSegmentId)) {'
                            'currentTrackSegmentLength = 100;'
                        '}'
                        'else {'
                            'currentTrackSegmentLength = 2 * Math.PI * 50;'
                        '}'

                        'let trackSegmentId = currentTrackSegmentId;'
                        'for(let i = 0; i < trackOrder.length; i++) {'
                            'if(getTrackIsCurve(trackSegmentId)) {'
                                'distanceToNextCurve = i * 100;'
                                'break;'
                            '}'
                            'trackSegmentId = (trackSegmentId + 1) % trackOrder.length;'
                        '}'
                    '}'

                    'function runPhysics() {'
                        'let brake = false;'
                        'if(speed < curveTopSpeed) brake = false;'
                        'else if((curveTopSpeed - speed) / braking < 0) brake = false;'
                        'else if(curveTopSpeed <= Math.sqrt(Math.pow(speed, 2) + 2 * braking * distanceToNextCurve)) brake = true;'
                        'else brake = false;'

                        'if(brake) {'
                            'speed -= braking / fps;'
                        '}'
                        'else if((distanceToNextCurve == 0 && speed < curveTopSpeed) || (distanceToNextCurve > 0 && speed < straightTopSpeed)) {'
                            'speed += acceleration / fps;'
                        '}'

                        'currentTrackSegmentProgress += speed / currentTrackSegmentLength;'

                        'if(currentTrackSegmentProgress >= 1) {'
                            'currentTrackSegmentProgress = 0;'
                            'currentTrackSegmentId++;'
                            'if(currentTrackSegmentId >= trackOrder.length) {'
                                'currentTrackSegmentId = 0;'
                                'lastLapTime = time;'
                                'time = 0;'
                            '}'

                            'getTrackSegmentInfo();'
                        '}'
                    '}'

                    'function draw() {'
                        'context.clearRect(0, 0, canvas.width, canvas.height);'

                        'context.fillStyle = "black";'
                        'context.fillRect(0, 0, canvas.width, canvas.height);'

                        'drawTrack();'
                        'drawCar();'
                        'drawTimer();'
                    '}'

                    'function drawTrack() {'
                        'for(let row = 0; row < gridNumRows; row++) {'
                            'for(let col = 0; col < gridNumCols; col++) {'
                                'const gridCell = trackOrder.contains(getGridRowColToId(row, col)) ? 1 : 0;'
                                'context.fillStyle = "rgb(" + gridCell * 100 + ", 100, 100)";'
                                'context.fillRect(col * gridCellSizeX, row * gridCellSizeY, gridCellSizeX, gridCellSizeY);'
                            '}'
                        '}'
                    '}'

                    'function lerp(min, max, s) {'
                        'if(min > max) return max + (min - max) * (1 - s);'
                        'return min + (max - min) * s;'
                    '}'

                    'function getCarPosition() {'
                        'let [prevGridRow, prevGridCol] = getGridIdToRowCol(trackOrder[(currentTrackSegmentId + trackOrder.length - 1) % trackOrder.length]);'
                        'let [gridRow, gridCol] = getGridIdToRowCol(trackOrder[currentTrackSegmentId]);'
                        'let [nextGridRow, nextGridCol] = getGridIdToRowCol(trackOrder[(currentTrackSegmentId + 1) % trackOrder.length]);'

                        'let gridLeastX = gridCol * gridCellSizeX;'
                        'let gridLeastY = gridRow * gridCellSizeY;'
                        'let gridMostX = (gridCol + 1) * gridCellSizeX;'
                        'let gridMostY = (gridRow + 1) * gridCellSizeY;'
                        'let gridCenterX = (gridLeastX + gridMostX) / 2;'
                        'let gridCenterY = (gridLeastY + gridMostY) / 2;'

                        'let segmentStartX, segmentStartY, segmentEndX, segmentEndY;'

                        'if(gridCol < prevGridCol) {'
                            'segmentStartX = gridMostX;'
                        '}'
                        'else if(gridCol > prevGridCol) {'
                            'segmentStartX = gridLeastX;'
                        '}'
                        'else {'
                            'segmentStartX = gridCenterX;'
                        '}'

                        'if(gridRow < prevGridRow) {'
                            'segmentStartY = gridMostY;'
                        '}'
                        'else if(gridRow > prevGridRow) {'
                            'segmentStartY = gridLeastY;'
                        '}'
                        'else {'
                            'segmentStartY = gridCenterY;'
                        '}'

                        'if(gridCol < nextGridCol) {'
                            'segmentEndX = gridMostX;'
                        '}'
                        'else if(gridCol > nextGridCol) {'
                            'segmentEndX = gridLeastX;'
                        '}'
                        'else {'
                            'segmentEndX = gridCenterX;'
                        '}'

                        'if(gridRow < nextGridRow) {'
                            'segmentEndY = gridMostY;'
                        '}'
                        'else if(gridRow > nextGridRow) {'
                            'segmentEndY = gridLeastY;'
                        '}'
                        'else {'
                            'segmentEndY = gridCenterY;'
                        '}'

                        'if(segmentStartX != segmentEndX && segmentStartY != segmentEndY) {'
                            'let circleCenterX, circleCenterY;'
                            'let thetaStart, thetaEnd;'
                            'if(segmentStartX == gridCenterX && segmentStartY == gridMostY && segmentEndX == gridMostX && segmentEndY == gridCenterY) {'
                                'circleCenterX = gridMostX;'
                                'circleCenterY = gridMostY;'
                                'thetaStart = Math.PI;'
                                'thetaEnd = 3 * Math.PI / 2;'
                            '}'
                            'else if(segmentStartX == gridLeastX && segmentStartY == gridCenterY && segmentEndX == gridCenterX && segmentEndY == gridMostY) {'
                                'circleCenterX = gridLeastX;'
                                'circleCenterY = gridMostY;'
                                'thetaStart = 3 * Math.PI / 2;'
                                'thetaEnd = 2 * Math.PI;'
                            '}'
                            'else if(segmentStartX == gridMostX && segmentStartY == gridCenterY && segmentEndX == gridCenterX && segmentEndY == gridLeastY) {'
                                'circleCenterX = gridMostX;'
                                'circleCenterY = gridLeastY;'
                                'thetaStart = Math.PI / 2;'
                                'thetaEnd = Math.PI;'
                            '}'
                            'else if(segmentStartX == gridCenterX && segmentStartY == gridLeastY && segmentEndX == gridLeastX && segmentEndY == gridCenterY) {'
                                'circleCenterX = gridLeastX;'
                                'circleCenterY = gridLeastY;'
                                'thetaStart = 0;'
                                'thetaEnd = Math.PI / 2;'
                            '}'
                            'else if(segmentStartX == gridMostX && segmentStartY == gridCenterY && segmentEndX == gridCenterX && segmentEndY == gridMostY) {'
                                'circleCenterX = gridMostX;'
                                'circleCenterY = gridMostY;'
                                'thetaStart = 3 * Math.PI / 2;'
                                'thetaEnd = Math.PI;'
                            '}'
                            'else if(segmentStartX == gridCenterX && segmentStartY == gridMostY && segmentEndX == gridLeastX && segmentEndY == gridCenterY) {'
                                'circleCenterX = gridLeastX;'
                                'circleCenterY = gridMostY;'
                                'thetaStart = 2 * Math.PI;'
                                'thetaEnd = 3* Math.PI / 2;'
                            '}'
                            'else if(segmentStartX == gridCenterX && segmentStartY == gridLeastY && segmentEndX == gridMostX && segmentEndY == gridCenterY) {'
                                'circleCenterX = gridMostX;'
                                'circleCenterY = gridLeastY;'
                                'thetaStart = Math.PI;'
                                'thetaEnd = Math.PI / 2;'
                            '}'
                            'else if(segmentStartX == gridLeastX && segmentStartY == gridCenterY && segmentEndX == gridCenterX && segmentEndY == gridLeastY) {'
                                'circleCenterX = gridLeastX;'
                                'circleCenterY = gridLeastY;'
                                'thetaStart = Math.PI / 2;'
                                'thetaEnd = 0;'
                            '}'

                            'let theta = lerp(thetaStart, thetaEnd, currentTrackSegmentProgress);'
                            'let x = circleCenterX + Math.cos(theta) * gridCellSizeX / 2;'
                            'let y = circleCenterY + Math.sin(theta) * gridCellSizeY / 2;'
                            'return [x, y];'
                        '}'
                        'else {'
                            'let x = lerp(segmentStartX, segmentEndX, currentTrackSegmentProgress);'
                            'let y = lerp(segmentStartY, segmentEndY, currentTrackSegmentProgress);'
                            'return [x, y];'
                        '}'
                    '}'

                    'function drawCar() {'
                        'let [x, y] = getCarPosition();'
                        'context.fillStyle = "rgb(255, 255, 255)";'
                        'context.fillRect(x, y, 10, 10);'
                    '}'

                    'function drawTimer() {'
                        'context.font = "18px serif";'
                        'context.textBaseline = "hanging";'
                        'context.fillStyle = "rgb(255,255,0)";'
                        'context.strokeStyle = "rgb(255,255,0)";'
                        'context.fillText("Time: " + time.toFixed(2) + "s" + (lastLapTime != null ? " | Last: " + lastLapTime.toFixed(2) + "s" : ""), 10, 20);'
                    '}'
                '</script>'
            '</body>'
        );

        return animation;
    }

    function withdraw() external onlyOwner {
        require(payable(msg.sender).send(address(this).balance));
    }

    function _startTokenId() internal view virtual override returns (uint256) {
        return 1;
    }
}
