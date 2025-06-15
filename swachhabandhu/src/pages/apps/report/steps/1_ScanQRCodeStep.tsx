import React, { useEffect, useState } from 'react';
import { Html5Qrcode, type Html5QrcodeResult } from 'html5-qrcode';

// A simple chevron icon for the accordion
const ChevronIcon: React.FC<{ open: boolean }> = ({ open }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className={`h-5 w-5 transition-transform duration-200 ${open ? 'rotate-180' : ''}`}
    viewBox="0 0 20 20"
    fill="currentColor"
  >
    <path
      fillRule="evenodd"
      d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
      clipRule="evenodd"
    />
  </svg>
);


interface Props {
  onScanSuccess: (decodedText: string) => void;
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

const ScanQRCodeStep: React.FC<Props> = ({ onScanSuccess }) => {
  const [error, setError] = useState<string | null>(null);
  const qrcodeRegionId = "html5qr-code-full-region";
  const [showManualEntry, setShowManualEntry] = useState(false);
  const [manualId, setManualId] = useState('');

  useEffect(() => {
    if (typeof window === 'undefined') return;

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
        
        const onScanErrorCallback = (errorMessage: string) => {
            if (!errorMessage.includes("NotFoundException")) {
                console.warn(`Non-critical QR Scan Error: ${errorMessage}`);
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
    
    const qrElement = document.getElementById(qrcodeRegionId);
    if (qrElement) {
        startScanner();
    }

    return () => {
      if (html5QrcodeScanner && html5QrcodeScanner.isScanning) {
        html5QrcodeScanner.stop().catch(err => {});
      }
    };
  }, [onScanSuccess]);

  const handleManualSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (manualId) {
      // Simulate the full URL to use the same parsing logic as a real scan
      // This makes the handler in the parent component reusable.
      onScanSuccess(`https://example.com/report/new/${manualId.trim()}`);
    }
  };

  return (
    <div className="flex flex-col items-center animate-fade-in">
      <h2 className="text-lg font-semibold mb-2 text-gray-700">Step 1: Scan Location QR Code</h2>
      <p className="text-sm text-gray-500 mb-4 text-center">Point your camera at the QR code on site.</p>
      
      {/* QR Code Scanner Viewfinder */}
      <div className="relative w-full max-w-xs h-64 rounded-lg overflow-hidden shadow-md border bg-gray-200">
        <div id={qrcodeRegionId} style={{ width: '100%', height: '100%' }} />
      </div>
      {error && (
        <div className="mt-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded-md text-sm">
          <strong>Error:</strong> {error}
        </div>
      )}

      {/* --- USER-FACING MANUAL ENTRY --- */}
      <div className="w-full max-w-xs mt-4">
        <div className="border-t">
            <button
                onClick={() => setShowManualEntry(!showManualEntry)}
                className="w-full flex justify-between items-center py-3 text-sm font-medium text-gray-700 hover:text-blue-600"
                aria-expanded={showManualEntry}
            >
                <span>Can't scan? Enter code manually</span>
                <ChevronIcon open={showManualEntry} />
            </button>
            
            {showManualEntry && (
                <div className="pb-4 animate-fade-in">
                    <p className="text-xs text-gray-500 mb-2">
                        Find the unique code printed near the QR code and enter it below.
                    </p>
                    <form onSubmit={handleManualSubmit} className="flex items-center gap-2">
                        <input 
                            type="text"
                            placeholder="Enter location code"
                            value={manualId}
                            onChange={(e) => setManualId(e.target.value)}
                            className="flex-grow p-2 border border-gray-300 rounded-md text-sm shadow-inner"
                            aria-label="Manual Location Code Input"
                        />
                        <button 
                            type="submit" 
                            className="px-4 py-2 bg-blue-500 text-white rounded-md text-sm font-semibold hover:bg-blue-600 disabled:bg-gray-400"
                            disabled={!manualId}
                        >
                            Go
                        </button>
                    </form>
                </div>
            )}
        </div>
      </div>
    </div>
  );
};

export default ScanQRCodeStep;