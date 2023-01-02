export global {
  // eslint-disable-next-line no-unused-vars
  interface KudosData {
    id: number | string;
    parentId?: number | null | undefined;
    firstName: string;
    lastName: string;
    email: string;
    wa: string;
    registerDate: string | Date;
    invited: boolean;
    subscribe: boolean;
    source?: string;
  }
}
