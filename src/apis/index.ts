import AUTH from "./auth";

const API = (router: any) => {
    // APIs for Auth
    router.post("/registry", AUTH.registry);
    router.post("/login", AUTH.login);
    
};

export default API;
