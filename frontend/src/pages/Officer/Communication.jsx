import { Send, Mail, Phone } from "lucide-react";
import { useState } from "react";

export default function OfficerCommunication() {
  const [form, setForm] = useState({ to: "", subject: "", message: "" });
  const [sent, setSent] = useState(false);

  const handleSend = (e) => {
    e.preventDefault();
    setSent(true);
    setTimeout(() => setSent(false), 3000);
    setForm({ to: "", subject: "", message: "" });
  };

  return (
    <div className="max-w-2xl space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Liên lạc với thí sinh</h1>
        <p className="text-gray-500 text-sm mt-1">Gửi thông báo, email đến thí sinh</p>
      </div>

      {sent && (
        <div className="p-4 bg-green-50 border border-green-200 text-green-700 rounded-xl flex items-center gap-3">
          <span>✓</span> Đã gửi thành công!
        </div>
      )}

      <div className="card">
        <div className="card-header"><h3 className="font-semibold text-gray-900 flex items-center gap-2"><Mail size={18} /> Gửi email thông báo</h3></div>
        <div className="card-body">
          <form onSubmit={handleSend} className="space-y-4">
            <div>
              <label className="form-label">Người nhận (email)</label>
              <input className="form-input" value={form.to} onChange={(e) => setForm({...form, to: e.target.value})}
                placeholder="student@gmail.com" type="email" required />
            </div>
            <div>
              <label className="form-label">Tiêu đề</label>
              <input className="form-input" value={form.subject} onChange={(e) => setForm({...form, subject: e.target.value})}
                placeholder="Thông báo kết quả xét tuyển" required />
            </div>
            <div>
              <label className="form-label">Nội dung</label>
              <textarea className="form-input resize-none" rows={6} value={form.message}
                onChange={(e) => setForm({...form, message: e.target.value})}
                placeholder="Nhập nội dung thông báo..." required />
            </div>
            <button type="submit" className="btn btn-blue flex items-center gap-2">
              <Send size={16} /> Gửi thông báo
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
