const { PrismaClient } = require("../../generated/prisma");

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

const addAttendeeToAppointment = async (req, res) => {
    try {
        const { appointment_id, nic, name, phone_no } = req.body;
        var added_by = "";
        if ("official" in req) {
            added_by = "official";
        }
        if ("user" in req) {
            added_by = "user";
        }
        if (added_by === "") {
            return res.status(400).json({ error: "you need to be logged in as a user of official to add attendee" });
        }

        if (!appointment_id || !nic || !name) {
            return res.status(400).json({ error: "Appointment ID, NIC, and name are required" });
        }
        
        // Fetch the appointment by ID
        const appointment = await prisma.appointment.findUnique({
            where: {
                appointment_id: parseInt(appointment_id)
            }
        });

        if (!appointment) {
            return res.status(404).json({ error: "Appointment not found" });
        }


        // Add the attendee to the Attendee table
        const newAttendee = await prisma.attendees.create({
            data: {
                Appointment: {
                    connect: { appointment_id: parseInt(appointment_id) }
                },
                nic: nic,
                name: name,
                phone_no: phone_no,
                added_by: added_by
            }
        });

        res.status(200).json({ message: "Attendee added successfully", attendee_data: newAttendee });
    } catch (error) {
        console.error("Error adding attendees:", error);
        return res.status(500).json({ error: "Internal Server Error" });
    }
};

const getAttendeesOfAppointment = async (req, res) => {
    try {
        const { appointment_id } = req.params;

        // Fetch the attendees for the specified appointment
        const attendees = await prisma.attendees.findMany({
            where: {
                appointment_id: parseInt(appointment_id)
            }
        });

        if (!attendees || attendees.length === 0) {
            return res.status(404).json({ error: "No attendees found for this appointment" });
        }

        res.status(200).json({ attendees });
    } catch (error) {
        console.error("Error fetching attendees:", error);
        return res.status(500).json({ error: "Internal Server Error" });
    }
};

const removeAttendeeFromAppointment = async (req, res) => {
    try {
        const { attendee_id } = req.params;

        // Fetch the attendee by ID
        const attendee = await prisma.attendees.findUnique({
            where: {
                attendee_id: parseInt(attendee_id)
            }
        });

        if (!attendee) {
            return res.status(404).json({ error: "Attendee not found" });
        }

        // Delete the attendee
        await prisma.attendees.delete({
            where: {
                attendee_id: parseInt(attendee_id)
            }
        });

        res.status(200).json({ message: "Attendee removed successfully" });
    } catch (error) {
        console.error("Error removing attendee:", error);
        return res.status(500).json({ error: "Internal Server Error" });
    }
};

const addAttachmentFile = async (req, res) => {
    try {
        const { appointment_id, file_url } = req.body;

        if (!appointment_id || !file_url) {
            return res.status(400).json({ error: "Appointment ID and file URL are required" });
        }
        
        const AttachmentExists = await prisma.attachment.findUnique({
            where: {
                appointment_id: parseInt(appointment_id)
            }
        });

        if (AttachmentExists) {
            // append the new file_url to the existing attachment file_urls array
            const updatedAttachment = await prisma.attachment.update({
                where: {
                    appointment_id: parseInt(appointment_id)
                },
                data: {
                    file_urls: {
                        push: file_url // Assuming file_url is an array, if not, you may need to adjust this
                    }
                }
            });

            return res.status(200).json({ message: "Attachment updated successfully", attachment: updatedAttachment });
        }else{
            // If no attachment exists, create a new one
            const newAttachment = await prisma.attachment.create({
                data: {
                    Appointment: {
                        connect: { appointment_id: parseInt(appointment_id) }
                    },
                    file_urls: [file_url] // Store the file_url as an array
                }
            });

            return res.status(200).json({ message: "Attachment added successfully", attachment_data: newAttachment });
        }

    } catch (error) {
        console.error("Error adding attachment:", error);
        return res.status(500).json({ error: "Internal Server Error" });
    }
};

const getAttachmentByAppointmentId = async (req, res) => {
    try {
        const { appointment_id } = req.params;

        // Fetch the attachment by appointment ID
        const attachment = await prisma.attachment.findUnique({
            where: {
                appointment_id: parseInt(appointment_id)
            }
        });

        if (!attachment) {
            return res.status(404).json({ error: "Attachment not found for this appointment" });
        }

        res.status(200).json({ attachment });
    } catch (error) {
        console.error("Error fetching attachment:", error);
        return res.status(500).json({ error: "Internal Server Error" });
    }
};

const removefileFromAttachment = async (req, res) => {
    try {
        const { attachment_id, file_url } = req.body;

        if (!attachment_id || !file_url) {
            return res.status(400).json({ error: "Appointment ID and file URL are required" });
        }

        // Fetch the attachment by appointment ID
        const attachment = await prisma.attachment.findUnique({
            where: {
                attachment_id: parseInt(attachment_id)
            }
        });

        if (!attachment) {
            return res.status(404).json({ error: "Attachment not found for this appointment" });
        }
        if (!attachment.file_urls.includes(file_url)) {
            return res.status(404).json({ error: "File URL not found in the attachment" });
        }
        if (attachment.file_urls.length === 1) {
            // If this was the last file, delete the attachment record
            await prisma.attachment.delete({
                where: {
                    attachment_id: parseInt(attachment_id)
                }
            });
            return res.status(200).json({ message: "Attachment deleted successfully, last file url was also deleted therefore entire attachment record was deleted", attachment_data: {} });
        } else {

            const updatedAttachment = await prisma.attachment.update({
                where: {
                    attachment_id: parseInt(attachment_id)
                },
                data: {
                    file_urls: {
                        set: attachment.file_urls.filter(url => url !== file_url)
                    }
                }
            });
            res.status(200).json({ message: "File removed successfully", attachment_data: updatedAttachment });
        }


    } catch (error) {
        console.error("Error removing file from attachment:", error);
        return res.status(500).json({ error: "Internal Server Error" });
    }
}
module.exports = { 
    bookAppointment, 
    getUsersAppointments,
    getAppointmentById,
    getAuthorityAppointments,
    addAttachmentFile,
    getAttachmentByAppointmentId,
    removefileFromAttachment,
    cancelAppointment,
    addAttendeeToAppointment,
    getAttendeesOfAppointment,
    removeAttendeeFromAppointment
};