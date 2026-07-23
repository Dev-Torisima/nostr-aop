export interface UnsignedNostrEvent {
  pubkey: string;
  created_at: number;
  kind: number;
  tags: string[][];
  content: string;
}


export interface NostrEvent extends UnsignedNostrEvent {
  id: string;
  sig: string;
}

export interface NostrFilter {
  ids?: string[];
  authors?: string[];
  kinds?: number[];

  "#d"?: string[];
  "#a"?: string[];
  "#p"?: string[];

   [key: `#${string}`]: string[] | undefined;

  since?: number;
  until?: number;
  limit?: number;
}

export type NostrTag = string[];
