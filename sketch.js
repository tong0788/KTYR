function preload() {
  magnetsData = loadJSON('assets/magnets.json');
}

let magnets = [];
let video;
let handpose;
let predictions = [];
let score = 0; // 分數變數

function setup() {
  createCanvas(400, 400);
  video = createCapture(VIDEO);
  video.size(400, 400);
  video.hide();

  handpose = ml5.handpose(video, modelReady);
  handpose.on('predict', results => {
    predictions = results;
  });

  for (let i = 0; i < magnetsData.length; i++) {
    magnets.push(new Magnet(magnetsData[i]));
  }
}

function modelReady() {
  console.log('Model Loaded!');
}

function draw() {
  background(220);
  image(video, 0, 0);

  for (let magnet of magnets) {
    magnet.display();
  }

  gotHands();

  // 顯示分數
  fill(0);
  textSize(16);
  textAlign(RIGHT, TOP);
  text(`Score: ${score}`, width - 10, 10);

  // 顯示遊戲說明
  textAlign(LEFT, BOTTOM);
  text("Move magnets using your hand!", 10, height - 10);
}

function gotHands() {
  if (predictions.length > 0) {
    let hand = predictions[0].landmarks;
    for (let magnet of magnets) {
      if (magnet.touch(hand)) {
        score++; // 每次磁鐵被觸碰時增加分數
      }
    }
  }
}