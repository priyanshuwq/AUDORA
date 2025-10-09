import { Component, ReactNode, ErrorInfo } from "react";
import { AlertCircle, RefreshCw } from "lucide-react";
import { Button } from "./ui/button";

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("ErrorBoundary caught an error:", error, errorInfo);
  }

  handleRetry = () => {
    this.setState({ hasError: false, error: null });
  };

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <div className="flex flex-col items-center justify-center py-12 space-y-4">
          <AlertCircle className="w-16 h-16 text-red-500" />
          <div className="text-center max-w-md">
            <h3 className="text-xl font-semibold text-white mb-2">
              Oops! Something went wrong
            </h3>
            <p className="text-zinc-400 mb-4">
              We encountered an unexpected error while loading this content.
            </p>
            <details className="text-left bg-black/20 rounded-lg p-4 mb-4">
              <summary className="cursor-pointer text-sm text-zinc-300 hover:text-white">
                Error Details
              </summary>
              <pre className="text-xs text-red-400 mt-2 whitespace-pre-wrap">
                {this.state.error?.message || "Unknown error occurred"}
              </pre>
            </details>
            <Button
              onClick={this.handleRetry}
              className="bg-red-600 hover:bg-red-700 text-white"
            >
              <RefreshCw className="w-4 h-4 mr-2" />
              Try Again
            </Button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
