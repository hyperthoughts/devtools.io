export interface FormatOptions {
  dialect: string;
  keywordCase: 'upper' | 'lower' | 'preserve';
  indent: string;
}

export const DIALECTS = [
  { value: 'sql', label: 'Standard SQL' },
  { value: 'postgresql', label: 'PostgreSQL' },
  { value: 'mysql', label: 'MySQL' },
  { value: 'mariadb', label: 'MariaDB' },
  { value: 'sqlite', label: 'SQLite' },
  { value: 'bigquery', label: 'BigQuery' },
  { value: 'tsql', label: 'T-SQL' },
  { value: 'plsql', label: 'PL/SQL' },
  { value: 'db2', label: 'DB2' },
  { value: 'snowflake', label: 'Snowflake' },
];

export const KEYWORD_CASES = [
  { value: 'upper', label: 'Uppercase (SELECT)' },
  { value: 'lower', label: 'Lowercase (select)' },
  { value: 'preserve', label: 'Preserve (Select)' },
];

export const INDENTS = [
  { value: '  ', label: '2 spaces' },
  { value: '    ', label: '4 spaces' },
  { value: '\t', label: 'Tabs' },
];
