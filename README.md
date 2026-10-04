# How Does Smell Convey Information?

An interactive educational visualization that follows a simplified olfactory signal from sensory receptors to selected receiving brain regions.

## What the interaction shows

The visualization is organized into four stages:

1. **Receive** — odor molecules interact with receptors on an olfactory sensory neuron.
2. **Relay** — the sensory axon enters a glomerular circuit and influences a bulb neuron.
3. **Project** — a bulb neuron sends an output axon toward piriform cortex.
4. **Distribute** — selected direct bulb projections are distinguished from routes involving additional circuitry.

Readers can highlight structures, trace signal paths, and select brain regions to examine how olfactory information is distributed.

## Built with

- HTML
- CSS
- JavaScript
- Inline SVG
- ARIA labels and live status updates

The project does not use a JavaScript framework or backend.

## Scientific scope

This is a simplified teaching model, not an anatomical simulation or a diagram drawn to scale.

In the projection map:

- Piriform cortex, selected cortical amygdala areas, and lateral entorhinal cortex represent direct targets of olfactory-bulb output.
- Orbitofrontal, hypothalamic/autonomic, and hippocampal networks are shown through selected onward routes involving additional circuitry.
- Many neurons, branches, synapses, feedback pathways, and intermediate regions are intentionally omitted.

“Direct” means that an axon originating in the olfactory bulb reaches the selected target. It does not mean that the signal reaches that target without processing or synaptic activity.

## Accessibility

The interaction includes:

- Semantic buttons
- Keyboard-accessible controls
- Visible focus behavior
- `aria-pressed` states for persistent selections
- `aria-live` updates for changing explanations
- Reduced-motion handling for animated paths
- Responsive layouts for desktop, tablet, and mobile screens

## Run locally

Open `index.html` in a browser.

For normal browser-origin behavior, serve the folder through a local web server or view the deployed GitHub Pages version.

## Project status

Version 1 is complete.

Future development may connect this visualization to a longer Alice Is In research artifact exploring olfactory coding, perception, mood, and pattern completion.