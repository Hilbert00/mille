interface FieldInputProps {
    placeholder: string;
    value: string | undefined;
}

export default function FieldInput(props: FieldInputProps) {
    return <input type="text" placeholder={props.placeholder} value={props.value} />;
}
