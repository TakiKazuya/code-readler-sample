import React, { useEffect, useState, useRef } from 'react';
import { BarcodeFormat, DecodeHintType, BrowserMultiFormatReader } from '@zxing/library';

type Mode = 'qr' | 'intermediate' | 'barcode';

const CodeReader: React.FC = () => {
  const [result, setResult] = useState('No result');
  const [mode, setMode] = useState<Mode>('qr');
  const videoRef = useRef<HTMLVideoElement>(null);
  const hints = new Map();
  const formats = [BarcodeFormat.QR_CODE, BarcodeFormat.CODE_128, BarcodeFormat.EAN_13, BarcodeFormat.EAN_8];
  hints.set(DecodeHintType.POSSIBLE_FORMATS, formats);
  const codeReader = new BrowserMultiFormatReader(undefined, 500);

  const resultBuffer: string[] = [];

  useEffect(() => {
    const startScanning = async () => {
      if (videoRef.current) {
        try {
          await codeReader.decodeFromVideoDevice(null, videoRef.current, (result, _error) => {
            if (result) {
              const text = result.getText();

              // 精度向上のため、3回連続で同じ値が出た場合のみ採用する
              if (resultBuffer.length === 3) {
                resultBuffer.shift();
              }

              resultBuffer.push(text);

              if (resultBuffer.every((item) => item === text)) {
                setResult(text);
              }
            }
          });
        } catch (err) {
          console.error(err);
        }
      }
    };

    (async () => {
      await startScanning();
    })();

    return () => {
      codeReader.reset();
    };
  }, [codeReader]);

  const toggleMode = () => {
    setMode((prevMode) => {
      if (prevMode === 'qr') return 'intermediate';
      if (prevMode === 'intermediate') return 'barcode';
      return 'qr';
    });
  };

  const getVideoHeight = () => {
    switch (mode) {
      case 'qr':
        return '100%';
      case 'intermediate':
        return '300px';
      case 'barcode':
        return '100px';
      default:
        return '100%';
    }
  };

  return (
    <div>
      <button onClick={toggleMode}>Switch Mode</button>
      <br />
      <video ref={videoRef} style={{ width: '100%', height: getVideoHeight(), objectFit: 'none' }} />
      <p>{result}</p>
    </div>
  );
};

export default CodeReader;
