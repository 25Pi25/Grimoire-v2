import { useRef, useState } from 'react';
import TextareaAutosize from 'react-textarea-autosize';


type CardTitleType = {
    title: string,
    editable?: boolean
}

export default function CardTitle({ title, editable = true }: CardTitleType) {
    const ref = useRef<any>(null)
    const [value, setValue] = useState(title);

    function onChange() {
        if (ref.current === null) return;

        setValue(ref.current.value);
    }

    return (
        <TextareaAutosize 
            ref={ref} 
            className="Card__title" 
            placeholder='You Learn...' 
            value={value}
            contentEditable={editable}
            onChange={onChange}
        />
    );
}