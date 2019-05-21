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
    return await segmentation;
};

img.onload = () => {
    console.log("image loaded.");
    ctx.fillStyle ="#000";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(img, 0, 0, width, height);
    //const imageElement = tf.browser.fromPixels(img);
    console.log(canvas);
    console.log(outputStride);
    console.log(segmentationThreshold);
    countPixels()
    /*estimate(canvas, outputStride, segmentationThreshold).then(function (segmentation) {
        console.log("Test");
        console.log("Segmentation: " + function () { return JSON.stringify(segmentation, null, ' ') });
    });*/
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