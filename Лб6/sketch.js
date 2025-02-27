let sound;
let isInitialised = false;
let isLoaded = false;
let fft;
let sliderSpeed, sliderStrokeRange;

function preload() {
    soundFormats('mp3', 'wav'); 
    sound = loadSound('assets/LPBurnItDown.mp3', () => {
        console.log("sound is loaded!");
        isLoaded = true;
    });
    sound.setVolume(0.2);
}

function setup() {
    createCanvas(1024, 1024);
    textAlign(CENTER);
    textSize(32);
    
    fft = new p5.FFT();

    // Скорость 
    sliderSpeed = createSlider(0.5, 2.0, 1.0, 0.1);
    sliderSpeed.position(10, height + 10);
    sliderSpeed.style('width', '200px');

    // Длинна 
    sliderStrokeRange = createSlider(10, 100, 50, 5);
    sliderStrokeRange.position(220, height + 10);
    sliderStrokeRange.style('width', '200px');
}

function draw() {
    background(0);
    fill(255);
    
    text("Speed", 110, height + 30);
    text("Stroke Range", 320, height + 30);

    if (isInitialised && !sound.isPlaying()) {
        text("Press any key to play sound", width / 2, height / 2);
    } else if (sound.isPlaying()) {
        sound.rate(sliderSpeed.value());
        
        let spectrum = fft.analyze();
        let waveform = fft.waveform();
        let lowFrequencies = fft.getEnergy("bass");
        let highFrequencies = fft.getEnergy("treble");

        let barWidth = width / spectrum.length * 10;
        let maxHeight = height - 50;
        let strokeRange = sliderStrokeRange.value();

        // Штрихи
        for (let i = 0; i < 10; i++) {
            let x = random(width);
            let y = random(height);
            let length = random(strokeRange, strokeRange * 2);
            let angle = random(TWO_PI);
            
            stroke(random(255), random(255), random(255));
            strokeWeight(random(1, 3));
            line(x, y, x + cos(angle) * length, y + sin(angle) * length);
        }

        // Столбики
        noStroke();
        for (let i = 0; i < spectrum.length; i += 10) {
            let barHeight = map(spectrum[i], 0, 255, 0, maxHeight);
            let x = map(i, 0, spectrum.length, 0, width);

            let c = color(0, map(barHeight, 0, maxHeight, 100, 255), 255);
            fill(c);
            rect(x, height - barHeight, barWidth, barHeight);
        }


        fill(255, 0, 0, 150);
        ellipse(150, height - 50, map(lowFrequencies, 0, 255, 10, 100));

        fill(0, 0, 255, 150);
        ellipse(width - 150, height - 50, map(highFrequencies, 0, 255, 10, 100));

        // Волны
        noFill();
        stroke(255, 105, 180);
        strokeWeight(2);
        beginShape();
        for (let i = 0; i < waveform.length; i++) {
            let x = map(i, 0, waveform.length, 0, width);
            let y = map(waveform[i], -1, 1, 0, height);
            vertex(x, y);
        }
        endShape();
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