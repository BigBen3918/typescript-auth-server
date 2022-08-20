import { TokenSchema } from "../models";

const Auth = {
    create: async (props: any) => {
        const { userId, token } = props;

        try {
            const newData = new TokenSchema({
                userId: userId,
                token: token,
            });

            const saveData = await newData.save();

            if (!saveData) {
                throw new Error("Database Error");
            }

            return saveData;
        } catch (err: any) {
            throw new Error(err.message);
        }
    },
    find: async (props: any) => {
        const { filter } = props;

        try {
            const result = await TokenSchema.findOne(filter);

            return result;
        } catch (err: any) {
            throw new Error(err.message);
        }
    },
};

export default Auth;
