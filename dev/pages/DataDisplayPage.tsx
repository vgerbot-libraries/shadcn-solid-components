import { createSignal, type Component } from 'solid-js'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/card'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/table'
import { ChartContainer, ChartCrosshair } from '@/components/chart'
import { Progress, ProgressGroup, ProgressLabel, ProgressValueLabel } from '@/components/progress'
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '@/components/carousel'
import { HoverCard, HoverCardContent, HoverCardTrigger } from '@/components/hover-card'
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/tooltip'
import { Button } from '@/components/button'
import { Badge } from '@/components/badge'
import { VisLine, VisArea } from '@unovis/solid'
import { PageLayout } from '../components/PageLayout'

const chartData = [
  { month: 'Jan', visitors: 186 },
  { month: 'Feb', visitors: 305 },
  { month: 'Mar', visitors: 237 },
  { month: 'Apr', visitors: 273 },
  { month: 'May', visitors: 209 },
  { month: 'Jun', visitors: 214 },
]

const chartConfig = {
  visitors: { label: 'Visitors', color: 'hsl(var(--chart-1))' },
  month: { label: 'Month' },
}

type ChartDataPoint = (typeof chartData)[0]

const DataDisplayPage: Component = () => {
  const [progressValue, setProgressValue] = createSignal(65)

  return (
    <PageLayout title="Data Display" description="Data presentation components: Table, Chart, Progress, Carousel, HoverCard, Tooltip.">
      {/* Table */}
      <Card>
        <CardHeader>
          <CardTitle>Table</CardTitle>
          <CardDescription>Basic data table layout.</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Invoice</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Method</TableHead>
                <TableHead class="text-right">Amount</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <TableRow>
                <TableCell class="font-medium">INV001</TableCell>
                <TableCell><Badge>Paid</Badge></TableCell>
                <TableCell>Credit Card</TableCell>
                <TableCell class="text-right">$250.00</TableCell>
              </TableRow>
              <TableRow>
                <TableCell class="font-medium">INV002</TableCell>
                <TableCell><Badge variant="secondary">Pending</Badge></TableCell>
                <TableCell>PayPal</TableCell>
                <TableCell class="text-right">$150.00</TableCell>
              </TableRow>
              <TableRow>
                <TableCell class="font-medium">INV003</TableCell>
                <TableCell><Badge variant="destructive">Unpaid</Badge></TableCell>
                <TableCell>Bank Transfer</TableCell>
                <TableCell class="text-right">$350.00</TableCell>
              </TableRow>
              <TableRow>
                <TableCell class="font-medium">INV004</TableCell>
                <TableCell><Badge>Paid</Badge></TableCell>
                <TableCell>Credit Card</TableCell>
                <TableCell class="text-right">$450.00</TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Chart */}
      <Card>
        <CardHeader>
          <CardTitle>Chart</CardTitle>
          <CardDescription>Area and line chart with Unovis.</CardDescription>
        </CardHeader>
        <CardContent>
          <ChartContainer<ChartDataPoint> config={chartConfig} type="xy" data={chartData} class="h-[250px] w-full">
            <ChartCrosshair />
            <VisArea<ChartDataPoint> x={(_d: ChartDataPoint, i: number) => i} y={(d: ChartDataPoint) => d.visitors} opacity={0.2} />
            <VisLine<ChartDataPoint> x={(_d: ChartDataPoint, i: number) => i} y={(d: ChartDataPoint) => d.visitors} />
          </ChartContainer>
        </CardContent>
      </Card>

      <div class="grid gap-4 md:grid-cols-2">
        {/* Progress */}
        <Card>
          <CardHeader>
            <CardTitle>Progress</CardTitle>
            <CardDescription>Progress bar indicator.</CardDescription>
          </CardHeader>
          <CardContent class="flex flex-col gap-4">
            <Progress value={progressValue()} minValue={0} maxValue={100}>
              <ProgressGroup>
                <ProgressLabel>Upload Progress</ProgressLabel>
                <ProgressValueLabel />
              </ProgressGroup>
            </Progress>
            <Progress value={30} minValue={0} maxValue={100}>
              <ProgressGroup>
                <ProgressLabel>CPU Usage</ProgressLabel>
                <ProgressValueLabel />
              </ProgressGroup>
            </Progress>
            <Progress value={90} minValue={0} maxValue={100}>
              <ProgressGroup>
                <ProgressLabel>Disk Space</ProgressLabel>
                <ProgressValueLabel />
              </ProgressGroup>
            </Progress>
            <Button size="sm" variant="outline" onClick={() => setProgressValue(v => Math.min(100, v + 10))}>
              Increase Progress
            </Button>
          </CardContent>
        </Card>

        {/* Tooltip + HoverCard */}
        <Card>
          <CardHeader>
            <CardTitle>Tooltip & HoverCard</CardTitle>
            <CardDescription>Contextual floating information.</CardDescription>
          </CardHeader>
          <CardContent class="flex flex-col gap-6">
            <div>
              <h4 class="text-sm font-medium mb-2">Tooltip</h4>
              <div class="flex gap-2">
                <Tooltip>
                  <TooltipTrigger as={Button} variant="outline">Hover me</TooltipTrigger>
                  <TooltipContent>
                    <p>This is a tooltip message</p>
                  </TooltipContent>
                </Tooltip>
                <Tooltip>
                  <TooltipTrigger as={Button} variant="outline" size="sm">Info</TooltipTrigger>
                  <TooltipContent>
                    <p>Additional context about this element</p>
                  </TooltipContent>
                </Tooltip>
              </div>
            </div>
            <div>
              <h4 class="text-sm font-medium mb-2">HoverCard</h4>
              <HoverCard>
                <HoverCardTrigger as={Button} variant="link">@solidjs</HoverCardTrigger>
                <HoverCardContent class="w-80">
                  <div class="flex flex-col gap-2">
                    <h4 class="text-sm font-semibold">SolidJS</h4>
                    <p class="text-sm text-muted-foreground">
                      Simple and performant reactivity for building user interfaces.
                    </p>
                    <div class="flex items-center gap-4 text-xs text-muted-foreground">
                      <span>12.5k stars</span>
                      <span>Joined Dec 2020</span>
                    </div>
                  </div>
                </HoverCardContent>
              </HoverCard>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Carousel */}
      <Card>
        <CardHeader>
          <CardTitle>Carousel</CardTitle>
          <CardDescription>Slideshow component with navigation.</CardDescription>
        </CardHeader>
        <CardContent class="flex justify-center px-12">
          <Carousel class="w-full max-w-sm">
            <CarouselContent>
              {[1, 2, 3, 4, 5].map(i => (
                <CarouselItem>
                  <Card>
                    <CardContent class="flex aspect-square items-center justify-center p-6">
                      <span class="text-4xl font-semibold">{i}</span>
                    </CardContent>
                  </Card>
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious />
            <CarouselNext />
          </Carousel>
        </CardContent>
      </Card>
    </PageLayout>
  )
}

export default DataDisplayPage
