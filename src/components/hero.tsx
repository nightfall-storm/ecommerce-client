import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { JSX } from "react"

/**
 * Hero section component for the landing page
 * Displays the main value proposition and call-to-action
 * @component
 */
export function Hero(): JSX.Element {
  return (
    <div className="w-full max-w-full -mt-16">
      <div className="relative w-full min-h-[90vh] flex items-center rounded-b-3xl bg-gradient-to-b from-background to-background/80 dark:from-background dark:to-background/80 overflow-hidden">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage:
              `radial-gradient(rgb(98 98 98 / 0.2) 1px, transparent 1px)`,
            backgroundSize: '20px 20px',
          }}
        />
        <div
          className="absolute bottom-0 w-full h-32 bg-gradient-to-t from-background to-transparent"
        />

        <div className="relative z-10 w-full px-4 sm:px-6 lg:px-8 pt-16">
          <div className="flex flex-col items-center text-center">
            <Badge
              variant="secondary"
              className="mb-6 hover:bg-secondary/80 cursor-pointer max-md:mt-3 md:mt-3"
            >
              New Collection Available
            </Badge>

            <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold tracking-tight max-w-4xl bg-clip-text text-transparent bg-gradient-to-b from-foreground to-foreground/70">
              Discover Amazing Products
            </h1>

            <p className="mt-6 text-xl text-muted-foreground max-w-2xl">
              Shop the latest trends and find everything you need. From electronics to fashion, we have got you covered with the best selection and prices.
            </p>

            <div className="mt-8 flex flex-wrap gap-4 justify-center">
              <Button
                size="lg"
                className="bg-primary hover:bg-primary/90"
              >
                Shop Now
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}