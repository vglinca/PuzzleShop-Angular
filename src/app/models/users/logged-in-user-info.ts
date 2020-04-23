
export class LoggedInUserInfo{
    userId: number;
    email: string;
    name: string;
    roles: Array<string>;
    constructor(){
        this.roles = new Array<string>();
    }
}