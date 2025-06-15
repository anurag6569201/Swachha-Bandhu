import React, { useEffect, useState } from 'react';
import { Html5Qrcode, type Html5QrcodeResult } from 'html5-qrcode';

interface Props {
  onScanSuccess: (decodedText: string) => void;
  // Let's add the manual input handler here for the dev button
  onManualInput: (locationId: string) => void; 
}

const qrboxFunction = (viewfinderWidth: number, viewfinderHeight: number) => {
    const minEdgePercentage = 0.7;
    const minEdgeSize = Math.min(viewfinderWidth, viewfinderHeight);
    const qrboxSize = Math.floor(minEdgeSize * minEdgePercentage);
    return {
        width: qrboxSize,
        height: qrboxSize,
    };
};

const ScanQRCodeStep: React.FC<Props> = ({ onScanSuccess, onManualInput }) => {
  const [error, setError] = useState<string | null>(null);
  const qrcodeRegionId = "html5qr-code-full-region";
  const [manualId, setManualId] = useState('');

  useEffect(() => {
    let html5QrcodeScanner: Html5Qrcode | undefined;

    const startScanner = async () => {
      try {
        html5QrcodeScanner = new Html5Qrcode(qrcodeRegionId);
        
        const onScanSuccessCallback = (decodedText: string, result: Html5QrcodeResult) => {
          if (html5QrcodeScanner?.isScanning) {
            html5QrcodeScanner.stop().catch(err => console.error("Failed to stop scanner", err));
          }
          onScanSuccess(decodedText);
        };
        
        // This will log errors to the console. It will fire A LOT. This is normal.
        // It shows the scanner is actively trying to find a code.
        const onScanErrorCallback = (errorMessage: string) => {
            if (!errorMessage.includes("NotFoundException")) {
                console.warn(`QR Scan Error: ${errorMessage}`);
            }
        };

        await html5QrcodeScanner.start(
          { facingMode: "environment" },
          { fps: 10, qrbox: qrboxFunction, aspectRatio: 1.0 },
          onScanSuccessCallback,
          onScanErrorCallback
        );
        setError(null);
      } catch (err: any) {
        console.error("Failed to start html5-qrcode scanner", err);
        setError("Failed to initialize camera. Please grant camera permissions and use a secure (HTTPS) connection.");
      }
    };
    startScanner();

    return () => {
      if (html5QrcodeScanner && html5QrcodeScanner.isScanning) {
        html5QrcodeScanner.stop().catch(err => {});
      }
    };
  }, [onScanSuccess]);

  const handleManualSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (manualId) {
      // We simulate the full URL to use the same parsing logic
      onScanSuccess(`https://example.com/report/new/${manualId}`);
    }
  };

  return (
    <div className="flex flex-col items-center animate-fade-in">
      <h2 className="text-lg font-semibold mb-2 text-gray-700">Step 1: Scan Location QR Code</h2>
      <p className="text-sm text-gray-500 mb-4 text-center">Point your camera at the QR code on site.</p>
      <div className="relative w-full max-w-xs h-64 rounded-lg overflow-hidden shadow-md border bg-gray-200">
        <div id={qrcodeRegionId} style={{ width: '100%', height: '100%' }} />
      </div>
      {error && (
        <div className="mt-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded-md text-sm">
          <strong>Error:</strong> {error}
        </div>
      )}

      {/* Developer Escape Hatch */}
      {process.env.NODE_ENV === 'development' && (
        <div className="mt-6 w-full max-w-xs p-3 border-t">
          <p className="text-xs text-center text-gray-500 mb-2">For Development: Manual Entry</p>
          <form onSubmit={handleManualSubmit} className="flex items-center gap-2">
            <input 
              type="text"
              placeholder="Paste Location ID"
              value={manualId}
              onChange={(e) => setManualId(e.target.value)}
              className="flex-grow p-2 border rounded-md text-sm"
            />
            <button type="submit" className="px-3 py-2 bg-blue-500 text-white rounded-md text-sm hover:bg-blue-600">Go</button>
          </form>
        </div>
      )}
    </div>
  );
};

export default ScanQRCodeStep;