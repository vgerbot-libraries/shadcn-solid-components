import { createSignal, type Component } from 'solid-js'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/card'
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from '@/components/accordion'
import { Collapsible, CollapsibleTrigger, CollapsibleContent } from '@/components/collapsible'
import { Resizable, ResizablePanel, ResizableHandle } from '@/components/resizable'
import { Tabs, TabsList, TabsTrigger, TabsContent, TabsIndicator } from '@/components/tabs'
import { Button } from '@/components/button'
import { IconChevronDown } from '@/components/icons'
import { PageLayout } from '../components/PageLayout'

const LayoutPage: Component = () => {
  const [collapsibleOpen, setCollapsibleOpen] = createSignal(false)

  return (
    <PageLayout title="Layout" description="Structural components: Card, Accordion, Collapsible, Resizable, Tabs.">
      {/* Card */}
      <Card>
        <CardHeader>
          <CardTitle>Card</CardTitle>
          <CardDescription>A flexible container with header, content, and footer.</CardDescription>
        </CardHeader>
        <CardContent>
          <div class="grid gap-4 md:grid-cols-3">
            <Card>
              <CardHeader>
                <CardTitle class="text-base">Basic Card</CardTitle>
                <CardDescription>Simple card with content.</CardDescription>
              </CardHeader>
              <CardContent>
                <p class="text-sm">This is the card body content.</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle class="text-base">With Footer</CardTitle>
                <CardDescription>Card with action footer.</CardDescription>
              </CardHeader>
              <CardContent>
                <p class="text-sm">Some important details here.</p>
              </CardContent>
              <CardFooter class="flex gap-2">
                <Button size="sm" variant="outline">Cancel</Button>
                <Button size="sm">Save</Button>
              </CardFooter>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle class="text-base">Notification</CardTitle>
                <CardDescription>You have 3 unread messages.</CardDescription>
              </CardHeader>
              <CardContent>
                <p class="text-sm">Check your inbox for updates.</p>
              </CardContent>
              <CardFooter>
                <Button size="sm" class="w-full">View All</Button>
              </CardFooter>
            </Card>
          </div>
        </CardContent>
      </Card>

      {/* Accordion */}
      <Card>
        <CardHeader>
          <CardTitle>Accordion</CardTitle>
          <CardDescription>Collapsible content sections.</CardDescription>
        </CardHeader>
        <CardContent>
          <Accordion multiple={false} collapsible>
            <AccordionItem value="item-1">
              <AccordionTrigger>Is it accessible?</AccordionTrigger>
              <AccordionContent>
                Yes. It adheres to the WAI-ARIA design pattern for accordions.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="item-2">
              <AccordionTrigger>Is it styled?</AccordionTrigger>
              <AccordionContent>
                Yes. It comes with default styles that match the other components' aesthetic.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="item-3">
              <AccordionTrigger>Is it animated?</AccordionTrigger>
              <AccordionContent>
                Yes. It uses CSS animations for smooth expand/collapse transitions.
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </CardContent>
      </Card>

      <div class="grid gap-4 md:grid-cols-2">
        {/* Collapsible */}
        <Card>
          <CardHeader>
            <CardTitle>Collapsible</CardTitle>
            <CardDescription>Toggle visibility of content sections.</CardDescription>
          </CardHeader>
          <CardContent>
            <Collapsible open={collapsibleOpen()} onOpenChange={setCollapsibleOpen} class="space-y-2">
              <div class="flex items-center justify-between rounded-md border px-4 py-3">
                <h4 class="text-sm font-semibold">@peduarte starred 3 repositories</h4>
                <CollapsibleTrigger as={Button} variant="ghost" size="icon-sm">
                  <IconChevronDown class={`size-4 transition-transform ${collapsibleOpen() ? 'rotate-180' : ''}`} />
                </CollapsibleTrigger>
              </div>
              <div class="rounded-md border px-4 py-3 text-sm">@radix-ui/primitives</div>
              <CollapsibleContent class="space-y-2">
                <div class="rounded-md border px-4 py-3 text-sm">@radix-ui/colors</div>
                <div class="rounded-md border px-4 py-3 text-sm">@stitches/react</div>
              </CollapsibleContent>
            </Collapsible>
          </CardContent>
        </Card>

        {/* Tabs */}
        <Card>
          <CardHeader>
            <CardTitle>Tabs</CardTitle>
            <CardDescription>Tabbed navigation between content panels.</CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="account">
              <TabsList>
                <TabsTrigger value="account">Account</TabsTrigger>
                <TabsTrigger value="password">Password</TabsTrigger>
                <TabsTrigger value="settings">Settings</TabsTrigger>
                <TabsIndicator />
              </TabsList>
              <TabsContent value="account" class="mt-4">
                <p class="text-muted-foreground text-sm">
                  Make changes to your account here. Click save when you're done.
                </p>
              </TabsContent>
              <TabsContent value="password" class="mt-4">
                <p class="text-muted-foreground text-sm">
                  Change your password here. After saving, you'll be logged out.
                </p>
              </TabsContent>
              <TabsContent value="settings" class="mt-4">
                <p class="text-muted-foreground text-sm">
                  Configure your preferences and notification settings.
                </p>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>

      {/* Resizable */}
      <Card>
        <CardHeader>
          <CardTitle>Resizable</CardTitle>
          <CardDescription>Resizable split panels.</CardDescription>
        </CardHeader>
        <CardContent>
          <Resizable class="max-w-full rounded-lg border" orientation="horizontal">
            <ResizablePanel initialSize={0.35} minSize={0.2}>
              <div class="flex h-[200px] items-center justify-center p-6">
                <span class="font-semibold">Sidebar</span>
              </div>
            </ResizablePanel>
            <ResizableHandle withHandle />
            <ResizablePanel initialSize={0.65}>
              <Resizable orientation="vertical">
                <ResizablePanel initialSize={0.5} minSize={0.25}>
                  <div class="flex h-full items-center justify-center p-6">
                    <span class="font-semibold">Content</span>
                  </div>
                </ResizablePanel>
                <ResizableHandle withHandle />
                <ResizablePanel initialSize={0.5}>
                  <div class="flex h-full items-center justify-center p-6">
                    <span class="font-semibold">Footer</span>
                  </div>
                </ResizablePanel>
              </Resizable>
            </ResizablePanel>
          </Resizable>
        </CardContent>
      </Card>
    </PageLayout>
  )
}

export default LayoutPage
