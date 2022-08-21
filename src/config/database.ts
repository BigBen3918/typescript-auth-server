import mongoose from "mongoose";

const ConnectDatabase = async (mongoUrl: string) => {
    try {
        const connectOptions: mongoose.ConnectOptions = {
            autoCreate: true,
            keepAlive: true,
            retryReads: true,
        };

        const result: any = await mongoose.connect(mongoUrl, connectOptions);

        if (result) {
            console.log("MongoDB connected");
        }
    } catch (err: any) {
        console.log(err);
        ConnectDatabase(mongoUrl);
    }
};

export default ConnectDatabase;
