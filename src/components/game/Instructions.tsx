import React from 'react';
import { Card, CardContent } from '@/components/ui/card';

/**
 * Props for the Instructions component.
 * @interface InstructionsProps
 * @property {React.ReactNode} children - The content to be displayed as instructions.
 *                                        This can be any valid React node (string, JSX, array of nodes).
 */
interface InstructionsProps {
  children: React.ReactNode;
}

/**
 * Instructions component.
 * Renders a card containing game instructions. It's a flexible container
 * that accepts any React node as its children to display the instructions.
 *
 * @param {InstructionsProps} { children } - Props passed to the component.
 * @returns {JSX.Element} The rendered instructions card.
 */
export const Instructions: React.FC<InstructionsProps> = ({ children }) => {
  return (
    <Card className="mb-6 bg-muted/30 border-primary/10">
      <CardContent className="pt-4">
        <div className="text-center space-y-2">
          {children} {/* Render the children passed as instructions */}
        </div>
      </CardContent>
    </Card>
  );
};