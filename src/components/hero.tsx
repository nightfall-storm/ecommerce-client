import { Button } from "@/components/ui/button"

export function Hero() {
  return (
    <div className="relative overflow-hidden bg-background py-24">
      <div className="container mx-auto px-4 max-w-7xl relative z-10">
        <div className="mx-auto max-w-2xl text-center">
          <h1 className="text-4xl font-bold tracking-tight sm:text-6xl">
            Discover Amazing Products
          </h1>
          <p className="mt-6 text-lg leading-8 text-muted-foreground">
            Shop the latest trends and find everything you need. From electronics to fashion,
            we've got you covered with the best selection and prices.
          </p>
          <div className="mt-10 flex items-center justify-center gap-x-6">
            <Button size="lg">Shop Now</Button>
            <Button variant="outline" size="lg">
              View Deals
            </Button>
          </div>
        </div>
      </div>
      <div className="absolute inset-0 -z-10 bg-[linear-gradient(to_right,#4f46e5,#0ea5e9)] opacity-[0.05]" />
    </div>
  )
}