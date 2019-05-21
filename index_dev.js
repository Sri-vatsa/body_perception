import * as bodyPix from '@tensorflow-models/body-pix';
require('@tensorflow/tfjs-node');
const tf = require('@tensorflow/tfjs');
const {createCanvas, Image} = require('canvas');

const outputStride = 8;
const segmentationThreshold = 0.6;

const width = 962;
const height = 1280;
const canvas = createCanvas(width, height);
const ctx = canvas.getContext('2d');
const img = new Image();
//const imageElement = document.getElementById('image');

// load the BodyPix model from a checkpoint
var estimate = async function(imageElement, outputStride, segmentationThreshold) {
    const net = await bodyPix.load(1.0);
    let segmentation = await net.estimatePersonSegmentation(imageElement, outputStride, segmentationThreshold);
    segmentation.inspect = function(){ return JSON.stringify(this, null, ' ' ); };
    return await segmentation;
};

img.onload = () => {
    console.log("image loaded.");
    ctx.drawImage(img, 0, 0, width, height);
    //const imageElement = tf.browser.fromPixels(img);
    console.log(canvas);
    console.log(outputStride);
    console.log(segmentationThreshold);
    estimate(canvas, outputStride, segmentationThreshold).then(function(segmentation){
        console.log("Test");
        console.log("Segmentation: " + segmentation);
    });
}

img.onerror = err => { throw err }
img.src = './images/star_pose_1.jpg';