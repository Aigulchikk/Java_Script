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
        let freqs = fft.analyze();
        let step = floor(freqs.length/width);
        
        noFill();
        stroke(0, 255, 0);
        strokeWeight(2);
        beginShape();

        
        for (let i = 2; i < freqs.length - 2; i += step) {
            let avg = (freqs[i - 2] + freqs[i - 1] + freqs[i] + freqs[i + 1] + freqs[i + 2]) / 5; 
            let y = map(avg, 0, 255, height, 0); 
            vertex(map(i, 0, freqs.length, 0, width), y);
        }
        
        endShape();

        noFill();
        stroke(255, 105, 180);
        strokeWeight(2);
        beginShape();

        
        for (let i = 2; i < freqs.length - 2; i += step) {
            let avg = (freqs[i - 2] + freqs[i - 1] + freqs[i] + freqs[i + 1] + freqs[i + 2]) / 5; 
            let y = map(avg, 0, 255, height / 2, 0); 
            vertex(map(i, 0, freqs.length, 0, width), y);
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