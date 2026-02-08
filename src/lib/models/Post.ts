export interface Post {
  id: string;
  content: string;
  created_at: string;
  team: {
    name: string;
    handle: string;
  };
}
