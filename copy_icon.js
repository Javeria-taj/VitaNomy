const fs = require('fs');
const path = require('path');

const source = "C:\\Users\\Dell\\.gemini\\antigravity\\brain\\e4e18cd8-8e38-4904-ba6f-b82936608fcf\\project_favicon_1775356714275.png";
const dest = "c:\\Users\\Dell\\OneDrive\\Desktop\\vitanomy\\app\\icon.png";

try {
    fs.copyFileSync(source, dest);
    console.log(`Successfully copied ${source} to ${dest}`);
} catch (err) {
    console.error(`Error copying: ${err.message}`);
}
