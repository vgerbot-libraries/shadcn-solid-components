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
    themeColor: '#ffc107',
    ctaClass: "bg-[#ffc107] hover:bg-[#e0a800] text-black",
    borderClass: "border-[#ffc107]",
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
    themeColor: '#ffc107',
    ctaClass: "bg-[#ffc107] hover:bg-[#e0a800] text-black",
    borderClass: "border-[#ffc107]",
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

const enhancedPlans: PricingPlan[] = [
  {
    name: 'Free',
    themeColor: '#222',
    ctaClass: "bg-black hover:bg-gray-800 text-white",
    borderClass: "border-black",
    description: 'Try us out for a quick project or two',
    priceMonthly: 0,
    priceYearly: 0,
    billingText: 'Upgrade any time',
    cta: 'Get Started',
    features: [
      { text: '1 active project', included: true },
      { text: '3 MB upload limit', included: true },
      { text: '5,000 visitors /mo', included: true },
    ],
    additionalFeatures: [
      { text: 'Remove branding', included: false },
      { text: 'QR codes', included: false },
      { text: 'Built-in analytics', included: false },
    ],
  },
  {
    name: 'Solo',
    themeColor: '#8a2be2',
    ctaClass: "bg-[#8a2be2] hover:bg-[#7a24cc] text-white",
    borderClass: "border-[#8a2be2]",
    description: 'Great for small projects',
    priceMonthly: 13,
    priceYearly: 120,
    isPopular: true,
    discount: '27% off',
    cta: 'Get Started',
    ctaInfo: '14-day money-back guarantee',
    features: [
      { text: '5 active projects', included: true },
      { text: '75 MB upload limit', included: true },
      { text: '100,000 visitors /mo', included: true },
    ],
    additionalFeatures: [
      { text: 'Custom domains', included: true },
      { text: 'Edit mode', included: true },
      { text: 'Password protection', included: true },
    ],
    footerAction: (
      <Button variant="ghost" class="text-muted-foreground w-full">
        Compare plans
      </Button>
    ),
  },
  {
    name: 'Pro',
    themeColor: '#ffc107',
    ctaClass: "bg-[#ffc107] hover:bg-[#e0a800] text-black",
    borderClass: "border-[#ffc107]",
    description: 'For freelancers, agencies & companies',
    priceMonthly: 31,
    priceYearly: 300,
    discount: '18% off',
    cta: 'Get Started',
    ctaVariant: 'secondary',
    ctaInfo: 'Custom SLA included',
    features: [
      { text: 'Unlimited active projects', included: true },
      { text: '10 GB upload limit', included: true },
      { text: '500,000 visitors /mo', included: true },
    ],
    additionalFeatures: [
      { text: 'Everything in Solo Plan', included: true },
      { text: 'Capture emails', included: true },
      { text: 'Add more team members', included: true },
    ],
    footerAction: (
      <Button variant="ghost" class="text-muted-foreground w-full">
        Compare plans
      </Button>
    ),
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

      {/* Enhanced features */}
      <Card>
        <CardHeader>
          <CardTitle>Enhanced Features</CardTitle>
          <CardDescription>
            Discount badges, additional features, custom billing text, CTA info, and footer actions.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <PricingTable plans={enhancedPlans} defaultBilling="yearly" />
        </CardContent>
      </Card>
    </PageLayout>
  )
}

export default PricingTablePage
