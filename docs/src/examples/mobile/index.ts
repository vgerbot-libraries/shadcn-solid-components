import type { Component } from 'solid-js'
import CascadeDemo from './cascade-demo'
import CheckboxDemo from './checkbox-demo'
import ImagePickerDemo from './image-picker-demo'
import PickerDemo from './picker-demo'
import QuantityStepperDemo from './stepper-demo'

export const mobileDemos: Record<string, Component> = {
  cascade: CascadeDemo,
  checkbox: CheckboxDemo,
  picker: PickerDemo,
  'image-picker': ImagePickerDemo,
  stepper: QuantityStepperDemo,
}
