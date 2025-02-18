"use client";

import { usePathname } from 'next/navigation'
import {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbSeparator
} from '@/components/ui/breadcrumb'
import { Fragment } from 'react';

interface BreadcrumbItemType {
  title: string
  url: string
}

const getBreadcrumbItems = (pathname: string): BreadcrumbItemType[] => {
  const items: BreadcrumbItemType[] = []
  const paths = pathname.split('/').filter(Boolean)

  // If we're in a dashboard route (admin/recruiter/candidate)
  if (paths[0] === 'admin' || paths[0] === 'recruiter' || paths[0] === 'candidate') {
    // Add the role as first item
    items.push({
      title: paths[0].charAt(0).toUpperCase() + paths[0].slice(1),
      url: `/${paths[0]}`
    })

    // Add remaining path segments
    paths.slice(1).forEach((path, index) => {
      items.push({
        title: path.charAt(0).toUpperCase() + path.slice(1),
        url: `/${paths.slice(0, index + 2).join('/')}`
      })
    })
  }

  return items
}

export function DashboardBreadcrumb() {
  const pathname = usePathname()
  const breadcrumbItems = getBreadcrumbItems(pathname)

  return (
    <Breadcrumb>
      <BreadcrumbList>
        {breadcrumbItems.map((item, index) => (
          <Fragment key={index}>
            <BreadcrumbItem>
              <BreadcrumbLink href={item.url}>
                {item.title}
              </BreadcrumbLink>
            </BreadcrumbItem>
            {index < breadcrumbItems.length - 1 && (
              <BreadcrumbSeparator className="hidden md:block" />
            )}
          </Fragment>
        ))}
      </BreadcrumbList>
    </Breadcrumb>
  )
}