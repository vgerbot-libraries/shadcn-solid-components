import { Picker } from 'shadcn-solid-components/mobile/picker'
import { createSignal } from 'solid-js'

const data = ['Anna', 'Ivonna', 'Eurus', 'Arwen']

const PickerDemo = () => {
  const [value, setValue] = createSignal<number>()

  return (
    <div class="p-4">
      <Picker
        value={value()}
        range={data}
        textAlign="right"
        onChange={next => setValue(typeof next === 'number' ? next : next[0])}
      >
        {data[value() ?? -1] ?? 'Please choose'}
      </Picker>
    </div>
  )
}

export default PickerDemo
