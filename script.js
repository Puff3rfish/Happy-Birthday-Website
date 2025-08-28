// ---------- NAME HANDLING ----------
function askNameAndGo() {
  let name = prompt("What's your name?");
  if (name && name.trim() !== "") {
    localStorage.setItem("username", name.trim());
    // navigate to slideshow
    window.location.href = "slideshow.html";
  }
}

// ---------- CONFETTI (wrapper) ----------
function startConfetti(durationSec = 4) {
  if (typeof confetti !== "function") return;
  const duration = durationSec * 1000;
  const end = Date.now() + duration;

  (function frame() {
    confetti({
      particleCount: 20,
      angle: 60,
      spread: 55,
      origin: { x: 0 }
    });
    confetti({
      particleCount: 20,
      angle : 120,
      spread: 55,
      origin: { x: 1 }
    });
    if (Date.now() < end) requestAnimationFrame(frame);
  })();
}


// ---------- SLIDESHOW HANDLING ----------
function startSlideshow() {
  const images = ["1.png","2.png","3.png","4.png","5.png","6.png","7.png","8.png"];
  let index = 0;
  const imgElement = document.getElementById("slideshow");
  const music1 = document.getElementById("music1");
  const music2 = document.getElementById("music2");
  const wishLink = document.getElementById("wishLink");
  const playMusicBtn = document.getElementById("playMusicBtn");

if (localStorage.getItem("startMusic") === "yes") {
    music1.play().catch(err => console.warn("Autoplay may be blocked", err));
    localStorage.removeItem("startMusic"); // reset flag
}


  function showImage(i) {
    imgElement.src = images[i];
  }

  function next() {
    showImage(index);

    // start music when first slide shows
    if (index === 0 && music1) {
  music1.play().catch(err => {
    console.warn("Autoplay blocked:", err);
  });
}


    if (index < images.length - 1) {
      // show next after 10 seconds
      setTimeout(() => {
        index++;
        next();
      }, 3000);
    } else {
      // last image (8.png)
      // stop walkwithyou, start happybday
      //if (music1 && !music1.paused) music1.pause();
      // if (music2) music2.play().catch(()=>showPlayFallback());
      // confetti and show Make a Wish link
      startConfetti(4);
      if (wishLink) wishLink.style.display = "block";
    }
  }

  next();
}

// ---------- CAKE BLOW DETECTION ----------
function startBlowDetection() {
    let username = localStorage.getItem("username") || "Friend";
    let greeting = document.getElementById("greeting");
    let cake = document.getElementById("cake");
    let hasBlown = false;

    navigator.mediaDevices.getUserMedia({ audio: true }).then(stream => {
        const audioContext = new AudioContext();
        const mic = audioContext.createMediaStreamSource(stream);
        const analyser = audioContext.createAnalyser();
        mic.connect(analyser);
        let data = new Uint8Array(analyser.frequencyBinCount);

        function detectBlow() {
            analyser.getByteFrequencyData(data);
            let volume = data.reduce((a, b) => a + b, 0) / data.length;

            if (!hasBlown && volume > 30) { // sensitivity threshold
                hasBlown = true;

                // Turn off the candle first
                cake.src = "cake.gif";

                // Delay showing the greeting for dramatic effect
                setTimeout(() => {
                    greeting.textContent = `Happy Birthday, ${username}!`;
                    greeting.style.display = "block";
                    // Play Happy Birthday music
                    const music2 = document.getElementById("music2");
                    if (music2) music2.play().catch(err => console.warn("Autoplay may be blocked", err));
                    // Confetti effects (same as slideshow 8.png)
                    startConfetti(4);
                    if (typeof confetti === "function") {
                        confetti({
                            particleCount: 100,
                            angle: 90,
                            spread: 70,
                            origin: { x: 0.5, y: 0 }
                        });
                        confetti({
                            particleCount: 150,
                            angle: 360,
                            spread: 100,
                            origin: { x: 0.5, y: 0.5 }
                        });
                    }
                    // Show exit button
                    const exitBtn = document.getElementById("exitBtn");
                    if (exitBtn) {
                        exitBtn.style.display = "inline-block";
                        exitBtn.onclick = function(e) {
                            e.preventDefault();
                            if (music2) music2.pause();
                            window.location.href = "about:blank"; // or use window.close() if you want to try closing the tab
                        };
                    }
                }, 1500); // 1.5 seconds delay
            }
            requestAnimationFrame(detectBlow);
        }

        detectBlow();
    }).catch(err => {
        console.error("Microphone access denied or error:", err);
    });

}

