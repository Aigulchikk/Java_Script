let sound;
let isInitialised = false;
let isLoaded = false;
let fft;
let sliderSpeed, sliderStrokeRange;
let showColumns = true;
let showLines = true;
let showRing = true;

function preload() {
    soundFormats('mp3', 'wav'); 
    sound = loadSound('assets/LPBurnItDown.mp3', () => {
        console.log("sound is loaded!");
        isLoaded = true;
    });
    sound.setVolume(0.2);
}

function setup() {
    createCanvas(1024, 920);
    textAlign(CENTER);
    textSize(32);
    
    fft = new p5.FFT();

    // Скорость
    sliderSpeed = createSlider(0.5, 2.0, 1.0, 0.1);
    sliderSpeed.position(10, height + 10);
    sliderSpeed.style('width', '150px');

    // Ширина
    sliderStrokeRange = createSlider(10, 100, 50, 5);
    sliderStrokeRange.position(180, height + 10);
    sliderStrokeRange.style('width', '150px');

    // Column
    let columnButton = createButton("Column");
    columnButton.position(350, height + 10);
    columnButton.mousePressed(() => {
        showColumns = !showColumns;
    });

    // Line
    let lineButton = createButton("Line");
    lineButton.position(428, height + 10);
    lineButton.mousePressed(() => {
        showLines = !showLines;
    });

    // Ring
    let ringButton = createButton("Ring");
    ringButton.position(490, height + 10);
    ringButton.mousePressed(() => {
        showRing = !showRing;
    });
}

function draw() {
    background(0);
    fill(255);
    
    text("Speed", 85, height + 30);
    text("Stroke Range", 255, height + 30);

    if (isInitialised && !sound.isPlaying()) {
        text("Press any key to play sound", width / 2, height / 2);
    } else if (sound.isPlaying()) {
        sound.rate(sliderSpeed.value());

        let spectrum = fft.analyze();
        let barWidth = width / spectrum.length * 10;
        let maxHeight = height - 50;

        // Линии
        if (showLines) {
            let strokeRange = sliderStrokeRange.value();
            for (let i = 0; i < 10; i++) {
                let x = random(width);
                let y = random(height);
                let length = random(strokeRange, strokeRange * 2);
                let angle = random(TWO_PI);

                stroke(random(255), random(255), random(255));
                strokeWeight(random(1, 3));
                line(x, y, x + cos(angle) * length, y + sin(angle) * length);
            }
        }
        // Столбики
        if (showColumns) {
          noStroke();
          for (let i = 0; i < spectrum.length; i += 10) {
              let barHeight = map(spectrum[i], 0, 255, 0, maxHeight);
              let x = map(i, 0, spectrum.length, 0, width);

              fill(0, map(barHeight, 0, maxHeight, 150, 255), 255);
              rect(x, height - barHeight, barWidth, barHeight);
          }

          // Противоп. столбики
          for (let i = 0; i < spectrum.length; i += 10) {
              let barHeight = map(spectrum[i], 0, 255, 0, maxHeight);
              let x = map(i, 0, spectrum.length, width, 0);

              fill(0, map(barHeight, 0, maxHeight, 150, 255), 255, 180);
              rect(x, 0, barWidth, barHeight);
          }
      }

      // Круги
      if (showRing) {
          let bass = fft.getEnergy("bass");
          let mid = fft.getEnergy("mid");
          let treble = fft.getEnergy("treble");
          
          let size1 = map(bass, 0, 255, 50, 200);
          let size2 = map(mid, 0, 255, 80, 250);
          let size3 = map(treble, 0, 255, 120, 300);

          push();
          translate(width / 2, height / 2);
          noFill();
          strokeWeight(2);
          
          stroke(255, 20, 147, 180);
          ellipse(0, 0, size1);
          
          stroke(255, 20, 147, 140); 
          ellipse(0, 0, size2);
          
          stroke(255, 20, 147, 100);
          ellipse(0, 0, size3);

          pop();
      }
  }
}

function keyPressed() {
  if (!isInitialised) {
      isInitialised = true;
      if (isLoaded) sound.loop();
  } else {
      if (key == ' ') {
          if (sound.isPaused()) sound.play();
          else sound.pause();
      }
  }
}