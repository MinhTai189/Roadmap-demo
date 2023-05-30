interface FieldSchema {
  name: string;
  kind: string;
  isRequired: boolean;
  isUnique?: boolean;
  isId: boolean;
  isReadOnly?: boolean;
  type: string;
  hasDefaultValue?: boolean;
  default?: any;
  isList?: boolean;
  relationName?: string;
  relationFromFields?: any[];
  relationToFields?: any[];
  relationOnDelete?: string;
  isGenerated?: boolean;
}

export type FieldSchemas = Record<string, FieldSchema>;
