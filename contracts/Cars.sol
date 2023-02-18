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

                    'let x = 0;'

                    'function startGame() {'
                        'context = canvas.getContext("2d");'
                        'document.body.insertBefore(canvas, document.body.childNodes[0]);'

                        'canvas.width  = window.innerWidth;'
                        'canvas.height = window.innerHeight;'

                        'time = 0;'
                        'runFrame();'
                    '}'

                    'function runFrame() {'
                        'time += 1 / fps;'
                        'draw();'

                        'setTimeout(function() {'
                            'requestAnimationFrame(runFrame);'
                        '}, 1000 / fps);'
                    '}'

                    'function draw() {'
                        'context.clearRect(0, 0, canvas.width, canvas.height);'

                        'context.fillStyle = "blue";'
                        'context.fillRect(0, 0, canvas.width, canvas.height);'

                        'context.beginPath();'
                        'context.arc(x, 100, 20, 0, 2 * Math.PI);'
                        'context.closePath();'
                        'context.fillStyle = "rgb(255, 0, 0)";'
                        'context.fill();'

                        'context.font = "48px serif";'
                        'context.textBaseline = "hanging";'
                        'context.fillStyle = "rgb(255,255,0)";'
                        'context.strokeStyle = "rgb(255,255,0)";'
                        'context.fillText("Timer: " + time.toFixed(2) + "s", 10, 50);'

                        'x += 100 / fps;'
                        'if(x > canvas.width) {'
                            'x = 0;'
                        '}'
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
