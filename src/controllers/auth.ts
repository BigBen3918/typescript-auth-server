import { UserSchema } from "../models";

const Auth = {
    create: async (props: any) => {
        const { name, email, password } = props;

        try {
            const newData = new UserSchema({
                name: name,
                email: email,
                password: password,
            });

            const saveData = await newData.save();

            if (!saveData) {
                throw new Error("Database Error");
            }

            return true;
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
};

export default Auth;
