import React, { useState, useEffect, useRef } from 'react';
import { Mic, MicOff } from 'lucide-react';

const MusicVisualizer = () => {
  const [isListening, setIsListening] = useState(false);
  const [mode, setMode] = useState('strobe');
  const [currentColor, setCurrentColor] = useState('#000000');
  const [error, setError] = useState('');
  const [intensity, setIntensity] = useState(0);
  
  const audioContextRef = useRef(null);
  const analyserRef = useRef(null);
  const dataArrayRef = useRef(null);
  const sourceRef = useRef(null);
  const animationRef = useRef(null);
  const lastBeatTimeRef = useRef(0);
  const beatThresholdRef = useRef(0);
  const modeStartTimeRef = useRef(0);
  const currentMainColorIndexRef = useRef(0);

  const strobeColors = ['#FFFFFF', '#000000', '#808080', '#D3D3D3', '#404040', '#C0C0C0'];
  const discoMainColors = ['#FF1493', '#00CED1', '#FFD700', '#9370DB', '#FF69B4', '#00FA9A', '#FF6347'];
  const rgbMainColors = ['#FF0000', '#00FF00', '#0000FF'];
  const rainbowColors = ['#FF0000', '#FF7F00', '#FFFF00', '#00FF00', '#0000FF', '#4B0082', '#9400D3'];
  
  const startListening = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      
      audioContextRef.current = new (window.AudioContext || window.webkitAudioContext)();
      analyserRef.current = audioContextRef.current.createAnalyser();
      analyserRef.current.fftSize = 512;
      analyserRef.current.smoothingTimeConstant = 0.5;
      
      sourceRef.current = audioContextRef.current.createMediaStreamSource(stream);
      sourceRef.current.connect(analyserRef.current);
      
      const bufferLength = analyserRef.current.frequencyBinCount;
      dataArrayRef.current = new Uint8Array(bufferLength);
      
      setIsListening(true);
      setError('');
      modeStartTimeRef.current = Date.now();
      currentMainColorIndexRef.current = 0;
      visualize();
    } catch (err) {
      setError('Could not access microphone. Please allow microphone permissions.');
      console.error('Error accessing microphone:', err);
    }
  };

  const stopListening = () => {
    if (animationRef.current) {
      cancelAnimationFrame(animationRef.current);
    }
    if (sourceRef.current) {
      sourceRef.current.disconnect();
    }
    if (audioContextRef.current) {
      audioContextRef.current.close();
    }
    setIsListening(false);
    setCurrentColor('#000000');
    setIntensity(0);
  };

  const detectBeat = (dataArray) => {
    let sum = 0;
    const bassRange = Math.floor(dataArray.length * 0.25);
    
    for (let i = 0; i < bassRange; i++) {
      sum += dataArray[i];
    }
    
    const average = sum / bassRange;
    beatThresholdRef.current = beatThresholdRef.current * 0.85 + average * 0.15;
    
    const now = Date.now();
    if (average > beatThresholdRef.current * 1.1 && now - lastBeatTimeRef.current > 50) {
      lastBeatTimeRef.current = now;
      return true;
    }
    return false;
  };

  const getOverallIntensity = (dataArray) => {
    let sum = 0;
    for (let i = 0; i < dataArray.length; i++) {
      sum += dataArray[i];
    }
    return (sum / dataArray.length) / 255;
  };

  const visualizeStrobe = (dataArray) => {
    const isBeat = detectBeat(dataArray);
    
    if (isBeat) {
      let randomIndex;
      do {
        randomIndex = Math.floor(Math.random() * strobeColors.length);
      } while (strobeColors[randomIndex] === currentColor && strobeColors.length > 1);
      
      setCurrentColor(strobeColors[randomIndex]);
    }
  };

  const visualizeDisco = (dataArray) => {
    const now = Date.now();
    const elapsed = now - modeStartTimeRef.current;
    
    if (elapsed >= 6000) {
      modeStartTimeRef.current = now;
      currentMainColorIndexRef.current = (currentMainColorIndexRef.current + 1) % discoMainColors.length;
    }
    
    const isBeat = detectBeat(dataArray);
    
    if (isBeat) {
      setCurrentColor(discoMainColors[currentMainColorIndexRef.current]);
    }
  };

  const visualizeRGB = (dataArray) => {
    const now = Date.now();
    const elapsed = now - modeStartTimeRef.current;
    
    if (elapsed >= 6000) {
      modeStartTimeRef.current = now;
      currentMainColorIndexRef.current = (currentMainColorIndexRef.current + 1) % rgbMainColors.length;
    }
    
    const isBeat = detectBeat(dataArray);
    
    if (isBeat) {
      setCurrentColor(rgbMainColors[currentMainColorIndexRef.current]);
    }
  };

  const visualizeRainbow = (dataArray) => {
    const isBeat = detectBeat(dataArray);
    
    if (isBeat) {
      const randomIndex = Math.floor(Math.random() * rainbowColors.length);
      setCurrentColor(rainbowColors[randomIndex]);
    }
  };

  const visualize = () => {
    if (!analyserRef.current || !dataArrayRef.current) return;
    
    analyserRef.current.getByteFrequencyData(dataArrayRef.current);
    const currentIntensity = getOverallIntensity(dataArrayRef.current);
    setIntensity(currentIntensity);
    
    switch (mode) {
      case 'strobe':
        visualizeStrobe(dataArrayRef.current);
        break;
      case 'disco':
        visualizeDisco(dataArrayRef.current);
        break;
      case 'rgb':
        visualizeRGB(dataArrayRef.current);
        break;
      case 'rainbow':
        visualizeRainbow(dataArrayRef.current);
        break;
      default:
        break;
    }
    
    animationRef.current = requestAnimationFrame(visualize);
  };

  useEffect(() => {
    return () => {
      stopListening();
    };
  }, []);

  useEffect(() => {
    if (isListening) {
      modeStartTimeRef.current = Date.now();
      currentMainColorIndexRef.current = 0;
      setCurrentColor('#000000');
    }
  }, [mode]);

  const pulseScale = 1 + (intensity * 0.3);

  return (
    <div style={{ 
      width: '100vw', 
      height: '100vh', 
      backgroundColor: currentColor,
      transition: 'background-color 0.1s ease',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      position: 'relative',
      filter: `brightness(${0.7 + intensity * 0.5})`
    }}>
      <div style={{
        position: 'absolute',
        top: '20px',
        left: '50%',
        transform: `translateX(-50%) scale(${pulseScale})`,
        backgroundColor: 'rgba(0, 0, 0, 0.85)',
        padding: '20px',
        borderRadius: '15px',
        display: 'flex',
        flexDirection: 'column',
        gap: '15px',
        alignItems: 'center',
        minWidth: '320px',
        transition: 'transform 0.1s ease',
        boxShadow: `0 0 ${30 * intensity}px rgba(255, 255, 255, ${intensity * 0.5})`
      }}>
        <h1 style={{ 
          color: 'white', 
          margin: 0, 
          fontSize: '24px',
          textShadow: `0 0 ${10 * intensity}px rgba(255, 255, 255, ${intensity})`
        }}>
          Music Visualizer
        </h1>
        
        <button
          onClick={isListening ? stopListening : startListening}
          style={{
            padding: '12px 24px',
            fontSize: '16px',
            backgroundColor: isListening ? '#ef4444' : '#22c55e',
            color: 'white',
            border: 'none',
            borderRadius: '8px',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            fontWeight: 'bold',
            transform: isListening ? `scale(${pulseScale})` : 'scale(1)',
            transition: 'transform 0.1s ease'
          }}
        >
          {isListening ? <MicOff size={20} /> : <Mic size={20} />}
          {isListening ? 'Stop Listening' : 'Start Listening'}
        </button>

        <div style={{ 
          display: 'flex', 
          gap: '10px',
          flexWrap: 'wrap',
          justifyContent: 'center'
        }}>
          <button
            onClick={() => setMode('strobe')}
            style={{
              padding: '10px 20px',
              fontSize: '14px',
              backgroundColor: mode === 'strobe' ? '#3b82f6' : '#6b7280',
              color: 'white',
              border: 'none',
              borderRadius: '6px',
              cursor: 'pointer',
              fontWeight: mode === 'strobe' ? 'bold' : 'normal',
              transform: mode === 'strobe' && isListening ? `scale(${pulseScale})` : 'scale(1)',
              transition: 'all 0.1s ease'
            }}
          >
            Strobe
          </button>
          <button
            onClick={() => setMode('disco')}
            style={{
              padding: '10px 20px',
              fontSize: '14px',
              backgroundColor: mode === 'disco' ? '#3b82f6' : '#6b7280',
              color: 'white',
              border: 'none',
              borderRadius: '6px',
              cursor: 'pointer',
              fontWeight: mode === 'disco' ? 'bold' : 'normal',
              transform: mode === 'disco' && isListening ? `scale(${pulseScale})` : 'scale(1)',
              transition: 'all 0.1s ease'
            }}
          >
            Disco
          </button>
          <button
            onClick={() => setMode('rgb')}
            style={{
              padding: '10px 20px',
              fontSize: '14px',
              backgroundColor: mode === 'rgb' ? '#3b82f6' : '#6b7280',
              color: 'white',
              border: 'none',
              borderRadius: '6px',
              cursor: 'pointer',
              fontWeight: mode === 'rgb' ? 'bold' : 'normal',
              transform: mode === 'rgb' && isListening ? `scale(${pulseScale})` : 'scale(1)',
              transition: 'all 0.1s ease'
            }}
          >
            RGB
          </button>
          <button
            onClick={() => setMode('rainbow')}
            style={{
              padding: '10px 20px',
              fontSize: '14px',
              backgroundColor: mode === 'rainbow' ? '#3b82f6' : '#6b7280',
              color: 'white',
              border: 'none',
              borderRadius: '6px',
              cursor: 'pointer',
              fontWeight: mode === 'rainbow' ? 'bold' : 'normal',
              transform: mode === 'rainbow' && isListening ? `scale(${pulseScale})` : 'scale(1)',
              transition: 'all 0.1s ease'
            }}
          >
            Rainbow
          </button>
        </div>

        {error && (
          <div style={{
            color: '#fca5a5',
            fontSize: '14px',
            textAlign: 'center',
            maxWidth: '280px'
          }}>
            {error}
          </div>
        )}

        {isListening && (
          <div style={{
            width: '100%',
            height: '8px',
            backgroundColor: 'rgba(255, 255, 255, 0.2)',
            borderRadius: '4px',
            overflow: 'hidden'
          }}>
            <div style={{
              width: `${intensity * 100}%`,
              height: '100%',
              backgroundColor: '#22c55e',
              transition: 'width 0.1s ease',
              boxShadow: `0 0 ${10 * intensity}px #22c55e`
            }} />
          </div>
        )}

        <div style={{
          color: '#d1d5db',
          fontSize: '12px',
          textAlign: 'center',
          maxWidth: '280px'
        }}>
          {isListening ? '🎵 Listening... Drop the beat! 🔥' : 'Play some music and watch the screen react to the beats!'}
        </div>
      </div>
    </div>
  );
};

export default MusicVisualizer;