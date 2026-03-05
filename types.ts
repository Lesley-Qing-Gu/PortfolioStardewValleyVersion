export enum Scene {
  TITLE = 'TITLE',
  DIALOGUE = 'DIALOGUE',
  FARM = 'FARM',
  INTERIOR = 'INTERIOR'
}

export type Language = 'en' | 'cn' | 'sv';

export interface Work {
  id: string;
  title: string;
  description: string;
  imageUrl: string;
  tags: string[];
}

export interface House {
  id: string;
  category: string;
  description: string;
  icon: string;
  works: Work[];
  x: number; // Percent positioning on farm
  y: number;
}