import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, act } from '@testing-library/react';
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  ChartLegend,
  ChartLegendContent,
} from './chart';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselPrevious,
  CarouselNext,
} from './carousel';
import {
  Menubar,
  MenubarMenu,
  MenubarTrigger,
  MenubarContent,
  MenubarItem,
  MenubarSeparator,
  MenubarLabel,
  MenubarCheckboxItem,
  MenubarRadioGroup,
  MenubarRadioItem,
  MenubarSub,
  MenubarSubTrigger,
  MenubarSubContent,
  MenubarShortcut,
} from '@/components/ui/navigation/menubar';
import {
  Drawer,
  DrawerTrigger,
  DrawerContent,
  DrawerHeader,
  DrawerFooter,
  DrawerTitle,
  DrawerDescription,
  DrawerClose,
} from '@/components/ui/interactive/drawer';
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormDescription,
  FormMessage,
} from '@/components/ui/forms/form';
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
  InputOTPSeparator,
} from '@/components/ui/forms/input-otp';
import {
  Command,
  CommandDialog,
  CommandInput,
  CommandList,
  CommandEmpty,
  CommandGroup,
  CommandItem,
  CommandSeparator,
  CommandShortcut,
} from './command';
import {
  NavigationMenu,
  NavigationMenuList,
  NavigationMenuItem,
  NavigationMenuTrigger,
  NavigationMenuContent,
  NavigationMenuLink,
  NavigationMenuIndicator,
  NavigationMenuViewport,
} from '@/components/ui/navigation/navigation-menu';
import {
  ResizablePanelGroup,
  ResizablePanel,
  ResizableHandle,
} from '@/components/ui/layout/resizable';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';

// ── GLOBAL MOCKS ────────────────────────────────────────────────────

beforeEach(() => {
  class MockIntersectionObserver {
    readonly root: Element | null = null;
    readonly rootMargin: string = '';
    readonly thresholds: ReadonlyArray<number> = [];
    observe = vi.fn();
    unobserve = vi.fn();
    disconnect = vi.fn();
    takeRecords = vi.fn();
  }
  globalThis.IntersectionObserver = MockIntersectionObserver as unknown as typeof IntersectionObserver;
});

// ── CHART ──────────────────────────────────────────────────────────

describe('Chart', () => {
  const sampleData = [
    { name: 'Jan', value: 100 },
    { name: 'Feb', value: 200 },
  ];

  const sampleConfig = {
    value: { label: 'Value', color: '#2563eb' },
  };

  it('renders ChartContainer with a LineChart', () => {
    const { container } = render(
      <ChartContainer config={sampleConfig}>
        <LineChart data={sampleData}>
          <XAxis dataKey="name" />
          <YAxis />
          <CartesianGrid />
          <Tooltip />
          <Legend />
          <Line type="monotone" dataKey="value" />
        </LineChart>
      </ChartContainer>
    );
    expect(container.querySelector('[data-chart]')).toBeInTheDocument();
  });

  it('renders ChartContainer with a BarChart', () => {
    const { container } = render(
      <ChartContainer config={sampleConfig}>
        <BarChart data={sampleData}>
          <XAxis dataKey="name" />
          <YAxis />
          <CartesianGrid />
          <Tooltip />
          <Legend />
          <Bar dataKey="value" />
        </BarChart>
      </ChartContainer>
    );
    expect(container.querySelector('[data-chart]')).toBeInTheDocument();
  });

  it('renders ChartTooltipContent with active payload', () => {
    const payloadItem = {
      dataKey: 'value',
      value: 100,
      name: 'value',
      payload: { fill: '#2563eb', name: 'Jan', value: 100 },
      color: '#2563eb',
    };
    const { container } = render(
      <ChartContainer config={sampleConfig}>
        <ChartTooltipContent active payload={[payloadItem]} />
      </ChartContainer>
    );
    expect(container.querySelector('.grid')).toBeInTheDocument();
  });

  it('returns null for ChartTooltipContent when not active', () => {
    const { container } = render(
      <ChartContainer config={sampleConfig}>
        <ChartTooltipContent
          active={false}
          payload={[{ dataKey: 'value', value: 100, name: 'value' }]}
        />
      </ChartContainer>
    );
    expect(container.querySelector('.grid')).not.toBeInTheDocument();
  });

  it('renders ChartLegendContent with payload', () => {
    const { container } = render(
      <ChartContainer config={sampleConfig}>
        <ChartLegendContent
          payload={[{ dataKey: 'value', value: 'value', color: '#2563eb' }]}
        />
      </ChartContainer>
    );
    expect(container.querySelector('.flex')).toBeInTheDocument();
  });

  it('renders ChartLegend', () => {
    const { container } = render(
      <ChartContainer config={sampleConfig}>
        <ChartLegend />
      </ChartContainer>
    );
    expect(container).toBeInTheDocument();
  });

  it('renders ChartTooltip', () => {
    const { container } = render(
      <ChartContainer config={sampleConfig}>
        <ChartTooltip />
      </ChartContainer>
    );
    expect(container).toBeInTheDocument();
  });
});

// ── CAROUSEL ───────────────────────────────────────────────────────

describe('Carousel', () => {
  it('renders carousel with content and navigation buttons', () => {
    render(
      <Carousel>
        <CarouselContent>
          <CarouselItem>Slide 1</CarouselItem>
          <CarouselItem>Slide 2</CarouselItem>
          <CarouselItem>Slide 3</CarouselItem>
        </CarouselContent>
        <CarouselPrevious />
        <CarouselNext />
      </Carousel>
    );
    expect(screen.getByText('Slide 1')).toBeInTheDocument();
    expect(screen.getByText('Slide 2')).toBeInTheDocument();
    expect(screen.getByText('Slide 3')).toBeInTheDocument();
    expect(screen.getByText('Previous slide')).toBeInTheDocument();
    expect(screen.getByText('Next slide')).toBeInTheDocument();
  });

  it('has correct aria role on the carousel region', () => {
    const { container } = render(
      <Carousel>
        <CarouselContent>
          <CarouselItem>Item</CarouselItem>
        </CarouselContent>
      </Carousel>
    );
    expect(container.querySelector('[role="region"]')).toBeInTheDocument();
  });
});

// ── MENUBAR ────────────────────────────────────────────────────────

describe('Menubar', () => {
  it('renders menubar with triggers', () => {
    render(
      <Menubar>
        <MenubarMenu>
          <MenubarTrigger>File</MenubarTrigger>
          <MenubarContent>
            <MenubarItem>New</MenubarItem>
            <MenubarItem>Open</MenubarItem>
            <MenubarSeparator />
            <MenubarItem>Exit</MenubarItem>
          </MenubarContent>
        </MenubarMenu>
        <MenubarMenu>
          <MenubarTrigger>Edit</MenubarTrigger>
          <MenubarContent>
            <MenubarItem>Undo</MenubarItem>
            <MenubarItem>Redo</MenubarItem>
          </MenubarContent>
        </MenubarMenu>
      </Menubar>
    );
    expect(screen.getByText('File')).toBeInTheDocument();
    expect(screen.getByText('Edit')).toBeInTheDocument();
  });

  it('renders menubar with label and submenu trigger', () => {
    render(
      <Menubar>
        <MenubarMenu>
          <MenubarTrigger>View</MenubarTrigger>
          <MenubarContent>
            <MenubarLabel>Layout</MenubarLabel>
            <MenubarSeparator />
            <MenubarSub>
              <MenubarSubTrigger>Panels</MenubarSubTrigger>
              <MenubarSubContent>
                <MenubarItem>Explorer</MenubarItem>
                <MenubarItem>Search</MenubarItem>
              </MenubarSubContent>
            </MenubarSub>
          </MenubarContent>
        </MenubarMenu>
      </Menubar>
    );
    expect(screen.getByText('View')).toBeInTheDocument();
  });

  it('renders trigger with correct accessibility attributes', () => {
    render(
      <Menubar>
        <MenubarMenu>
          <MenubarTrigger>File</MenubarTrigger>
          <MenubarContent>
            <MenubarItem>New File</MenubarItem>
          </MenubarContent>
        </MenubarMenu>
      </Menubar>
    );
    const trigger = screen.getByText('File');
    expect(trigger).toHaveAttribute('aria-haspopup', 'menu');
    expect(trigger).toHaveAttribute('aria-expanded', 'false');
  });
});

// ── DRAWER ─────────────────────────────────────────────────────────

describe('Drawer', () => {
  it('renders drawer trigger', () => {
    render(
      <Drawer>
        <DrawerTrigger>Open Drawer</DrawerTrigger>
        <DrawerContent>
          <DrawerHeader>
            <DrawerTitle>Drawer Title</DrawerTitle>
            <DrawerDescription>Drawer description</DrawerDescription>
          </DrawerHeader>
          <DrawerFooter>
            <DrawerClose>Close</DrawerClose>
          </DrawerFooter>
        </DrawerContent>
      </Drawer>
    );
    expect(screen.getByText('Open Drawer')).toBeInTheDocument();
  });
});

// ── FORM ───────────────────────────────────────────────────────────

describe('Form', () => {
  const formSchema = z.object({
    username: z.string().min(2, 'Username must be at least 2 characters'),
  });

  function TestForm({ mode }: { mode?: 'onSubmit' | 'onChange' | 'onBlur' | 'onTouched' }) {
    const form = useForm<z.infer<typeof formSchema>>({
      resolver: zodResolver(formSchema),
      defaultValues: { username: '' },
      mode: mode ?? 'onChange',
    });

    return (
      <Form {...form}>
        <FormField
          name="username"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Username</FormLabel>
              <FormControl>
                <input data-testid="username-input" {...field} />
              </FormControl>
              <FormDescription>Enter your username</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
      </Form>
    );
  }

  it('renders form with label, input, and description', () => {
    render(<TestForm />);
    expect(screen.getByText('Username')).toBeInTheDocument();
    expect(screen.getByTestId('username-input')).toBeInTheDocument();
    expect(screen.getByText('Enter your username')).toBeInTheDocument();
  });

  it('shows validation error for invalid input', async () => {
    render(<TestForm mode="onChange" />);
    const input = screen.getByTestId('username-input') as HTMLInputElement;

    await act(async () => {
      fireEvent.change(input, { target: { value: 'A' } });
    });

    const errorMessage = await screen.findByText(
      'Username must be at least 2 characters'
    );
    expect(errorMessage).toBeInTheDocument();
  });

  it('renders without error for valid input', async () => {
    render(<TestForm mode="onChange" />);
    const input = screen.getByTestId('username-input') as HTMLInputElement;

    await act(async () => {
      fireEvent.change(input, { target: { value: 'ValidUser' } });
    });

    expect(
      screen.queryByText('Username must be at least 2 characters')
    ).not.toBeInTheDocument();
  });
});

// ── INPUT OTP ──────────────────────────────────────────────────────

describe('InputOTP', () => {
  it('renders OTP input with slots and separator', () => {
    render(
      <InputOTP maxLength={6}>
        <InputOTPGroup>
          <InputOTPSlot index={0} />
          <InputOTPSlot index={1} />
          <InputOTPSlot index={2} />
        </InputOTPGroup>
        <InputOTPSeparator />
        <InputOTPGroup>
          <InputOTPSlot index={3} />
          <InputOTPSlot index={4} />
          <InputOTPSlot index={5} />
        </InputOTPGroup>
      </InputOTP>
    );
    expect(screen.getByRole('separator')).toBeInTheDocument();
  });

  it('renders with default value', () => {
    render(
      <InputOTP maxLength={4} value="1234" onChange={() => {}}>
        <InputOTPGroup>
          <InputOTPSlot index={0} />
          <InputOTPSlot index={1} />
          <InputOTPSlot index={2} />
          <InputOTPSlot index={3} />
        </InputOTPGroup>
      </InputOTP>
    );
    expect(document.querySelector('input')).toBeInTheDocument();
  });
});

// ── COMMAND ────────────────────────────────────────────────────────

describe('Command', () => {
  it('renders command with items', () => {
    render(
      <Command>
        <CommandInput placeholder="Search..." />
        <CommandList>
          <CommandEmpty>No results</CommandEmpty>
          <CommandGroup heading="Suggestions">
            <CommandItem>Item 1</CommandItem>
            <CommandItem>Item 2</CommandItem>
          </CommandGroup>
          <CommandSeparator />
          <CommandItem>Item 3</CommandItem>
        </CommandList>
      </Command>
    );
    expect(screen.getByText('Item 1')).toBeInTheDocument();
    expect(screen.getByText('Item 2')).toBeInTheDocument();
    expect(screen.getByText('Item 3')).toBeInTheDocument();
  });

  it('renders command shortcut', () => {
    render(
      <Command>
        <CommandList>
          <CommandItem>
            Search <CommandShortcut>Ctrl+K</CommandShortcut>
          </CommandItem>
        </CommandList>
      </Command>
    );
    expect(screen.getByText('Ctrl+K')).toBeInTheDocument();
  });

  it('renders CommandDialog when open', () => {
    render(
      <CommandDialog open={true}>
        <CommandInput placeholder="Search..." />
        <CommandList>
          <CommandItem>Dialog Result</CommandItem>
        </CommandList>
      </CommandDialog>
    );
    expect(screen.getByText('Dialog Result')).toBeInTheDocument();
  });

  it('does not render CommandDialog content when closed', () => {
    render(
      <CommandDialog open={false}>
        <CommandInput placeholder="Search..." />
        <CommandList>
          <CommandItem>Hidden Result</CommandItem>
        </CommandList>
      </CommandDialog>
    );
    expect(screen.queryByText('Hidden Result')).not.toBeInTheDocument();
  });
});

// ── NAVIGATION MENU ────────────────────────────────────────────────

describe('NavigationMenu', () => {
  it('renders navigation menu with trigger and link', () => {
    render(
      <NavigationMenu>
        <NavigationMenuList>
          <NavigationMenuItem>
            <NavigationMenuTrigger>Products</NavigationMenuTrigger>
            <NavigationMenuContent>
              <NavigationMenuLink asChild>
                <a href="/product-1">Product 1</a>
              </NavigationMenuLink>
              <NavigationMenuLink asChild>
                <a href="/product-2">Product 2</a>
              </NavigationMenuLink>
            </NavigationMenuContent>
          </NavigationMenuItem>
          <NavigationMenuItem>
            <NavigationMenuLink asChild>
              <a href="/about">About</a>
            </NavigationMenuLink>
          </NavigationMenuItem>
        </NavigationMenuList>
        <NavigationMenuIndicator />
        <NavigationMenuViewport />
      </NavigationMenu>
    );
    expect(screen.getByText('Products')).toBeInTheDocument();
    expect(screen.getByText('About')).toBeInTheDocument();
  });

  it('renders NavigationMenuViewport', () => {
    const { container } = render(
      <NavigationMenu>
        <NavigationMenuList>
          <NavigationMenuItem>
            <NavigationMenuTrigger>Item</NavigationMenuTrigger>
            <NavigationMenuContent>Content</NavigationMenuContent>
          </NavigationMenuItem>
        </NavigationMenuList>
        <NavigationMenuViewport />
      </NavigationMenu>
    );
    expect(container.querySelector('[data-state]')).toBeInTheDocument();
  });
});

// ── RESIZABLE ──────────────────────────────────────────────────────

describe('Resizable', () => {
  it('renders resizable panel group with panels', () => {
    const { container } = render(
      <ResizablePanelGroup direction="horizontal">
        <ResizablePanel defaultSize={50}>
          <div>Panel 1</div>
        </ResizablePanel>
        <ResizableHandle />
        <ResizablePanel defaultSize={50}>
          <div>Panel 2</div>
        </ResizablePanel>
      </ResizablePanelGroup>
    );
    expect(screen.getByText('Panel 1')).toBeInTheDocument();
    expect(screen.getByText('Panel 2')).toBeInTheDocument();
    expect(container.querySelector('[data-panel-group-direction="horizontal"]')).toBeInTheDocument();
  });

  it('renders resizable handle withHandle', () => {
    render(
      <ResizablePanelGroup direction="vertical">
        <ResizablePanel defaultSize={50}>Top</ResizablePanel>
        <ResizableHandle withHandle />
        <ResizablePanel defaultSize={50}>Bottom</ResizablePanel>
      </ResizablePanelGroup>
    );
    expect(screen.getByText('Top')).toBeInTheDocument();
    expect(screen.getByText('Bottom')).toBeInTheDocument();
  });

  it('renders resizable handle without handle icon', () => {
    render(
      <ResizablePanelGroup direction="horizontal">
        <ResizablePanel defaultSize={50}>Left</ResizablePanel>
        <ResizableHandle />
        <ResizablePanel defaultSize={50}>Right</ResizablePanel>
      </ResizablePanelGroup>
    );
    expect(screen.getByText('Left')).toBeInTheDocument();
    expect(screen.getByText('Right')).toBeInTheDocument();
  });
});
