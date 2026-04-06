import { createSignal } from "solid-js"

import { Button } from "shadcn-solid-components/components/button"
import { Stepper, useStepper } from "shadcn-solid-components/hoc/stepper"

function StepContent() {
  const api = useStepper()

  return (
    <div class="space-y-3">
      <p class="text-muted-foreground text-sm">
        Step {api.activeStep() + 1} of {api.totalSteps}
      </p>
      <div class="flex gap-2">
        <Button disabled={api.isFirst()} type="button" variant="outline" onClick={() => api.prev()}>
          Back
        </Button>
        <Button type="button" onClick={() => void api.next()}>
          {api.isLast() ? "Finish" : "Continue"}
        </Button>
      </div>
    </div>
  )
}

const StepperDemo = () => {
  const [agreed, setAgreed] = createSignal(false)

  return (
    <Stepper
      showNavigation={false}
      steps={[
        {
          label: "Terms",
          content: (
            <div class="space-y-3">
              <label class="flex items-center gap-2 text-sm">
                <input
                  type="checkbox"
                  checked={agreed()}
                  onChange={(e) => setAgreed(e.currentTarget.checked)}
                />
                I agree to the terms
              </label>
              <StepContent />
            </div>
          ),
          validate: () => agreed(),
        },
        {
          label: "Review",
          content: <p class="text-sm text-muted-foreground">All steps completed.</p>,
        },
      ]}
    />
  )
}

export default StepperDemo
