import Fuse, { type IFuseOptions } from 'fuse.js';

export interface SearchKey<T> {
  name: keyof T & string;
  weight: number;
}

export interface SearchIndexConfig<T> {
  keys: SearchKey<T>[];
  threshold?: number;
}

export interface SearchResult<T> {
  item: T;
  score: number;
}

const DEFAULT_THRESHOLD = 0.35;

export class SearchIndex<T> {
  private fuse: Fuse<T>;

  constructor(items: T[], config: SearchIndexConfig<T>) {
    const options: IFuseOptions<T> = {
      keys: config.keys.map((k) => ({ name: k.name, weight: k.weight })),
      threshold: config.threshold ?? DEFAULT_THRESHOLD,
      includeScore: true,
    };
    this.fuse = new Fuse(items, options);
  }

  search(query: string): T[] {
    if (!query.trim()) return [];
    return this.fuse.search(query).map((r) => r.item);
  }

  searchWithScore(query: string): SearchResult<T>[] {
    if (!query.trim()) return [];
    return this.fuse.search(query).map((r) => ({
      item: r.item,
      score: r.score ?? 0,
    }));
  }

  update(items: T[]) {
    this.fuse.setCollection(items);
  }
}
