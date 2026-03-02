# 🎵 Music Visualizer — Your Screen Reacts to the Beat

## The Story

So I was mindlessly scrolling through TEMU at 1am (we've all been there) and I stumbled across these LED strips that react to music. You know the ones — they pulse and change color with the beat, people have them behind their monitors and TV setups. I genuinely wanted it. I had it in my cart for a solid 10 minutes.

Then I thought about it. I'd set it up, think it's the coolest thing ever for like three days, and then it would just sit there collecting dust behind my desk. $22 down the drain.

But the idea stuck with me. What if my screen did that instead? I already have a monitor. I'm already playing music. Why not just make the whole thing react to what I'm listening to?

That's how this started. No fancy hardware, no waiting for a shipping container from across the world — just your browser, your music, and your screen moving with the beat.

---

## What It Does

Music Visualizer captures audio from your microphone in real time and makes your entire screen react to it. The background color pulses and flashes with the beat, the UI elements scale with the intensity, and you get four different visual modes depending on your vibe. It's the LED strip experience — built right into your browser.

### Modes
| Mode | Behavior |
|---|---|
| **Strobe** | Flashes white, grey, and black tones on every beat |
| **Disco** | Cycles through vibrant colors every 6 seconds, flashes on beat |
| **RGB** | Rotates through pure Red, Green, Blue every 6 seconds, flashes on beat |
| **Rainbow** | Randomly picks from the full rainbow spectrum on every beat |

---

## Tech Stack

| Technology | Purpose |
|---|---|
| React 18 | UI framework, state management via hooks |
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
2. An `AudioContext` and `AnalyserNode` are created with an FFT size of **512** and a smoothing constant of **0.5**
3. Every animation frame, `getByteFrequencyData()` reads the frequency spectrum into a `Uint8Array`
4. **Beat detection** works by averaging the bottom 25% of frequency bins (bass range) and comparing it against a rolling threshold — a beat is triggered when the average exceeds the threshold by 10%, with a minimum gap of 50ms between beats
5. **Overall intensity** is calculated as the average of all frequency bins normalized to 0–1, which drives the screen brightness, UI pulse scale, and the green intensity bar
6. The active mode's color logic fires on each detected beat and updates the background via React state

---

## Getting Started

### Prerequisites
- Node.js 16+
- A browser with Web Audio API support (Chrome, Firefox, Edge)

### Installation

```bash
git clone https://github.com/YOUR_USERNAME/YOUR_REPO.git
cd YOUR_REPO
npm install
npm start
```

Open [http://localhost:3000](http://localhost:3000) and allow microphone permissions when prompted.

> **Tip:** Play music out loud or through speakers near your mic for the best effect. The visualizer reacts to ambient audio captured by your microphone.

---

## Available Scripts

### `npm start`
Runs the app in development mode at [http://localhost:3000](http://localhost:3000).

### `npm run build`
Builds the production-ready app into the `build` folder — minified and optimized.

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

> Safari has known restrictions with `getUserMedia` on non-HTTPS origins.

---

## Live Demo

-- Coming soon

---

## License
