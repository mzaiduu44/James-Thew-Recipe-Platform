import React, { Component, ErrorInfo, ReactNode } from 'react';
import { ChefHat, RefreshCcw } from 'lucide-react';
import { Button } from '../ui/Button';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Uncaught culinary render error:', error, errorInfo);
  }

  public render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-[60vh] flex items-center justify-center p-6 text-center">
          <div className="max-w-md w-full bg-white dark:bg-[#1E1A15] border border-[#E8DFD1] dark:border-[#383026] rounded-3xl p-8 shadow-warm-xl flex flex-col items-center">
            <div className="w-16 h-16 rounded-2xl bg-[#F5E2D8] dark:bg-[#382017] text-[#C9542F] flex items-center justify-center mb-4">
              <ChefHat className="w-8 h-8" />
            </div>
            <h2 className="font-serif text-2xl font-bold text-[#201A14] dark:text-[#F5EFE4] mb-2">
              Kitchen Interruption
            </h2>
            <p className="text-xs sm:text-sm text-[#6B6155] dark:text-[#A89E90] mb-6">
              An unexpected recipe rendering glitch occurred. Refreshing the pantry should restore the kitchen.
            </p>
            <Button
              variant="primary"
              onClick={() => window.location.reload()}
              leftIcon={<RefreshCcw className="w-4 h-4" />}
            >
              Reload Kitchen
            </Button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
