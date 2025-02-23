import React, { useRef, useEffect } from 'react';
import { Product } from '@/services/products';
import { Avatar } from '@/components/ui/avatar';
import ListItem from '@/components/ui/list-item';
import { useRouter } from 'next/navigation';
import Image from 'next/image';

interface SearchResultsProps {
  results: Product[];
  onClose: () => void;
}

const SearchResults: React.FC<SearchResultsProps> = ({ results, onClose }) => {
  const dropdownRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        onClose();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [onClose]);

  const handleProductClick = (id: number) => {
    onClose(); // Close the dropdown
    router.push(`/products/${id}?id=${id}`); // Navigate to product details page
  };

  return (
    <div ref={dropdownRef} className="absolute z-10 w-[580px] bg-white dark:bg-gray-800 shadow-lg rounded-md max-h-60 overflow-y-auto">
      <div className="p-2">
        {results.length > 0 ? (
          results.map((product) => (
            <ListItem key={product.id} onClick={() => handleProductClick(product.id)} className="gap-3">
              <Avatar className="h-8 w-8">
                <Image src={product.imageURL} alt={product.nom} width={32} height={32}  />
              </Avatar>
              <span className="text-sm">{product.nom}</span>
            </ListItem>
          ))
        ) : (
          <p className="text-center text-gray-500 text-sm py-2">No results found</p>
        )}
      </div>
    </div>
  );
};

export default SearchResults;