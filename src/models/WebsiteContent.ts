import mongoose, { Schema, Document } from 'mongoose';

const BilingualSchema = new Schema({
  en: { type: String, required: true },
  bn: { type: String, required: true },
}, { _id: false });

export interface IBilingual {
  en: string;
  bn: string;
}

export interface IWebsiteContent extends Document {
  hero: {
    title: IBilingual;
    subtitle: IBilingual;
  };
  event: {
    details: IBilingual;
  };
  notice: IBilingual;
  formLabels: {
    name: IBilingual;
    email: IBilingual;
    phone: IBilingual;
    batch: IBilingual;
    submit: IBilingual;
  };
  gallery: {
    title: IBilingual;
  };
  footer: {
    text: IBilingual;
  };
  emailTemplates: {
    registrationSubject: IBilingual;
    registrationBody: IBilingual;
  };
}

const WebsiteContentSchema = new Schema<IWebsiteContent>({
  hero: {
    title: BilingualSchema,
    subtitle: BilingualSchema,
  },
  event: {
    details: BilingualSchema,
  },
  notice: BilingualSchema,
  formLabels: {
    name: BilingualSchema,
    email: BilingualSchema,
    phone: BilingualSchema,
    batch: BilingualSchema,
    submit: BilingualSchema,
  },
  gallery: {
    title: BilingualSchema,
  },
  footer: {
    text: BilingualSchema,
  },
  emailTemplates: {
    registrationSubject: BilingualSchema,
    registrationBody: BilingualSchema,
  },
}, { timestamps: true });

export default mongoose.models.WebsiteContent || mongoose.model<IWebsiteContent>('WebsiteContent', WebsiteContentSchema);
