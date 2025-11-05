import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export const WhatImLearning: React.FC = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>What I'm Learning</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-muted-foreground">
          Currently enhancing capabilities through a Master's in Big Data, focusing on cloud architecture, data processing, and machine learning applications.
        </p>
        <ul className="list-disc list-inside text-muted-foreground mt-4 space-y-2">
          <li>Cloud Architecture (AWS, Azure)</li>
          <li>Data Pipelines (Spark, Kafka)</li>
          <li>Machine Learning (Pytorch, TensorFlow, Keras)</li>
        </ul>
      </CardContent>
    </Card>
  );
};