import { Loader2 } from "lucide-react"
import { cn } from "@/lib/utils"

interface LoaderProps extends React.HTMLAttributes<HTMLDivElement> {
  size?: "sm" | "default" | "lg" | "xl"
  className?: string
  fullScreen?: boolean
}

const sizeClasses = {
  sm: "h-4 w-4",
  default: "h-6 w-6",
  lg: "h-8 w-8",
  xl: "h-12 w-12"
}

export function Loader({
  size = "default",
  className,
  fullScreen = false,
  ...props
}: LoaderProps) {
  const loaderContent = (
    <div className={cn("flex items-center justify-center", className)} {...props}>
      <Loader2 className={cn("animate-spin text-primary", sizeClasses[size])} />
    </div>
  )

  if (fullScreen) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-background/80 backdrop-blur-sm">
        {loaderContent}
      </div>
    )
  }

  return loaderContent
}