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

                    'let gridSizeX = 3, gridSizeY = 3;'
                    'let gridCellSizeX, gridCellSizeY;'
                    'let track = [[2, 1, 3], [0, 6, 0], [5, 1, 4]];'

                    'let trackOrder = [0, 1, 2, 5, 9, 8, 7, 3];'
                    'let currentTrackSegmentId = 0;'
                    'let currentTrackSegmentProgress = 0;'

                    'let speed = 1;'

                    'function getGridIdToXY(gridId) {'
                        'return [gridId % gridSizeX, Math.floor(gridId / gridSizeX)];'
                    '}'

                    'function getGridXYToId(gridX, gridY) {'
                        'return gridX + gridY * gridSizeX;'
                    '}'

                    'function getPreviousTrackSegmentId() {'
                        'let id = currentTrackSegmentId - 1;'
                        'if(id < 0) {'
                            'id = trackOrder.length - 1;'
                        '}'
                        'return id;'
                    '}'

                    'function getNextTrackSegmentId() {'
                        'let id = currentTrackSegmentId + 1;'
                        'if(id >= trackOrder.length) {'
                            'id = 0;'
                        '}'
                        'return id;'
                    '}'

                    'function lerp(min, max, s) {'
                        'return min + (max - min) * s;'
                    '}'

                    'function startGame() {'
                        'context = canvas.getContext("2d");'
                        'document.body.insertBefore(canvas, document.body.childNodes[0]);'

                        'canvas.width  = window.innerWidth;'
                        'canvas.height = window.innerHeight;'

                        'gridCellSizeX = canvas.width / gridSizeX;'
                        'gridCellSizeY = canvas.height / gridSizeY;'

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
                        'for(let y = 0; y < gridSizeY; y++) {'
                            'for(let x = 0; x < gridSizeX; x++) {'
                                'const gridCell = track[y][x];'
                                'context.fillStyle = "rgb(" + gridCell * 40 + ", 100, 100)";'
                                'context.fillRect(x * gridCellSizeX, y * gridCellSizeY, gridCellSizeX, gridCellSizeY);'
                            '}'
                        '}'
                    '}'

                    'function getCarPosition() {'
                        'let [gridX, gridY] = getGridIdToXY(currentTrackSegmentId);'
                        'let [prevGridX, prevGridY] = getGridIdToXY(getPreviousTrackSegmentId());'
                        'let [nextGridX, nextGridY] = getGridIdToXY(getNextTrackSegmentId());'

                        'let gridLeastX = gridX * gridCellSizeX;'
                        'let gridLeastY = gridY * gridCellSizeY;'
                        'let gridMostX = (gridX + 1) * gridCellSizeX;'
                        'let gridMostY = (gridY + 1) * gridCellSizeY;'
                        'let gridCenterX = (gridLeastX + gridMostX) / 2;'
                        'let gridCenterY = (gridLeastY + gridMostY) / 2;'

                        'let segmentStartX, segmentStartY, segmentEndX, segmentEndY;'

                        'if(gridX < prevGridX) {'
                            'segmentStartX = gridMostX;'
                        '}'
                        'else if(gridX > prevGridX) {'
                            'segmentStartX = gridLeastX;'
                        '}'
                        'else {'
                            'segmentStartX = gridCenterX;'
                        '}'
                        'if(gridY < prevGridY) {'
                            'segmentStartY = gridMostY;'
                        '}'
                        'else if(gridY > prevGridY) {'
                            'segmentStartY = gridLeastY;'
                        '}'
                        'else {'
                            'segmentStartY = gridCenterY;'
                        '}'

                        'if(gridX < nextGridX) {'
                            'segmentEndX = gridMostX;'
                        '}'
                        'else if(gridX > nextGridX) {'
                            'segmentEndX = gridLeastX;'
                        '}'
                        'else {'
                            'segmentEndX = gridCenterX;'
                        '}'
                        'if(gridY < nextGridY) {'
                            'segmentEndY = gridMostY;'
                        '}'
                        'else if(gridY > nextGridY) {'
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
