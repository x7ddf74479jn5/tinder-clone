export const generateId = (id1: string, id2: string): string => (id1 > id2 ? id1 + id2 : id2 + id1);
