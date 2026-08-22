import { Cascade, type CascadeOption } from 'shadcn-solid-components/mobile/cascade'

const options: CascadeOption[] = [
  {
    value: 'materials',
    label: 'Materials',
    children: [
      {
        value: 'hardware',
        label: 'Hardware',
        children: [
          { value: 'screws', label: 'Screws' },
          { value: 'hinges', label: 'Hinges' },
          { value: 'handles', label: 'Handles' },
        ],
      },
      {
        value: 'panels',
        label: 'Panels',
        children: [
          { value: 'mdf', label: 'MDF' },
          { value: 'plywood', label: 'Plywood' },
        ],
      },
    ],
  },
  {
    value: 'decor',
    label: 'Decor',
    children: [
      {
        value: 'tiles',
        label: 'Tiles',
        children: [
          { value: 'ceramic', label: 'Ceramic' },
          { value: 'mosaic', label: 'Mosaic' },
        ],
      },
      {
        value: 'wallpaper',
        label: 'Wallpaper',
        children: [
          { value: 'plain', label: 'Plain' },
          { value: 'patterned', label: 'Patterned' },
        ],
      },
    ],
  },
  {
    value: 'lighting',
    label: 'Lighting',
    children: [
      {
        value: 'ceiling',
        label: 'Ceiling',
        children: [
          { value: 'downlight', label: 'Downlight' },
          { value: 'chandelier', label: 'Chandelier' },
        ],
      },
      { value: 'portable', label: 'Portable lamps' },
    ],
  },
]

const CascadeDemo = () => {
  return <Cascade name="category" options={options} />
}

export default CascadeDemo
