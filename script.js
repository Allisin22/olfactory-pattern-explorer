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

const highlightAxonButton = document.getElementById("highlight-axon");
const receptorButton = document.getElementById("explore-receptors");
const sensoryAxon = document.getElementById("sensory-axon");
const receptorMarkers = document.getElementById("receptor-markers");
const sceneExplanation = document.getElementById("scene-explanation");

function clearHighlights() {
  sensoryAxon.classList.remove("is-highlighted");
  receptorMarkers.classList.remove("is-highlighted");

  highlightAxonButton.setAttribute("aria-pressed", "false");
  receptorButton.setAttribute("aria-pressed", "false");
}

receptorButton.addEventListener("click", function () {
  clearHighlights();

  receptorMarkers.classList.add("is-highlighted");
  receptorButton.setAttribute("aria-pressed", "true");

  sceneExplanation.textContent =
    "These markers represent receptor proteins in the membranes of " +
    "the cilia. Odor molecules interact with receptors here, initiating " +
    "processes inside the sensory neuron that can lead to action potentials.";
});

highlightAxonButton.addEventListener("click", function () {
  clearHighlights();

  sensoryAxon.classList.add("is-highlighted");
  highlightAxonButton.setAttribute("aria-pressed", "true");

  sceneExplanation.textContent =
    "The highlighted axon is part of this sensory neuron. " +
    "Action potentials travel along it toward the olfactory bulb; " +
    "the odor molecule itself does not travel down the axon.";
});

const traceInputButton = document.getElementById("trace-sensory-input");
const sensoryInputLine = document.getElementById("sensory-input-line");
const sensoryTerminal = document.getElementById("sensory-terminal");
const traceStatus = document.getElementById("trace-status");
const receivingBranches = document.querySelectorAll(
  "#receiving-branches line"
);
const bulbDendrite = document.getElementById("bulb-dendrite");
const bulbOutputAxon = document.getElementById("bulb-output-axon");

traceInputButton.addEventListener("click", async function () {
  traceInputButton.disabled = true;
  traceStatus.textContent =
    "The sensory neurn's axon is entering the glomerular circuit.";

  sensoryInputLine.style.strokeDashoffset = "1";
  sensoryTerminal.style.opacity = "0";
  bulbDendrite.style.strokeDashoffset = "1";

  receivingBranches.forEach(function (branch) {
    branch.style.strokeDashoffset = "1";
    bulbOutputAxon.style.strokeDashoffset = "1";
  });

  const reduceMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)"
  ).matches;

  const duration = reduceMotion ? 0 : 900;
  const pause = reduceMotion ? 0 : 400;

  const sensoryDrawing = sensoryInputLine.animate(
    [
      { strokeDashoffset: 1 },
      { strokeDashoffset: 0 }
    ],
    {
      duration: duration,
      easing: "linear",
      fill: "forwards"
    }
  );

  await sensoryDrawing.finished;

  sensoryInputLine.style.strokeDashoffset = "0";
  sensoryTerminal.style.opacity = "1";
  traceStatus.textContent =
    "The sensory axon ends here. Across synapses, it can influence a different neuron.";

  await new Promise(function (resolve) {
    setTimeout(resolve, pause);
  });

  const branchDrawings = [];

  receivingBranches.forEach(function (branch) {
    const branchDrawing = branch.animate(
      [
        { strokeDashoffset: 1 },
        { strokeDashoffset: 0 }
      ],
      {
        duration: duration / 2,
        easing: "linear",
        fill: "forwards"
      }
    );

    branchDrawings.push(branchDrawing.finished);
  });

  await Promise.all(branchDrawings);

  traceStatus.textContent =
    "The blue branches and dendrite belong to a bulb neuron receiving that input.";

  receivingBranches.forEach(function (branch) {
    branch.style.strokeDashoffset = "0";
  });

  const dendriteDrawing = bulbDendrite.animate(
    [
      { strokeDashoffset: 1 },
      { strokeDashoffset: 0 }
    ],
    {
      duration: duration,
      easing: "linear",
      fill: "forwards"
    }
  );

  await dendriteDrawing.finished;

  bulbDendrite.style.strokeDashoffset = "0";

  const outputDrawing = bulbOutputAxon.animate(
    [
      { strokeDashoffset: 1 },
      { strokeDashoffset: 0 }
    ],
    {
      duration: 1200,
      easing: "linear",
      fill: "forwards"
    }
  );

  await outputDrawing.finished;

  bulbOutputAxon.style.strokeDashoffset = "0";
  traceStatus.textContent =
    "The bulb neuron's axon carries its output toward receiving brain regions.";
  traceInputButton.disabled = false;
});

const followProjectionButton = document.getElementById(
  "follow-projection"
);
const directProjection = document.getElementById("direct-projection");
const projectionTerminals = document.getElementById(
  "projection-terminals"
);
const projectionStatus = document.getElementById("projection-status");

followProjectionButton.addEventListener("click", async function () {
  followProjectionButton.disabled = true;

  directProjection.style.strokeDashoffset = "1";
  projectionTerminals.style.opacity = "0";

  projectionStatus.textContent =
    "The highlighted axon belongs to a neuron in the olfactory bulb.";

  const reduceMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)"
  ).matches;

  const projectionDrawing = directProjection.animate(
    [
      { strokeDashoffset: 1 },
      { strokeDashoffset: 0 }
    ],
    {
      duration: reduceMotion ? 0 : 1200,
      easing: "linear",
      fill: "forwards"
    }
  );

  await projectionDrawing.finished;

  directProjection.style.strokeDashoffset = "0";
  projectionTerminals.style.opacity = "1";

  projectionStatus.textContent =
    "The bulb neuron's axon enters piriform cortex and forms " +
    "connections there. This is a direct bulb projection.";

  followProjectionButton.disabled = false;
});