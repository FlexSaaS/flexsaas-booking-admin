// firestoreDataAccess.ts
import { db } from "./FirebaseConfig";
import {
  collection,
  getDocs,
  setDoc,
  doc,
  deleteDoc,
} from "firebase/firestore";
import type { DataAccess, AvailabilityType, Appointment } from "../types";

/**
 * Firestore implementation of the DataAccess interface.
 * Handles CRUD operations for appointments and user availability.
 */
export class FirestoreDataAccess implements DataAccess {
  private availabilityCollection = collection(db, "availability");
  private appointmentsCollection = collection(db, "appointments");

  /** Add a new appointment (or update existing if ID provided) */
  async addAppointment(appointment: Appointment): Promise<void> {
    const id = appointment.id || doc(this.appointmentsCollection).id;

    const appointmentData = {
      ...appointment,
      date: appointment.date.toISOString(), // store as ISO string
      id, // ensure ID is included
    };

    await setDoc(doc(this.appointmentsCollection, id), appointmentData);
  }

  /** Retrieve all appointments from Firestore */
  async getAllAppointments(): Promise<Appointment[]> {
    const snapshot = await getDocs(this.appointmentsCollection);

    return snapshot.docs.map((doc) => {
      const data = doc.data();
      return {
        id: doc.id,
        date: data.date ? new Date(data.date) : new Date(),
        time: data.time ?? "",
        service: data.service ?? "",
        client: {
          name: data.client?.name ?? "",
          email: data.client?.email ?? "",
          phone: data.client?.phone ?? "",
        },
        notes: data.notes ?? "",
      } as Appointment;
    });
  }

  /** Delete an appointment by ID */
  async deleteAppointment(id: string): Promise<void> {
    await deleteDoc(doc(this.appointmentsCollection, id));
  }

  /** Set availability for a specific user */
  async setAvailability(
    userId: string,
    availability: AvailabilityType[]
  ): Promise<void> {
    const userDoc = doc(this.availabilityCollection, userId);
    const availabilityData = availability.map((a) => ({
      ...a,
      date: a.date instanceof Date ? a.date.toISOString() : a.date,
    }));

    await setDoc(userDoc, { availability: availabilityData });
  }

  /** Get availability */
  async getAvailability(): Promise<AvailabilityType[]> {
    const snapshot = await getDocs(this.availabilityCollection);

    if (snapshot.empty) return [];

    const allAvailability: AvailabilityType[] = [];

    snapshot.forEach((doc) => {
      const data = doc.data();
      if (data?.availability) {
        (data.availability as AvailabilityType[]).forEach((a) => {
          allAvailability.push({
            ...a,
            date: typeof a.date === "string" ? new Date(a.date) : a.date,
          });
        });
      }
    });

    return allAvailability;
  }
}
