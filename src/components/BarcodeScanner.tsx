import { useEffect, useRef, useState } from 'react';
import { Html5Qrcode, Html5QrcodeSupportedFormats } from 'html5-qrcode';

interface BarcodeScannerProps {
  onScan: (barcode: string) => void;
  onError?: (error: string) => void;
  onClose: () => void;
}

export default function BarcodeScanner({ onScan, onError, onClose }: BarcodeScannerProps) {
  const scannerRef = useRef<Html5Qrcode | null>(null);
  const [isScanning, setIsScanning] = useState(false);
  const [error, setError] = useState<string>('');
  const [hasScanned, setHasScanned] = useState(false);

  useEffect(() => {
    const scannerId = 'barcode-scanner';
    let html5QrCode: Html5Qrcode | null = null;

    const startScanner = async () => {
      try {
        html5QrCode = new Html5Qrcode(scannerId);
        scannerRef.current = html5QrCode;

        const config = {
          fps: 10,
          qrbox: { width: 250, height: 250 },
          aspectRatio: 1.0,
          // Support all common barcode formats
          formatsToSupport: [
            Html5QrcodeSupportedFormats.QR_CODE,
            Html5QrcodeSupportedFormats.UPC_A,
            Html5QrcodeSupportedFormats.UPC_E,
            Html5QrcodeSupportedFormats.EAN_13,
            Html5QrcodeSupportedFormats.EAN_8,
            Html5QrcodeSupportedFormats.CODE_128,
            Html5QrcodeSupportedFormats.CODE_39,
            Html5QrcodeSupportedFormats.CODE_93,
          ],
          disableFlip: false,
          showTorchButtonIfSupported: true,
        };

        // Try to use back camera on mobile
        const cameraConfig = { facingMode: 'environment' };

        await html5QrCode.start(
          cameraConfig,
          config,
          (decodedText: string) => {
            // Successfully scanned
            if (!hasScanned) {
              console.log('Barcode scanned:', decodedText);
              setHasScanned(true);
              onScan(decodedText);
            }
          },
          () => {
            // Scanning error (continuous, don't show)
          }
        );

        setIsScanning(true);
      } catch (err) {
        const errorMsg = err instanceof Error ? err.message : 'Failed to start camera';
        console.error('Error starting scanner:', err);
        setError(errorMsg);
        setIsScanning(false);

        if (onError) {
          onError(errorMsg);
        }
      }
    };

    // Start scanner when component mounts
    startScanner();

    // Cleanup on unmount
    return () => {
      if (html5QrCode) {
        html5QrCode.stop().catch((err: unknown) => {
          console.error('Error stopping scanner:', err);
        });
      }
    };
  }, [onScan, onError, hasScanned]);

  const handleClose = async () => {
    if (scannerRef.current) {
      try {
        if (scannerRef.current.isScanning) {
          await scannerRef.current.stop();
        }
      } catch (err) {
        console.error('Error stopping scanner:', err);
      }
    }
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black flex items-center justify-center">
      <div className="w-full h-full max-w-2xl flex flex-col">
        {/* Header */}
        <div className="bg-gradient-to-r from-green-600 to-green-700 text-white p-4 flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold">Scan Barcode</h2>
            <p className="text-sm text-green-100">Point camera at product barcode</p>
          </div>
          <button
            onClick={handleClose}
            className="text-white hover:text-green-100 text-3xl font-bold px-3"
            aria-label="Close scanner"
          >
            ×
          </button>
        </div>

        {/* Scanner area - takes full space */}
        <div className="flex-1 bg-black flex items-center justify-center relative">
          <div
            id="barcode-scanner"
            className="w-full h-full"
          />

          {/* Scanning overlay */}
          {isScanning && !error && (
            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black to-transparent p-6 text-center">
              <div className="bg-green-500 bg-opacity-90 rounded-lg p-4 inline-block">
                <p className="text-white font-semibold flex items-center gap-2">
                  <span className="text-2xl">📷</span>
                  <span>Camera Active - Position barcode in frame</span>
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Error message */}
        {error && (
          <div className="bg-red-600 text-white p-4">
            <div className="flex items-start gap-3">
              <span className="text-2xl">⚠️</span>
              <div className="flex-1">
                <p className="font-semibold">Camera Error</p>
                <p className="text-sm mt-1">{error}</p>
                {error.toLowerCase().includes('permission') && (
                  <p className="text-sm mt-2 text-red-100">
                    Please allow camera access in your browser settings
                  </p>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Help text */}
        <div className="bg-gray-900 text-gray-300 p-4 text-center text-sm">
          <p>Supports: UPC, EAN, QR codes, and other barcode formats</p>
        </div>
      </div>
    </div>
  );
}
