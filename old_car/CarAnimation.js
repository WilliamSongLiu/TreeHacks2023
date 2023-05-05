let canvas = document.createElement("canvas");
let context;

let svgDataType = "data:image/svg+xml;base64,";

let carLeftImg = new Image();
carLeftImg.src = svgDataType + "PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iVVRGLTgiPz48c3ZnIGlkPSJhIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI1MDAiIGhlaWdodD0iNTAwIiB2aWV3Qm94PSIwIDAgNTAwIDUwMCI+PGRlZnM+PHN0eWxlPi5ie2ZpbGw6bm9uZTt9LmN7ZmlsbDojMDEwMTAxO30uZCwuZXtmaWxsOiNlYzIyMjc7fS5me2ZpbGw6I2ZlZmFkNzt9Lmd7ZmlsbDojMjMxZjIwO30uaHtmaWxsOiM0ZTRlNGU7fS5le3N0cm9rZTojMjMxZjIwO3N0cm9rZS1taXRlcmxpbWl0OjEwO308L3N0eWxlPjwvZGVmcz48cGF0aCBjbGFzcz0iYiIgZD0ibTQ1My40LDE2My45djE3Mi4xcy00MDQuNywwLTQwNC43LDB2LTE3Mi4xczQwNC43LDAsNDA0LjcsMFptLTIyLjYsNzguMWMyLjgtMTAxLjEtMTEyLjktNjkuNC0xNzguNC03Mi4zLTEwMC45LTE2LjktMjgwLjUsMTUuNS0xNzIuMiwxNDMuNCwzOS4zLDI4LjcsOTAuMyw2LjYsMTM1LjEsMTYuNyw3OC4zLTYsMjE2LjIsMjQuNywyMTYuOC02NS4yLjgsMTMuOC0xMi4yLDMxLjksNC43LDM5LjQsMzguMy0zMy41LTEyLjYtMTgzLTYtNjJaIi8+PHBhdGggY2xhc3M9ImMiIGQ9Im00MzAuOCwyNDIuMWMtNS45LTEyMC40LDQ0LjQsMjguMiw2LjIsNjEuNi0yMC05LjQsMS41LTMyLjItNi4yLTQ3LjktMS44LDE2LjYtMi4yLDM2LjEtMTIuNiw0OS44LTc2LjQsNTMuMy0xODIuOCw5LjgtMjcxLjEsMjEuMy04NywyMy42LTEzNi4yLTEwNi45LTU4LjQtMTQ3LjgsNjUuNS0yMi41LDE0MS45LTQuMywyMTEuMi05LjYsNTcuNy05LDEzNS43LTUsMTMwLjksNzIuNlptLTM0NC40LDc0LjFjNzAsMjYuNCwxNTMuMiw0LjQsMjI4LDExLjcsNTUsMTUuNSwxMjEtOC45LDExNS40LTc0LjIsMTEuMywxMy0xMy43LDQzLjgsOC40LDQ5LjIsMTUtMjAuMiwyMS4yLTEwOC4xLTYuNy0xMDQtNi45LDIuMiw3LDUwLjItMS40LDQzLjMsNS45LTU5LjktNTguMS04Ny41LTEwOS03Mi40LTc2LjgsOS0xNjIuMi0xNS0yMzQuNCwxMS44LDUuOS0xLjMsMTEuOC0yLjUsMTcuNC00LjYtNC40LDUuMi0xMy42LDEyLjctMTguMSwyMC4yLTExLjksMTAuNS0zMi45LDUuOS0zMi4yLDI3LjItNC4xLDMzLjgtNy4yLDY4LjcsMzIuMiw3Ni40LDEyLjIsMTQuNiwyOC45LDI0LjQuNCwxNS40Wm0tMjYtMTA5YzI5LjYtOS44LDIwLTguNSwzOS44LTI3LjYtMTguMSwxLjgtMzIsMTEtMzkuOCwyNy42Wm00MS4xLDExMS42Yy0xMS45LTEzLjMtMjQuMS0yMi42LTQxLjItMjguMyw5LjUsMTkuOCwyMSwyMy45LDQxLjIsMjguM1oiLz48cGF0aCBjbGFzcz0iZSIgZD0ibTg2LjUsMzE2LjJjMjguOSw4LjQsMTAuNi0xLS43LTE1LjYtMzgtMTYuNS0yOS41LTEwLTM0LjYtNTAuNy0uOC0zMy4zLDUuNS00MS44LDM0LjYtNTIuOSwxNy0zMi40LDIzLjQtMjcuNSw4OC4zLTI1LjUsNDcuNS00LjcsOTQuOS45LDE0Mi41LTEuMyw1My44LTE1LjMsMTE5LjksOS41LDExMy41LDc0LjEtMS45LTEyMy4zLDM5LjgsMTguMiw3LjksNTguNC0yMi4xLTUuNywyLjktMzUuNy04LjQtNDkuMiw0LjgsMTAwLjMtMTA0LjUsNzMuMS0xNjkuOCw3My44LTU2LjMtMy44LTEyMi44LDExLjUtMTczLjMtMTEuMVptMjc0LjctODIuOWM5LjEtODMuNC0xMDItNDguMS0xNTQuNC01Ni41LTYxLjYtOC4yLTQ4LjQsMTA4LjctMjcsMTQxLjEsMzcuMiwxMS4zLDgyLDEuMSwxMjEuMS0xLDcxLjcsMTAuMyw1OC0zMS42LDYwLjMtODMuNloiLz48cGF0aCBjbGFzcz0iZiIgZD0ibTYwLjUsMjA3LjJjNy43LTE2LjYsMjEuNy0yNS43LDM5LjctMjcuNS0xOS41LDE4LjktMTAuOSwxOC4zLTM5LjcsMjcuNVoiLz48cGF0aCBjbGFzcz0iZiIgZD0ibTEwMS42LDMxOC44Yy0yMC4yLTQuNC0zMS43LTguNS00MS4yLTI4LjMsMTcsNS42LDI5LjMsMTUuMSw0MS4yLDI4LjNaIi8+PHBhdGggY2xhc3M9ImMiIGQ9Im0zNjEuMSwyMzMuM2MtMS42LDUxLjgsMTAuNiw5My45LTYwLjIsODMuNC0zOS4xLDIuMS04My44LDEyLjItMTIxLjEsMS0yMS43LTM1LjItMzUuMS0xNTAuMiwyOS4yLTE0MS4zLDUxLjcsOC4yLDE2Mi4xLTI1LjYsMTUyLjEsNTYuOVptLTE1My4zLTUyLjJjOC4zLDUuOCw0NS0uNSwzNy4xLDEzLjMtMzYuOSw4NS41LDM1LjcsMTE3LjYtMjkuNiwxMjEuNi01Ni42LDEwLjQsNjMuOSwzLjgsODcuNS0uMiw1MC44LDcuOCw1OS42LTEyLjksNTcuMi01OS42LDYuNy00OC44LTguNC04Ny4zLTY0LjYtNzQuNC0yNi4xLTMuNi05Ny4yLTgtODcuNi0uN1ptLTQzLjYsNzMuNGMxLjUsNTQuMSw5LjksNzIuMyw2NS42LDUzLjIsMTEtMjkuNS0xMi02OS41LDQuNS0xMDYuMi40LTMuNiwyLjgtOS43LTIuNC0xMC41LTU4LjQtMjQuOC03MS41LDEwLjItNjcuNyw2My41Wm0xOS40LTc0LjVjMTMuOCw3LjgsNTYuMS0uNSw1MSwyMi0yNy40LDcxLjIsNDMuMywxMDguNy01MC41LDExNS42LDE4LjguOCw0Ni4yLTQuMSw2Mi41LTkuNy00Ni4xLTc1LjgsNTAuOC0xMzAuMS02My0xMjcuOVoiLz48cGF0aCBjbGFzcz0iZyIgZD0ibTIwNy44LDE4MS4yYy05LTguMiw2MS4yLTIuOCw4Ny41LjQsNTYtMTIuOCw3MS40LDI1LjUsNjQuNiw3NC40LDIuNCw0Ni43LTYuNCw2Ny40LTU3LjIsNTkuNi0yMy40LDQuNC0xNDQuMywxMC4yLTg3LjUuMiw2NC43LTMuMy03LTM5LDI5LjYtMTIxLjYsNy40LTEzLjctMjkuMy04LjEtMzctMTNaIi8+PHBhdGggY2xhc3M9ImgiIGQ9Im0xNjQuMiwyNTQuNmMxLjMtMjEuNi0yLjUtNzkuOCwzMC40LTcxLjEsMTIsNS4yLDQ0LjktLjMsNDAsMTguNC05LjUsMzcuMy03LjEsNjMuMiwxLDEwMC4xLDEuMSwzLjktMi41LDUuNy01LjgsNS45LTU2LjUsMTkuNS02MywwLTY1LjYtNTMuM1oiLz48cGF0aCBjbGFzcz0iZCIgZD0ibTE4My43LDE4MC4xYzExNC4xLTIuNSwxNi44LDUwLjMsNjMsMTI3LjctMTMuOSw1LjMtNDUuMywxMC42LTYyLjUsOS43LDkzLjctNi45LDIzLjEtNDQuNiw1MC41LTExNS42LDUuMS0yMi4zLTM3LjYtMTQuNi01MS0yMS44WiIvPjwvc3ZnPg==";

let carRightImg = new Image();
carRightImg.src = svgDataType + "PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iVVRGLTgiPz48c3ZnIGlkPSJhIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI1MDAiIGhlaWdodD0iNTAwIiB2aWV3Qm94PSIwIDAgNTAwIDUwMCI+PGRlZnM+PHN0eWxlPi5ie2ZpbGw6bm9uZTt9LmMsLmR7ZmlsbDojZWIyMDI3O30uZXtmaWxsOiNmZGY5ZDY7fS5me2ZpbGw6IzIyMWYxZjt9Lmd7ZmlsbDojNGQ0ZTRlO30uZHtzdHJva2U6IzIyMWYxZjtzdHJva2UtbWl0ZXJsaW1pdDoxMDt9PC9zdHlsZT48L2RlZnM+PHBhdGggY2xhc3M9ImIiIGQ9Im00Ni42LDMzNi4xdi0xNzIuMXM0MDQuNywwLDQwNC43LDB2MTcyLjFzLTQwNC43LDAtNDA0LjcsMFptMjIuNi03OC4xYy0yLjgsMTAxLjEsMTEyLjksNjkuNCwxNzguNCw3Mi4zLDEwMC45LDE2LjksMjgwLjUtMTUuNSwxNzIuMi0xNDMuNC0zOS4zLTI4LjctOTAuMy02LjYtMTM1LjEtMTYuNy03OC4zLDYtMjE2LjItMjQuNy0yMTYuOCw2NS4yLS44LTEzLjgsMTIuMi0zMS45LTQuNy0zOS40LTM4LjMsMzMuNSwxMi42LDE4Myw2LDYyWiIvPjxwYXRoIGQ9Im02OS4yLDI1Ny45YzUuOSwxMjAuNC00NC40LTI4LjItNi4yLTYxLjYsMjAsOS40LTEuNSwzMi4yLDYuMiw0Ny45LDEuOC0xNi42LDIuMi0zNi4xLDEyLjYtNDkuOCw3Ni40LTUzLjMsMTgyLjgtOS44LDI3MS4xLTIxLjMsODctMjMuNiwxMzYuMiwxMDYuOSw1OC40LDE0Ny44LTY1LjUsMjIuNS0xNDEuOSw0LjMtMjExLjIsOS42LTU3LjcsOS0xMzUuNyw1LTEzMC45LTcyLjZabTM0NC40LTc0LjFjLTcwLTI2LjQtMTUzLjItNC40LTIyOC0xMS43LTU1LTE1LjUtMTIxLDguOS0xMTUuNCw3NC4yLTExLjMtMTMsMTMuNy00My44LTguNC00OS4yLTE1LDIwLjItMjEuMiwxMDguMSw2LjcsMTA0LDYuOS0yLjItNy01MC4yLDEuNC00My4zLTUuOSw1OS45LDU4LjEsODcuNSwxMDksNzIuNCw3Ni44LTksMTYyLjIsMTUsMjM0LjQtMTEuOC01LjksMS4zLTExLjgsMi41LTE3LjQsNC42LDQuNC01LjIsMTMuNi0xMi43LDE4LjEtMjAuMiwxMS45LTEwLjUsMzIuOS01LjksMzIuMi0yNy4yLDQuMS0zMy44LDcuMi02OC43LTMyLjItNzYuNC0xMi4yLTE0LjYtMjguOS0yNC40LS40LTE1LjRabTI2LDEwOWMtMjkuNiw5LjgtMjAsOC41LTM5LjgsMjcuNiwxOC4xLTEuOCwzMi0xMSwzOS44LTI3LjZabS00MS4xLTExMS42YzExLjksMTMuMywyNC4xLDIyLjYsNDEuMiwyOC4zLTkuNS0xOS44LTIxLTIzLjktNDEuMi0yOC4zWiIvPjxwYXRoIGNsYXNzPSJkIiBkPSJtNDEzLjUsMTgzLjhjLTI4LjktOC40LTEwLjYsMSwuNywxNS42LDM4LDE2LjUsMjkuNSwxMCwzNC42LDUwLjcuOCwzMy4zLTUuNSw0MS44LTM0LjYsNTIuOS0xNywzMi40LTIzLjQsMjcuNS04OC4zLDI1LjUtNDcuNSw0LjctOTQuOS0uOS0xNDIuNSwxLjMtNTMuOCwxNS4zLTExOS45LTkuNS0xMTMuNS03NC4xLDEuOSwxMjMuMy0zOS44LTE4LjItNy45LTU4LjQsMjIuMSw1LjctMi45LDM1LjcsOC40LDQ5LjItNC44LTEwMC4zLDEwNC41LTczLjEsMTY5LjgtNzMuOCw1Ni4zLDMuOCwxMjIuOC0xMS41LDE3My4zLDExLjFabS0yNzQuNyw4Mi45Yy05LjEsODMuNCwxMDIsNDguMSwxNTQuNCw1Ni41LDYxLjYsOC4yLDQ4LjQtMTA4LjcsMjctMTQxLjEtMzcuMi0xMS4zLTgyLTEuMS0xMjEuMSwxLTcxLjctMTAuMy01OCwzMS42LTYwLjMsODMuNloiLz48cGF0aCBjbGFzcz0iZSIgZD0ibTQzOS41LDI5Mi44Yy03LjcsMTYuNi0yMS43LDI1LjctMzkuNywyNy41LDE5LjUtMTguOSwxMC45LTE4LjMsMzkuNy0yNy41WiIvPjxwYXRoIGNsYXNzPSJlIiBkPSJtMzk4LjQsMTgxLjJjMjAuMiw0LjQsMzEuNyw4LjUsNDEuMiwyOC4zLTE3LTUuNi0yOS4zLTE1LjEtNDEuMi0yOC4zWiIvPjxwYXRoIGQ9Im0xMzguOSwyNjYuN2MxLjYtNTEuOC0xMC42LTkzLjksNjAuMi04My40LDM5LjEtMi4xLDgzLjgtMTIuMiwxMjEuMS0xLDIxLjcsMzUuMiwzNS4xLDE1MC4yLTI5LjIsMTQxLjMtNTEuNy04LjItMTYyLjEsMjUuNi0xNTIuMS01Ni45Wm0xNTMuMyw1Mi4yYy04LjMtNS44LTQ1LC41LTM3LjEtMTMuMywzNi45LTg1LjUtMzUuNy0xMTcuNiwyOS42LTEyMS42LDU2LjYtMTAuNC02My45LTMuOC04Ny41LjItNTAuOC03LjgtNTkuNiwxMi45LTU3LjIsNTkuNi02LjcsNDguOCw4LjQsODcuMyw2NC42LDc0LjQsMjYuMSwzLjYsOTcuMiw4LDg3LjYuN1ptNDMuNi03My40Yy0xLjUtNTQuMS05LjktNzIuMy02NS42LTUzLjItMTEsMjkuNSwxMiw2OS41LTQuNSwxMDYuMi0uNCwzLjYtMi44LDkuNywyLjQsMTAuNSw1OC40LDI0LjgsNzEuNS0xMC4yLDY3LjctNjMuNVptLTE5LjQsNzQuNWMtMTMuOC03LjgtNTYuMS41LTUxLTIyLDI3LjQtNzEuMi00My4zLTEwOC43LDUwLjUtMTE1LjYtMTguOC0uOC00Ni4yLDQuMS02Mi41LDkuNyw0Ni4xLDc1LjgtNTAuOCwxMzAuMSw2MywxMjcuOVoiLz48cGF0aCBjbGFzcz0iZiIgZD0ibTI5Mi4yLDMxOC44YzksOC4yLTYxLjIsMi44LTg3LjUtLjQtNTYsMTIuOC03MS40LTI1LjUtNjQuNi03NC40LTIuNC00Ni43LDYuNC02Ny40LDU3LjItNTkuNiwyMy40LTQuNCwxNDQuMy0xMC4yLDg3LjUtLjItNjQuNywzLjMsNywzOS0yOS42LDEyMS42LTcuNCwxMy43LDI5LjMsOC4xLDM3LDEzWiIvPjxwYXRoIGNsYXNzPSJnIiBkPSJtMzM1LjgsMjQ1LjRjLTEuMywyMS42LDIuNSw3OS44LTMwLjQsNzEuMS0xMi01LjItNDQuOS4zLTQwLTE4LjQsOS41LTM3LjMsNy4xLTYzLjItMS0xMDAuMS0xLjEtMy45LDIuNS01LjcsNS44LTUuOSw1Ni41LTE5LjUsNjMsMCw2NS42LDUzLjNaIi8+PHBhdGggY2xhc3M9ImMiIGQ9Im0zMTYuMywzMTkuOWMtMTE0LjEsMi41LTE2LjgtNTAuMy02My0xMjcuNywxMy45LTUuMyw0NS4zLTEwLjYsNjIuNS05LjctOTMuNyw2LjktMjMuMSw0NC42LTUwLjUsMTE1LjYtNS4xLDIyLjMsMzcuNiwxNC42LDUxLDIxLjhaIi8+PC9zdmc+";

let emptyTrackImg = new Image();
emptyTrackImg.src = svgDataType + "PHN2ZyBkYXRhLW5hbWU9IkxheWVyIDEiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIgd2lkdGg9IjUwMCIgaGVpZ2h0PSI1MDAiIHZpZXdCb3g9IjAgMCA1MDAgNTAwIj48cGF0aCBzdHlsZT0iZmlsbDojMzliNTRhIiBkPSJNLjIgMGg1MDB2NTAwSC4yeiIvPjwvc3ZnPg==";

let bush1Img = new Image();
bush1Img.src = svgDataType + "PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI1MDAiIGhlaWdodD0iNTAwIiB2aWV3Qm94PSIwIDAgNTAwIDUwMCI+PHBhdGggc3R5bGU9ImZpbGw6IzM5YjU0YSIgZD0iTS0uNC0uNGg1MDB2NTAwSC0uNHoiLz48cGF0aCBkPSJNMTg4LjEgMjE3LjZjMjEuOC0yOC4xIDY4LTguNSA3Ny4xIDIyLjIgMTAuOC0xLjIgMjQuMy0yLjkgMzUuNiAzLjEgMzEuNCAxNC45IDE4LjIgMzIuOCA1NS43IDU4LjIgNyA4LjEgMy4xIDE4LjMgMCAyNi4xIDExIDcuMyAxOC4zIDI3LjcgMy45IDM1LjMgMTguOCAyNy43LTEwLjkgMjcuOS0zIDQ5LjEuNyAxMC44LTEwIDI0LjEtMjEuNCAxOC42LTYuOCA2LjEtMjIuMSAxMS41LTI1LjctMi43LTEzLjMgOC4zLTI5LjIgMS0zNy0xMS4zaC0uNGMtNS40IDI2LjEtMjguNSAzNy42LTQyIDkuNC0yMS44IDE4LjMtMzkuNyAxMS4xLTQ1LjctMTYuMS00NC4zIDQwLjUtNzguMi0zLjMtOTctMzMuMy0xOC43IDUuMi0zNC0xMC41LTM3LTI3LjgtMi41LTEzLjkgNC4yLTI3LjIgMTIuOC0zNy43LTEyLjctMjMuNi0xMy44LTY2LjMgMjUuOS02Ni4zLTEuNi00LjktMS4xLTkuNyA0LjktMTAuNC0xMi4xLTM0LjggNjAuNi02MS42IDYyLjktMTguMSAxMC40LTIuOSAyMC41LTEuNCAzMC4yIDJ2LS4zWk01Mi45IDM0Mi43Yy44IDIwLjIgMTggMzguMiAzOC44IDMwLjEgMTIgNDQuOCA3Ny45IDc1LjUgMTAyLjYgMTcuNCAxLjUtMi40LjMtMTAgNC43LTguMSAyOCAxOS4yIDUwLjItNC42IDU1LjMtMzEuMiA1LjItMS45IDEyLjMtNCAxMS0xMSAuMi0xMy4yLTEzLjctMjEuMS0xNy43LTMwIDE4LjUtMjYuOS0xNS01NS0zNy44LTU5LjEgNS40LTI0LjktMzEtNDAtNTEuMy0zMy42LTMuOS0zNi44LTcwLjktMjQuOC02MS41IDE2LjMtMTIuNCA1LjgtLjUgOS43LTYuNCAxMi41LTMxLjItMi41LTQ0LjggMzgtMjQgNTguNyA1LjQgNC40LTE1IDE2LjktMTQgMzcuOGwuMy4yWm0xNTkuMi05MS44YzU5LjkgMTIuMSAyNy40IDQ5LjggNTMuMSA4MC44IDQuOSAxMC44IDEuOSAxOC05LjcgMjEtMy45IDI4LjItMjkuNiA1MC4yLTU3LjMgMzEuMy0yMC40IDI5LjMtMi4zIDY4LjggMzIuNCAzOS41IDEzLjYgMjQuOCAzNC4yIDIwLjQgNDItMTEuMSA4IDEyLjggMjQuNSAyMy45IDM4LjcgMTIgLjYgMTAuOSAxNS4xIDE0LjggMjAuOSA1LjQgNC4xLTUuOCAxMC43IDcuNiAyMC43LTguMSA3LjgtOC00LjgtMjAuNCAxLjEtMjUuNSAyMi4yLTcuNi0uMy0yOS45IDcuNi0zNyAxMC4xLTcuNiAyLjQtMjQuMS02LjItMjkuOC01LjEtMi40IDUuNy0xMS45IDIuOS0xOC4yLTMuMi0xNC0xNy43LTIxLjUtMjkuMS0yOC4yLTUuNy0yNi43LTMyLjYtNTAtNjEuOC0zOS45LTE0LjgtMjMuOC01MC4xLTU0LjEtNzguMS0yNC4yIDExLjkgNi4xIDI3IDE3LjQgMjIuNyAzMi42di0uNmguMVoiLz48cGF0aCBkPSJNNTIuOCAzNDIuNmMxOC45LTYwLjkgMTYuMy0xMS41IDMuOC02NS45IDEuNS0xNy4xIDE2LjQtMzIuNSAzNC4yLTMwLjYgNS41IDAtNC41LTkuMiAzLjktMTAuNyAxIDAgMy43LS4yIDIuNS0xLjgtMTMuOS0zMi40IDU3LjEtNTkuMyA1OC45LTE4IDE3LjUtLjggNjAuNSA2IDUzLjkgMzUuMyAyMi44IDQuMSA1Ni40IDMyLjIgMzcuOCA1OS4xLTIuNiA0IDEwLjkgNy4yIDE1LjQgMjEuNyA4LjUgMjAuOS03LjcgMTQuNC0xMC42IDIxLjgtMS41IDI3LjItMjguOCA0Ni01Mi45IDI5LTQuNy0zLjEtMy44IDUuMy01LjIgNy44LTI0LjcgNTcuOC05MC42IDI3LjYtMTAyLjYtMTcuNC0yMC44IDguMS0zOC4xLTEwLTM4LjgtMzAuMWwtLjMtLjJaIiBzdHlsZT0iZmlsbDojYjBkMjM1Ii8+PHBhdGggZD0iTTIxMiAyNTAuOGM0LjItMTUuMi0xMC44LTI2LjYtMjIuNy0zMi42IDI4LjMtMjkuNyA2My4yLjMgNzguMSAyNC4yIDI5LjMtMTAgNTYuMSAxMy4xIDYxLjggMzkuOSAxMS41IDYuNiAyNS45IDE0LjMgMjkuMSAyOC4yIDIuOSA2LjMtOC4xIDE2LTIuOSAxOC4yIDguNiA1LjggMTYuMyAyMi4yIDYuMiAyOS44LTcuOCA3LjIgMTQuNSAyOS41LTcuNiAzNy01LjkgNS4xIDYuNyAxNy41LTEuMSAyNS41LTkuOSAxNS42LTE2LjQgMi40LTIwLjcgOC4xLTUuOCA5LjMtMjAuMyA1LjYtMjAuOS01LjQtMTQuMiAxMS45LTMwLjYuOS0zOC43LTEyLTcuNyAzMS44LTI4LjYgMzUuNy00MiAxMS4xLTM0LjcgMjkuMy01Mi44LTEwLjMtMzIuNC0zOS41IDI1LjQgMTcuNiA1NC4xLS42IDU2LjEtMjkuNyA5LjEtNC44IDE3LjctMTAuNyAxMC45LTIyLjYtMS44LTkuMy0xMi0xNS4yLTE1LjMtMjEuNiAxNi42LTI0LjgtMTEuNy01OC0zNy44LTU5LjJ2LjZoLS4xWiIgc3R5bGU9ImZpbGw6IzMyNzk0NSIvPjwvc3ZnPg==";

let straightTrackHorizontalImg = new Image();
straightTrackHorizontalImg.src = svgDataType + "PHN2ZyBkYXRhLW5hbWU9IkxheWVyIDEiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIgd2lkdGg9IjUwMCIgaGVpZ2h0PSI1MDAiIHZpZXdCb3g9IjAgMCA1MDAgNTAwIj48cGF0aCBzdHlsZT0iZmlsbDojMzliNTRhIiBkPSJNMCAwaDUwMHY1MDBIMHoiLz48cGF0aCBzdHlsZT0iZmlsbDojZmZmIiBkPSJNMCA3NWg1MDB2MzUwSDB6Ii8+PHBhdGggc3R5bGU9ImZpbGw6IzgwODI4NSIgZD0iTTAgMTAwaDUwMHYzMDBIMHoiLz48L3N2Zz4=";

let straightTrackVerticalImg = new Image();
straightTrackVerticalImg.src = svgDataType +
"PHN2ZyBkYXRhLW5hbWU9IkxheWVyIDEiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIgd2lkdGg9IjUwMCIgaGVpZ2h0PSI1MDAiIHZpZXdCb3g9IjAgMCA1MDAgNTAwIj48cGF0aCBzdHlsZT0iZmlsbDojMzliNTRhIiBkPSJNMCAwaDUwMHY1MDBIMHoiLz48cGF0aCBzdHlsZT0iZmlsbDojZmZmIiBkPSJNNzUgMGgzNTB2NTAwSDc1eiIvPjxwYXRoIHN0eWxlPSJmaWxsOiM4MDgyODUiIGQ9Ik0xMDAgMGgzMDB2NTAwSDEwMHoiLz48L3N2Zz4=";

let curvedTrackTopLeftImg = new Image();
curvedTrackTopLeftImg.src = svgDataType + "PHN2ZyBpZD0idXVpZC05OTk1ZjEyYy1lMzdkLTQ4N2EtYTI5Yi0zNzMyYWYzMDgwMGEiIGRhdGEtbmFtZT0iTGF5ZXIgMSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiB3aWR0aD0iNTAwIiBoZWlnaHQ9IjUwMCIgdmlld0JveD0iMCAwIDUwMCA1MDAiPjxkZWZzPjxzdHlsZT4udXVpZC05Y2U2NGVkOC03MTk1LTQ0YjktOWIzNC1jZDJiNzZlYWIzZmN7ZmlsbDojMzliNTRhfTwvc3R5bGU+PC9kZWZzPjxwYXRoIGNsYXNzPSJ1dWlkLTljZTY0ZWQ4LTcxOTUtNDRiOS05YjM0LWNkMmI3NmVhYjNmYyIgZD0iTTAgMGg1MDB2NTAwSDB6Ii8+PHBhdGggZD0iTTUwMCA3NUMyNjUuMyA3NSA3NSAyNjUuMyA3NSA1MDBoNDI1Vjc1WiIgc3R5bGU9ImZpbGw6I2ZmZiIvPjxwYXRoIGQ9Ik01MDAgNDAwVjEwMGMtMjIwLjkgMC00MDAgMTc5LjEtNDAwIDQwMGgzMDBjMC01NS4yIDQ0LjgtMTAwIDEwMC0xMDBaIiBzdHlsZT0iZmlsbDojODA4Mjg1Ii8+PHBhdGggY2xhc3M9InV1aWQtOWNlNjRlZDgtNzE5NS00NGI5LTliMzQtY2QyYjc2ZWFiM2ZjIiBkPSJNNDI1IDQ5OS45aDc1di03NS4xYy00MS40IDAtNzUgMzMuNi03NSA3NVoiLz48L3N2Zz4=";

let curvedTrackTopRightImg = new Image();
curvedTrackTopRightImg.src = svgDataType + "PHN2ZyBpZD0idXVpZC03NDFlMWU3ZC1kMWEwLTQ1MDQtODNkOS1iNTVmNGY2ZjY4ZDIiIGRhdGEtbmFtZT0iTGF5ZXIgMSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiB3aWR0aD0iNTAwIiBoZWlnaHQ9IjUwMCIgdmlld0JveD0iMCAwIDUwMCA1MDAiPjxkZWZzPjxzdHlsZT4udXVpZC1hODM1YWQ4Ni1jN2ExLTQ5NDgtOGY1ZS1hNTNhYTc1YTU1MjZ7ZmlsbDojMzliNTRhfTwvc3R5bGU+PC9kZWZzPjxwYXRoIGNsYXNzPSJ1dWlkLWE4MzVhZDg2LWM3YTEtNDk0OC04ZjVlLWE1M2FhNzVhNTUyNiIgZD0iTTAgMGg1MDB2NTAwSDB6Ii8+PHBhdGggZD0iTTQyNC45IDUwMEM0MjQuOSAyNjUuMyAyMzQuNiA3NSAwIDc1djQyNWg0MjVaIiBzdHlsZT0iZmlsbDojZmZmIi8+PHBhdGggZD0iTTk5LjkgNTAwaDMwMGMwLTIyMC45LTE3OS4xLTQwMC0zOTkuOS00MDB2MzAwYzU1LjIgMCAxMDAgNDQuOCAxMDAgMTAwWiIgc3R5bGU9ImZpbGw6IzgwODI4NSIvPjxwYXRoIGNsYXNzPSJ1dWlkLWE4MzVhZDg2LWM3YTEtNDk0OC04ZjVlLWE1M2FhNzVhNTUyNiIgZD0iTTAgNDI1djc1aDc1LjFjMC00MS40LTMzLjYtNzUtNzUtNzVaIi8+PC9zdmc+";

let curvedTrackBottomLeftImg = new Image();
curvedTrackBottomLeftImg.src = svgDataType + "PHN2ZyBpZD0idXVpZC0wYTcxMGQ2Mi05ZmY5LTQ3YzQtOWFlMC0zMTkxOTRlZTFiNWEiIGRhdGEtbmFtZT0iTGF5ZXIgMSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiB3aWR0aD0iNTAwIiBoZWlnaHQ9IjUwMCIgdmlld0JveD0iMCAwIDUwMCA1MDAiPjxkZWZzPjxzdHlsZT4udXVpZC1kMmFhODQ5MC0xNjY4LTQ3YzItYTUzNy0yZDU3YzEzYTk1ZDl7ZmlsbDojMzliNTRhfTwvc3R5bGU+PC9kZWZzPjxwYXRoIGNsYXNzPSJ1dWlkLWQyYWE4NDkwLTE2NjgtNDdjMi1hNTM3LTJkNTdjMTNhOTVkOSIgZD0iTTAgMGg1MDB2NTAwSDB6Ii8+PHBhdGggZD0iTTc1IDBjMCAyMzQuNyAxOTAuMyA0MjUgNDI1IDQyNVYwSDc1WiIgc3R5bGU9ImZpbGw6I2ZmZiIvPjxwYXRoIGQ9Ik00MDAgMEgxMDBjMCAyMjAuOSAxNzkuMSA0MDAgNDAwIDQwMFYxMDBjLTU1LjIgMC0xMDAtNDQuOC0xMDAtMTAwWiIgc3R5bGU9ImZpbGw6IzgwODI4NSIvPjxwYXRoIGNsYXNzPSJ1dWlkLWQyYWE4NDkwLTE2NjgtNDdjMi1hNTM3LTJkNTdjMTNhOTVkOSIgZD0iTTQ5OS45IDc1VjBoLTc1LjFjMCA0MS40IDMzLjYgNzUgNzUgNzVaIi8+PC9zdmc+";

let curvedTrackBottomRightImg = new Image();
curvedTrackBottomRightImg.src = svgDataType + "PHN2ZyBpZD0idXVpZC1hNjE3ZWZkMS0zNTgyLTQwN2YtODdjMi0wODQzOThmNDJlNzMiIGRhdGEtbmFtZT0iTGF5ZXIgMSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiB3aWR0aD0iNTAwIiBoZWlnaHQ9IjUwMCIgdmlld0JveD0iMCAwIDUwMCA1MDAiPjxkZWZzPjxzdHlsZT4udXVpZC1iY2M1YTdiOS04NzZhLTRmMGQtYmUxNi03ODgzODdlZjgzMmJ7ZmlsbDojMzliNTRhfTwvc3R5bGU+PC9kZWZzPjxwYXRoIGNsYXNzPSJ1dWlkLWJjYzVhN2I5LTg3NmEtNGYwZC1iZTE2LTc4ODM4N2VmODMyYiIgZD0iTTAgMGg1MDB2NTAwSDB6Ii8+PHBhdGggZD0iTTAgNDI1YzIzNC43IDAgNDI1LTE5MC4zIDQyNS00MjVIMHY0MjVaIiBzdHlsZT0iZmlsbDojZmZmIi8+PHBhdGggZD0iTTAgMTAwdjMwMGMyMjAuOSAwIDQwMC0xNzkuMSA0MDAtNDAwSDEwMGMwIDU1LjItNDQuOCAxMDAtMTAwIDEwMFoiIHN0eWxlPSJmaWxsOiM4MDgyODUiLz48cGF0aCBjbGFzcz0idXVpZC1iY2M1YTdiOS04NzZhLTRmMGQtYmUxNi03ODgzODdlZjgzMmIiIGQ9Ik03NSAuMUgwdjc1LjFjNDEuNCAwIDc1LTMzLjYgNzUtNzVaIi8+PC9zdmc+";

let fps = 60;
let time = 0;

let gridNumRows = 4, gridNumCols = 4;
let gridCellSizeX, gridCellSizeY;
let carSizeX = 50, carSizeY = 50;

let trackOrder;
let trackIsLoop;

let currentTrackOrderId = 0;
let currentTrackSegmentProgress = 0.5;

let currentTrackSegmentLength;
let distanceToNextCurve;

let lastLapTime = null;

let straightTopSpeed = 30;
let curveTopSpeed = 3;
let acceleration = 3;
let braking = 10;

let speed = 0;
let lastX, lastY;
let velocityX, velocityY;

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
        return [dfs(startNode, end).visited, false];
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
        // shuffle(neighbors);

        for(let i = 0; i < neighbors.length; i++) {
            let neighborNode = { id: neighbors[i], visited: startNode.visited };
            let result = dfs(neighborNode, endId);
            if(result != null) {
                return result;
            }
        }

        return null;
    }
    [trackOrder, trackIsLoop] = dfsStart(startCell, endCell);

    // function generateBasicLoop() {
    //     let result = [];
    //     let padding = 1;
    //     for(let col = padding; col < gridNumCols - padding; col++) {
    //         result.push(getGridRowColToId(padding, col));
    //     }
    //     for(let row = padding + 1; row < gridNumRows - padding; row++) {
    //         result.push(getGridRowColToId(row, gridNumCols - 1 - padding));
    //     }
    //     for(let col = gridNumCols - 2; col >= padding; col--) {
    //         result.push(getGridRowColToId(gridNumCols - 1 - padding, col));
    //     }
    //     for(let row = gridNumRows - 2; row >= padding; row--) {
    //         result.push(getGridRowColToId(row, padding));
    //     }
    //     return [result, true];
    // }
    // [trackOrder, trackIsLoop] = generateBasicLoop();

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

function getPrevCurrNextRowCols(trackOrderId) {
    let [prevGridRow, prevGridCol] = getGridIdToRowCol(trackOrder[(trackOrderId + trackOrder.length - 1) % trackOrder.length]);
    let [gridRow, gridCol] = getGridIdToRowCol(trackOrder[trackOrderId]);
    let [nextGridRow, nextGridCol] = getGridIdToRowCol(trackOrder[(trackOrderId + 1) % trackOrder.length]);

    if(!trackIsLoop) {
        if(trackOrderId == 0) {
            prevGridRow = gridRow - 1;
            prevGridCol = gridCol;
        }
        else if(trackOrderId == trackOrder.length - 1) {
            nextGridRow = gridRow + 1;
            nextGridCol = gridCol;
        }
    }

    return [prevGridRow, prevGridCol, gridRow, gridCol, nextGridRow, nextGridCol];
}

function getTrackIsCurve(trackOrderId) {
    let [prevGridRow, prevGridCol, gridRow, gridCol, nextGridRow, nextGridCol] = getPrevCurrNextRowCols(trackOrderId);

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
    let [prevGridRow, prevGridCol, gridRow, gridCol, nextGridRow, nextGridCol] = getPrevCurrNextRowCols(trackOrderId);

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
        currentTrackSegmentLength = 2 * Math.PI * 50 / 4;
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
    if(speed <= curveTopSpeed) brake = false;
    else if (speed > curveTopSpeed) brake = true;
    // else if((speed - curveTopSpeed) / braking >= 0) brake = true;
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
        if(Math.random() < 0.1) {
            context.drawImage(bush1Img, startX, startY, gridCellSizeX, gridCellSizeY);
        }
        else {
            context.drawImage(emptyTrackImg, startX, startY, gridCellSizeX, gridCellSizeY);
        }
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
        context.drawImage(curvedTrackTopLeftImg, startX, startY, gridCellSizeX, gridCellSizeY);
    }
    else if(trackDirection == "tr") {
        context.drawImage(curvedTrackTopRightImg, startX, startY, gridCellSizeX, gridCellSizeY);
    }
    else if(trackDirection == "bl") {
        context.drawImage(curvedTrackBottomLeftImg, startX, startY, gridCellSizeX, gridCellSizeY);
    }
    else if(trackDirection == "br") {
        context.drawImage(curvedTrackBottomRightImg, startX, startY, gridCellSizeX, gridCellSizeY);
    }
}

function lerp(min, max, s) {
    if(min > max) return max + (min - max) * (1 - s);
    return min + (max - min) * s;
}

function getCarPosition() {
    let [prevGridRow, prevGridCol, gridRow, gridCol, nextGridRow, nextGridCol] = getPrevCurrNextRowCols(currentTrackOrderId);

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

    let x, y;
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
        x = circleCenterX + Math.cos(theta) * gridCellSizeX / 2;
        y = circleCenterY + Math.sin(theta) * gridCellSizeY / 2;
    }
    else {
        x = lerp(segmentStartX, segmentEndX, currentTrackSegmentProgress);
        y = lerp(segmentStartY, segmentEndY, currentTrackSegmentProgress);
    }

    if(x != lastX || y != lastY) {
        velocityX = x - lastX;
        velocityY = y - lastY;
        lastX = x;
        lastY = y;
    }

    return [x, y];
}

function drawCar() {
    let [x, y] = getCarPosition();
    let carImg;

    if(Math.abs(velocityX) >= Math.abs(velocityY)) {
        if(velocityX >= 0) {
            carImg = carRightImg;
        }
        else {
            carImg = carLeftImg;
        }
    }
    else {
        if(velocityY >= 0) {
            carImg = carRightImg;
        }
        else {
            carImg = carLeftImg;
        }
    }

    context.drawImage(carImg, x - carSizeX / 2, y - carSizeY / 2, carSizeX, carSizeY);
}

function drawTimer() {
    context.font = "18px serif";
    context.textBaseline = "hanging";
    context.fillStyle = "rgb(255, 255, 0)";
    context.fillText("Time: " + time.toFixed(2) + "s" + (lastLapTime != null ? " | Last: " + lastLapTime.toFixed(2) + "s" : ""), 30, 30);
}
