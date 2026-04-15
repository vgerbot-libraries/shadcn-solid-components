import { PricingTable } from "shadcn-solid-components/hoc/pricing-table"

const PricingTableDemo = () => {
  return (
    <PricingTable
      plans={[
        {
          name: "Free",
          description: "For individuals getting started",
          priceMonthly: 0,
          priceYearly: 0,
          cta: "Get started",
          billingText: "Free forever",
          features: [
            { text: "1 project", included: true },
            { text: "Basic analytics", included: true },
            { text: "Custom domain", included: false },
            { text: "Priority support", included: false },
          ],
        },
        {
          name: "Pro",
          description: "For growing teams",
          priceMonthly: 19,
          priceYearly: 190,
          isPopular: true,
          discount: "17% off",
          cta: "Start free trial",
          ctaInfo: "14-day money-back guarantee",
          features: [
            { text: "Unlimited projects", included: true },
            { text: "Advanced analytics", included: true },
            { text: "Custom domain", included: true },
            { text: "Priority support", included: true },
          ],
        },
        {
          name: "Enterprise",
          description: "For large organisations",
          priceMonthly: 49,
          priceYearly: 490,
          cta: "Contact sales",
          features: [
            { text: "Unlimited projects", included: true },
            { text: "Advanced analytics", included: true },
            { text: "Custom domain", included: true },
            { text: "Priority support", included: true },
          ],
          additionalFeatures: [
            { text: "SSO / SAML", included: true },
            { text: "Dedicated account manager", included: true },
          ],
        },
      ]}
    />
  )
}

export default PricingTableDemo
