import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from './accordion';
import { Tabs, TabsList, TabsTrigger, TabsContent } from './tabs';
import { Dialog, DialogTrigger, DialogContent, DialogTitle } from './dialog';
import { Toggle } from './toggle';

describe('Accordion', () => {
  it('renders accordion trigger', () => {
    render(
      <Accordion type="single">
        <AccordionItem value="1">
          <AccordionTrigger>Section 1</AccordionTrigger>
          <AccordionContent>Content 1</AccordionContent>
        </AccordionItem>
      </Accordion>
    );
    expect(screen.getByText('Section 1')).toBeInTheDocument();
  });
});

describe('Tabs', () => {
  it('renders tabs trigger and content', () => {
    render(
      <Tabs defaultValue="tab1">
        <TabsList>
          <TabsTrigger value="tab1">Tab 1</TabsTrigger>
        </TabsList>
        <TabsContent value="tab1">Content 1</TabsContent>
      </Tabs>
    );
    expect(screen.getByText('Tab 1')).toBeInTheDocument();
  });
});

describe('Dialog', () => {
  it('renders trigger button', () => {
    render(
      <Dialog>
        <DialogTrigger>Open Dialog</DialogTrigger>
        <DialogContent>
          <DialogTitle>Dialog Title</DialogTitle>
        </DialogContent>
      </Dialog>
    );
    expect(screen.getByText('Open Dialog')).toBeInTheDocument();
  });
});

describe('Toggle', () => {
  it('renders toggle button', () => {
    render(<Toggle>Toggle me</Toggle>);
    expect(screen.getByText('Toggle me')).toBeInTheDocument();
  });
});
