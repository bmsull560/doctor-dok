import { z } from 'zod';
import { getCurrentTS } from './server/db-provider';

export const patientDTOSchema = z.object({
  id: z.number().positive(),
  firstName: z.string().min(1),
  lastName: z.string().min(1),
  updatedAt: z.string().default(() => getCurrentTS()),
});

export type PatientDTO = z.infer<typeof patientDTOSchema>;

export const configDTOSchema = z.object({
  key: z.string().min(1),
  value: z.string().min(1),
  updatedAt: z.string().default(() => getCurrentTS()),
});

export type ConfigDTO = z.infer<typeof configDTOSchema>;

export const patientRecordAttachmentDTOSchema = z.object({
  id: z.number().positive(),
  patientId: z.number().positive().int(),
  patientRecordId: z.number().positive().int(),

  displayName: z.string().min(1),
  description: z.string().nullable(),

  mimeType: z.string().nullable(),
  type: z.string().nullable(),
  json: z.string().nullable(),
  extra: z.string().nullable(),

  size: z.number().positive().int(),

  createdAt: z.string().default(() => getCurrentTS()),
  updatedAt: z.string().default(() => getCurrentTS()),
});

export type PatientRecordAttachmentDTO = z.infer<typeof patientRecordAttachmentDTOSchema>;

export const patientRecordDTOSchema = z.object({
  id: z.number().positive(),
  patientId: z.number().positive().int(),

  description: z.string().nullable(),
  type: z.string().min(1),
  json: z.string().nullable(),
  extra: z.string().nullable(),

  createdAt: z.string().default(() => getCurrentTS()),
  updatedAt: z.string().default(() => getCurrentTS()),
});

export type PatientRecordDTO = z.infer<typeof patientRecordDTOSchema> & {
  attachments?: PatientRecordAttachmentDTO[];
};