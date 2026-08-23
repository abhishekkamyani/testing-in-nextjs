import { Component, ErrorInfo, ReactNode } from "react";

interface ErrorBoundaryProps {
  children: ReactNode;
  fallback?: ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
}

export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  public state: ErrorBoundaryState = { hasError: false };

  public static getDerivedStateFromError(): ErrorBoundaryState {
    return { hasError: true };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
`    // Log error if needed
`  }

  public render() {
    if (this.state.hasError) {
      return this.props.fallback || <div role="alert">Something went wrong.</div>;
    }
    return this.props.children;
  }
}