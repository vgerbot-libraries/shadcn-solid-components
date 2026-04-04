import { useColorMode } from '@kobalte/core'
import { createEffect, createSignal, For } from 'solid-js'
import { toast } from 'solid-sonner'
import { Badge } from 'shadcn-solid-components/components/badge'
import { Button } from 'shadcn-solid-components/components/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from 'shadcn-solid-components/components/card'
import { Checkbox, CheckboxControl, CheckboxLabel } from 'shadcn-solid-components/components/checkbox'
import {
  IconArrowRight,
  IconCalendar,
  IconCircleCheck,
  IconCopy,
  IconRocket,
  IconSettings,
  IconUsers,
} from 'shadcn-solid-components/components/icons'
import { Progress, ProgressGroup, ProgressLabel, ProgressValueLabel } from 'shadcn-solid-components/components/progress'
import { ModeToggleGroup } from 'shadcn-solid-components/hoc/mode-toggle-group'
import {
  RadioGroup,
  RadioGroupItem,
  RadioGroupItemControl,
  RadioGroupItemLabel,
} from 'shadcn-solid-components/components/radio-group'
import { Separator } from 'shadcn-solid-components/components/separator'
import { Slider, SliderFill, SliderThumb, SliderTrack } from 'shadcn-solid-components/components/slider'
import { Switch, SwitchControl, SwitchLabel, SwitchThumb } from 'shadcn-solid-components/components/switch'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from 'shadcn-solid-components/components/table'
import { Tabs, TabsContent, TabsIndicator, TabsList, TabsTrigger } from 'shadcn-solid-components/components/tabs'
import { TextField, TextFieldInput, TextFieldLabel } from 'shadcn-solid-components/components/text-field'
import { BASE_COLORS } from '../lib/base-colors'
import { generatePresetCss, generateThemeCssVars, RADII } from '../lib/theme-generator'
import { generateStyleCss, STYLE_PRESETS } from '../lib/theme-styles'
import { THEMES } from '../lib/themes'

const projectMetrics = [
  { label: 'Components', value: '24', detail: '+6 this week' },
  { label: 'Theme Tokens', value: '128', detail: 'Light and dark ready' },
  { label: 'Team Members', value: '8', detail: '3 reviewers online' },
]

const launchSteps = [
  { label: 'Design tokens synced', checked: true },
  { label: 'Marketing pages reviewed', checked: true },
  { label: 'CLI defaults finalized', checked: false },
]

const teamMembers = [
  { name: 'Lena Fischer', role: 'Design', access: 'Owner', status: 'Active' },
  { name: 'Marcus Lee', role: 'Engineering', access: 'Editor', status: 'Reviewing' },
  { name: 'Priya Patel', role: 'Marketing', access: 'Viewer', status: 'Invited' },
]

export default function CustomThemePage() {
  const { colorMode } = useColorMode()
  const [style, setStyle] = createSignal('vega')
  const [baseColor, setBaseColor] = createSignal('neutral')
  const [themeColor, setThemeColor] = createSignal('neutral')
  const [radius, setRadius] = createSignal('0.625rem')

  const handleCopyCss = async () => {
    const css = generatePresetCss({
      style: style(),
      baseColor: baseColor(),
      theme: themeColor(),
      radius: radius(),
    })
    try {
      await navigator.clipboard.writeText(css)
      toast.success('CSS copied to clipboard', {
        description: 'You can now paste it into your theme CSS file.',
      })
    } catch (_err) {
      toast.error('Failed to copy CSS')
    }
  }

  createEffect(() => {
    const vars = generateThemeCssVars({
      style: style(),
      baseColor: baseColor(),
      theme: themeColor(),
      radius: radius(),
    })

    let styleEl = document.getElementById('custom-theme-preview')
    if (!styleEl) {
      styleEl = document.createElement('style')
      styleEl.id = 'custom-theme-preview'
      document.head.appendChild(styleEl)
    }

    const lightCss = Object.entries(vars.light)
      .map(([key, value]) => `  --${key}: ${value};`)
      .join('\n')

    const darkCss = Object.entries(vars.dark)
      .map(([key, value]) => `  --${key}: ${value};`)
      .join('\n')

    const styleCss = generateStyleCss(style(), {
      scope: `[data-theme-style="${style()}"]`,
    })

    styleEl.innerHTML = `
      :root {
        --radius-component: var(--radius);
        ${lightCss}
      }
      [data-kb-theme="dark"] {
        ${darkCss}
      }

      ${styleCss}
    `
  })

  const selectedStyle = () => STYLE_PRESETS.find(item => item.name === style()) ?? STYLE_PRESETS[0]

  return (
    <div class="container mx-auto p-6 flex flex-col md:flex-row gap-8">
      {/* Customizer Panel */}
      <div class="w-full md:w-80 flex flex-col gap-6 shrink-0">
        <Card>
          <CardHeader>
            <CardTitle>Customize Theme</CardTitle>
            <CardDescription>Pick your style, colors and radius.</CardDescription>
          </CardHeader>
          <CardContent class="flex flex-col gap-6">
            {/* Style */}
            <div class="flex flex-col gap-2">
              <label class="text-sm font-medium select-none">Style</label>
              <div class="grid grid-cols-2 gap-2">
                <For each={STYLE_PRESETS}>
                  {preset => (
                    <Button
                      variant={style() === preset.name ? 'default' : 'outline'}
                      size="sm"
                      class="justify-start"
                      onClick={() => setStyle(preset.name)}
                    >
                      {preset.title}
                    </Button>
                  )}
                </For>
              </div>
              <p class="text-xs text-muted-foreground">{selectedStyle().description}</p>
            </div>

            {/* Base Color */}
            <div class="flex flex-col gap-2">
              <label class="text-sm font-medium select-none">Base Color</label>
              <div class="grid grid-cols-3 gap-2">
                <For each={BASE_COLORS}>
                  {color => (
                    <Button
                      variant={baseColor() === color.name ? 'default' : 'outline'}
                      size="sm"
                      class="justify-start gap-1 px-2 text-xs"
                      onClick={() => setBaseColor(color.name)}
                    >
                      <span
                        class="h-3.5 w-3.5 shrink-0 rounded-full mr-1.5"
                        style={{ 'background-color': color.cssVars.light.primary }}
                      />
                      <span class="min-w-0 leading-none capitalize">{color.name}</span>
                    </Button>
                  )}
                </For>
              </div>
            </div>

            {/* Theme Color */}
            <div class="flex flex-col gap-2">
              <label class="text-sm font-medium select-none">Theme</label>
              <div class="grid grid-cols-3 gap-2">
                <For each={THEMES}>
                  {theme => (
                    <Button
                      variant={themeColor() === theme.name ? 'default' : 'outline'}
                      size="sm"
                      class="justify-start gap-1 px-2 text-xs"
                      onClick={() => setThemeColor(theme.name)}
                    >
                      <span
                        class="h-3.5 w-3.5 shrink-0 rounded-full mr-1.5"
                        style={{ 'background-color': theme.cssVars.light.primary }}
                      />
                      <span class="min-w-0 leading-none capitalize">{theme.name}</span>
                    </Button>
                  )}
                </For>
              </div>
            </div>

            {/* Radius */}
            <div class="flex flex-col gap-2">
              <label class="text-sm font-medium select-none">Radius</label>
              <div class="grid grid-cols-5 gap-2">
                <For each={RADII}>
                  {r => (
                    <Button
                      variant={radius() === r.value ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => setRadius(r.value)}
                    >
                      {r.label}
                    </Button>
                  )}
                </For>
              </div>
            </div>
          </CardContent>
          <CardFooter>
            <Button class="w-full" onClick={handleCopyCss}>
              <IconCopy class="mr-2 h-4 w-4" />
              Copy CSS
            </Button>
          </CardFooter>
        </Card>
      </div>

      {/* Preview Area */}
      <div class="flex-1 flex flex-col gap-6" data-theme-style={style()}>
        <div class="bg-background text-foreground rounded-component border p-4 shadow-sm md:p-6">
          <Card>
            <CardHeader>
              <div class="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                <div class="space-y-2">
                  <div class="flex flex-wrap items-center gap-2">
                    <Badge>Preview Area</Badge>
                    <Badge variant="secondary">{selectedStyle().title}</Badge>
                    <Badge variant="outline" class="capitalize">
                      {themeColor()}
                    </Badge>
                    <Badge variant="outline" class="capitalize">
                      {colorMode()}
                    </Badge>
                  </div>
                  <CardTitle class="text-2xl">Launch your next project faster</CardTitle>
                  <CardDescription class="max-w-2xl">
                    A richer preview inspired by the shadcn create flow. Mix content, forms, team
                    settings, and status panels to validate how your theme behaves in real UI.
                  </CardDescription>
                </div>
                <div class="flex flex-wrap items-center gap-2">
                  <div class="inline-flex items-center gap-2">
                    <ModeToggleGroup />
                  </div>
                  <Button variant="outline">
                    <IconSettings class="size-4" />
                    Configure
                  </Button>
                  <Button>
                    <IconRocket class="size-4" />
                    Create project
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent class="grid gap-4 md:grid-cols-3">
              <For each={projectMetrics}>
                {metric => (
                  <div class="rounded-component border bg-muted/30 p-4">
                    <p class="text-muted-foreground text-sm">{metric.label}</p>
                    <p class="mt-2 text-2xl font-semibold">{metric.value}</p>
                    <p class="text-muted-foreground mt-1 text-xs">{metric.detail}</p>
                  </div>
                )}
              </For>
            </CardContent>
          </Card>

          <div class="mt-6 grid grid-cols-1 gap-6 xl:grid-cols-[1.15fr_0.85fr]">
            <Card>
              <CardHeader>
                <CardTitle>Project Setup</CardTitle>
                <CardDescription>See how form layouts, badges, and actions respond to your theme.</CardDescription>
              </CardHeader>
              <CardContent class="flex flex-col gap-5">
                <div class="grid gap-4 md:grid-cols-2">
                  <TextField>
                    <TextFieldLabel>Project name</TextFieldLabel>
                    <TextFieldInput value="solid-launchpad" />
                  </TextField>
                  <TextField>
                    <TextFieldLabel>Workspace</TextFieldLabel>
                    <TextFieldInput value="apps/web" />
                  </TextField>
                </div>
                <TextField>
                  <TextFieldLabel>Starter description</TextFieldLabel>
                  <TextFieldInput value="A polished starter with tokens, dashboards, and team settings." />
                </TextField>

                <div class="flex flex-wrap gap-2">
                  <Badge>TypeScript</Badge>
                  <Badge variant="secondary">SolidStart</Badge>
                  <Badge variant="outline">Theme-aware</Badge>
                </div>

                <Separator />

                <div class="flex flex-wrap gap-2">
                  <Button>Generate theme</Button>
                  <Button variant="secondary">Share preview</Button>
                  <Button variant="ghost">
                    View example
                    <IconArrowRight class="size-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Release Readiness</CardTitle>
                <CardDescription>Combine progress, checklist items, and compact status UI.</CardDescription>
              </CardHeader>
              <CardContent class="flex flex-col gap-5">
                <Progress value={82} minValue={0} maxValue={100}>
                  <ProgressGroup>
                    <ProgressLabel>Launch progress</ProgressLabel>
                    <ProgressValueLabel />
                  </ProgressGroup>
                </Progress>

                <Progress value={64} minValue={0} maxValue={100}>
                  <ProgressGroup>
                    <ProgressLabel>Docs coverage</ProgressLabel>
                    <ProgressValueLabel />
                  </ProgressGroup>
                </Progress>

                <Separator />

                <div class="space-y-3">
                  <For each={launchSteps}>
                    {step => (
                      <div class="flex items-center justify-between gap-3 rounded-component border p-3">
                        <div class="flex items-center gap-3">
                          <div
                            class={`rounded-component flex size-8 items-center justify-center ${
                              step.checked
                                ? 'bg-primary text-primary-foreground'
                                : 'bg-muted text-muted-foreground'
                            }`}
                          >
                            <IconCircleCheck class="size-4" />
                          </div>
                          <span class="text-sm font-medium">{step.label}</span>
                        </div>
                        <Badge variant={step.checked ? 'secondary' : 'outline'}>
                          {step.checked ? 'Done' : 'Pending'}
                        </Badge>
                      </div>
                    )}
                  </For>
                </div>
              </CardContent>
            </Card>
          </div>

          <div class="mt-6 grid grid-cols-1 gap-6 xl:grid-cols-[0.9fr_1.1fr]">
            <Card>
              <CardHeader>
                <CardTitle>Inputs & Controls</CardTitle>
                <CardDescription>Check selection states, spacing, and contrast together.</CardDescription>
              </CardHeader>
              <CardContent class="flex flex-col gap-6">
                <div class="flex items-center justify-between gap-4 rounded-component border p-4">
                  <div>
                    <p class="text-sm font-medium">Auto deploy previews</p>
                    <p class="text-muted-foreground text-sm">
                      Publish a preview build for every branch.
                    </p>
                  </div>
                  <Switch defaultChecked>
                    <SwitchLabel class="sr-only">Auto deploy previews</SwitchLabel>
                    <SwitchControl>
                      <SwitchThumb />
                    </SwitchControl>
                  </Switch>
                </div>

                <div class="space-y-3 rounded-component border p-4">
                  <p class="text-sm font-medium">Launch checklist</p>
                  <Checkbox defaultChecked>
                    <CheckboxControl />
                    <CheckboxLabel>Include analytics</CheckboxLabel>
                  </Checkbox>
                  <Checkbox defaultChecked>
                    <CheckboxControl />
                    <CheckboxLabel>Enable dark mode</CheckboxLabel>
                  </Checkbox>
                  <Checkbox>
                    <CheckboxControl />
                    <CheckboxLabel>Seed demo content</CheckboxLabel>
                  </Checkbox>
                </div>

                <div class="space-y-3 rounded-component border p-4">
                  <p class="text-sm font-medium">Density</p>
                  <RadioGroup defaultValue="comfortable">
                    <div class="flex items-center space-x-2">
                      <RadioGroupItem value="compact">
                        <RadioGroupItemControl />
                        <RadioGroupItemLabel>Compact</RadioGroupItemLabel>
                      </RadioGroupItem>
                    </div>
                    <div class="flex items-center space-x-2">
                      <RadioGroupItem value="comfortable">
                        <RadioGroupItemControl />
                        <RadioGroupItemLabel>Comfortable</RadioGroupItemLabel>
                      </RadioGroupItem>
                    </div>
                    <div class="flex items-center space-x-2">
                      <RadioGroupItem value="spacious">
                        <RadioGroupItemControl />
                        <RadioGroupItemLabel>Spacious</RadioGroupItemLabel>
                      </RadioGroupItem>
                    </div>
                  </RadioGroup>
                </div>

                <div class="space-y-3 rounded-component border p-4">
                  <div class="flex items-center justify-between gap-4">
                    <p class="text-sm font-medium">Corner softness</p>
                    <span class="text-muted-foreground text-sm">{radius()}</span>
                  </div>
                  <Slider defaultValue={[50]} maxValue={100} step={1}>
                    <div class="flex w-full items-center">
                      <SliderTrack>
                        <SliderFill />
                        <SliderThumb />
                      </SliderTrack>
                    </div>
                  </Slider>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <div class="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
                  <div>
                    <CardTitle>Team Access</CardTitle>
                    <CardDescription>Validate tables, badges, and compact actions in one panel.</CardDescription>
                  </div>
                  <Button size="sm" variant="outline">
                    <IconUsers class="size-4" />
                    Invite member
                  </Button>
                </div>
              </CardHeader>
              <CardContent class="space-y-4">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Member</TableHead>
                      <TableHead>Role</TableHead>
                      <TableHead>Access</TableHead>
                      <TableHead>Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    <For each={teamMembers}>
                      {member => (
                        <TableRow>
                          <TableCell class="font-medium">{member.name}</TableCell>
                          <TableCell>{member.role}</TableCell>
                          <TableCell>{member.access}</TableCell>
                          <TableCell>
                            <Badge
                              variant={
                                member.status === 'Active'
                                  ? 'secondary'
                                  : member.status === 'Reviewing'
                                    ? 'default'
                                    : 'outline'
                              }
                            >
                              {member.status}
                            </Badge>
                          </TableCell>
                        </TableRow>
                      )}
                    </For>
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </div>

          <Card class="mt-6">
            <CardHeader>
              <CardTitle>Workspace Tabs</CardTitle>
              <CardDescription>
                Use tabs to preview how your palette behaves across different content surfaces.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="overview" class="w-full">
                <TabsList class="grid w-full grid-cols-3">
                  <TabsTrigger value="overview">Overview</TabsTrigger>
                  <TabsTrigger value="activity">Activity</TabsTrigger>
                  <TabsTrigger value="schedule">Schedule</TabsTrigger>
                  <TabsIndicator />
                </TabsList>
                <TabsContent value="overview" class="mt-4">
                  <div class="grid gap-4 md:grid-cols-2">
                    <div class="rounded-component border p-4">
                      <p class="text-sm font-medium">Current style</p>
                      <p class="text-muted-foreground mt-1 text-sm">
                        {selectedStyle().title} with {baseColor()} base and {themeColor()} theme.
                      </p>
                    </div>
                    <div class="rounded-component border p-4">
                      <p class="text-sm font-medium">Next milestone</p>
                      <p class="text-muted-foreground mt-1 text-sm">
                        Finalize the starter and ship the public template next week.
                      </p>
                    </div>
                  </div>
                </TabsContent>
                <TabsContent value="activity" class="mt-4">
                  <div class="space-y-3">
                    <div class="flex items-center justify-between rounded-component border p-4">
                      <div class="space-y-1">
                        <p class="text-sm font-medium">Theme updated</p>
                        <p class="text-muted-foreground text-sm">
                          Color tokens were regenerated for the preview workspace.
                        </p>
                      </div>
                      <Badge>New</Badge>
                    </div>
                    <div class="flex items-center justify-between rounded-component border p-4">
                      <div class="space-y-1">
                        <p class="text-sm font-medium">Review requested</p>
                        <p class="text-muted-foreground text-sm">
                          Three teammates were notified to review the latest setup.
                        </p>
                      </div>
                      <Button size="sm" variant="ghost">
                        Open
                      </Button>
                    </div>
                  </div>
                </TabsContent>
                <TabsContent value="schedule" class="mt-4">
                  <div class="grid gap-3 md:grid-cols-2">
                    <div class="rounded-component border p-4">
                      <div class="flex items-center gap-2 text-sm font-medium">
                        <IconCalendar class="size-4" />
                        Apr 02
                      </div>
                      <p class="text-muted-foreground mt-2 text-sm">
                        Record launch video and publish the template gallery.
                      </p>
                    </div>
                    <div class="rounded-component border p-4">
                      <div class="flex items-center gap-2 text-sm font-medium">
                        <IconCalendar class="size-4" />
                        Apr 05
                      </div>
                      <p class="text-muted-foreground mt-2 text-sm">
                        Collect feedback from the first batch of starter projects.
                      </p>
                    </div>
                  </div>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
