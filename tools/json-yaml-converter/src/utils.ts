import yaml from 'yaml';

export function jsonToYaml(jsonStr: string): string {
  if (!jsonStr.trim()) return '';
  try {
    const obj = JSON.parse(jsonStr);
    return yaml.stringify(obj, { indent: 2 });
  } catch (err: any) {
    throw new Error(`JSON parsing failed: ${err.message}`);
  }
}

export function yamlToJson(yamlStr: string): string {
  if (!yamlStr.trim()) return '';
  try {
    const obj = yaml.parse(yamlStr);
    return JSON.stringify(obj, null, 2);
  } catch (err: any) {
    throw new Error(`YAML parsing failed: ${err.message}`);
  }
}
