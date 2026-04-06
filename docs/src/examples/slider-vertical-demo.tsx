import {
  Slider,
  SliderFill,
  SliderThumb,
  SliderTrack,
} from "shadcn-solid-components/components/slider"

const SliderVerticalDemo = () => {
  return (
    <Slider orientation="vertical">
      <SliderTrack>
        <SliderFill />
        <SliderThumb />
      </SliderTrack>
    </Slider>
  )
}

export default SliderVerticalDemo
