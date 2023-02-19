//SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;

contract CarArt {
    function makeImage() public view returns (string memory image) {
        image = string.concat(
            '<svg xmlns="http://www.w3.org/2000/svg" width="500" height="500" viewBox="0 0 500 500"><path d="M46.6 336.1V164h404.7v172.1H46.6ZM69.2 258c-2.8 101.1 112.9 69.4 178.4 72.3 100.9 16.9 280.5-15.5 172.2-143.4-39.3-28.7-90.3-6.6-135.1-16.7-78.3 6-216.2-24.7-216.8 65.2-.8-13.8 12.2-31.9-4.7-39.4-38.3 33.5 12.6 183 6 62Z" style="fill:none"/><path d="M69.2 257.9c5.9 120.4-44.4-28.2-6.2-61.6 20 9.4-1.5 32.2 6.2 47.9 1.8-16.6 2.2-36.1 12.6-49.8 76.4-53.3 182.8-9.8 271.1-21.3 87-23.6 136.2 106.9 58.4 147.8-65.5 22.5-141.9 4.3-211.2 9.6-57.7 9-135.7 5-130.9-72.6Zm344.4-74.1c-70-26.4-153.2-4.4-228-11.7-55-15.5-121 8.9-115.4 74.2-11.3-13 13.7-43.8-8.4-49.2-15 20.2-21.2 108.1 6.7 104 6.9-2.2-7-50.2 1.4-43.3-5.9 59.9 58.1 87.5 109 72.4 76.8-9 162.2 15 234.4-11.8-5.9 1.3-11.8 2.5-17.4 4.6 4.4-5.2 13.6-12.7 18.1-20.2 11.9-10.5 32.9-5.9 32.2-27.2 4.1-33.8 7.2-68.7-32.2-76.4-12.2-14.6-28.9-24.4-.4-15.4Zm26 109c-29.6 9.8-20 8.5-39.8 27.6 18.1-1.8 32-11 39.8-27.6Zm-41.1-111.6c11.9 13.3 24.1 22.6 41.2 28.3-9.5-19.8-21-23.9-41.2-28.3Z"/><path d="M413.5 183.8c-28.9-8.4-10.6 1 .7 15.6 38 16.5 29.5 10 34.6 50.7.8 33.3-5.5 41.8-34.6 52.9-17 32.4-23.4 27.5-88.3 25.5-47.5 4.7-94.9-.9-142.5 1.3-53.8 15.3-119.9-9.5-113.5-74.1 1.9 123.3-39.8-18.2-7.9-58.4 22.1 5.7-2.9 35.7 8.4 49.2-4.8-100.3 104.5-73.1 169.8-73.8 56.3 3.8 122.8-11.5 173.3 11.1Zm-274.7 82.9c-9.1 83.4 102 48.1 154.4 56.5 61.6 8.2 48.4-108.7 27-141.1-37.2-11.3-82-1.1-121.1 1-71.7-10.3-58 31.6-60.3 83.6Z" style="stroke:#221f1f;stroke-miterlimit:10;fill:#eb2027"/><path d="M439.5 292.8c-7.7 16.6-21.7 25.7-39.7 27.5 19.5-18.9 10.9-18.3 39.7-27.5Zm-41.1-111.6c20.2 4.4 31.7 8.5 41.2 28.3-17-5.6-29.3-15.1-41.2-28.3Z" style="fill:#fdf9d6"/><path d="M138.9 266.7c1.6-51.8-10.6-93.9 60.2-83.4 39.1-2.1 83.8-12.2 121.1-1 21.7 35.2 35.1 150.2-29.2 141.3-51.7-8.2-162.1 25.6-152.1-56.9Zm153.3 52.2c-8.3-5.8-45 .5-37.1-13.3C292 220.1 219.4 188 284.7 184c56.6-10.4-63.9-3.8-87.5.2-50.8-7.8-59.6 12.9-57.2 59.6-6.7 48.8 8.4 87.3 64.6 74.4 26.1 3.6 97.2 8 87.6.7Zm43.6-73.4c-1.5-54.1-9.9-72.3-65.6-53.2-11 29.5 12 69.5-4.5 106.2-.4 3.6-2.8 9.7 2.4 10.5 58.4 24.8 71.5-10.2 67.7-63.5ZM316.4 320c-13.8-7.8-56.1.5-51-22 27.4-71.2-43.3-108.7 50.5-115.6-18.8-.8-46.2 4.1-62.5 9.7 46.1 75.8-50.8 130.1 63 127.9Z"/><path d="M292.2 318.8c9 8.2-61.2 2.8-87.5-.4-56 12.8-71.4-25.5-64.6-74.4-2.4-46.7 6.4-67.4 57.2-59.6 23.4-4.4 144.3-10.2 87.5-.2-64.7 3.3 7 39-29.6 121.6-7.4 13.7 29.3 8.1 37 13Z" style="fill:#221f1f"/><path d="M335.8 245.4c-1.3 21.6 2.5 79.8-30.4 71.1-12-5.2-44.9.3-40-18.4 9.5-37.3 7.1-63.2-1-100.1-1.1-3.9 2.5-5.7 5.8-5.9 56.5-19.5 63 0 65.6 53.3Z" style="fill:#4d4e4e"/><path d="M316.3 319.9c-114.1 2.5-16.8-50.3-63-127.7 13.9-5.3 45.3-10.6 62.5-9.7-93.7 6.9-23.1 44.6-50.5 115.6-5.1 22.3 37.6 14.6 51 21.8Z" style="fill:#eb2027"/></svg>'
        );

        return image;
    }
}
