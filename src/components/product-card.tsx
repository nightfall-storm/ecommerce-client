import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import Image from "next/image"

interface ProductCardProps {
  product: {
    id: string
    name: string
    price: number
    image: string
    category: string
  }
}

const fallbackImage = "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500&q=80"

export function ProductCard({ product }: ProductCardProps) {
  // Ensure image URL is absolute and handle potential undefined/null values
  const imageUrl = product.image && typeof product.image === 'string'
    ? product.image.startsWith('http')
      ? product.image
      : product.image.startsWith('/')
        ? `${process.env.NEXT_PUBLIC_API_URL}${product.image}`
        : fallbackImage
    : fallbackImage

  return (
    <Card className="flex flex-col justify-between overflow-hidden transition-all hover:shadow-lg">
      <CardHeader className="p-0">
        <div className="aspect-square relative overflow-hidden">
          <Image
            src={imageUrl}
            alt={product.name}
            fill
            className="object-cover transition-all hover:scale-105"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
        </div>
      </CardHeader>
      <CardContent className="p-4">
        <div className="flex items-start justify-between">
          <div>
            <h3 className="font-semibold text-lg">{product.name}</h3>
            <Badge variant="secondary" className="mt-2">
              {product.category}
            </Badge>
          </div>
          <p className="font-bold text-lg">${product.price}</p>
        </div>
      </CardContent>
      <CardFooter className="p-4 pt-0">
        <Button className="w-full">Add to Cart</Button>
      </CardFooter>
    </Card>
  )
}