import * as bodyPix from '@tensorflow-models/body-pix';
require('@tensorflow/tfjs-node');
const tf = require('@tensorflow/tfjs');
const { createCanvas, Image } = require('canvas');

const outputStride = 8;
const segmentationThreshold = 0.6;

const width = 962;
const height = 1280;
const canvas = createCanvas(width, height);
const ctx = canvas.getContext('2d');
const img = new Image();
//const imageElement = document.getElementById('image');

// load the BodyPix model from a checkpoint
var estimate = async function (imageElement, outputStride, segmentationThreshold) {
    const net = await bodyPix.load(1.0);
    let segmentation = await net.estimatePersonSegmentation(imageElement, outputStride, segmentationThreshold);

    return segmentation;
};

img.onload = async () => {
    console.log("image loaded.");
    ctx.fillStyle = "#000";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(img, 0, 0, width, height);

    console.log(outputStride);
    console.log(segmentationThreshold);
    //countPixels()

    // Estimate body segment
    var segmentation = await estimate(canvas, outputStride, segmentationThreshold);
    console.log(segmentation)

    /*
    // Plot segmentation mask
    var palette = ctx.getImageData(0,0,canvas.width,canvas.height);
    palette.data.set(new Uint8ClampedArray(segmentation.data));
    ctx.putImageData(palette,0,0);
    
    // Write image to file
    var image = new Image();

    const fs = require('fs');
    image.src = canvas.toDataURL("image/png");
    image.onload = () => {
        fs.writeFile("test.png", image.src, function(err) {
            if(err) {
                return console.log(err);
            }
        
            console.log("The file was saved!");
        }); 
    }
    */
    //Post processing * DOESNT WORK *
    const maskBackground = true;
    const backgroundDarkeningMask = bodyPix.toMaskImageData(segmentation, maskBackground);

    const opacity = 0.9;
    const maskBlurAmount = 0;
    const flipHorizontal = true;

    bodyPix.drawMask(canvas, img, backgroundDarkeningMask, opacity, maskBlurAmount, flipHorizontal);
    
    /*
    var fs = require('fs');

    var data = {}
    data.table = []
    data.table.push(segmentation)
    fs.writeFile("input.json", JSON.stringify(data), function (err) {
        if (err) throw err;
        console.log('complete');
    }
    );
    */
}

img.onerror = err => { throw err }
img.src = './images/star_pose_1.jpg';

function countPixels() {
    var nAlive = 0;
    var p = ctx.getImageData(0, 0, canvas.width, canvas.height).data;
    //TODO: Count pixels per row of b&W with interval of 5cm
    for (var y = 20, i = 0; y < 21; y++) {
        for (var x = 0; x < canvas.width; x++ , i += 4) {
            if (p[i] != 0 || p[i + 1] != 0 || p[i + 2] != 0) //Not black
            {
                nAlive++;
            }
        }
    }
    console.log(nAlive);
}