import { Component } from 'react';
import type { ErrorInfo, ReactNode } from 'react';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
}

class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null
    };
  }

  static getDerivedStateFromError(error: Error): State {
    // Update state so the next render will show the fallback UI
    return {
      hasError: true,
      error,
      errorInfo: null
    };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    // Log the error to console for debugging
    console.error('❌ ErrorBoundary caught an error:', error);
    console.error('Component stack:', errorInfo.componentStack);

    // Update state with error details
    this.setState({
      error,
      errorInfo
    });
  }

  handleReset = () => {
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null
    });
  };

  render() {
    if (this.state.hasError) {
      // If a custom fallback is provided, use it
      if (this.props.fallback) {
        return this.props.fallback;
      }

      // Default error UI
      return (
        <div className="min-h-screen bg-gradient-to-br from-red-50 to-orange-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-lg p-6 sm:p-8 max-w-2xl w-full">
            <div className="text-center mb-6">
              <span className="text-6xl mb-4 block">⚠️</span>
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-2">
                Something Went Wrong
              </h1>
              <p className="text-gray-600">
                The app encountered an error and couldn't continue. This has been logged for debugging.
              </p>
            </div>

            {this.state.error && (
              <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded mb-6">
                <h3 className="font-semibold text-red-800 mb-2">Error Details:</h3>
                <p className="text-sm text-red-700 font-mono break-words">
                  {this.state.error.toString()}
                </p>
              </div>
            )}

            <div className="flex flex-col sm:flex-row gap-3">
              <button
                onClick={this.handleReset}
                className="flex-1 bg-gradient-to-r from-blue-500 to-green-500 text-white font-semibold py-3 px-6 rounded-lg hover:from-blue-600 hover:to-green-600 transition-all shadow-md"
              >
                Try Again
              </button>
              <button
                onClick={() => window.location.href = '/PlatePerfect'}
                className="flex-1 bg-white text-gray-700 font-semibold py-3 px-6 rounded-lg border-2 border-gray-300 hover:bg-gray-50 transition-all"
              >
                Go to Home
              </button>
            </div>

            {import.meta.env.MODE === 'development' && this.state.errorInfo && (
              <details className="mt-6 text-sm">
                <summary className="cursor-pointer text-gray-600 hover:text-gray-800 font-medium">
                  Show Component Stack (Dev Mode)
                </summary>
                <pre className="mt-2 p-4 bg-gray-100 rounded overflow-auto text-xs">
                  {this.state.errorInfo.componentStack}
                </pre>
              </details>
            )}
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
