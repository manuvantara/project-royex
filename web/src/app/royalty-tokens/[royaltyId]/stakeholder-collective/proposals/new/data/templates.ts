export interface ProposalTemplate<Type = string> {
  id: string;
  name: string;
  description: string;
  strengths?: string;
  type: Type;
}

export const templateTypes = ['Type 1', 'Type 2'] as const;

export type TemplateType = (typeof templateTypes)[number];

export const proposalTemplates: ProposalTemplate<TemplateType>[] = [
  {
    id: 'template-1',
    name: 'Template 1',
    description: 'Description for Template 1',
    type: 'Type 1',
    strengths: 'Strengths for Template 1',
  },
  {
    id: 'template-2',
    name: 'Template 2',
    description: 'Description for Template 2',
    type: 'Type 2',
    strengths: 'Strengths for Template 2',
  },
];
