const { PrismaClient } = require("../generated/prisma");

const prisma = new PrismaClient();

const viewFreeTimeSlots = async (req, res) => {
    try {
        const { official } = req; // Extract official info from the request object
        if (!official) {
            return res.status(401).json({ error: "Unauthorized" });
        }

        const { authority_id } = official;

        // Fetch free time slots for the official's authority
        const freeTimeSlots = await prisma.Free_Times.findMany({
            where: {
                authority_id: authority_id,
            },
        });

        if (freeTimeSlots.length === 0) {
            return res.status(404).json({ message: "No free time slots found" });
        }

        res.status(200).json(freeTimeSlots);
    } catch (error) {
        console.error("Error fetching free time slots:", error);
        return res.status(500).json({ error: "Internal Server Error" });
    }
}

const addFreeTimeSlot = async (req, res) => {
    try {
        const { official } = req; // Extract official info from the request object
        if (!official) {
            return res.status(401).json({ error: "Unauthorized" });
        }

        const { authority_id } = official;
        const { date, start_time, end_time } = req.body;

        if (!date || !start_time || !end_time) {
            return res.status(400).json({ error: "Date, start time, and end time are required" });
        }
        // Create the new time slot string
        const newTimeSlotStr = `${start_time} - ${end_time}`;

        const recordExistsForDate = await prisma.Free_Times.findFirst({
            where: {
                authority_id: authority_id,
                date: new Date(date),
            },
        });

        if (recordExistsForDate) {

            // Append the new time slot to the existing array
            const updatedTimeSlots = [...recordExistsForDate.time_slots, newTimeSlotStr];

            // Update the record in the database
            await prisma.Free_Times.update({
            where: {
                authority_id_date: {
                authority_id: authority_id,
                date: new Date(date),
                },
            },
            data: {
                time_slots: updatedTimeSlots,
            },
            });

            return res.status(200).json({ message: "Time slot added to existing date", free_time_slot_data: {
                authority_id: authority_id,
                date: new Date(date),
                time_slots: updatedTimeSlots
            } });
        }

        const newTimeSlot = await prisma.Free_Times.create({
            data: {
                authority_id: authority_id,
                date: new Date(date),
                time_slots: [newTimeSlotStr], // Store the time slot as an array
            },
        });

        res.status(201).json({ message: "New time slot created", free_time_slot_data: {
            authority_id: newTimeSlot.authority_id,
            date: newTimeSlot.date,
            time_slots: newTimeSlot.time_slots
        } });
    } catch (error) {
        console.error("Error adding free time slot:", error);
        return res.status(500).json({ error: "Internal Server Error" });
    }
}
module.exports = {
    viewFreeTimeSlots,
    addFreeTimeSlot,
};