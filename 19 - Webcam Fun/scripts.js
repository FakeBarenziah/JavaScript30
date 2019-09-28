const video = document.querySelector(".player");
const canvas = document.querySelector(".photo");
const ctx = canvas.getContext("2d");
const strip = document.querySelector(".strip");
const snap = document.querySelector(".snap");

async function getVideo() {
  try {
    const localMediaStream = await navigator.mediaDevices.getUserMedia({
      video: true,
      audio: false
    });

    /*
  The window.URL.createObjectURL method does not accept MediaStreams as arguments in Firefox anymore. The HTMLMediaElement.prototype.srcObject property can be set with a MediaStream instead.
  */

    video.srcObject = localMediaStream;
    video.play();
  } catch (error) {
    console.error(error);
  }
}

function paintToCanvas() {
  // Sets the canvas dimensions to match the video's and store it in a variable
  const width = (canvas.width = video.videoWidth);
  const height = (canvas.height = video.videoHeight);

  // Draw the video stream to the context every 16ms and return the interval id
  return setInterval(() => {
    ctx.drawImage(video, 0, 0, width, height);
    let pixels = ctx.getImageData(0, 0, width, height);
    // ctx.globalAlpha = 0.1;
    // pixels = rgbShift(pixels);
    // pixels = redEffect(pixels);
    // pixels = brightness(pixels, 1.5);
    // pixels = snow(pixels);
    // pixels = negative(pixels);
    // pixels = greenScreen(pixels);
    ctx.putImageData(pixels, 0, 0);
  }, 16);
}

function takePhoto() {
  snap.currentTime = 0;
  snap.play();

  const photoID = Math.ceil(Math.random() * 999);
  const data = canvas.toDataURL("image/jpeg");
  const link = document.createElement("a");
  link.href = data;
  link.setAttribute("download", `picture-${photoID}`);
  link.innerHTML = `<img src="${data}" alt="${photoID}"/>`;
  if (strip.hasChildNodes) {
    strip.insertBefore(link, strip.firstChild);
  } else {
    strip.appendChild(link);
  }
}

function redEffect(pixels) {
  for (let i = 0; i < pixels.data.length; i += 4) {
    pixels.data[i] += 180;
    pixels.data[i + 1] -= 50;
    pixels.data[i + 2] *= 0.5;
  }
  return pixels;
}

function brightness(pixels, multiplier) {
  for (let i = 0; i < pixels.data.length; i += 4) {
    pixels.data[i] *= multiplier;
    pixels.data[i + 1] *= multiplier;
    pixels.data[i + 2] *= multiplier;
  }
  return pixels;
}

function snow(pixels) {
  for (let i = 0; i < pixels.data.length; i += 4) {
    if (Math.ceil(Math.random() * 8) <= 3) {
      pixels.data[i] = Math.floor(Math.random() * 225);
      pixels.data[i + 1] = Math.floor(Math.random() * 225);
      pixels.data[i + 2] = Math.floor(Math.random() * 225);
    }
  }
  return pixels;
}

function negative(pixels) {
  for (let i = 0; i < pixels.data.length; i += 4) {
    if (pixels.data[i] < 127) {
      pixels.data[i] = 256 - pixels.data[i];
    } else if (pixels.data[i] > 128) {
      pixels.data[i] = 128 - (pixels.data[i] - 128);
    }
    if (pixels.data[i + 1] < 127) {
      pixels.data[i + 1] = 256 - pixels.data[i + 1];
    } else if (pixels.data[i + 1] > 128) {
      pixels.data[i + 1] = 128 - (pixels.data[i + 1] - 128);
    }
    if (pixels.data[i + 2] < 127) {
      pixels.data[i + 2] = 256 - pixels.data[i + 2];
    } else if (pixels.data[i + 2] > 128) {
      pixels.data[i + 2] = 128 - (pixels.data[i + 2] - 128);
    }
  }
  return pixels;
}

function rgbShift(pixels) {
  for (let i = 0; i < pixels.data.length; i += 4) {
    pixels.data[i - 150] = pixels.data[i];
    pixels.data[i + 100] = pixels.data[i + 1];
    pixels.data[i - 150] = pixels.data[i + 2];
  }
  return pixels;
}

function greenScreen(pixels) {
  const levels = {};

  document.querySelectorAll(".rgb input").forEach(input => {
    levels[input.name] = input.value;
  });

  const { rmin, rmax, gmin, gmax, bmin, bmax } = levels;

  for (let i = 0; i < pixels.data.length; i += 4) {
    const red = pixels.data[i];
    const green = pixels.data[i + 1];
    const blue = pixels.data[i + 2];

    if (
      red >= rmin &&
      red <= rmax &&
      green >= gmin &&
      green <= gmax &&
      blue >= bmin &&
      blue <= bmax
    ) {
      pixels.data[i + 3] = 0;
    }
  }
  return pixels;
}

getVideo();

video.addEventListener("canplay", paintToCanvas);
