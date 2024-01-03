import type { JwtPayload } from 'jwt-decode';

export interface CustomJwtPayload extends JwtPayload {
	id: number;
	email: string;
}
