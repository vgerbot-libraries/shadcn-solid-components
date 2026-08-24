import { QuantityStepper } from 'shadcn-solid-components/mobile/stepper'

const QuantityStepperDemo = () => {
  return (
    <div class="flex flex-col gap-6 p-4">
      <QuantityStepper />
      <QuantityStepper defaultValue={5} min={5} max={10} />
      <QuantityStepper defaultValue={10} disabled />
    </div>
  )
}

export default QuantityStepperDemo
