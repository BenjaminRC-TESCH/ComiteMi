export interface User {
    _id: string;
    name: string;
    email: string;
    password: string;
    roles: string[];
    roleNames?: string[]; // Agrega esta línea
}
