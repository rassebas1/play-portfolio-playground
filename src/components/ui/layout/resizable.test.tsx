import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import {
  ResizablePanelGroup,
  ResizablePanel,
  ResizableHandle,
} from './resizable'

describe('ResizablePanelGroup', () => {
  it('renders panels with content', () => {
    render(
      <ResizablePanelGroup direction="horizontal">
        <ResizablePanel defaultSize={50}>Left Panel</ResizablePanel>
        <ResizableHandle />
        <ResizablePanel defaultSize={50}>Right Panel</ResizablePanel>
      </ResizablePanelGroup>
    )

    expect(screen.getByText('Left Panel')).toBeInTheDocument()
    expect(screen.getByText('Right Panel')).toBeInTheDocument()
  })

  it('renders handle with grip icon when withHandle is true', () => {
    const { container } = render(
      <ResizablePanelGroup direction="horizontal">
        <ResizablePanel defaultSize={50}>A</ResizablePanel>
        <ResizableHandle withHandle />
        <ResizablePanel defaultSize={50}>B</ResizablePanel>
      </ResizablePanelGroup>
    )

    const svgs = container.querySelectorAll('svg')
    expect(svgs.length).toBeGreaterThan(0)
  })

  it('renders handle without grip icon by default', () => {
    const { container } = render(
      <ResizablePanelGroup direction="horizontal">
        <ResizablePanel defaultSize={50}>A</ResizablePanel>
        <ResizableHandle />
        <ResizablePanel defaultSize={50}>B</ResizablePanel>
      </ResizablePanelGroup>
    )

    const svgs = container.querySelectorAll('svg')
    expect(svgs.length).toBe(0)
  })
})
