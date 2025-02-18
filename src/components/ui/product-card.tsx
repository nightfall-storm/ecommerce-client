import { Card, CardContent, CardFooter, CardHeader } from "./card"
import { Button } from "./button"
import Image from "next/image"
import { Badge } from "./badge"

interface ProductCardProps {
  product: {
    id: string
    name: string
    price: number
    image: string
    category: string
  }
}

export function ProductCard({ product }: ProductCardProps) {
  return (
    <Card className="flex flex-col justify-between overflow-hidden transition-all hover:shadow-lg">
      <CardHeader className="p-0">
        <div className="aspect-square relative overflow-hidden">
          <Image
            src={product.image}
            alt={product.name}
            fill
            className="object-cover transition-all hover:scale-105"
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