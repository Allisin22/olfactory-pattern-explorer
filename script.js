/*
  OLFACTORY EXPLORER CONTROL FLOW

  1. Pattern explorer stores and compares simplified bulb-output patterns.
  2. Sensory-neuron controls highlight receptors or the axon.
  3. Glomerulus trace reveals the pathway between two neurons.
  4. Projection trace follows a bulb neuron's axon into piriform cortex.
  5. Projection-map controls highlight routes and explain destinations.
*/


// --------- 1. Pattern explorer ---------
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
  patternStatus.textContent =
    "Selected input: Pattern " + selectedPattern;

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
      channel.textContent =
        "Output group " + (index + 1) + ": " + value;
      channel.setAttribute(
        "aria-label",
        "Output group " + (index + 1) + ": " + value +
        ". Click to make this input unavailable."
      );
    } else {
      channel.dataset.value = "hidden";
      channel.textContent =
        "Output group " + (index + 1) + ": ?";
      channel.setAttribute(
        "aria-label",
        "Output group " + (index + 1) +
        ": unavailable. Click to restore."
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


// ---------- 2. Sensory-neuron structure selection ----------
const highlightAxonButton = document.getElementById("highlight-axon");
const receptorButton = document.getElementById("explore-receptors");
const sensoryAxon = document.getElementById("sensory-axon");
const receptorMarkers = document.getElementById("receptor-markers");
const sceneExplanation = document.getElementById("scene-explanation");
const defaultSceneExplanation =
  sceneExplanation.textContent.trim();

function clearHighlights() {
  sensoryAxon.classList.remove("is-highlighted");
  receptorMarkers.classList.remove("is-highlighted");

  highlightAxonButton.setAttribute("aria-pressed", "false");
  receptorButton.setAttribute("aria-pressed", "false");

  sceneExplanation.textContent = defaultSceneExplanation;
}

receptorButton.addEventListener("click", function () {
  const wasActive =
    receptorButton.getAttribute("aria-pressed") === "true";

  clearHighlights();

  if (!wasActive) {
    receptorMarkers.classList.add("is-highlighted");
    receptorButton.setAttribute("aria-pressed", "true");

    sceneExplanation.textContent =
      "These markers represent receptor proteins in the membranes of " +
      "the cilia. Odor molecules interact with receptors here, initiating " +
      "processes inside the sensory neuron that can lead to action potentials.";
  }
});

highlightAxonButton.addEventListener("click", function () {
  const wasActive =
    highlightAxonButton.getAttribute("aria-pressed") === "true";

  clearHighlights();

  if (!wasActive) {
    sensoryAxon.classList.add("is-highlighted");
    highlightAxonButton.setAttribute("aria-pressed", "true");

    sceneExplanation.textContent =
      "The highlighted axon is part of this sensory neuron. " +
      "Action potentials travel along it toward the olfactory bulb; " +
      "the odor molecule itself does not travel down the axon.";
  }
});

// ---------- 3. Glomerulus pathway animation ----------
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
    "The sensory neuron's axon is entering the glomerular circuit.";

  sensoryInputLine.style.strokeDashoffset = "1";
  sensoryTerminal.style.opacity = "0";
  bulbDendrite.style.strokeDashoffset = "1";

  receivingBranches.forEach(function (branch) {
    branch.style.strokeDashoffset = "1";
  });

  bulbOutputAxon.style.strokeDashoffset = "1";

  const reduceMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)"
  ).matches;

  const duration = reduceMotion ? 0 : 2000;
  const pause = reduceMotion ? 0 : 1000;
  const outputDuration = reduceMotion ? 0 : 2700;

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
      duration: outputDuration,
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

// ---------- 4. Bulb-to-piriform projection animation ----------
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
  followProjectionButton.classList.add("is-animating");

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

  followProjectionButton.classList.remove("is-animating");
  followProjectionButton.disabled = false;
});

// ---------- 5. Projection-map region selection ----------
const regionDetails = {
  piriform: {
    nodeId: "piriform-node",
    routeIds: ["route-piriform"],
    title: "Piriform cortex",
    connection: "Direct bulb projection.",
    description:
      "Piriform cortex combines distributed bulb inputs into learned " +
      "odor representations involved in identity and association."
  },

  amygdala: {
    nodeId: "amygdala-node",
    routeIds: ["route-amygdala"],
    title: "Cortical amygdala",
    connection: "Selected areas receive direct bulb projections.",
    description:
      "These circuits contribute to the learned emotional importance " +
      "and behavioral value of odor information."
  },

  entorhinal: {
    nodeId: "entorhinal-node",
    routeIds: ["route-entorhinal"],
    title: "Lateral entorhinal cortex",
    connection: "Direct bulb projection.",
    description:
      "This region links olfactory information with broader contextual " +
      "and memory-related networks."
  },

  orbitofrontal: {
    nodeId: "orbitofrontal-node",
    routeIds: ["route-piriform", "route-orbitofrontal"],
    title: "Orbitofrontal cortex",
    connection:
      "Onward from piriform cortex in this selected route; indirect from the bulb.",
    description:
      "Orbitofrontal cortex contributes to conscious evaluation, " +
      "pleasantness, reward value, and integration with other senses. " +
      "Additional olfactory routes, including thalamic circuitry, also exist."
  },

  hypothalamic: {
    nodeId: "hypothalamic-node",
    routeIds: ["route-amygdala", "route-hypothalamic"],
    title: "Hypothalamic and autonomic networks",
    connection:
      "Onward from cortical amygdala in this selected route; indirect from the bulb.",
    description:
      "These broader circuits can connect odor information with feeding, " +
      "arousal, hormonal regulation, and autonomic responses. Other routes " +
      "from olfactory areas are omitted here."
  },

  hippocampal: {
    nodeId: "hippocampal-node",
    routeIds: ["route-entorhinal", "route-hippocampal"],
    title: "Hippocampal networks",
    connection:
      "Onward through lateral entorhinal cortex; indirect from the bulb.",
    description:
      "These networks contribute to contextual and memory-related processing " +
      "associated with odors and the circumstances in which they occur."
  }
};

const regionButtons = document.querySelectorAll(".region-button");
const mapNodes = document.querySelectorAll(".map-node");
const mapRoutes = document.querySelectorAll(
  ".direct-route, .onward-route"
);

const regionDetailTitle = document.getElementById(
  "region-detail-title"
);
const regionDetailConnection = document.getElementById(
  "region-detail-connection"
);
const regionDetailDescription = document.getElementById(
  "region-detail-description"
);

regionButtons.forEach(function (button) {
  button.addEventListener("click", function () {
    const regionName = button.dataset.region;
    const region = regionDetails[regionName];

    regionButtons.forEach(function (otherButton) {
      const isSelected = otherButton === button;

      otherButton.setAttribute(
        "aria-pressed",
        String(isSelected)
      );
    });

    mapNodes.forEach(function (node) {
      node.classList.remove("is-selected");
    });

    mapRoutes.forEach(function (route) {
      route.classList.remove("is-selected");
    });

    document
      .getElementById(region.nodeId)
      .classList.add("is-selected");

    region.routeIds.forEach(function (routeId) {
      document
        .getElementById(routeId)
        .classList.add("is-selected");
    });

    regionDetailTitle.textContent = region.title;
    regionDetailConnection.textContent = region.connection;
    regionDetailDescription.textContent = region.description;
  });
});