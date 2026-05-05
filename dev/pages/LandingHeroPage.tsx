import { Badge } from 'shadcn-solid-components/components/badge'
import { Button } from 'shadcn-solid-components/components/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from 'shadcn-solid-components/components/card'
import { LandingHero } from 'shadcn-solid-components/components/landing-hero'
import { OverlayPage } from 'shadcn-solid-components/hoc/overlay-page'
import type { Component } from 'solid-js'

const LandingHeroPage: Component = () => {
  return (
    <OverlayPage
      overlay={false}
      title="Landing Hero"
      description="Reusable three-zone hero header with responsive mobile menu behavior."
      showBackButton={false}
      contentClass="p-4 md:p-6"
      actions={
        <div class="flex items-center gap-2">
          <Badge variant="secondary">OverlayPage Demo</Badge>
          <Button size="sm" variant="outline">
            Docs
          </Button>
        </div>
      }
    >
      <div class="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>LandingHero Preview</CardTitle>
            <CardDescription>
              Desktop shows brand + centered nav + actions A/B. Mobile keeps action group A and
              moves nav + action group B into the right drawer.
            </CardDescription>
          </CardHeader>
          <CardContent class="space-y-4">
            <LandingHero
              brand={{
                title: 'Shadcn Solid',
                href: '/',
                logo: <span class="text-primary text-lg font-bold">S</span>,
              }}
              navItems={[
                { label: 'Blocks', href: '#' },
                { label: 'Templates', href: '#' },
                {
                  label: 'Resources',
                  children: [
                    { label: 'Documentation', href: '#' },
                    { label: 'Changelog', href: '#' },
                    { label: 'Support', href: '#' },
                  ],
                },
              ]}
              primaryActions={
                <Button size="sm" variant="ghost">
                  Sign In
                </Button>
              }
              secondaryActions={
                <>
                  <Button size="sm" variant="outline">
                    GitHub
                  </Button>
                  <Button size="sm">Get Started</Button>
                </>
              }
            />

            <div class="text-muted-foreground rounded-md border border-dashed p-4 text-sm">
              Tip: Shrink the viewport to verify mobile behavior (menu trigger, overlay, drawer
              animation, click-outside close, and Esc close).
            </div>
          </CardContent>
        </Card>
      </div>
    </OverlayPage>
  )
}

export default LandingHeroPage
