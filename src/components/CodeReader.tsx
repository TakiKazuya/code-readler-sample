import React, { useEffect, useState, useRef } from 'react';
import { BarcodeFormat, DecodeHintType, BrowserMultiFormatReader } from '@zxing/library';

const CodeReader: React.FC = () => {
  const [result, setResult] = useState('No result');
  const videoRef = useRef<HTMLVideoElement>(null);
  const hints = new Map();
  const formats = [BarcodeFormat.QR_CODE, BarcodeFormat.CODE_128, BarcodeFormat.EAN_13, BarcodeFormat.EAN_8];
  hints.set(DecodeHintType.POSSIBLE_FORMATS, formats);
  const codeReader = new BrowserMultiFormatReader(undefined, 500);

  useEffect(() => {
    const startScanning = async () => {
      if (videoRef.current) {
        try {
          await codeReader.decodeFromVideoDevice(null, videoRef.current, (result, _error) => {
            if (result) {
              setResult(result.getText());
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

  return (
    <div>
      <video ref={videoRef} style={{ width: '100%' }} />
      <p>{result}</p>
    </div>
  );
};

export default CodeReader;
