import AUTH from "./auth";

const API = (router: any) => {
    // APIs for Auth
    router.post("/registry", AUTH.registry);
    router.post("/login", AUTH.login);
    router.post("/password-reset", AUTH.middleware, AUTH.passwordreset);
    router.post("/reset/:userId/:token", AUTH.middleware);
};

export default API;
