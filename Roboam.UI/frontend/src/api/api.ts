import { get } from "../utils/requests";

export default class Api {
    public test = () => {
        return get<string>("/api/test");
    }
}