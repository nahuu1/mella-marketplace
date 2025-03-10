
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Edit, Trash2 } from "lucide-react";

interface ListingCardProps {
  id: string;
  title: string;
  price: number;
  currency?: string;
  category: 'house' | 'car' | 'service' | 'product';
  imageUrl: string;
  location: string;
  onEdit?: (id: string) => void;
  onDelete?: (id: string) => void;
}

export function ListingCard({
  id,
  title,
  price,
  currency = "ETB",
  category,
  imageUrl,
  location,
  onEdit,
  onDelete,
}: ListingCardProps) {
  const getCategoryStyles = () => {
    switch (category) {
      case 'house':
        return { bg: 'bg-blue-50', text: 'text-blue-600' };
      case 'car':
        return { bg: 'bg-green-50', text: 'text-green-600' };
      case 'service':
        return { bg: 'bg-amber-50', text: 'text-amber-600' };
      case 'product':
        return { bg: 'bg-purple-50', text: 'text-purple-600' };
      default:
        return { bg: 'bg-gray-50', text: 'text-gray-600' };
    }
  };

  const styles = getCategoryStyles();

  return (
    <Card className="overflow-hidden">
      <div className="aspect-[4/3] relative overflow-hidden">
        <img 
          src={imageUrl || 'https://via.placeholder.com/400x300'} 
          alt={title}
          className="object-cover w-full h-full"
        />
        <Badge 
          className={`absolute top-2 left-2 ${styles.bg} ${styles.text} border-0`}
        >
          {category.charAt(0).toUpperCase() + category.slice(1)}
        </Badge>
      </div>
      
      <CardContent className="p-4">
        <h3 className="font-medium text-lg line-clamp-1 mb-1">{title}</h3>
        <p className="text-sm text-muted-foreground mb-2">{location}</p>
        <p className="font-bold">
          {price.toLocaleString()} {currency}
        </p>
      </CardContent>
      
      <CardFooter className="p-3 pt-0 flex justify-between gap-2">
        {onEdit && (
          <Button 
            variant="outline" 
            size="sm" 
            className="flex-1"
            onClick={() => onEdit(id)}
          >
            <Edit className="h-4 w-4 mr-2" />
            Edit
          </Button>
        )}
        
        {onDelete && (
          <Button 
            variant="outline" 
            size="sm" 
            className="flex-1 text-destructive hover:text-destructive-foreground hover:bg-destructive"
            onClick={() => onDelete(id)}
          >
            <Trash2 className="h-4 w-4 mr-2" />
            Delete
          </Button>
        )}
      </CardFooter>
    </Card>
  );
}
