import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { AspectRatio } from './aspect-ratio';
import { Avatar, AvatarImage, AvatarFallback } from './avatar';
import { Progress } from './progress';
import { Skeleton } from './skeleton';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell, TableCaption } from './table';

describe('AspectRatio', () => {
  it('renders with correct aspect ratio', () => {
    const { container } = render(<AspectRatio ratio={16 / 9}>content</AspectRatio>);
    expect(container.querySelector('[style*="padding-bottom"]')).toBeInTheDocument();
  });
});

describe('Avatar', () => {
  it('renders fallback when no image', () => {
    render(<Avatar><AvatarFallback>AB</AvatarFallback></Avatar>);
    expect(screen.getByText('AB')).toBeInTheDocument();
  });
});

describe('Progress', () => {
  it('renders with correct value', () => {
    render(<Progress value={50} />);
    const indicator = document.querySelector('[role="progressbar"]');
    expect(indicator).toBeInTheDocument();
  });
});

describe('Skeleton', () => {
  it('renders with base classes', () => {
    const { container } = render(<Skeleton className="w-10 h-10" />);
    expect(container.firstChild).toHaveClass('animate-pulse');
  });
});

describe('Table', () => {
  it('renders table with caption', () => {
    render(
      <Table>
        <TableCaption>Test caption</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          <TableRow>
            <TableCell>Data</TableCell>
          </TableRow>
        </TableBody>
      </Table>
    );
    expect(screen.getByText('Test caption')).toBeInTheDocument();
    expect(screen.getByText('Name')).toBeInTheDocument();
    expect(screen.getByText('Data')).toBeInTheDocument();
  });
});
