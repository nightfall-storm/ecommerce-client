import React from 'react';

interface ListItemProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
}

const ListItem: React.FC<ListItemProps> = ({ children, className, ...props }) => {
  return (
    <div className={`flex items-center p-2 rounded-md hover:bg-gray-100 ${className}`} {...props}>
      {children}
    </div>
  );
};

export default ListItem;