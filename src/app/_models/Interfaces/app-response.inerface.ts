/** http response shape that come back with any http method */
export interface AppBaseResponse<T> {
  /** response message text */
  message?: string;
  /** data that we used in work */
  content?: T;
  /** check if request is success or not backvalue `true` or `false` */
  succeeded?: any;
  /** array of validation items */
  errors?: any[] | any;
}
