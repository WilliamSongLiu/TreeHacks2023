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

        string memory name = string(abi.encodePacked("Animation #", utils.uint2str(tokenId)));
        string memory image = makeImage(tokenId);
        string memory animation = makeAnimation(tokenId);

        string memory json = string(
            abi.encodePacked(
                '{'
                    '"name": "', name, '",'
                    '"description": "Animation",'
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
                    'let track = [[2, 1, 3], [0, 6, 0], [5, 1, 4]];'

                    'let trackOrder = [0, 1, 2, 5, 8, 7, 6, 3];'
                    'let currentTrackSegmentId = 0;'
                    'let currentTrackSegmentProgress = 0.5;'

                    'let speed = 1;'

                    'function getGridIdToRowCol(gridId) {'
                        'return [Math.floor(gridId / gridNumCols), gridId % gridNumCols];'
                    '}'

                    'function getGridRowColToId(gridRow, gridCol) {'
                        'return gridCol + gridRow * gridNumCols;'
                    '}'

                    'function lerp(min, max, s) {'
                        'return min + (max - min) * s;'
                    '}'

                    'function startGame() {'
                        'context = canvas.getContext("2d");'
                        'document.body.insertBefore(canvas, document.body.childNodes[0]);'

                        'canvas.width  = window.innerWidth;'
                        'canvas.height = window.innerHeight;'

                        'gridCellSizeX = canvas.width / gridNumCols;'
                        'gridCellSizeY = canvas.height / gridNumRows;'

                        'for(let i = 0; i < gridNumRows * gridNumCols; i++) {'
                            'let a = getGridIdToRowCol(i);'
                            'let b = getGridRowColToId(a[0], a[1]);'
                            'console.log(i + " " + a + " " + b);'
                        '}'

                        'runFrame();'
                    '}'

                    'function runFrame() {'
                        'moveCar();'
                        'draw();'

                        'time += 1 / fps;'

                        'setTimeout(function() {'
                            'requestAnimationFrame(runFrame);'
                        '}, 1000 / fps);'
                    '}'

                    'function moveCar() {'
                        'currentTrackSegmentProgress += speed / 100;'
                        'if(currentTrackSegmentProgress >= 1) {'
                            'currentTrackSegmentProgress = 0;'
                            'currentTrackSegmentId++;'
                            'if(currentTrackSegmentId >= trackOrder.length) {'
                                'currentTrackSegmentId = 0;'
                            '}'
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
                                'const gridCell = track[row][col];'
                                'context.fillStyle = "rgb(" + gridCell * 40 + ", 100, 100)";'
                                'context.fillRect(col * gridCellSizeX, row * gridCellSizeY, gridCellSizeX, gridCellSizeY);'
                            '}'
                        '}'
                    '}'

                    'function getCarPosition() {'
                        'let [prevGridRow, prevGridCol] = getGridIdToRowCol((currentTrackSegmentId + trackOrder.length - 1) % trackOrder.length);'
                        'let [gridRow, gridCol] = getGridIdToRowCol(currentTrackSegmentId);'
                        'let [nextGridRow, nextGridCol] = getGridIdToRowCol((currentTrackSegmentId + 1) % trackOrder.length);'

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

                        'let x = lerp(segmentStartX, segmentEndX, currentTrackSegmentProgress);'
                        'let y = lerp(segmentStartY, segmentEndY, currentTrackSegmentProgress);'

                        'return [x, y];'
                    '}'

                    'function drawCar() {'
                        'let [x, y] = getCarPosition();'
                        'context.fillStyle = "rgb(255, 255, 255)";'
                        'context.fillRect(x, y, 10, 10);'
                    '}'

                    'function drawTimer() {'
                        'context.font = "48px serif";'
                        'context.textBaseline = "hanging";'
                        'context.fillStyle = "rgb(255,255,0)";'
                        'context.strokeStyle = "rgb(255,255,0)";'
                        'context.fillText("Timer: " + time.toFixed(2) + "s", 10, 50);'
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
