'use client'

import { Component, ReactNode } from 'react'
import { AlertTriangle, RefreshCw, Home } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import Link from 'next/link'

interface ErrorBoundaryProps {
  children: ReactNode
  fallback?: ReactNode
}

interface ErrorBoundaryState {
  hasError: boolean
  error?: Error
}

export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props)
    this.state = { hasError: false }
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error }
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('Error caught by boundary:', error, errorInfo)
  }

  handleRetry = () => {
    this.setState({ hasError: false, error: undefined })
  }

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback
      }

      return (
        <ErrorState 
          error={this.state.error} 
          onRetry={this.handleRetry} 
        />
      )
    }

    return this.props.children
  }
}

interface ErrorStateProps {
  title?: string
  message?: string
  error?: Error
  onRetry?: () => void
  showHomeButton?: boolean
}

export function ErrorState({ 
  title = "Bir hata oluştu",
  message,
  error,
  onRetry,
  showHomeButton = true
}: ErrorStateProps) {
  const errorMessage = message || error?.message || "Beklenmeyen bir hata oluştu. Lütfen tekrar deneyin."

  return (
    <div className="flex items-center justify-center min-h-[400px] p-4">
      <Card className="max-w-md w-full">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 w-12 h-12 rounded-full bg-destructive/10 flex items-center justify-center">
            <AlertTriangle className="h-6 w-6 text-destructive" />
          </div>
          <CardTitle>{title}</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground text-center">
            {errorMessage}
          </p>
        </CardContent>
        <CardFooter className="flex justify-center gap-3">
          {onRetry && (
            <Button onClick={onRetry} variant="outline">
              <RefreshCw className="h-4 w-4 mr-2" />
              Tekrar Dene
            </Button>
          )}
          {showHomeButton && (
            <Link href="/">
              <Button>
                <Home className="h-4 w-4 mr-2" />
                Ana Sayfa
              </Button>
            </Link>
          )}
        </CardFooter>
      </Card>
    </div>
  )
}

export function NotFound() {
  return (
    <div className="flex items-center justify-center min-h-[60vh] p-4">
      <Card className="max-w-md w-full text-center">
        <CardHeader>
          <div className="text-6xl font-bold text-muted-foreground mb-4">404</div>
          <CardTitle>Sayfa Bulunamadı</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            Aradığınız sayfa mevcut değil veya taşınmış olabilir.
          </p>
        </CardContent>
        <CardFooter className="justify-center">
          <Link href="/">
            <Button>
              <Home className="h-4 w-4 mr-2" />
              Ana Sayfaya Dön
            </Button>
          </Link>
        </CardFooter>
      </Card>
    </div>
  )
}
