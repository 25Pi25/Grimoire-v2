import { ReminderData } from "../types/Reminder";
import Reminder from "./Reminder";

type SampleReminderType = {
    id?: string,
    text?: string,
    className?: string,
}

export default function SampleReminder({id, text, className}: SampleReminderType) {
    const dummyReminderInfo: ReminderData = {
        id,
        ownerUid: 0,
        reminderUid: 0,
        flipped: false,
        text: text ?? "",
        top: 0,
        left: 0,
    }

    return (<Reminder reminder={dummyReminderInfo} className={className} promptDeletion={false} />)
}