import type { Component } from 'solid-js'
import { Button } from 'shadcn-solid-components/components/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from 'shadcn-solid-components/components/card'
import {
  IconAlertTriangle,
  IconLock,
  IconSearch,
} from 'shadcn-solid-components/components/icons'
import { ErrorPage } from 'shadcn-solid-components/hoc/error-page'
import { PageLayout } from '../components/PageLayout'

const ErrorPageDemo: Component = () => {
  return (
    <PageLayout
      title="Error Page"
      description="Full-page error states with preset variants for common HTTP errors."
    >
      {/* All preset variants */}
      <div class="grid gap-4 md:grid-cols-2">
        {/* 404 */}
        <Card>
          <CardHeader>
            <CardTitle>404 — Not Found</CardTitle>
            <CardDescription>
              Default 404 variant with auto-generated title, description, and "Go back home" button.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ErrorPage variant="404" class="min-h-[40vh]" />
          </CardContent>
        </Card>

        {/* 403 */}
        <Card>
          <CardHeader>
            <CardTitle>403 — Forbidden</CardTitle>
            <CardDescription>
              Access denied page with all defaults from locale.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ErrorPage variant="403" class="min-h-[40vh]" />
          </CardContent>
        </Card>

        {/* 500 */}
        <Card>
          <CardHeader>
            <CardTitle>500 — Server Error</CardTitle>
            <CardDescription>
              Internal server error page.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ErrorPage variant="500" class="min-h-[40vh]" />
          </CardContent>
        </Card>

        {/* 503 */}
        <Card>
          <CardHeader>
            <CardTitle>503 — Service Unavailable</CardTitle>
            <CardDescription>
              Service unavailable error page.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ErrorPage variant="503" class="min-h-[40vh]" />
          </CardContent>
        </Card>
      </div>

      {/* Generic variant */}
      <Card>
        <CardHeader>
          <CardTitle>Generic Error</CardTitle>
          <CardDescription>
            The default variant when no specific HTTP status code applies. Shows "!" as the code.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ErrorPage class="min-h-[40vh]" />
        </CardContent>
      </Card>

      {/* Custom icon */}
      <Card>
        <CardHeader>
          <CardTitle>Custom Icons</CardTitle>
          <CardDescription>
            Replace the default status code display with custom icons or illustrations.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div class="grid gap-8 md:grid-cols-3">
            <ErrorPage
              variant="404"
              icon={<IconSearch class="size-20 stroke-1" />}
              class="min-h-[30vh] py-8"
            />
            <ErrorPage
              variant="403"
              icon={<IconLock class="size-20 stroke-1" />}
              class="min-h-[30vh] py-8"
            />
            <ErrorPage
              variant="500"
              icon={<IconAlertTriangle class="size-20 stroke-1" />}
              class="min-h-[30vh] py-8"
            />
          </div>
        </CardContent>
      </Card>

      {/* Custom content */}
      <Card>
        <CardHeader>
          <CardTitle>Custom Content</CardTitle>
          <CardDescription>
            Override title, description, and actions for full control.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ErrorPage
            variant="500"
            title="Oops! Something broke"
            description="Our engineers have been notified and are working on a fix. Please try again in a few moments."
            actions={
              <>
                <Button as="a" href="/">
                  Back to Home
                </Button>
                <Button variant="outline" onClick={() => location.reload()}>
                  Try Again
                </Button>
              </>
            }
            class="min-h-[40vh]"
          />
        </CardContent>
      </Card>

      {/* Maintenance page style */}
      <Card>
        <CardHeader>
          <CardTitle>Maintenance Page</CardTitle>
          <CardDescription>
            Use the 503 variant with custom messaging for scheduled maintenance windows.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ErrorPage
            variant="503"
            title="We'll be right back"
            description="We're performing scheduled maintenance to improve your experience. Expected downtime: 30 minutes."
            actions={
              <Button variant="outline" onClick={() => location.reload()}>
                Check Again
              </Button>
            }
            class="min-h-[40vh]"
          />
        </CardContent>
      </Card>
    </PageLayout>
  )
}

export default ErrorPageDemo
