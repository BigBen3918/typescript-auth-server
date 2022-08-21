require("dotenv").config();
import express, { Express } from "express";
import cors from "cors";

// External Modules
import API from "./src/apis";
import config from "./src/config";
import ConnectDatabase from "./src/config/database";

// Get router
const router = express.Router();

const app: Express = express();
const port: Number = Number(process.env.HTTP_PORT || 5005);

app.use(
    cors({
        origin: "*",
        methods: ["POST", "GET"],
    })
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Frontend Load
// app.use(express.static(__dirname + "/build"));
// app.get("/*", function (req: any, res: any) {
//     res.sendFile(__dirname + "/build/index.html", function (err: any) {
//         if (err) {
//             res.status(500).send(err);
//         }
//     });
// });

// API Router
API(router);
app.use("/api", router);

ConnectDatabase(config.mongoURI);
app.listen(port, () => {
    console.log(`Server listening on http://localhost:${port}`);
});
