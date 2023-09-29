interface Meta {
  code: number;
  message: string;
  limit?: number;
  total?: number;
}

export default interface MessageResponse<T> {
  data?: T;
  meta: Meta;
}
