import mongoose from "mongoose";

const ConnectDatabase = (mongoUrl: string) => {
    try {
        const result: any = mongoose.connect(mongoUrl);

        if (result) {
            console.log("MongoDB connected");
        }
    } catch (err: any) {
        console.log(err);
        ConnectDatabase(mongoUrl);
    }
};

export default ConnectDatabase;
