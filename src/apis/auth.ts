require("dotenv").config();

import { Request, Response, NextFunction } from "express";
import { OAuth2Client } from "google-auth-library";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import crypto from "crypto";

import { LoginObject, RegistryObject } from "../interfaces/global";
import controllers from "../controllers";
import Utils from "../utils";

const googleClient = new OAuth2Client({
    clientId: `${process.env.OAUTH_CLIENTID}`,
});

// Normal Auth
const registry = async (req: Request, res: Response) => {
    try {
        const { name, email, password }: RegistryObject = req.body;

        if (!(email.trim() && password.trim() && name.trim())) {
            return res.status(400).send("Please enter all required data.");
        } // Check user

        const oldUser = await controllers.Auth.find({
            filter: { email: email.toLowerCase().trim() },
        });

        if (oldUser) {
            return res.status(409).send("User Already Exist. Please Login");
        }

        let encryptedPassword = await bcrypt.hash(password, 10); // Encrypt password

        const result = await controllers.Auth.create({
            name: name,
            email: email.toLowerCase().trim(),
            password: encryptedPassword,
            verify: false
        }); // Save user data

        let token = await controllers.Token.create({
            userId: result._id,
            token: crypto.randomBytes(32).toString("hex"),
        });

        const link = `${process.env.BASE_URL}api/user-verify/${result._id}/${token.token}`;
        const sendVerify = await Utils.sendEmail(result.email, "New User Verify", link);

        if (sendVerify) {
            res.status(200).json({
                success: true,
            });
        } else {
            throw new Error("Server Error");
        }
    } catch (err: any) {
        console.log("create error : ", err.message);
        res.status(500).send(err.message);
    }
};

const login = async (req: Request, res: Response) => {
    try {
        const { email, password }: LoginObject = req.body;

        if (!(email.trim() && password.trim())) {
            return res.status(400).send("Please Enter All Required Data.");
        }

        const user = await controllers.Auth.find({
            filter: { email: email.toLowerCase().trim() },
        });

        if (!user) {
            // User check
            return res.status(404).send("User Not Exist. Please Registry");
        }

        const pass = await bcrypt.compare(password, user.password);

        if (pass) {
            if (!user.verify) {
                return res.status(403).send("User Not Verified. Please Verify");
            }
            // Password check
            const token = jwt.sign(
                { user_id: user._id, email: email.toLowerCase().trim() },
                String(process.env.TOKEN_KEY),
                {
                    expiresIn: "2h",
                }
            ); // Create token

            res.status(200).json({ token: token });
        } else {
            return res.status(400).send("Password or Username Is Not Correct");
        }
    } catch (err: any) {
        console.log("login error: ", err);
        res.status(500).send(err.message);
    }
};

const passwordreset = async (req: Request, res: Response) => {
    try {
        const { email } = req.body;

        const user = await controllers.Auth.find({ filter: { email: email } });
        if (!user)
            return res.status(400).send("User With Given Email Doesn't Exist");

        let token = await controllers.Token.find({
            filter: { userId: user._id },
        });

        if (!token) {
            token = await controllers.Token.create({
                userId: user._id,
                token: crypto.randomBytes(32).toString("hex"),
            });
        }

        const link = `${process.env.BASE_URL}api/reset/${user._id}/${token.token}`;
        const result = await Utils.sendEmail(user.email, "Password reset", link);

        if (result) {
            res.status(200).json({
                success: true
            });
        } else {
            throw new Error("Mailing Error");
        }
    } catch (err: any) {
        console.log(err);
        res.status(500).send(err.message);
    }
};

// Gmail Auth
const glogin = async (req: Request, res: Response) => {
    try {
        const { token } = req.body;
        console.log(token);
        const ticket = await googleClient.verifyIdToken({
            idToken: token,
            audience: process.env.OAUTH_CLIENTID,
        });

        const payload = ticket.getPayload();

        var user: any = await controllers.Auth.find({
            filter: { email: payload?.email },
        });

        if (!user) {
            user = await controllers.Auth.create({
                name: payload?.name,
                email: payload?.email,
                password: "",
                verify: true,
            });
        }

        const jwtToken = jwt.sign(
            { user_id: user._id, email: payload?.email },
            String(process.env.TOKEN_KEY),
            {
                expiresIn: "2h",
            }
        );

        res.status(200).json({ token: jwtToken });
    } catch (err: any) {
        console.log("glogin error", err.message);
        res.status(500).send(err.message);
    }
};

const handleverify = async (req: Request, res: Response) => {
    try {
        const user = await controllers.Auth.fintById({ param: req.params.userId });
        if (!user) return res.status(400).send("invalid link or expired");

        const token = await controllers.Token.find({
            filter: {
                userId: user._id,
                token: req.params.token,
            }
        });

        if (!token) return res.status(400).send("Invalid link or expired");

        user.verify = true;
        await user.save();
        await token.delete();

        res.redirect("http://localhost:3000");
    } catch (err: any) {
        console.log(err);
        res.status(500).send(err.message);
    }
}

const handlereset = async (req: Request, res: Response) => {
    try {
        const user = await controllers.Auth.fintById({ param: req.params.userId });
        if (!user) return res.status(400).send("invalid link or expired");

        const token = await controllers.Token.find({
            filter: {
                userId: user._id,
                token: req.params.token,
            }
        });

        if (!token) return res.status(400).send("Invalid link or expired");

        user.password = "";
        await user.save();
        await token.delete();

        res.redirect("http://localhost:3000");
    } catch (err: any) {
        console.log(err);
        res.status(500).send(err.message);
    }
}

// Middleware
const middleware = async (req: any, res: Response, next: NextFunction) => {
    try {
        const token = <string>req.headers["authorization"] || "";
        console.log(token);

        jwt.verify(
            token,
            String(process.env.TOKEN_KEY),
            async (err: any, userData: any) => {
                if (err) return res.status(403).end();

                const user: any = await controllers.Auth.find({
                    filter: {
                        email: userData.email,
                    },
                });
                req.user = user; // Save user data

                next();
            }
        );
    } catch (err: any) {
        console.log(err.message);
        res.status(401).end();
    }
};

export default {
    login,
    registry,
    passwordreset,
    glogin,
    handlereset,
    handleverify,
    middleware,
};
