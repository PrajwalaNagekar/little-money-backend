import registerModel from "../../models/register.model.js";

const registerUser = async (req, res) => {
    const { mobileNumber } = req.body;
    
    try {
        const existingUser = await registerModel.findOne({ mobileNumber });
        if (existingUser) {
            return res.status(400).json({ message: "Phone number already registered" });
        }

        const newUser = new registerModel({ mobileNumber });
        await newUser.save();

        res.status(201).json({ message: "User registered successfully", user: newUser });
    } catch (error) {
        console.error("Registration Error:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
};
export default registerUser;