export default class APIError extends Error {
    status: number;
    data: any;

    constructor(message: string, status: number, data: any) {
        super(message); // Appelle le constructeur de la classe Error
        this.status = status;
        this.data = data;
        Object.setPrototypeOf(this, APIError.prototype); // Fixe le prototype pour la compatibilité
    }
}
