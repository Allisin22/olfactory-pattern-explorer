const patterns = {
  A: [1, 1, 0, 0, 1, 0, 1, 0],
  B: [1, 1, 0, 0, 0, 1, 1, 0],
  C: [0, 0, 1, 1, 1, 0, 1, 0]
};

console.log(patterns);

let selectedPattern = "A";
let availableChannels = [true, true, true, true, true, true, true, true];

const patternSelect = document.getElementById("pattern-select");
const patternStatus = document.getElementById("pattern-status");

patternSelect.addEventListener("change", function () {
  selectedPattern = patternSelect.value;
  patternStatus.textContent = "Selected pattern: " + selectedPattern;

});

const channelsContainer = document.getElementById("channels");

function renderChannels() {
  channelsContainer.replaceChildren();

  const currentPattern = patterns[selectedPattern];

  currentPattern.forEach(function (value, index) {
    const channel = document.createElement("button");
    const isAvailable = availableChannels[index];

    channel.type = "button";
    channel.className = "channel";

    if (isAvailable) {
      channel.dataset.value = value;
      channel.textContent = "Channel " + (index + 1) + ": " + value;
      channel.setAttribute(
        "aria-label",
        "Channel " + (index + 1) + ": " + value + ". Click to hide."
      );
    } else {
      channel.dataset.value = "hidden";
      channel.textContent = "Channel " + (index + 1) + ": ?";
      channel.setAttribute(
        "aria-label",
        "Channel " + (index + 1) + ": unavailable. Click to restore."
      );
    }

    channel.addEventListener("click", function () {
      availableChannels[index] = !availableChannels[index];
      renderChannels();
      channelsContainer.children[index].focus();
    });

    channelsContainer.appendChild(channel);
  });

  renderMatches();
}

renderChannels();

function findMatchingPatterns() {
  const observedPattern = patterns[selectedPattern];
  const matches = [];

  for (const patternName of Object.keys(patterns)) {
    const candidatePattern = patterns[patternName];
    let fitsEvidence = true;

    for (let index = 0; index < availableChannels.length; index++) {
      if (!availableChannels[index]) {
        continue;
      }

      if (candidatePattern[index] !== observedPattern[index]) {
        fitsEvidence = false;
        break;
      }
    }

    if (fitsEvidence) {
      matches.push(patternName);
    }
  }

  return matches;
}

function renderMatches() {
  const matchStatus = document.getElementById("match-status");
  const matches = findMatchingPatterns();

  if (!availableChannels.includes(true)) {
    matchStatus.textContent = "No channels visible: not enough information.";
  } else if (matches.length === 1) {
    matchStatus.textContent = "One matching pattern: " + matches[0];
  } else {
    matchStatus.textContent = "Possible patterns: " + matches.join(", ");
  }
}

const restoreButton = document.getElementById("restore-channels");

restoreButton.addEventListener("click", function () {
  availableChannels.fill(true);
  renderChannels();
});