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

const getUsersAppointments = async (req, res) => {
    console.log("Fetching user appointments");
    try {
        const { user } = req; // Extract user info from the request object
        if (!user) {
            return res.status(401).json({ error: "Unauthorized" });
        }

        const { user_id } = user;

        // Fetch appointments for the user
        const appointments = await prisma.Appointment.findMany({
            where: {
                user_id: parseInt(user_id)
            },
            include: {
                Authority: true,
                Issue: true
            }
        });
        if (appointments.length === 0) {
            return res.status(404).json({ message: "No appointments found for the user" });
        }

        res.status(200).json(appointments);
    } catch (error) {
        console.error("Error fetching appointments:", error);
        return res.status(500).json({ error: "Internal Server Error" });
    }
};

const getAppointmentById = async (req, res) => {
    try {
        const { appointment_id } = req.params;

        // Fetch the appointment by ID
        const appointment = await prisma.Appointment.findUnique({
            where: {
                appointment_id: parseInt(appointment_id)
            },
            include: {
                Authority: true,
                Issue: true
            } 
        });
        if (!appointment) {
            return res.status(404).json({ error: "Appointment not found" });
        }
        res.status(200).json(appointment);  
    } catch (error) {
        console.error("Error fetching appointment:", error);
        return res.status(500).json({ error: "Internal Server Error" });
    }
};

const getAuthorityAppointments = async (req, res) => {
    try {
        const { authority_id } = req.official; 

        // Fetch appointments for the authority
        const appointments = await prisma.Appointment.findMany({
            where: {
                authority_id: parseInt(authority_id)
            },
            include: {
                User: true,
                Issue: true
            }
        });

        res.status(200).json(appointments);
    } catch (error) {
        console.error("Error fetching authority appointments:", error);
        return res.status(500).json({ error: "Internal Server Error" });
    }
};

const cancelAppointment = async (req, res) => {
    try {
        const { appointment_id, reason } = req.body;
        var reason_to_be_stored = "";
        if("official" in req) {
            reason_to_be_stored = `Cancelled by official: ${reason}`;
        }
        if("user" in req) {
            reason_to_be_stored = `Cancelled by user: ${reason}`;
        }
        if (reason_to_be_stored === "") {
            return res.status(400).json({ error: "you need to be logged in as a user of official to cancel appointment" });
        }

        if (!appointment_id) {
            return res.status(400).json({ error: "Appointment ID is required" });
        }
        if (!reason) {cancel-appointment-by-user
            return res.status(400).json({ error: "Descriptive reason for cancellation is required" });
        }

        // Fetch the appointment by ID
        const appointment = await prisma.Appointment.findUnique({
            where: {
                appointment_id: parseInt(appointment_id)
            }
        });

        if (!appointment) {
            return res.status(404).json({ error: "Appointment not found" });
        }

        // Delete the appointment
        await prisma.Appointment.delete({
            where: {
                appointment_id: parseInt(appointment_id)
            }
        });

        // free the time slot
        const freeTimesRecord = await prisma.Free_Times.findFirst({
            where: {
                authority_id: appointment.authority_id,
                date: appointment.date,
 
            }
        });
        if (!freeTimesRecord){
            // create a new record in Free_Times
            await prisma.Free_Times.create({
                data: {
                    authority_id: appointment.authority_id,
                    date: new Date(appointment.date),
                    time_slots: [appointment.time_slot], // Store the time slot as an array
                },
        });
        }else{
            // get time_slots array append and update the record
            const updatedTimeSlots = [...freeTimesRecord.time_slots, appointment.time_slot];
            await prisma.Free_Times.update({
                where: {
                    authority_id_date: {
                        authority_id: appointment.authority_id,
                        date: appointment.date
                    }
                },
                data: {
                    time_slots: updatedTimeSlots
                }
            });
        }

        res.status(200).json({ message: "Appointment cancelled successfully" });
    } catch (error) {
        console.error("Error cancelling appointment:", error);
        return res.status(500).json({ error: "Internal Server Error" });
    }
};

module.exports = { 
    bookAppointment, 
    getUsersAppointments,
    getAppointmentById,
    getAuthorityAppointments,
    cancelAppointment,
};