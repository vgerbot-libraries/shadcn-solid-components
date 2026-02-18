import { type Component } from 'solid-js'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/card'
import { Button } from '@/components/button'
import { ButtonGroup, ButtonText, ButtonSeparator } from '@/components/button-group'
import { Badge } from '@/components/badge'
import { Separator } from '@/components/separator'
import { Kbd, KbdGroup } from '@/components/kbd'
import { Skeleton } from '@/components/skeleton'
import { IconMail, IconPlus, IconDownload, IconTrash, IconSettings, IconBold, IconItalic, IconUnderline } from '@/components/icons'
import { PageLayout } from '../components/PageLayout'

const GeneralPage: Component = () => {
  return (
    <PageLayout title="General" description="Basic building-block components: Button, Badge, Separator, Kbd, Skeleton.">
      {/* Button */}
      <Card>
        <CardHeader>
          <CardTitle>Button</CardTitle>
          <CardDescription>Variants, sizes, and states.</CardDescription>
        </CardHeader>
        <CardContent class="flex flex-col gap-4">
          <div class="flex flex-wrap items-center gap-2">
            <Button>Default</Button>
            <Button variant="secondary">Secondary</Button>
            <Button variant="destructive">Destructive</Button>
            <Button variant="outline">Outline</Button>
            <Button variant="ghost">Ghost</Button>
            <Button variant="link">Link</Button>
          </div>
          <div class="flex flex-wrap items-center gap-2">
            <Button size="sm">Small</Button>
            <Button size="default">Default</Button>
            <Button size="lg">Large</Button>
            <Button size="icon"><IconPlus /></Button>
            <Button size="icon-sm"><IconSettings /></Button>
          </div>
          <div class="flex flex-wrap items-center gap-2">
            <Button disabled>Disabled</Button>
            <Button variant="outline"><IconMail class="mr-2" />Login with Email</Button>
            <Button variant="destructive"><IconTrash class="mr-2" />Delete</Button>
            <Button variant="outline"><IconDownload class="mr-2" />Download</Button>
          </div>
        </CardContent>
      </Card>

      {/* ButtonGroup */}
      <Card>
        <CardHeader>
          <CardTitle>Button Group</CardTitle>
          <CardDescription>Group related actions together.</CardDescription>
        </CardHeader>
        <CardContent class="flex flex-col gap-4">
          <ButtonGroup>
            <Button variant="outline"><IconBold /></Button>
            <ButtonSeparator />
            <Button variant="outline"><IconItalic /></Button>
            <ButtonSeparator />
            <Button variant="outline"><IconUnderline /></Button>
          </ButtonGroup>
          <ButtonGroup>
            <Button variant="outline">Day</Button>
            <ButtonSeparator />
            <Button variant="outline">Week</Button>
            <ButtonSeparator />
            <Button variant="outline">Month</Button>
            <ButtonSeparator />
            <Button variant="outline">Year</Button>
          </ButtonGroup>
          <ButtonGroup orientation="vertical">
            <Button variant="outline">Top</Button>
            <ButtonSeparator />
            <Button variant="outline">Middle</Button>
            <ButtonSeparator />
            <Button variant="outline">Bottom</Button>
          </ButtonGroup>
        </CardContent>
      </Card>

      <div class="grid gap-4 md:grid-cols-2">
        {/* Badge */}
        <Card>
          <CardHeader>
            <CardTitle>Badge</CardTitle>
            <CardDescription>Status indicators and labels.</CardDescription>
          </CardHeader>
          <CardContent class="flex flex-wrap gap-2">
            <Badge>Default</Badge>
            <Badge variant="secondary">Secondary</Badge>
            <Badge variant="outline">Outline</Badge>
            <Badge variant="destructive">Destructive</Badge>
          </CardContent>
        </Card>

        {/* Kbd */}
        <Card>
          <CardHeader>
            <CardTitle>Kbd</CardTitle>
            <CardDescription>Keyboard shortcut indicators.</CardDescription>
          </CardHeader>
          <CardContent class="flex flex-wrap items-center gap-3">
            <KbdGroup>
              <Kbd>⌘</Kbd>
              <Kbd>K</Kbd>
            </KbdGroup>
            <KbdGroup>
              <Kbd>Ctrl</Kbd>
              <Kbd>Shift</Kbd>
              <Kbd>P</Kbd>
            </KbdGroup>
            <Kbd>Enter</Kbd>
            <Kbd>Esc</Kbd>
          </CardContent>
        </Card>
      </div>

      <div class="grid gap-4 md:grid-cols-2">
        {/* Separator */}
        <Card>
          <CardHeader>
            <CardTitle>Separator</CardTitle>
            <CardDescription>Visual dividers for content.</CardDescription>
          </CardHeader>
          <CardContent class="flex flex-col gap-4">
            <div>
              <h4 class="text-sm font-medium">Section Title</h4>
              <Separator class="my-2" />
              <p class="text-muted-foreground text-sm">Content below the separator.</p>
            </div>
            <div class="flex h-5 items-center gap-4 text-sm">
              <span>Blog</span>
              <Separator orientation="vertical" />
              <span>Docs</span>
              <Separator orientation="vertical" />
              <span>API</span>
            </div>
          </CardContent>
        </Card>

        {/* Skeleton */}
        <Card>
          <CardHeader>
            <CardTitle>Skeleton</CardTitle>
            <CardDescription>Loading placeholder animations.</CardDescription>
          </CardHeader>
          <CardContent class="flex flex-col gap-3">
            <div class="flex items-center gap-4">
              <Skeleton class="h-12 w-12 rounded-full" />
              <div class="flex-1 space-y-2">
                <Skeleton class="h-4 w-3/4" />
                <Skeleton class="h-4 w-1/2" />
              </div>
            </div>
            <Skeleton class="h-[120px] w-full rounded-xl" />
            <div class="flex gap-2">
              <Skeleton class="h-8 w-20" />
              <Skeleton class="h-8 w-20" />
            </div>
          </CardContent>
        </Card>
      </div>
    </PageLayout>
  )
}

export default GeneralPage
