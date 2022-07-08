import { ActionIcon } from "@mantine/core";
import { useClipboard } from "@mantine/hooks";
import { Clipboard, ClipboardCheck } from "tabler-icons-react";

type CopyButtonProps = {
    data: string;
};

export default function CopyButton({ data }: CopyButtonProps) {
    const clipboard = useClipboard();


    return (
        <ActionIcon
            color={clipboard.copied ? "green" : "blue"}
            onClick={() => clipboard.copy(data)}
        >
            {clipboard.copied ? <ClipboardCheck size={16} /> : <Clipboard size={16} />}
        </ActionIcon>
    );
}