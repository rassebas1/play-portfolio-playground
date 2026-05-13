import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Breadcrumb, BreadcrumbList, BreadcrumbItem, BreadcrumbLink, BreadcrumbSeparator } from './breadcrumb';
import { Pagination, PaginationContent, PaginationItem, PaginationPrevious, PaginationNext } from './pagination';

describe('Breadcrumb', () => {
  it('renders breadcrumb with items', () => {
    render(
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem><BreadcrumbLink href="/">Home</BreadcrumbLink></BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem><BreadcrumbLink href="/page">Page</BreadcrumbLink></BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
    );
    expect(screen.getByText('Home')).toBeInTheDocument();
    expect(screen.getByText('Page')).toBeInTheDocument();
  });
});

describe('Pagination', () => {
  it('renders pagination controls', () => {
    render(
      <Pagination>
        <PaginationContent>
          <PaginationItem><PaginationPrevious href="#" /></PaginationItem>
          <PaginationItem><PaginationNext href="#" /></PaginationItem>
        </PaginationContent>
      </Pagination>
    );
    expect(screen.getByText(/Previous/i)).toBeInTheDocument();
    expect(screen.getByText(/Next/i)).toBeInTheDocument();
  });
});
