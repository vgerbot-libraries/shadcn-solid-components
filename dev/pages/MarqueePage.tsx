import { Card, CardContent } from 'shadcn-solid-components/components/card'
import { Marquee } from 'shadcn-solid-components/components/marquee'
import type { Component } from 'solid-js'
import { PageLayout } from '../components/PageLayout'

const reviews = [
  {
    name: 'Ken Masters',
    username: '@kmasters',
    body: '“Our productivity has nearly doubled since onboarding. Automation features removed repetitive tasks, allowing our team to focus on building instead of managing operations.”',
    profile: 'https://picsum.photos/seed/1/64/64',
  },
  {
    name: 'Kira Athrun',
    username: '@kathrun',
    body: '“What surprised us most was how quickly our team adapted. Minimal learning curve, excellent documentation, and powerful features make it a must-have for modern SaaS companies.”',
    profile: 'https://picsum.photos/seed/2/64/64',
  },
  {
    name: 'Lirael Nassun',
    username: '@lnassun',
    body: '“This is easily one of the most reliable SaaS tools we’ve adopted. The UI is intuitive, integrations are seamless, and it saves us countless hours every week.”',
    profile: 'https://picsum.photos/seed/3/64/64',
  },
  {
    name: 'Jessica',
    username: '@jessica',
    body: 'Switching to this platform streamlined our entire workflow. Setup was effortless, performance improved instantly, and our team now ships features faster without worrying about infrastructure.',
    profile: 'https://picsum.photos/seed/4/64/64',
  },
  {
    name: 'Jenny',
    username: '@jenny',
    body: '“We evaluated multiple solutions, but this stood out immediately. It’s fast, scalable, and thoughtfully designed for growing teams that need stability without added complexity.”',
    profile: 'https://picsum.photos/seed/5/64/64',
  },
  {
    name: 'Kira Athrun',
    username: '@kathrun',
    body: '“What surprised us most was how quickly our team adapted. Minimal learning curve, excellent documentation, and powerful features make it a must-have for modern SaaS companies.”',
    profile: 'https://picsum.photos/seed/6/64/64',
  },
  {
    name: 'Ken Masters',
    username: '@kmasters',
    body: '“Our productivity has nearly doubled since onboarding. Automation features removed repetitive tasks, allowing our team to focus on building instead of managing operations.”',
    profile: 'https://picsum.photos/seed/7/64/64',
  },
]

const firstRow = reviews.slice(0, Math.ceil(reviews.length / 2))
const secondRow = reviews.slice(Math.ceil(reviews.length / 2))

interface ReviewCardProps {
  profile: string
  name: string
  username: string
  body: string
}

const ReviewCard = (props: ReviewCardProps) => {
  return (
    <Card class="bg-card relative h-full w-64 cursor-pointer overflow-hidden border-border p-4 shadow-none">
      <CardContent class="flex flex-col gap-2 p-0">
        <div class="flex flex-row items-center gap-2">
          <img class="rounded-full" width="32" height="32" alt="" src={props.profile} />
          <div class="flex flex-col">
            <p class="text-foreground text-sm font-medium">{props.name}</p>
            <p class="text-muted-foreground text-xs font-medium">{props.username}</p>
          </div>
        </div>
        <p class="text-foreground line-clamp-3 text-sm">{props.body}</p>
      </CardContent>
    </Card>
  )
}

const MarqueePage: Component = () => {
  return (
    <PageLayout
      title="Marquee"
      description="Scrolling testimonial marquee with pause-on-hover and reverse direction."
    >
      <div class="relative flex w-full flex-col items-center justify-center overflow-hidden rounded-xl border p-4 md:p-6">
        <Marquee pauseOnHover class="[--duration:20s]">
          {firstRow.map(review => (
            <ReviewCard {...review} />
          ))}
        </Marquee>

        <Marquee reverse pauseOnHover class="[--duration:20s]">
          {secondRow.map(review => (
            <ReviewCard {...review} />
          ))}
        </Marquee>

        <div class="from-background pointer-events-none absolute inset-y-0 left-0 w-1/4 bg-gradient-to-r" />
        <div class="from-background pointer-events-none absolute inset-y-0 right-0 w-1/4 bg-gradient-to-l" />
      </div>
    </PageLayout>
  )
}

export default MarqueePage
