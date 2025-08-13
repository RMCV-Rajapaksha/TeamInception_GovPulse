const { PrismaClient } = require("../generated/prisma");

const prisma = new PrismaClient();

const bookAppointment = async (req, res) => {
    try {
        const { user } = req; // Extract user info from the request object
        if (!user) {
            return res.status(401).json({ error: "Unauthorized" });
        }

        const { user_id } = user;
        const { authority_id, time_slot, date } = req.body;
        var issue_id ;
        if ("issue_id" in req.body) {
            issue_id = req.body.issue_id;
        } else {
            issue_id = null;
        }
        if (!authority_id || !time_slot || !date) {
            return res.status(400).json({ error: "Authority ID, time slot, and date are required" });
        }

        // Check if the time slot exists for the given authority
        const timeSlot = await prisma.Free_Times.findFirst({
            where: {
                authority_id: parseInt(authority_id),
                date: new Date(date),
                time_slots: {
                    has: time_slot
                }
            }
        });

        if (!timeSlot) {
            return res.status(404).json({ error: "Time slot not found for the specified date" });
        }

        const newAppointmentData = {
            User: {
                    connect: { user_id: parseInt(user_id) }
                },
                Authority:{
                    connect: { authority_id: parseInt(authority_id) }
                },
                date: new Date(date),
                time_slot: time_slot,
        }
        if(issue_id) {
            newAppointmentData.Issue = {
                connect: { issue_id: parseInt(issue_id) }
            };
        }
        // Create the appointment
        const newAppointment = await prisma.Appointment.create({
            data: newAppointmentData
        });

        // Remove the booked time slot from the Free_Times table
        if (timeSlot.time_slots.length === 1) {
            // If this was the last time slot, delete the entry
            await prisma.Free_Times.delete({
                where: {
                    authority_id_date: {
                        authority_id: parseInt(authority_id),
                        date: new Date(date)
                    }
                }
            });
        } else {
            // Otherwise, just remove the specific time slot
        await prisma.Free_Times.update({
            where: {
                authority_id_date: {
                    authority_id: parseInt(authority_id),
                    date: new Date(date)
                }
            },
            data: {
                time_slots: {
                    set: timeSlot.time_slots.filter(slot => slot !== time_slot)
                }
            }
        });
    }
    res.status(200).json({ message: "Appointment booked successfully", appointment_data: newAppointment });
    } catch (error) {
        console.error("Error booking appointment:", error);
        return res.status(500).json({ error: "Internal Server Error" });
    }
}

module.exports = { bookAppointment };