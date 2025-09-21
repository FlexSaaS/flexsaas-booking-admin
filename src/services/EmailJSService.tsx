import emailjs from "emailjs-com";
import type { IEmailService } from "../types";

const SERVICE_ID = "service_g2fmkcp";
const TEMPLATE_ID = "template_h7ria5l";
const PUBLIC_KEY = "s_7egKYGY7tVPPmMy";

export class EmailJsService implements IEmailService {
  async sendApprovalEmail(to: string): Promise<void> {
    await emailjs.send(
      SERVICE_ID,
      TEMPLATE_ID,
      {
        to_email: to,
        subject: "Your account has been approved",
        message: "You can now log in with your email and password.",
      },
      PUBLIC_KEY
    );
  }

  async sendRejectionEmail(to: string): Promise<void> {
    await emailjs.send(
      SERVICE_ID,
      TEMPLATE_ID,
      {
        to_email: to,
        subject: "Your account registration was rejected",
        message: "Your registration request was not approved by the admin.",
      },
      PUBLIC_KEY
    );
  }

  async sendRegistrationPendingEmail(to: string): Promise<void> {
    await emailjs.send(
      SERVICE_ID,
      TEMPLATE_ID,
      {
        to_email: to,
        subject: "Registration Pending",
        message: "Your registration request is pending admin approval.",
      },
      PUBLIC_KEY
    );
  }

  async notifyAdminOfRegistration(userEmail: string): Promise<void> {
    await emailjs.send(
      SERVICE_ID,
      TEMPLATE_ID,
      {
        to_email: "flexsaas.team@gmail.com",
        subject: "New registration request",
        message: `New registration request: ${userEmail}`,
      },
      PUBLIC_KEY
    );
  }
}
