import { Spinner } from 'shadcn-solid-components/components/spinner'

const SpinnerCustomDemo = () => {
  return (
    <div class="flex items-center gap-3">
      <Spinner
        class="size-6 text-orange-500"
        animationClass="animate-bounce"
        aria-label="Loading custom star"
        icon={
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="currentColor"
            class="size-full"
          >
            <path d="M12 2.5l2.78 5.63 6.22.9-4.5 4.38 1.06 6.19L12 16.68 6.44 19.6l1.06-6.19L3 9.03l6.22-.9L12 2.5z" />
          </svg>
        }
      />
      <span class="text-sm">Custom icon + animation class</span>
    </div>
  )
}

export default SpinnerCustomDemo
