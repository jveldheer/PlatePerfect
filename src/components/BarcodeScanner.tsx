import { useEffect, useRef, useState } from 'react';
import { Html5Qrcode } from 'html5-qrcode';

interface BarcodeScannerProps {
  onScan: (barcode: string) => void;
  onError?: (error: string) => void;
  onClose: () => void;
}

export default function BarcodeScanner({ onScan, onError, onClose }: BarcodeScannerProps) {
  const scannerRef = useRef<Html5Qrcode | null>(null);
  const [isScanning, setIsScanning] = useState(false);
  const [error, setError] = useState<string>('');
  const [cameraPermission, setCameraPermission] = useState<'granted' | 'denied' | 'prompt'>('prompt');

  useEffect(() => {
    const scannerId = 'barcode-scanner';
    const html5QrCode = new Html5Qrcode(scannerId);
    scannerRef.current = html5QrCode;

    const config = {
      fps: 10,
      qrbox: { width: 250, height: 250 },
      aspectRatio: 1.0,
      formatsToSupport: [
        // Common barcode formats
        0, // QR_CODE (for compatibility)
        7, // EAN_13
        8, // EAN_8
        12, // UPC_A
        13, // UPC_E
        15, // CODE_128
        16, // CODE_39
      ]
    };

    const startScanner = async () => {
      try {
        setIsScanning(true);

        await html5QrCode.start(
          { facingMode: 'environment' }, // Use back camera
          config,
          (decodedText) => {
            // Successfully scanned
            console.log('Barcode scanned:', decodedText);
            onScan(decodedText);
            // Stop scanner after successful scan
            stopScanner();
          },
          () => {
            // Scanning error (usually just "No barcode found")
            // Don't show these errors to user as they're continuous
          }
        );

        setCameraPermission('granted');
      } catch (err) {
        const errorMsg = err instanceof Error ? err.message : 'Failed to start camera';
        console.error('Error starting scanner:', err);
        setError(errorMsg);

        if (errorMsg.includes('Permission') || errorMsg.includes('permission')) {
          setCameraPermission('denied');
        }

        if (onError) {
          onError(errorMsg);
        }
        setIsScanning(false);
      }
    };

    const stopScanner = async () => {
      if (html5QrCode && html5QrCode.isScanning) {
        try {
          await html5QrCode.stop();
        } catch (err) {
          console.error('Error stopping scanner:', err);
        }
      }
      setIsScanning(false);
    };

    startScanner();

    // Cleanup on unmount
    return () => {
      stopScanner();
    };
  }, [onScan, onError]);

  const handleClose = async () => {
    if (scannerRef.current && scannerRef.current.isScanning) {
      try {
        await scannerRef.current.stop();
      } catch (err) {
        console.error('Error stopping scanner:', err);
      }
    }
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black bg-opacity-90 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl max-w-md w-full p-6 relative">
        {/* Close button */}
        <button
          onClick={handleClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 text-2xl font-bold"
          aria-label="Close scanner"
        >
          ×
        </button>

        {/* Header */}
        <div className="mb-4 text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Scan Barcode
          </h2>
          <p className="text-sm text-gray-600">
            Point your camera at a product barcode
          </p>
        </div>

        {/* Scanner area */}
        <div className="mb-4">
          <div
            id="barcode-scanner"
            className="rounded-lg overflow-hidden border-4 border-primary-500"
            style={{ minHeight: '300px' }}
          />
        </div>

        {/* Status messages */}
        {error && (
          <div className="mb-4 bg-red-50 border-l-4 border-red-500 p-4 rounded">
            <div className="flex items-start">
              <span className="text-2xl mr-2">⚠️</span>
              <div>
                <p className="text-sm font-semibold text-red-800">Camera Error</p>
                <p className="text-xs text-red-700 mt-1">{error}</p>
                {cameraPermission === 'denied' && (
                  <p className="text-xs text-red-700 mt-2">
                    Please allow camera access in your browser settings to use the barcode scanner.
                  </p>
                )}
              </div>
            </div>
          </div>
        )}

        {isScanning && !error && (
          <div className="bg-green-50 border-l-4 border-green-500 p-4 rounded">
            <div className="flex items-center">
              <span className="text-2xl mr-2">📷</span>
              <div>
                <p className="text-sm font-semibold text-green-800">Camera Active</p>
                <p className="text-xs text-green-700 mt-1">
                  Position the barcode within the frame
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Help text */}
        <div className="mt-4 text-center">
          <p className="text-xs text-gray-500">
            Supports UPC, EAN-13, EAN-8, and CODE-128 barcodes
          </p>
        </div>

        {/* Cancel button */}
        <button
          onClick={handleClose}
          className="w-full mt-4 py-3 bg-gray-200 text-gray-700 rounded-lg font-semibold hover:bg-gray-300 transition-colors"
        >
          Cancel
        </button>
      </div>
    </div>
  );
}
