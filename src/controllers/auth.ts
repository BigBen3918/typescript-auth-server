import { UserSchema } from "../models";

const Auth = {
    create: async (props: any) => {
        const { name, email, password, verify } = props;

        try {
            const newData = new UserSchema({
                name: name,
                email: email,
                password: password,
                verify: verify
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
            const result = await UserSchema.findOne(filter);

            return result;
        } catch (err: any) {
            throw new Error(err.message);
        }
    },
    fintById: async (props: any) => {
        const { param } = props;
        try {
            const result = await UserSchema.findById(param);

            return result;
        } catch (err: any) {
            throw new Error(err.message);
        }
    }
};

export default Auth;
