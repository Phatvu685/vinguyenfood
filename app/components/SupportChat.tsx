"use client";

import { FormEvent, useState } from "react";

type Message = { id: number; text: string; from: "bot" | "user" };

const quickReplies = ["Tư vấn chọn gạo", "Kiểm tra đơn hàng", "Chính sách giao hàng"];

const answers: Record<string, string> = {
  "Tư vấn chọn gạo": "Bạn thích cơm dẻo, thơm hay mềm? Hãy cho Vigen biết khẩu vị để được gợi ý loại gạo phù hợp.",
  "Kiểm tra đơn hàng": "Bạn vào mục Tài khoản → Đơn hàng của tôi để theo dõi trạng thái đơn hàng nhé.",
  "Chính sách giao hàng": "Vigen giao hàng toàn quốc. Thời gian nhận hàng thường từ 2–5 ngày làm việc, tùy khu vực.",
};

export default function SupportChat() {
  const [open, setOpen] = useState(false);
  const [text, setText] = useState("");
  const [messages, setMessages] = useState<Message[]>([
    { id: 1, from: "bot", text: "Chào bạn! Vigen có thể hỗ trợ gì cho bữa cơm hôm nay?" },
  ]);

  function reply(content: string) {
    const clean = content.trim();
    if (!clean) return;
    setMessages((current) => [
      ...current,
      { id: Date.now(), from: "user", text: clean },
      { id: Date.now() + 1, from: "bot", text: answers[clean] || "Vigen đã nhận được tin nhắn. Nhân viên tư vấn sẽ phản hồi bạn sớm nhất có thể." },
    ]);
    setText("");
  }

  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    reply(text);
  }

  return (
    <div className="support-chat">
      {open && (
        <section className="support-chat-window" aria-label="Trò chuyện hỗ trợ">
          <header className="support-chat-header">
            <span className="support-chat-mark" aria-hidden="true">V</span>
            <div><strong>Vigen hỗ trợ</strong><small>Đang sẵn sàng tư vấn</small></div>
            <button type="button" onClick={() => setOpen(false)} aria-label="Đóng chat">×</button>
          </header>

          <div className="support-chat-messages" aria-live="polite">
            {messages.map((message) => <p key={message.id} className={`support-message ${message.from}`}>{message.text}</p>)}
          </div>

          <div className="support-quick-replies">
            {quickReplies.map((item) => <button key={item} type="button" onClick={() => reply(item)}>{item}</button>)}
          </div>

          <form className="support-chat-form" onSubmit={submit}>
            <input value={text} onChange={(event) => setText(event.target.value)} placeholder="Nhập câu hỏi của bạn..." aria-label="Nội dung tin nhắn" />
            <button type="submit" aria-label="Gửi tin nhắn">↑</button>
          </form>
        </section>
      )}

      <button className="support-chat-trigger" type="button" onClick={() => setOpen((value) => !value)} aria-label={open ? "Đóng chat" : "Mở chat hỗ trợ"}>
        {open ? "×" : <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 18.2 3.5 21l4.3-1.5A8.5 8.5 0 1 0 3.5 12c0 1.7.5 3.3 1.5 4.7Z" /><path d="M8 12h.01M12 12h.01M16 12h.01" /></svg>}
      </button>
    </div>
  );
}
