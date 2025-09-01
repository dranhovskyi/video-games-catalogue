import React, { Component, type ReactNode } from 'react';
import { Alert, Button } from 'react-bootstrap';

interface Props {
    children: ReactNode;
}

interface State {
    hasError: boolean;
    error?: Error;
}

class ErrorBoundary extends Component<Props, State> {
    constructor(props: Props) {
        super(props);
        this.state = { hasError: false };
    }

    static getDerivedStateFromError(error: Error): State {
        return { hasError: true, error };
    }

    componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
        console.error('Error caught by boundary:', error, errorInfo);
    }

    render() {
        if (this.state.hasError) {
            return (
                <Alert variant="danger">
                    <Alert.Heading>Something went wrong!</Alert.Heading>
                    <p>We're sorry, but something unexpected happened.</p>
                    <Button
                        variant="outline-danger"
                        onClick={() => this.setState({ hasError: false })}
                    >
                        Try again
                    </Button>
                </Alert>
            );
        }

        return this.props.children;
    }
}

export default ErrorBoundary;