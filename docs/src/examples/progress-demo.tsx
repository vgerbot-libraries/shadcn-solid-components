import {
  Progress,
  ProgressGroup,
  ProgressLabel,
  ProgressValueLabel,
} from "shadcn-solid-components/components/progress"

const ProgressDemo = () => {
  return (
    <Progress value={80} class="max-w-xs">
      <ProgressGroup>
        <ProgressLabel>Progress</ProgressLabel>
        <ProgressValueLabel />
      </ProgressGroup>
    </Progress>
  )
}

export default ProgressDemo
