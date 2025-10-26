import { Component } from "react";
import type { ErrorInfo, ReactNode } from "react";

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
      errorInfo: null,
    };
  }

  static getDerivedStateFromError(error: Error): Partial<State> {
    // Update state so the next render will show the fallback UI
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    // Log error to console for debugging
    console.error("ErrorBoundary caught an error:", error, errorInfo);
    
    // Update state with error details
    this.setState({
      error,
      errorInfo,
    });

    // Here you could log to an error reporting service like Sentry
    // logErrorToService(error, errorInfo);
  }

  handleReset = () => {
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null,
    });
  };

  render() {
    if (this.state.hasError) {
      // Custom fallback UI
      if (this.props.fallback) {
        return this.props.fallback;
      }

      // Default error UI
      return (
        <div className="container mt-5">
          <div className="row justify-content-center">
            <div className="col-md-8">
              <div className="card border-danger">
                <div className="card-header bg-danger text-white">
                  <h2 className="mb-0">
                    <i className="bi bi-exclamation-triangle-fill me-2"></i>
                    Something went wrong
                  </h2>
                </div>
                <div className="card-body">
                  <p className="lead">
                    We apologize for the inconvenience. An unexpected error has occurred.
                  </p>
                  
                  {import.meta.env.DEV && this.state.error && (
                    <div className="alert alert-light mt-3">
                      <strong>Error Details (Development Only):</strong>
                      <pre className="mt-2 mb-0" style={{ fontSize: "0.85rem" }}>
                        {this.state.error.toString()}
                      </pre>
                      {this.state.errorInfo && (
                        <details className="mt-3">
                          <summary className="text-muted cursor-pointer">
                            Stack Trace
                          </summary>
                          <pre className="mt-2 mb-0" style={{ fontSize: "0.85rem" }}>
                            {this.state.errorInfo.componentStack}
                          </pre>
                        </details>
                      )}
                    </div>
                  )}

                  <div className="mt-4 d-flex gap-2">
                    <button
                      type="button"
                      className="btn btn-primary"
                      onClick={this.handleReset}
                    >
                      Try Again
                    </button>
                    <button
                      type="button"
                      className="btn btn-secondary"
                      onClick={() => (window.location.href = "/")}
                    >
                      Go to Home
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;

