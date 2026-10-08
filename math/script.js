const storedPattern = [
  1, -1, 1, 1, -1,
  -1, 1, -1, -1, 1,
  1, 1, -1, 1, -1,
  -1, -1, 1, -1, 1,
  1, -1, 1, 1, -1
];

const N = storedPattern.length;

function buildWeights(pattern) {
  const weights = [];

  for (let i = 0; i < N; i++) {
    const row = [];

    for (let j = 0; j < N; j++) {
      if (i === j) {
        row.push(0);
      } else {
        const weight = (pattern[i] * pattern[j]) / N;
        row.push(weight);
      }
    }

    weights.push(row);
  }

  return weights;
}

const weights = buildWeights(storedPattern);

console.log(weights);

function createDegradedPattern(pattern, indicesToFlip) {
  const degradedPattern = [...pattern];

  for (const index of indicesToFlip) {
    degradedPattern[index] *= -1;
  }

  return degradedPattern;
}

const degradedPattern = createDegradedPattern(
  storedPattern,
  [1, 7, 13]
);

console.log("stored:", storedPattern);
console.log("degraded:", degradedPattern);

const storedPatternElement = document.querySelector("#stored-pattern");
const degradedPatternElement = document.querySelector("#degraded-pattern");
const runRecoveryButton = document.querySelector("#run-recovery");
const recoveryResult = document.querySelector("#recovery-result");
const resetRecoveryButton = document.querySelector("#reset-recovery");
const runMath = document.querySelector("#run-math");

function renderPattern(pattern, container) {
  container.innerHTML = "";

  for (const state of pattern) {
    const cell = document.createElement("div");

    cell.textContent = state;

    if (state === 1) {
      cell.classList.add("state-positive");
    } else {
      cell.classList.add("state-negative");
    }

    container.appendChild(cell);
  }
}

function updatePattern(pattern, weights) {
  const nextPattern = [];

  for (let i = 0; i < pattern.length; i++) {
    let totalInput = 0;

    for (let j = 0; j < pattern.length; j++) {
      totalInput += weights[i][j] * pattern[j];
    }

    if (totalInput > 0) {
      nextPattern.push(1);
    } else if (totalInput < 0) {
      nextPattern.push(-1);
    } else {
      nextPattern.push(pattern[i]);
    }
  }

  return nextPattern;
}

const updatedPattern = updatePattern(degradedPattern, weights);

console.log("updated:", updatedPattern);

const updatedPatternElement =
  document.querySelector("#updated-pattern");

function countMatches(patternA, patternB) {
  let matches = 0;

  for (let i = 0; i < patternA.length; i++) {
    if (patternA[i] === patternB[i]) {
      matches++;
    }
  }

  return matches;
}

function patternsMatch(patternA, patternB) {
  for (let i = 0; i < patternA.length; i++) {
    if (patternA[i] !== patternB[i]) {
      return false;
    }
  }

  return true;
}

function runUntilStable(startPattern, weights) {
  let currentPattern = [...startPattern];

  for (let step = 1; step <= 20; step++) {
    const nextPattern = updatePattern(currentPattern, weights);

    if (patternsMatch(currentPattern, nextPattern)) {
      return {
        pattern: nextPattern,
        steps: step,
        stabilized: true
      };
    }

    currentPattern = nextPattern;
  }

  return {
    pattern: currentPattern,
    steps: 20,
    stabilized: false
  };
}

function calculateInputForUnit(pattern, weights, i) {
  let totalInput = 0;

  for (let j = 0; j < pattern.length; j++) {
    totalInput += weights[i][j] * pattern[j];
  }

  return totalInput;
}

renderPattern(storedPattern, storedPatternElement);
renderPattern(degradedPattern, degradedPatternElement);

runRecoveryButton.addEventListener("click", function () {
  const result = runUntilStable(
    degradedPattern,
    weights
  );

  renderPattern(
    result.pattern,
    updatedPatternElement
  );

  const matches = countMatches(
    result.pattern,
    storedPattern
  );

  runRecoveryButton.classList.add("is-active");
  runRecoveryButton.disabled = true;

  if (result.stabilized) {
    recoveryResult.textContent =
      `Stabilized after ${result.steps} updates · ${matches}/${storedPattern.length} units match the stored pattern`;
  } else {
    recoveryResult.textContent =
      `Stopped after ${result.steps} updates · ${matches}/${storedPattern.length} units match the stored pattern`;
  }

  const degradedMatches = countMatches(
    degradedPattern,
    storedPattern
  );

  const exampleIndex = degradedPattern.findIndex(
    (state, i) => state !== storedPattern[i]
  );

  const exampleInput = calculateInputForUnit(
    degradedPattern,
    weights,
    exampleIndex
  );

  let exampleNextState;

  if (exampleInput > 0) {
    exampleNextState = 1;
  } else if (exampleInput < 0) {
    exampleNextState = -1;
  } else {
    exampleNextState = degradedPattern[exampleIndex];
  }

  runMath.innerHTML = `
  <strong>This run</strong>
  <p>
    Degraded input: ${degradedMatches}/${storedPattern.length}
    units match the stored pattern.
  </p>

  <p>
    For unit ${exampleIndex + 1}:
    h<sub>${exampleIndex + 1}</sub>
    = Σ w<sub>${exampleIndex + 1}j</sub>s<sub>j</sub>
    = ${exampleInput.toFixed(2)}
  </p>

  <p>
    Its weighted input is
    ${exampleInput > 0 ? "positive" : exampleInput < 0 ? "negative" : "zero"},
    so its next state is ${exampleNextState > 0 ? "+1" : "−1"}.
  </p>
`;
});

resetRecoveryButton.addEventListener("click", function () {
  updatedPatternElement.innerHTML = "";
  recoveryResult.textContent = "";
  runMath.innerHTML = "";
  runRecoveryButton.classList.remove("is-active");
  runRecoveryButton.disabled = false;
});