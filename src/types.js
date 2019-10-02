// @flow

export type Message = {
  id?: number;
  title: string;
  body: string;
  category: { id: number };
};

export type Category = {
  id?: number;
  title: string;
  parent?: { id: number } | null;
  children?: Category[];
  messages?: Message[];
};
