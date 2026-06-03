import { Tag } from "antd";
import type { MessageStatus } from "../types";

const statusColors: Record<MessageStatus, string> = {
  OPEN: "blue",
  REPLIED: "green",
  DELETED: "default",
};

export function MessageStatusTag({ status }: { status: MessageStatus }) {
  return <Tag color={statusColors[status]}>{status}</Tag>;
}
