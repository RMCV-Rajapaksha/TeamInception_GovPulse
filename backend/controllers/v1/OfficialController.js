const { PrismaClient } = require("../../generated/prisma");

const prisma = new PrismaClient();
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const login = async (req, res) => {
    try {
        const { username, password } = req.body;

        const official = await prisma.official.findUnique({
            where: { username }
        });

        if (!official) {
            return res.status(401).json({ message: "Invalid credentials" });
        }

        const isValid = await bcrypt.compare(password, official.password);
        if (!isValid) {
            return res.status(401).json({ message: "Invalid credentials" });
        }

        const token = jwt.sign({ official_id: official.official_id, authority_id: official.authority_id }, process.env.JWT_SECRET, {
            expiresIn: "1d"
        });

        res.json({ token });
    } catch (error) {
        console.error("Login error:", error);
        res.status(500).json({ message: "Internal server error" });
    }
}

const register = async (req, res) => {
    try {
        const { username, password, authority_id, position } = req.body;

        if (!username || !password || !authority_id || !position) {
            return res.status(400).json({ message: "Username, password, authority_id, and position are required" });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const existingOfficial = await prisma.official.findUnique({
            where: { username: username }
        });

        if (existingOfficial) {
            return res.status(409).json({ message: "Username already exists" });
        }

        const newOfficial = await prisma.official.create({
            data: {
                username,
                password: hashedPassword,
                Authority: {
                    connect: { authority_id: parseInt(authority_id) }
                }
            }
        });

        const token = jwt.sign({ official_id: newOfficial.official_id, authority_id: newOfficial.authority_id }, process.env.JWT_SECRET, {
            expiresIn: "1d"
        });
        
        res.status(201).json({ message: "Official registered successfully", token: token });
    } catch (error) {
        console.error("Registration error:", error);
        res.status(500).json({ message: "Internal server error" });
    }
}

module.exports = {
    login,
    register
};