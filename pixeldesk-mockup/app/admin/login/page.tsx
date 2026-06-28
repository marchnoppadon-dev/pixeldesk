export default function AdminLoginPage() {
  return (
    <div style={{ maxWidth: 360, margin: "4rem auto", padding: "0 1rem" }}>
      <h1 style={{ fontSize: 20, marginBottom: 8 }}>pixeldeskth admin</h1>
      <p style={{ fontSize: 14, color: "#666", marginBottom: 24 }}>
        สำหรับทีมตรวจสอบเนื้อหาก่อน publish เท่านั้น
      </p>
      <form action="/api/admin/login" method="POST">
        <input
          type="password"
          name="password"
          placeholder="รหัสผ่าน admin"
          required
          style={{
            width: "100%",
            padding: "10px 12px",
            fontSize: 14,
            marginBottom: 12,
            border: "1px solid #ccc",
            borderRadius: 6,
          }}
        />
        <button
          type="submit"
          style={{
            width: "100%",
            padding: "10px 12px",
            fontSize: 14,
            fontWeight: 500,
            background: "#111",
            color: "#fff",
            border: "none",
            borderRadius: 6,
            cursor: "pointer",
          }}
        >
          เข้าสู่ระบบ
        </button>
      </form>
    </div>
  );
}