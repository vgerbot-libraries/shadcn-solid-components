import { FaqSection } from "shadcn-solid-components/hoc/faq-section"

const FaqSectionDemo = () => {
  return (
    <FaqSection
      categories={[
        { id: "general", label: "General" },
        { id: "billing", label: "Billing" },
        { id: "technical", label: "Technical" },
      ]}
      items={[
        {
          id: "q1",
          question: "What is this component library?",
          answer:
            "A collection of accessible, reusable UI components built with SolidJS and styled with Tailwind CSS.",
          category: "general",
        },
        {
          id: "q2",
          question: "Can I cancel my subscription at any time?",
          answer:
            "Yes. You can cancel your subscription from the billing page and your access will continue until the end of the billing cycle.",
          category: "billing",
        },
        {
          id: "q3",
          question: "Which frameworks are supported?",
          answer: "Currently SolidJS is the primary target. The components use Kobalte under the hood for accessible primitives.",
          category: "technical",
        },
        {
          id: "q4",
          question: "Is there a free tier?",
          answer: "Yes. The library is open source and free to use in any project.",
          category: "billing",
        },
      ]}
    />
  )
}

export default FaqSectionDemo
