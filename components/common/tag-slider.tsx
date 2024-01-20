import { useEffect, useRef, useState } from "react"
import { ChevronLeftIcon, ChevronRightIcon } from "lucide-react"
import Slider from "react-slick"

import { Button } from "@/components/ui/button"
import { TagBadge } from "@/components/common/tag-badge"

import "slick-carousel/slick/slick-theme.css"
import "slick-carousel/slick/slick.css"
import "@/styles/slider.css"

interface TagSliderProps {
  tags: string[]
}

function SliderNextArrow(props: any) {
  const { onClick } = props
  return (
    <div className="absolute right-0 top-0 z-10 flex h-full items-center justify-center">
      <Button className="h-6 w-6 rounded-full" onClick={onClick} size="icon">
        <ChevronRightIcon className="h-5 w-5 text-white" />
      </Button>
    </div>
  )
}

function SliderPrevArrow(props: any) {
  const { onClick } = props
  return (
    <div className="absolute left-0 top-0 z-10 flex h-full items-center justify-center">
      <Button className="h-6 w-6 rounded-full" onClick={onClick} size="icon">
        <ChevronLeftIcon className="h-5 w-5 text-white" />
      </Button>
    </div>
  )
}

function TagSlider({ tags }: TagSliderProps) {
  const [sliderNeeded, setSliderNeeded] = useState(false)
  const tagContainerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (tagContainerRef.current) {
      let parentWidth = tagContainerRef.current?.offsetWidth

      let childrenWidth = Array.from(tagContainerRef.current.children).reduce(
        (acc, child) => acc + (child as HTMLDivElement).offsetWidth,
        0
      )

      setSliderNeeded(childrenWidth >= parentWidth)
    }
  }, [tags])

  const settings = {
    dots: false,
    infinite: true,
    centerMode: true,
    slidesToShow: 1,
    slidesToScroll: 1,
    variableWidth: true,
    prevArrow: <SliderPrevArrow />,
    nextArrow: <SliderNextArrow />,
  }

  return sliderNeeded ? (
    <Slider {...settings}>
      {tags.map((tag, index) => (
        <TagBadge key={index}>{tag}</TagBadge>
      ))}
    </Slider>
  ) : (
    <div
      ref={tagContainerRef}
      className={sliderNeeded ? "" : "flex w-full max-w-full"}
    >
      {tags.map((tag, index) => (
        <TagBadge key={index}>{tag}</TagBadge>
      ))}
    </div>
  )
}

export { TagSlider }
