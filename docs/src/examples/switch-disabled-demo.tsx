import {
  Switch,
  SwitchControl,
  SwitchInput,
  SwitchLabel,
  SwitchThumb,
} from "shadcn-solid-components/components/switch"

const SwitchDisabledDemo = () => {
  return (
    <Switch class="flex items-center gap-x-2" disabled>
      <SwitchInput />
      <SwitchControl>
        <SwitchThumb />
      </SwitchControl>
      <SwitchLabel>Unavailable</SwitchLabel>
    </Switch>
  )
}

export default SwitchDisabledDemo
