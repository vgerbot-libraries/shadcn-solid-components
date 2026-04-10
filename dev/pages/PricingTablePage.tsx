import type { Component } from 'solid-js'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from 'shadcn-solid-components/components/card'
import {
  PricingTable,
  type PricingPlan,
} from 'shadcn-solid-components/hoc/pricing-table'
import { PageLayout } from '../components/PageLayout'

const basicPlans: PricingPlan[] = [
  {
    name: 'Free',
    description: 'For individuals getting started',
    priceMonthly: 0,
    priceYearly: 0,
    cta: 'Get Started',
    features: [
      { text: '1 project', included: true },
      { text: '100 MB storage', included: true },
      { text: 'Community support', included: true },
      { text: 'Custom domain', included: false },
      { text: 'Analytics', included: false },
    ],
  },
  {
    name: 'Pro',
    description: 'For growing teams',
    priceMonthly: 19,
    priceYearly: 190,
    isPopular: true,
    cta: 'Start Free Trial',
    features: [
      { text: 'Unlimited projects', included: true },
      { text: '10 GB storage', included: true },
      { text: 'Priority support', included: true },
      { text: 'Custom domain', included: true },
      { text: 'Analytics', included: false },
    ],
  },
  {
    name: 'Enterprise',
    description: 'For large organizations',
    priceMonthly: 49,
    priceYearly: 490,
    cta: 'Contact Sales',
    features: [
      { text: 'Unlimited projects', included: true },
      { text: '100 GB storage', included: true },
      { text: 'Dedicated support', included: true },
      { text: 'Custom domain', included: true },
      { text: 'Advanced analytics', included: true },
    ],
  },
]

const twoPlans: PricingPlan[] = [
  {
    name: 'Hobby',
    description: 'For side projects',
    priceMonthly: 0,
    priceYearly: 0,
    cta: 'Get Started',
    features: [
      { text: '3 projects', included: true },
      { text: '1 GB storage', included: true },
      { text: 'Email support', included: false },
    ],
  },
  {
    name: 'Team',
    description: 'For collaboration',
    priceMonthly: 29,
    priceYearly: 290,
    isPopular: true,
    cta: 'Upgrade',
    features: [
      { text: 'Unlimited projects', included: true },
      { text: '50 GB storage', included: true },
      { text: 'Priority email support', included: true },
    ],
  },
]

const fourPlans: PricingPlan[] = [
  {
    name: 'Starter',
    priceMonthly: 0,
    priceYearly: 0,
    cta: 'Get Started',
    features: [
      { text: '1 user', included: true },
      { text: '1 GB', included: true },
      { text: 'API access', included: false },
    ],
  },
  {
    name: 'Basic',
    priceMonthly: 9,
    priceYearly: 90,
    cta: 'Subscribe',
    features: [
      { text: '5 users', included: true },
      { text: '10 GB', included: true },
      { text: 'API access', included: false },
    ],
  },
  {
    name: 'Pro',
    priceMonthly: 29,
    priceYearly: 290,
    isPopular: true,
    cta: 'Subscribe',
    features: [
      { text: '25 users', included: true },
      { text: '100 GB', included: true },
      { text: 'API access', included: true },
    ],
  },
  {
    name: 'Business',
    priceMonthly: 79,
    priceYearly: 790,
    cta: 'Contact Us',
    features: [
      { text: 'Unlimited users', included: true },
      { text: '1 TB', included: true },
      { text: 'API access', included: true },
    ],
  },
]

const PricingTablePage: Component = () => {
  return (
    <PageLayout
      title="Pricing Table"
      description="Pricing plans with billing toggle, feature comparison, and responsive grid layout."
    >
      {/* 3-plan layout */}
      <Card>
        <CardHeader>
          <CardTitle>Three Plans</CardTitle>
          <CardDescription>
            Standard three-tier pricing with a popular plan highlighted.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <PricingTable plans={basicPlans} />
        </CardContent>
      </Card>

      {/* 2-plan layout */}
      <Card>
        <CardHeader>
          <CardTitle>Two Plans</CardTitle>
          <CardDescription>
            Simple two-column layout for straightforward pricing.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <PricingTable plans={twoPlans} defaultBilling="yearly" />
        </CardContent>
      </Card>

      {/* 4-plan layout */}
      <Card>
        <CardHeader>
          <CardTitle>Four Plans</CardTitle>
          <CardDescription>
            Four-tier pricing grid with responsive columns.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <PricingTable plans={fourPlans} />
        </CardContent>
      </Card>

      {/* Custom header/footer */}
      <Card>
        <CardHeader>
          <CardTitle>With Header & Footer</CardTitle>
          <CardDescription>
            Custom header and footer slots for additional context.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <PricingTable
            plans={basicPlans}
            header={
              <div class="text-center">
                <h2 class="text-2xl font-bold">Choose Your Plan</h2>
                <p class="text-muted-foreground mt-1">Start free, upgrade anytime.</p>
              </div>
            }
            footer={
              <p class="text-muted-foreground text-center text-sm">
                All plans include a 14-day free trial. No credit card required.
              </p>
            }
          />
        </CardContent>
      </Card>
    </PageLayout>
  )
}

export default PricingTablePage
