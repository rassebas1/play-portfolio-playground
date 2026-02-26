import React, { useRef, useEffect } from 'react';
import * as d3 from 'd3';
import { motion } from 'framer-motion';
import { Activity, Cpu, Zap } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import type { SpectrogramData, ProcessingProgress } from '../../types';

interface ProcessingTunnelProps {
  spectrogramData: SpectrogramData | null;
  processingProgress: ProcessingProgress;
  audioData: Float32Array | null;
}

export const ProcessingTunnel: React.FC<ProcessingTunnelProps> = ({
  spectrogramData,
  processingProgress,
  audioData,
}) => {
  const waveformRef = useRef<SVGSVGElement>(null);
  const spectrogramRef = useRef<SVGSVGElement>(null);

  // Waveform visualization
  useEffect(() => {
    if (!waveformRef.current || !audioData) return;

    const svg = d3.select(waveformRef.current);
    svg.selectAll('*').remove();

    const width = waveformRef.current.clientWidth;
    const height = waveformRef.current.clientHeight;
    const margin = { top: 10, right: 10, bottom: 10, left: 10 };
    const innerWidth = width - margin.left - margin.right;
    const innerHeight = height - margin.top - margin.bottom;

    const g = svg.append('g')
      .attr('transform', `translate(${margin.left},${margin.top})`);

    // Downsample for display
    const step = Math.max(1, Math.floor(audioData.length / innerWidth));
    const displayData: [number, number][] = [];
    for (let i = 0; i < audioData.length; i += step) {
      displayData.push([i / audioData.length, audioData[i]]);
    }

    const xScale = d3.scaleLinear()
      .domain([0, 1])
      .range([0, innerWidth]);

    const yScale = d3.scaleLinear()
      .domain([-1, 1])
      .range([innerHeight, 0]);

    // Create gradient
    const gradient = svg.append('defs')
      .append('linearGradient')
      .attr('id', 'waveform-gradient')
      .attr('x1', '0%')
      .attr('y1', '0%')
      .attr('x2', '0%')
      .attr('y2', '100%');

    gradient.append('stop')
      .attr('offset', '0%')
      .attr('stop-color', 'hsl(var(--primary))')
      .attr('stop-opacity', 0.8);

    gradient.append('stop')
      .attr('offset', '50%')
      .attr('stop-color', 'hsl(var(--primary))')
      .attr('stop-opacity', 0.3);

    gradient.append('stop')
      .attr('offset', '100%')
      .attr('stop-color', 'hsl(var(--primary))')
      .attr('stop-opacity', 0.8);

    // Create area generator
    const area = d3.area<[number, number]>()
      .x(d => xScale(d[0]))
      .y0(innerHeight / 2)
      .y1(d => yScale(d[1]))
      .curve(d3.curveMonotoneX);

    // Draw waveform
    g.append('path')
      .datum(displayData)
      .attr('fill', 'url(#waveform-gradient)')
      .attr('d', area)
      .attr('opacity', 0)
      .transition()
      .duration(500)
      .attr('opacity', 1);

    // Add center line
    g.append('line')
      .attr('x1', 0)
      .attr('x2', innerWidth)
      .attr('y1', innerHeight / 2)
      .attr('y2', innerHeight / 2)
      .attr('stroke', 'hsl(var(--primary) / 0.3)')
      .attr('stroke-width', 1)
      .attr('stroke-dasharray', '4,4');

  }, [audioData]);

  // Spectrogram visualization
  useEffect(() => {
    if (!spectrogramRef.current || !spectrogramData) return;

    const svg = d3.select(spectrogramRef.current);
    svg.selectAll('*').remove();

    const width = spectrogramRef.current.clientWidth;
    const height = spectrogramRef.current.clientHeight;
    const margin = { top: 10, right: 10, bottom: 20, left: 30 };
    const innerWidth = width - margin.left - margin.right;
    const innerHeight = height - margin.top - margin.bottom;

    const g = svg.append('g')
      .attr('transform', `translate(${margin.left},${margin.top})`);

    // Color scale - viridis-like
    const colorScale = d3.scaleSequential()
      .domain([0, 80])
      .interpolator(d3.interpolateViridis);

    // Flatten magnitudes for display
    const displayData: { x: number; y: number; value: number }[] = [];
    spectrogramData.magnitudes.forEach((row, timeIdx) => {
      row.forEach((mag, freqIdx) => {
        displayData.push({
          x: timeIdx / spectrogramData.magnitudes.length,
          y: freqIdx / row.length,
          value: mag,
        });
      });
    });

    // Downsample for performance
    const stepX = Math.max(1, Math.floor(spectrogramData.magnitudes.length / 100));
    const stepY = Math.max(1, Math.floor(spectrogramData.frequencies.length / 50));
    const filteredData = displayData.filter(
      (d, i) => i % (stepX * stepY) === 0
    );

    const xScale = d3.scaleLinear()
      .domain([0, 1])
      .range([0, innerWidth]);

    const yScale = d3.scaleLinear()
      .domain([0, 1])
      .range([innerHeight, 0]);

    // Draw heatmap cells
    g.selectAll('rect')
      .data(filteredData)
      .enter()
      .append('rect')
      .attr('x', d => xScale(d.x))
      .attr('y', d => yScale(d.y) - innerHeight / (spectrogramData.frequencies.length / stepY))
      .attr('width', Math.max(1, innerWidth / (spectrogramData.magnitudes.length / stepX)))
      .attr('height', Math.max(1, innerHeight / (spectrogramData.frequencies.length / stepY)))
      .attr('fill', d => colorScale(d.value))
      .attr('opacity', 0)
      .transition()
      .duration(500)
      .attr('opacity', 0.8);

    // Add frequency axis
    const freqAxis = d3.axisLeft(yScale)
      .ticks(5)
      .tickFormat(d => {
        const freq = (d as number) * spectrogramData.sampleRate / 2;
        return freq > 1000 ? `${(freq / 1000).toFixed(1)}k` : `${freq.toFixed(0)}`;
      });

    g.append('g')
      .attr('transform', `translate(0,0)`)
      .call(freqAxis)
      .selectAll('text')
      .attr('fill', 'hsl(var(--muted-foreground))')
      .attr('font-size', '8px');

    g.selectAll('.domain, .tick line')
      .attr('stroke', 'hsl(var(--border))');

  }, [spectrogramData]);

  const getStageIcon = (stage: string) => {
    switch (stage) {
      case 'audio':
        return <Activity className="w-4 h-4" />;
      case 'dsp':
        return <Zap className="w-4 h-4" />;
      case 'inference':
        return <Cpu className="w-4 h-4" />;
      default:
        return <Activity className="w-4 h-4" />;
    }
  };

  const getStageLabel = (stage: string) => {
    switch (stage) {
      case 'idle':
        return 'Ready';
      case 'loading':
        return 'Loading';
      case 'audio':
        return 'Audio In';
      case 'dsp':
        return 'Processing';
      case 'inference':
        return 'Inference';
      case 'complete':
        return 'Complete';
      case 'error':
        return 'Error';
      default:
        return stage;
    }
  };

  return (
    <Card className="h-full bg-gradient-to-br from-card via-card to-secondary/20 border-primary/20 overflow-hidden">
      <div className="absolute inset-0 bg-grid-pattern opacity-20" />
      
      <CardHeader className="relative pb-4">
        <CardTitle className="text-lg font-semibold flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-secondary flex items-center justify-center">
            <Activity className="w-4 h-4 text-secondary-foreground" />
          </div>
          Processing Tunnel
        </CardTitle>
      </CardHeader>

      <CardContent className="relative space-y-4">
        {/* Processing Progress */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-xs">
            <span className="flex items-center gap-1 text-muted-foreground">
              {getStageIcon(processingProgress.stage)}
              {getStageLabel(processingProgress.stage)}
            </span>
            <span className="font-mono text-primary">
              {processingProgress.progress}%
            </span>
          </div>
          <div className="h-2 rounded-full bg-background overflow-hidden">
            <motion.div
              className="h-full bg-gradient-to-r from-primary to-primary-glow"
              initial={{ width: 0 }}
              animate={{ width: `${processingProgress.progress}%` }}
              transition={{ duration: 0.3 }}
            />
          </div>
          <p className="text-xs text-muted-foreground">
            {processingProgress.message}
          </p>
        </div>

        {/* Waveform Display */}
        <div className="space-y-2">
          <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
            Time Domain
          </label>
          <div className="relative h-24 rounded-lg bg-background/50 border border-border overflow-hidden">
            <svg
              ref={waveformRef}
              className="w-full h-full"
              preserveAspectRatio="none"
            />
            {!audioData && (
              <div className="absolute inset-0 flex items-center justify-center">
                <p className="text-xs text-muted-foreground">No audio data</p>
              </div>
            )}
          </div>
        </div>

        {/* Spectrogram Display */}
        <div className="space-y-2">
          <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
            Frequency Domain (Spectrogram)
          </label>
          <div className="relative h-32 rounded-lg bg-background/50 border border-border overflow-hidden">
            <svg
              ref={spectrogramRef}
              className="w-full h-full"
              preserveAspectRatio="none"
            />
            {!spectrogramData && (
              <div className="absolute inset-0 flex items-center justify-center">
                <p className="text-xs text-muted-foreground">No spectrogram data</p>
              </div>
            )}
          </div>
        </div>

        {/* Processing Stats */}
        <div className="grid grid-cols-3 gap-2 pt-2 border-t border-border/50">
          <div className="p-2 rounded-lg bg-background/50 text-center">
            <p className="text-[10px] text-muted-foreground uppercase">Window</p>
            <p className="font-mono text-xs">2048</p>
          </div>
          <div className="p-2 rounded-lg bg-background/50 text-center">
            <p className="text-[10px] text-muted-foreground uppercase">Hop</p>
            <p className="font-mono text-xs">512</p>
          </div>
          <div className="p-2 rounded-lg bg-background/50 text-center">
            <p className="text-[10px] text-muted-foreground uppercase">MFCC</p>
            <p className="font-mono text-xs">13</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ProcessingTunnel;
