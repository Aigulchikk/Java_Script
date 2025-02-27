let sound; 
let isInitialised = false; 
let isLoaded = false;
let fft;

function preload() {
    soundFormats('mp3', 'wav'); 
    sound = loadSound('assets/Linkin_Park.mp3', () => {
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
}

function draw() {
    background(0);
    fill(255);

    if (isInitialised && !sound.isPlaying()) {
        text("Press any key to play sound", width / 2, height / 2);
    } else if (sound.isPlaying()) {
        let spectrum = fft.analyze();
        let waveform = fft.waveform();
        let barWidth = width / spectrum.length * 10; 
        let maxHeight = height - 50; 

        // Столбики
        noStroke();
        for (let i = 0; i < spectrum.length; i += 10) { 
            let barHeight = map(spectrum[i], 0, 255, 0, maxHeight);
            let x = map(i, 0, spectrum.length, 0, width);
            
            let c = color(0, map(barHeight, 0, maxHeight, 50, 255), 0); 
            fill(c);
            rect(x, height - barHeight, barWidth, barHeight);
        }

        // Волна
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