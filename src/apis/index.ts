import AUTH from "./auth";

const API = (router: any) => {
    // APIs for Auth
    router.post("/registry", AUTH.registry);
    router.post("/login", AUTH.login);
    router.post("/g-login", AUTH.glogin);
    router.post("/password-reset", AUTH.passwordreset);
    router.get("/reset/:userId/:token", AUTH.handlereset);
    router.get("/user-verify/:userId/:token", AUTH.handleverify);
};

export default API;
