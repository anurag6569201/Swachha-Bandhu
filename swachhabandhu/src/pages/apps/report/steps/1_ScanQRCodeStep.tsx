import React, { useEffect, useState, useRef } from 'react';
// Corrected the import to use a CDN URL for browser compatibility
import { Html5Qrcode, type Html5QrcodeResult } from 'https://esm.sh/html5-qrcode@2.3.8';

// A simple chevron icon for the accordion
const ChevronIcon: React.FC<{ open: boolean }> = ({ open }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className={`h-5 w-5 transform transition-transform duration-200 ${open ? 'rotate-180' : ''}`}
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

// Configuration for the QR code scanning box.
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
  const [showManualEntry, setShowManualEntry] = useState(false);
  const [manualId, setManualId] = useState('');
  
  // Use a ref to hold the scanner instance to ensure cleanup can access it.
  const html5QrcodeScannerRef = useRef<Html5Qrcode | null>(null);
  const qrcodeRegionId = "html5qr-code-full-region";

  useEffect(() => {
    // This effect should only run once on mount and clean up on unmount.
    if (typeof window === 'undefined' || !Html5Qrcode) return;

    // When the component mounts, create a new instance.
    const html5QrcodeScanner = new Html5Qrcode(qrcodeRegionId);
    html5QrcodeScannerRef.current = html5QrcodeScanner;

    const startScanner = async () => {
      try {
        const onScanSuccessCallback = (decodedText: string, result: Html5QrcodeResult) => {
          // Stop scanning after a successful scan.
          if (html5QrcodeScannerRef.current?.isScanning) {
            html5QrcodeScannerRef.current.stop().catch(err => {
              console.error("Failed to stop scanner after success", err);
            });
          }
          onScanSuccess(decodedText);
        };
        
        const onScanErrorCallback = (errorMessage: string) => {
          // Ignore the common "NotFoundException" error, which just means no QR code was found.
          if (!errorMessage.includes("NotFoundException")) {
              console.warn(`Non-critical QR Scan Error: ${errorMessage}`);
          }
        };

        await html5QrcodeScanner.start(
          { facingMode: "environment" }, // Use the rear camera
          { 
            fps: 10, 
            qrbox: qrboxFunction,
            aspectRatio: 1.0 
          },
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

    // Cleanup function: this is called when the component unmounts.
    return () => {
      if (html5QrcodeScannerRef.current && html5QrcodeScannerRef.current.isScanning) {
        console.log("Stopping QR code scanner on component unmount.");
        html5QrcodeScannerRef.current.stop().catch(err => {
            // Log error but don't crash the app. This can happen if the scanner is already stopping.
            console.error("Error stopping the scanner during cleanup:", err);
        });
      }
    };
  }, [onScanSuccess]);

  const handleManualSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (manualId) {
      // We simulate a URL scan to keep the parent handler logic consistent.
      onScanSuccess(`https://example.com/report/new/${manualId.trim()}`);
    }
  };

  return (
    <div className="flex flex-col items-center animate-fade-in w-full">
      <h2 className="text-xl font-semibold mb-2 text-gray-800">Step 1: Scan Location QR Code</h2>
      <p className="text-base text-gray-500 mb-6 text-center">Point your camera at the QR code on site.</p>
      
      {/* QR Code Scanner Viewfinder - Made Larger */}
      <div className="w-full max-w-md h-96 rounded-lg overflow-hidden shadow-2xl border-4 border-gray-200 bg-gray-900">
        <div id={qrcodeRegionId} style={{ width: '100%', height: '100%' }} />
      </div>
      {error && (
        <div className="mt-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded-lg text-sm w-full max-w-md">
          <strong>Error:</strong> {error}
        </div>
      )}

      {/* Manual Entry Section */}
      <div className="w-full max-w-md mt-6">
        <div className="border-t">
            <button
                onClick={() => setShowManualEntry(!showManualEntry)}
                className="w-full flex justify-between items-center py-4 text-base font-medium text-gray-700 hover:text-blue-600 focus:outline-none"
                aria-expanded={showManualEntry}
            >
                <span>Can't scan? Enter code manually</span>
                <ChevronIcon open={showManualEntry} />
            </button>
            
            {showManualEntry && (
                <div className="pb-4 animate-fade-in">
                    <p className="text-sm text-gray-500 mb-3">
                        Find the unique code printed near the QR code and enter it below.
                    </p>
                    <form onSubmit={handleManualSubmit} className="flex items-center gap-2">
                        <input 
                            type="text"
                            placeholder="Enter location code"
                            value={manualId}
                            onChange={(e) => setManualId(e.target.value)}
                            className="flex-grow p-3 border border-gray-300 rounded-lg text-base shadow-inner focus:ring-2 focus:ring-blue-500"
                            aria-label="Manual Location Code Input"
                        />
                        <button 
                            type="submit" 
                            className="px-5 py-3 bg-blue-600 text-white rounded-lg text-base font-semibold hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
                            disabled={!manualId.trim()}
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
