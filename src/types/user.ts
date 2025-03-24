
export interface CreateUserPayload {
	id: string;
	email: string;
	password?: string;
}
  
export interface UpdateUserPayload {
	email?: string;
	password?: string;
}
