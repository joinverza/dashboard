import { Component, type ReactNode } from 'react';
import { AlertTriangle, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

type Props = {
  children: ReactNode;
};

type State = {
  hasError: boolean;
};

export class ApiErrorBoundary extends Component<Props, State> {
  state: State = {
    hasError: false,
  };

  static getDerivedStateFromError(): State {
    return { hasError: true };
  }

  componentDidCatch(): void {}

  private handleReset = (): void => {
    this.setState({ hasError: false });
  };

  render(): ReactNode {
    if (!this.state.hasError) return this.props.children;
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-destructive" />
            Integration Error
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Button onClick={this.handleReset} variant="outline">
            <RefreshCw className="mr-2 h-4 w-4" />
            Retry Render
          </Button>
        </CardContent>
      </Card>
    );
  }
}
