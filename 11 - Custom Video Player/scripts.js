// get elements

const player = document.querySelector(".player");
const video = player.querySelector(".viewer");
const progress = player.querySelector(".progress");
const progressBar = player.querySelector(".progress__filled");
const toggle = player.querySelector(".toggle");
const skipButtons = player.querySelectorAll("[data-skip]");
const ranges = player.querySelectorAll(".player__slider");

// cb functions

function togglePlay() {
  video.paused ? video.play() : video.pause();
}

function updateButton() {
  toggle.textContent = this.paused ? "►" : "❚ ❚";
}

function skip() {
  video.currentTime += +this.dataset.skip;
}

function handleRangeUpdate() {
  video[this.name] = this.value;
}

function handleProgress() {
  const percent = (video.currentTime / video.duration) * 100;
  progressBar.style.flexBasis = `${percent}%`;
}

function scrub(event) {
  const scrubTime = (event.offsetX / progress.offsetWidth) * video.duration;
  video.currentTime = scrubTime;
}

// connect to event listeners

let progressMouseDown = false;

video.addEventListener("click", togglePlay);
video.addEventListener("play", updateButton);
video.addEventListener("pause", updateButton);
video.addEventListener("timeupdate", handleProgress);
toggle.addEventListener("click", togglePlay);
skipButtons.forEach(each => each.addEventListener("click", skip));
progress.addEventListener("click", scrub);
progress.addEventListener("mousemove", e => progressMouseDown && scrub(e));
progress.addEventListener("mousedown", () => {
  progressMouseDown = true;
});
progress.addEventListener("mouseup", () => {
  progressMouseDown = false;
});
ranges.forEach(each => each.addEventListener("change", handleRangeUpdate));
