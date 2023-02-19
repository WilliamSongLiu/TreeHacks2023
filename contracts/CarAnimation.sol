//SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;

contract CarAnimation {
    function makeAnimation() public view returns (string memory animation) {
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
                    'let canvas=document.createElement("canvas"),context,fps=60,time=0,gridNumRows=8,gridNumCols=8,gridCellSizeX,gridCellSizeY,trackOrder,currentTrackSegmentId=0,currentTrackSegmentProgress=.5,currentTrackSegmentLength,distanceToNextCurve,lastLapTime=null,straightTopSpeed=6,curveTopSpeed=1,acceleration=3,braking=10,speed=0;function getGridIdToRowCol(e){return[Math.floor(e/gridNumCols),e%gridNumCols]}function getGridRowColToId(e,r){return r+e*gridNumCols}function startGame(){context=canvas.getContext("2d"),document.body.insertBefore(canvas,document.body.childNodes[0]),canvas.width=window.innerWidth,canvas.height=window.innerHeight,gridCellSizeX=canvas.width/gridNumCols,gridCellSizeY=canvas.height/gridNumRows,generateTrack(),getTrackSegmentInfo(),runFrame()}function shuffle(e){let r=e.length,t;for(;0!=r;)t=Math.floor(Math.random()*r),r--,[e[r],e[t]]=[e[t],e[r]];return e}function generateTrack(){var e,r;let t=getGridRowColToId(0,0),n=getGridRowColToId(gridNumRows-1,gridNumCols-1);trackOrder=(e=t,function e(r,t){if(r.visited.push(r.id),r.id===t)return r;let[n,i]=getGridIdToRowCol(r.id),o=[];for(let c=-1;c<=1;c++)for(let d=-1;d<=1;d++){if(0!=c&&0!=d)continue;let l=n+c,a=i+d;if(l<0||l>=gridNumRows||a<0||a>=gridNumCols)continue;let g=getGridRowColToId(l,a);r.visited.includes(g)||o.push(g)}shuffle(o);for(let s=0;s<o.length;s++){let u=e({id:o[s],visited:r.visited},t);if(null!=u)return u}return null}({id:e,visited:[]},r=n)).visited}function runFrame(){runPhysics(),draw(),time+=1/fps,setTimeout(function(){requestAnimationFrame(runFrame)},1e3/fps)}function getTrackIsCurve(e){let[r,t]=getGridIdToRowCol(trackOrder[(e+trackOrder.length-1)%trackOrder.length]),[n,i]=getGridIdToRowCol(trackOrder[e]),[o,c]=getGridIdToRowCol(trackOrder[(e+1)%trackOrder.length]);return(i==t||i==c)&&(n==r||n==o)}function getTrackSegmentInfo(){currentTrackSegmentLength=getTrackIsCurve(currentTrackSegmentId)?100:2*Math.PI*50;let e=currentTrackSegmentId;for(let r=0;r<trackOrder.length;r++){if(getTrackIsCurve(e)){distanceToNextCurve=100*r;break}e=(e+1)%trackOrder.length}}function runPhysics(){let e=!1;(e=!(speed<curveTopSpeed)&&!((curveTopSpeed-speed)/braking<0)&&curveTopSpeed<=Math.sqrt(Math.pow(speed,2)+2*braking*distanceToNextCurve))?speed-=braking/fps:(0==distanceToNextCurve&&speed<curveTopSpeed||distanceToNextCurve>0&&speed<straightTopSpeed)&&(speed+=acceleration/fps),(currentTrackSegmentProgress+=speed/currentTrackSegmentLength)>=1&&(currentTrackSegmentProgress=0,++currentTrackSegmentId>=trackOrder.length&&(currentTrackSegmentId=0,lastLapTime=time,time=0),getTrackSegmentInfo())}function draw(){context.clearRect(0,0,canvas.width,canvas.height),context.fillStyle="black",context.fillRect(0,0,canvas.width,canvas.height),drawTrack(),drawCar(),drawTimer()}function drawTrack(){for(let e=0;e<gridNumRows;e++)for(let r=0;r<gridNumCols;r++){let t=trackOrder.includes(getGridRowColToId(e,r))?1:0;context.fillStyle="rgb("+100*t+", 100, 100)",context.fillRect(r*gridCellSizeX,e*gridCellSizeY,gridCellSizeX,gridCellSizeY)}}function lerp(e,r,t){return e>r?r+(e-r)*(1-t):e+(r-e)*t}function getCarPosition(){let[e,r]=getGridIdToRowCol(trackOrder[(currentTrackSegmentId+trackOrder.length-1)%trackOrder.length]),[t,n]=getGridIdToRowCol(trackOrder[currentTrackSegmentId]),[i,o]=getGridIdToRowCol(trackOrder[(currentTrackSegmentId+1)%trackOrder.length]),c=n*gridCellSizeX,d=t*gridCellSizeY,l=(n+1)*gridCellSizeX,a=(t+1)*gridCellSizeY,g=(c+l)/2,s=(d+a)/2,u,T,f,k;if(u=n<r?l:n>r?c:g,T=t<e?a:t>e?d:s,f=n<o?l:n>o?c:g,k=t<i?a:t>i?d:s,u!=f&&T!=k){let m,$,C,S;u==g&&T==a&&f==l&&k==s?(m=l,$=a,C=Math.PI,S=3*Math.PI/2):u==c&&T==s&&f==g&&k==a?(m=c,$=a,C=3*Math.PI/2,S=2*Math.PI):u==l&&T==s&&f==g&&k==d?(m=l,$=d,C=Math.PI/2,S=Math.PI):u==g&&T==d&&f==c&&k==s?(m=c,$=d,C=0,S=Math.PI/2):u==l&&T==s&&f==g&&k==a?(m=l,$=a,C=3*Math.PI/2,S=Math.PI):u==g&&T==a&&f==c&&k==s?(m=c,$=a,C=2*Math.PI,S=3*Math.PI/2):u==g&&T==d&&f==l&&k==s?(m=l,$=d,C=Math.PI,S=Math.PI/2):u==c&&T==s&&f==g&&k==d&&(m=c,$=d,C=Math.PI/2,S=0);let I=lerp(C,S,currentTrackSegmentProgress);return[m+Math.cos(I)*gridCellSizeX/2,$+Math.sin(I)*gridCellSizeY/2]}{let p=lerp(u,f,currentTrackSegmentProgress),h=lerp(T,k,currentTrackSegmentProgress);return[p,h]}}function drawCar(){let[e,r]=getCarPosition();context.fillStyle="rgb(255, 255, 255)",context.fillRect(e,r,10,10)}function drawTimer(){context.font="18px serif",context.textBaseline="hanging",context.fillStyle="rgb(255,255,0)",context.strokeStyle="rgb(255,255,0)",context.fillText("Time: "+time.toFixed(2)+"s"+(null!=lastLapTime?" | Last: "+lastLapTime.toFixed(2)+"s":""),10,20)}'
                '</script>'
            '</body>'
        );

        return animation;
    }
}
