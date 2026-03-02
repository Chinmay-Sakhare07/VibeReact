# 🎵 VibeReact - Your Screen Reacts to the Beat

## The Story

So I was mindlessly scrolling through TEMU at 1am (we've all been there) and I stumbled across these LED strips that react to music. You know the ones - they pulse and change color with the beat, people have them behind their monitors and TV setups. I genuinely wanted it. I had it in my cart for a solid 10 minutes.

Then I thought about it. I'd set it up, think it's the coolest thing ever for like three days, and then it would just sit there collecting dust behind my desk. $22 down the drain.

But the idea stuck with me. What if my screen did that instead? I already have a monitor. I'm already playing music. Why not just make the whole thing react to what I'm listening to?

That's how VibeReact started. No fancy hardware, no waiting for a shipping container from across the world - just your browser, your music, and your screen moving with the beat.

---

## What It Does

VibeReact captures audio from your microphone in real time and makes your entire screen react to it. The background color pulses and flashes on every beat, the UI elements scale with the audio intensity, and you get four different visual modes depending on your vibe.

### Modes

| Mode | Behavior |
|---|---|
| **Strobe** | Flashes between white, grey, and black tones on every beat |
| **Disco** | Cycles through vibrant colors every 6 seconds, flashes on beat |
| **RGB** | Rotates through pure Red, Green, Blue every 6 seconds, flashes on beat |
| **Rainbow** | Randomly picks from the full rainbow spectrum on every beat |

> **Note:** To switch modes, stop listening first, select your mode, then start listening again.

---

## Tech Stack

| Technology | Purpose |
|---|---|
| React 18 | UI framework, state and refs via hooks |
| Web Audio API | Captures live microphone audio stream |
| `AudioContext` / `AnalyserNode` | Real-time FFT frequency analysis (fftSize: 512) |
| `getUserMedia` | Browser microphone access |
| `requestAnimationFrame` | Smooth 60fps animation loop |
| Lucide React | Mic / MicOff icons |
| Web Vitals | Performance monitoring |
| Create React App | Project bootstrapping and build tooling |

---

## How It Works

1. On **Start Listening**, the app requests microphone access via `navigator.mediaDevices.getUserMedia`
2. An `AudioContext` and `AnalyserNode` are created - FFT size **512**, smoothing constant **0.5**
3. Every animation frame, `getByteFrequencyData()` reads the frequency spectrum into a `Uint8Array`
4. **Beat detection** averages the bottom 25% of frequency bins (bass range) against a rolling threshold - a beat fires when the average exceeds the threshold by 10%, with a minimum 50ms gap between beats
5. **Intensity** is the average of all frequency bins normalized to 0–1, driving screen brightness, UI pulse scale, and the intensity bar
6. The active mode's color logic fires on each detected beat and updates the full-screen background via React state

---

## Getting Started

### Prerequisites
- Node.js 16+
- Chrome, Firefox, or Edge (Web Audio API support required)

### Installation

```bash
git clone https://github.com/Chinmay-Sakhare07/VibeReact.git
cd VibeReact
npm install
npm start
```

Open [http://localhost:3000](http://localhost:3000) and allow microphone permissions when prompted.

### How to Use

1. Pick a mode - **Strobe**, **Disco**, **RGB**, or **Rainbow**
2. Hit **Start Listening**
3. Play music out loud near your mic and watch your screen go
4. To switch modes - hit **Stop Listening**, select a new mode, then **Start Listening** again

---

## Available Scripts

### `npm start`
Runs the app in development mode at [http://localhost:3000](http://localhost:3000).

### `npm run build`
Builds the production-ready app into the `build` folder - minified and optimized.

### `npm test`
Launches the test runner in interactive watch mode.

---

## Browser Support

| Browser | Supported |
|---|---|
| Chrome | ✅ |
| Firefox | ✅ |
| Edge | ✅ |
| Safari | ⚠️ Partial (Web Audio API limitations) |

---

## Live Demo

🔗 [vibe-react-five.vercel.app](https://vibereact.vercel.app/)

---