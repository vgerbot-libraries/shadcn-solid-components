import { type Component } from 'solid-js'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from 'shadcn-solid-components/components/card'
import {
  IconCreditCard,
  IconHelp,
  IconLock,
  IconRocket,
} from 'shadcn-solid-components/components/icons'
import { FaqSection, type FaqCategory, type FaqItem } from 'shadcn-solid-components/hoc/faq-section'
import { PageLayout } from '../components/PageLayout'

const categories: FaqCategory[] = [
  { id: 'general', label: 'General', icon: <IconHelp class="size-4" /> },
  { id: 'billing', label: 'Billing', icon: <IconCreditCard class="size-4" /> },
  { id: 'security', label: 'Security', icon: <IconLock class="size-4" /> },
  { id: 'getting-started', label: 'Getting Started', icon: <IconRocket class="size-4" /> },
]

const faqItems: FaqItem[] = [
  {
    id: 'faq-1',
    question: 'How do I get started with shadcn-solid-components?',
    answer:
      'Install the package, wrap your app with ConfigProvider, then import components and HOC blocks as needed.',
    category: 'getting-started',
  },
  {
    id: 'faq-2',
    question: 'Can I customize the theme and design tokens?',
    answer:
      'Yes. You can customize colors, radius, typography and spacing through your Tailwind configuration and component class names.',
    category: 'general',
  },
  {
    id: 'faq-3',
    question: 'Do you support yearly billing?',
    answer:
      'Yes. Yearly plans are available and typically include a discount compared with monthly billing.',
    category: 'billing',
  },
  {
    id: 'faq-4',
    question: 'What payment methods are supported?',
    answer:
      'We currently support major credit cards. Additional payment options can be enabled for enterprise accounts.',
    category: 'billing',
  },
  {
    id: 'faq-5',
    question: 'How is my data protected?',
    answer:
      'Data is encrypted in transit and at rest. We also provide role-based access controls and audit logs.',
    category: 'security',
  },
  {
    id: 'faq-6',
    question: 'Can I enable two-factor authentication?',
    answer:
      'Absolutely. You can enable 2FA in account settings to add an extra layer of protection.',
    category: 'security',
  },
  {
    id: 'faq-7',
    question: 'Is there a trial period?',
    answer:
      'Yes, new accounts can start with a free trial and upgrade any time from the billing page.',
    category: 'general',
  },
]

const HelperCenterPage: Component = () => {
  return (
    <PageLayout
      title="Helper Center"
      description="FAQ section demo with search, category filters, and accordion answers."
    >
      <Card>
        <CardHeader>
          <CardTitle>FAQ Section — Full Demo</CardTitle>
          <CardDescription>
            Search by keyword, switch categories, and expand answers with accordion interactions.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <FaqSection items={faqItems} categories={categories} searchable />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>FAQ Section — No Categories</CardTitle>
          <CardDescription>Minimal setup using only searchable FAQ items.</CardDescription>
        </CardHeader>
        <CardContent>
          <FaqSection items={faqItems.slice(0, 4)} searchable />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>FAQ Section — Empty State</CardTitle>
          <CardDescription>
            Example with no items to showcase the fallback empty state.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <FaqSection items={[]} searchable categories={categories} />
        </CardContent>
      </Card>
    </PageLayout>
  )
}

export default HelperCenterPage
