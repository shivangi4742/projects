import { Attachment } from './attachment.model';

export class Notification {
  constructor(
    public isMOver: boolean,
    public isUnread: boolean,
    public isImportant: boolean,
    public hasAttachments: boolean,
    public id: string,
    public attrId: string,
    public type: number,
    public merchantCode: string,
    public from: string,
    public subject: string,
    public body: string,
    public time: string,
    public attachments: Attachment[]|null) { }
}