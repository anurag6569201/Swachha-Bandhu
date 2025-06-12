// src/pages/app/scan/ScannerPage.tsx
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Html5Qrcode, type Html5QrcodeResult } from 'html5-qrcode';
import { toast } from 'react-hot-toast';
import { ScanLine, XCircle } from 'lucide-react';

const qrcodeRegionId = "qr-code-reader";

const ScannerPage: React.FC = () => {
  const navigate = useNavigate();
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    document.title = 'Scan QR Code - Swachh Bandhu';
    
    // This function will start the scanner
    const startScanner = async () => {
      try {
        const cameras = await Html5Qrcode.getCameras();
        if (cameras && cameras.length) {
          const html5QrCode = new Html5Qrcode(qrcodeRegionId);
          await html5QrCode.start(
            { facingMode: "environment" }, // Prioritize the rear camera
            {
              fps: 10,
              qrbox: { width: 250, height: 250 },
            },
            onScanSuccess,
            onScanFailure
          );
        } else {
            setErrorMessage("No cameras found on this device.");
        }
      } catch (err) {
        console.error("Camera initialization failed", err);
        setErrorMessage("Could not access the camera. Please grant permission and refresh.");
      }
    };

    startScanner();

    // Cleanup function to stop the scanner when the component unmounts
    return () => {
      const html5QrCode = new Html5Qrcode(qrcodeRegionId);
      if (html5QrCode && html5QrCode.isScanning) {
        html5QrCode.stop().catch(err => console.error("Failed to stop scanner", err));
      }
    };
  }, []);

  const onScanSuccess = (decodedText: string, decodedResult: Html5QrcodeResult) => {
    console.log(`Scan result: ${decodedText}`);
    try {
      // Assuming the QR code contains the full URL e.g., "https://yourapp.com/scan/uuid-goes-here"
      const url = new URL(decodedText);
      const pathSegments = url.pathname.split('/').filter(Boolean); // a/b/c -> ['a', 'b', 'c']

      // Find the UUID in the path. This is robust to changes in URL structure.
      const locationId = pathSegments.find(seg => seg.length === 36); // Standard UUID length

      if (locationId) {
        toast.success("QR Code detected!");
        // Navigate to the report submission page, passing the locationId
        navigate(`/app/report/new/${locationId}`);
      } else {
        throw new Error("Valid Location ID not found in QR code.");
      }
    } catch (error) {
        console.error("Error parsing QR code:", error);
        toast.error("Invalid QR code. Please scan a valid Swachh Bandhu QR code.");
    }
  };

  const onScanFailure = (error: Html5QrcodeError) => {
    // This is called frequently, so we don't log every failure.
    // It's useful for debugging if needed: console.warn(`QR scan error: ${error}`);
  };

  return (
    <div className="relative w-full min-h-screen bg-slate-900 flex flex-col items-center justify-center text-white p-4">
      <div className="text-center z-10 mb-6">
        <ScanLine className="mx-auto mb-4" size={48} />
        <h1 className="text-2xl font-bold">Scan a Location QR Code</h1>
        <p className="text-slate-300 mt-2">Point your camera at the Swachh Bandhu QR code.</p>
      </div>

      <div id={qrcodeRegionId} className="w-full max-w-md rounded-lg overflow-hidden border-4 border-slate-700 shadow-2xl z-10"></div>

      {errorMessage && (
        <div className="mt-6 p-4 bg-red-500/20 border border-red-500 rounded-lg flex items-center gap-3 z-10">
          <XCircle className="text-red-400" size={24} />
          <p>{errorMessage}</p>
        </div>
      )}
    </div>
  );
};

export default ScannerPage;