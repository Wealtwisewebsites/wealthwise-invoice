import React, { useState, useEffect, useRef } from "react";

const COLORS = {
  cream: "#F5F1E8",
  charcoal: "#1A1D20",
  gold: "#C9A668",
  forest: "#2F5D3A",
  border: "#E8E4D8",
  muted: "#6B6B6B",
  softGrey: "#9A9A9A",
};

const FONT_HEADING = 'Georgia, "Times New Roman", serif';
const FONT_BODY = 'Georgia, "Times New Roman", serif';
const FONT_DISPLAY = '"Helvetica Neue", Arial, sans-serif';

const DEFAULT_COMPANY = {
  name: "WealthWise Media",
  address: "236 Beyers Naude Drive",
  city: "Rustenburg",
  province: "North West",
  code: "0299",
  country: "ZA",
  phone: "+27603475304",
  email: "marco@wealthwisemedia.co.za",
  taxReg: "9419617221",
  bank: "FNB",
  beneficiary: "WealthWise Media",
  account: "63110508752",
};

const STORAGE_COMPANY = "ww_company_info";
const STORAGE_NUM = "ww_invoice_num";

function formatMoney(n) {
  const num = Number(n) || 0;
  const fixed = num.toFixed(2);
  const parts = fixed.split(".");
  parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  return "R" + parts.join(".");
}

function formatDate(iso) {
  if (!iso) return "";
  const d = new Date(iso);
  if (isNaN(d.getTime())) return "";
  const months = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
  return d.getDate() + " " + months[d.getMonth()] + " " + d.getFullYear();
}

function todayISO() {
  const d = new Date();
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return y + "-" + m + "-" + day;
}

function addDaysISO(iso, days) {
  const d = new Date(iso);
  if (isNaN(d.getTime())) return iso;
  d.setDate(d.getDate() + days);
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return y + "-" + m + "-" + day;
}

function newItem() {
  return {
    id: Math.random().toString(36).slice(2),
    description: "",
    subDescription: "",
    qty: 1,
    unitPrice: 0,
    discount: 0,
  };
}

const WLOGO_DATA_URL = "data:image/png;base64,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";

function WLogo() {
  return (
    <img
      src={WLOGO_DATA_URL}
      alt="WealthWise Media"
      style={{
        width: 92,
        height: "auto",
        display: "block",
        background: "transparent",
      }}
    />
  );
}

function SignaturePad(props) {
  const canvasRef = useRef(null);
  const drawing = useRef(false);
  const lastPt = useRef(null);

  useEffect(function () {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    ctx.fillStyle = "#ffffff";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.strokeStyle = COLORS.charcoal;
    ctx.lineWidth = 2;
    ctx.lineCap = "round";
    ctx.lineJoin = "round";
  }, []);

  function getPos(e) {
    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();
    const sx = canvas.width / rect.width;
    const sy = canvas.height / rect.height;
    const cx = e.touches ? e.touches[0].clientX : e.clientX;
    const cy = e.touches ? e.touches[0].clientY : e.clientY;
    return { x: (cx - rect.left) * sx, y: (cy - rect.top) * sy };
  }

  function start(e) {
    e.preventDefault();
    drawing.current = true;
    lastPt.current = getPos(e);
  }
  function move(e) {
    if (!drawing.current) return;
    e.preventDefault();
    const ctx = canvasRef.current.getContext("2d");
    const pt = getPos(e);
    ctx.beginPath();
    ctx.moveTo(lastPt.current.x, lastPt.current.y);
    ctx.lineTo(pt.x, pt.y);
    ctx.stroke();
    lastPt.current = pt;
  }
  function end() {
    if (!drawing.current) return;
    drawing.current = false;
    try { props.onChange(canvasRef.current.toDataURL("image/png")); } catch (e) {}
  }
  function clear() {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    ctx.fillStyle = "#ffffff";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    props.onChange("");
  }

  return (
    <div>
      <canvas
        ref={canvasRef}
        width={600}
        height={150}
        style={{
          width: "100%",
          height: 150,
          background: "#fff",
          border: "1px solid " + COLORS.border,
          borderRadius: 6,
          touchAction: "none",
          cursor: "crosshair",
          display: "block",
        }}
        onMouseDown={start}
        onMouseMove={move}
        onMouseUp={end}
        onMouseLeave={end}
        onTouchStart={start}
        onTouchMove={move}
        onTouchEnd={end}
      />
      <div style={{ marginTop: 8, display: "flex", justifyContent: "flex-end" }}>
        <button onClick={clear} style={{
          background: "transparent",
          border: "1px solid " + COLORS.border,
          padding: "8px 16px",
          fontFamily: FONT_BODY,
          fontSize: 13,
          color: COLORS.charcoal,
          cursor: "pointer",
          borderRadius: 4,
          minHeight: 40,
        }}>Clear</button>
      </div>
    </div>
  );
}

export default function InvoiceStudio() {
  // Safe synchronous default - never reads window during render
  const [width, setWidth] = useState(1200);
  const isMobile = width < 720;

  useEffect(function () {
    function update() {
      try { setWidth(window.innerWidth); } catch (e) {}
    }
    update();
    window.addEventListener("resize", update);
    return function () { window.removeEventListener("resize", update); };
  }, []);

  const [view, setView] = useState("editor");
  const [docType, setDocType] = useState("invoice");
  const [docNumber, setDocNumber] = useState("75");
  const [company, setCompany] = useState(DEFAULT_COMPANY);
  const [companyDraft, setCompanyDraft] = useState(DEFAULT_COMPANY);
  const [client, setClient] = useState({ name: "", email: "", phone: "", address: "" });
  const [docDate, setDocDate] = useState(todayISO());
  const [dueDate, setDueDate] = useState(addDaysISO(todayISO(), 3));
  const [validUntil, setValidUntil] = useState(addDaysISO(todayISO(), 14));
  const [items, setItems] = useState([newItem()]);
  const [notes, setNotes] = useState("");
  const [signature, setSignature] = useState("");
  const [sigMode, setSigMode] = useState("draw");

  // Load from localStorage on mount
  useEffect(function () {
    try {
      const stored = localStorage.getItem(STORAGE_COMPANY);
      if (stored) {
        try {
          const parsed = JSON.parse(stored);
          const merged = Object.assign({}, DEFAULT_COMPANY, parsed);
          setCompany(merged);
          setCompanyDraft(merged);
        } catch (e) {}
      }
      const num = localStorage.getItem(STORAGE_NUM);
      if (num) setDocNumber(String(num));
    } catch (e) {}
  }, []);

  useEffect(function () {
    setDueDate(addDaysISO(docDate, 3));
    setValidUntil(addDaysISO(docDate, 14));
  }, [docDate]);

  let subtotal = 0;
  for (let i = 0; i < items.length; i++) {
    const it = items[i];
    subtotal += (Number(it.qty) || 0) * (Number(it.unitPrice) || 0) - (Number(it.discount) || 0);
  }
  const total = subtotal;
  const accent = docType === "invoice" ? COLORS.gold : COLORS.forest;

  function updateItem(id, field, value) {
    setItems(function (prev) {
      return prev.map(function (it) {
        if (it.id !== id) return it;
        const out = Object.assign({}, it);
        out[field] = value;
        return out;
      });
    });
  }
  function addItem() { setItems(function (p) { return p.concat([newItem()]); }); }
  function removeItem(id) {
    setItems(function (p) {
      if (p.length <= 1) return p;
      return p.filter(function (i) { return i.id !== id; });
    });
  }

  function saveCompany() {
    setCompany(companyDraft);
    try {
      localStorage.setItem(STORAGE_COMPANY, JSON.stringify(companyDraft));
    } catch (e) {}
    setView("editor");
  }

  function handleExport() {
    const next = String((parseInt(docNumber, 10) || 0) + 1);
    try {
      localStorage.setItem(STORAGE_NUM, next);
    } catch (e) {}
    try { window.print(); } catch (e) {}
  }

  function handleFile(file) {
    if (!file) return;
    const reader = new FileReader();
    reader.onload = function () { setSignature(reader.result); };
    reader.readAsDataURL(file);
  }

  // Styles
  const inputStyle = {
    width: "100%",
    padding: isMobile ? "12px 14px" : "10px 12px",
    fontFamily: FONT_BODY,
    fontSize: 16,
    color: COLORS.charcoal,
    background: "#fff",
    border: "1px solid " + COLORS.border,
    borderRadius: 6,
    outline: "none",
    boxSizing: "border-box",
    minHeight: isMobile ? 44 : 38,
  };

  const cardStyle = {
    background: "#fff",
    borderRadius: 10,
    padding: isMobile ? 18 : 28,
    marginBottom: isMobile ? 14 : 20,
    boxShadow: "0 1px 3px rgba(0,0,0,0.04), 0 4px 12px rgba(0,0,0,0.04)",
    border: "1px solid " + COLORS.border,
  };

  const cardTitleStyle = {
    fontFamily: FONT_HEADING,
    fontSize: isMobile ? 18 : 20,
    fontWeight: 700,
    color: COLORS.charcoal,
    marginBottom: isMobile ? 14 : 18,
  };

  const labelStyle = {
    display: "block",
    fontFamily: FONT_BODY,
    fontSize: 11,
    fontWeight: 700,
    textTransform: "uppercase",
    letterSpacing: "1px",
    color: COLORS.muted,
    marginBottom: 6,
  };

  const headerBtnGhost = {
    background: "transparent",
    border: "1px solid #555",
    color: COLORS.cream,
    padding: isMobile ? "8px 12px" : "9px 16px",
    fontFamily: FONT_BODY,
    fontSize: isMobile ? 12 : 13,
    cursor: "pointer",
    borderRadius: 4,
    minHeight: isMobile ? 38 : 36,
    whiteSpace: "nowrap",
  };

  const headerBtnGold = {
    background: COLORS.gold,
    border: "none",
    color: COLORS.charcoal,
    padding: isMobile ? "8px 14px" : "9px 18px",
    fontFamily: FONT_BODY,
    fontSize: isMobile ? 12 : 13,
    fontWeight: 700,
    cursor: "pointer",
    borderRadius: 4,
    minHeight: isMobile ? 38 : 36,
    whiteSpace: "nowrap",
  };

  const containerStyle = {
    maxWidth: 980,
    margin: "0 auto",
    padding: isMobile ? "20px 14px 80px" : "32px 24px",
  };

  const grid2 = { display: "grid", gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr", gap: isMobile ? 0 : 16 };
  const grid3 = { display: "grid", gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr 1fr", gap: isMobile ? 0 : 16 };

  function renderField(label, child) {
    return (
      <div style={{ marginBottom: 14 }}>
        <label style={labelStyle}>{label}</label>
        {child}
      </div>
    );
  }

  function renderHeader(title, right) {
    return (
      <div className="ww-app-header" style={{
        background: COLORS.charcoal,
        color: COLORS.cream,
        padding: isMobile ? "14px 16px" : "18px 28px",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        borderBottom: "2px solid " + COLORS.gold,
        flexWrap: "wrap",
        gap: 10,
      }}>
        <div style={{ fontFamily: FONT_HEADING, fontSize: isMobile ? 17 : 21, fontWeight: 700 }}>{title}</div>
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>{right}</div>
      </div>
    );
  }

  // ============ SETTINGS VIEW ============
  if (view === "settings") {
    return (
      <div style={{ minHeight: "100vh", background: COLORS.cream, fontFamily: FONT_BODY, color: COLORS.charcoal }}>
        <PrintStyles />
        {renderHeader("Company Settings", (
          <button onClick={function () { setView("editor"); }} style={headerBtnGhost}>← Back</button>
        ))}
        <div style={containerStyle}>
          <div style={cardStyle}>
            <div style={cardTitleStyle}>Business Information</div>
            <div style={grid2}>
              {renderField("Company Name",
                <input style={inputStyle} value={companyDraft.name}
                  onChange={function (e) { setCompanyDraft(Object.assign({}, companyDraft, { name: e.target.value })); }} />
              )}
              {renderField("Tax Reg No.",
                <input style={inputStyle} value={companyDraft.taxReg}
                  onChange={function (e) { setCompanyDraft(Object.assign({}, companyDraft, { taxReg: e.target.value })); }} />
              )}
            </div>
            {renderField("Street Address",
              <input style={inputStyle} value={companyDraft.address}
                onChange={function (e) { setCompanyDraft(Object.assign({}, companyDraft, { address: e.target.value })); }} />
            )}
            <div style={grid3}>
              {renderField("City",
                <input style={inputStyle} value={companyDraft.city}
                  onChange={function (e) { setCompanyDraft(Object.assign({}, companyDraft, { city: e.target.value })); }} />
              )}
              {renderField("Province",
                <input style={inputStyle} value={companyDraft.province}
                  onChange={function (e) { setCompanyDraft(Object.assign({}, companyDraft, { province: e.target.value })); }} />
              )}
              {renderField("Postal Code",
                <input style={inputStyle} value={companyDraft.code}
                  onChange={function (e) { setCompanyDraft(Object.assign({}, companyDraft, { code: e.target.value })); }} />
              )}
            </div>
            <div style={grid3}>
              {renderField("Country",
                <input style={inputStyle} value={companyDraft.country}
                  onChange={function (e) { setCompanyDraft(Object.assign({}, companyDraft, { country: e.target.value })); }} />
              )}
              {renderField("Phone",
                <input style={inputStyle} type="tel" value={companyDraft.phone}
                  onChange={function (e) { setCompanyDraft(Object.assign({}, companyDraft, { phone: e.target.value })); }} />
              )}
              {renderField("Email",
                <input style={inputStyle} type="email" value={companyDraft.email}
                  onChange={function (e) { setCompanyDraft(Object.assign({}, companyDraft, { email: e.target.value })); }} />
              )}
            </div>
          </div>

          <div style={cardStyle}>
            <div style={cardTitleStyle}>Banking Details</div>
            <div style={grid3}>
              {renderField("Bank Name",
                <input style={inputStyle} value={companyDraft.bank}
                  onChange={function (e) { setCompanyDraft(Object.assign({}, companyDraft, { bank: e.target.value })); }} />
              )}
              {renderField("Beneficiary",
                <input style={inputStyle} value={companyDraft.beneficiary}
                  onChange={function (e) { setCompanyDraft(Object.assign({}, companyDraft, { beneficiary: e.target.value })); }} />
              )}
              {renderField("Account Number",
                <input style={inputStyle} value={companyDraft.account}
                  onChange={function (e) { setCompanyDraft(Object.assign({}, companyDraft, { account: e.target.value })); }} />
              )}
            </div>
          </div>

          <div style={{
            display: "flex",
            gap: 12,
            justifyContent: "flex-end",
            marginTop: 24,
            flexDirection: isMobile ? "column-reverse" : "row",
          }}>
            <button onClick={function () { setCompanyDraft(company); setView("editor"); }} style={{
              padding: isMobile ? "14px 24px" : "12px 24px",
              background: "transparent",
              border: "1px solid " + COLORS.charcoal,
              color: COLORS.charcoal,
              fontFamily: FONT_BODY,
              fontSize: 14,
              cursor: "pointer",
              borderRadius: 6,
              minHeight: isMobile ? 48 : 44,
            }}>Cancel</button>
            <button onClick={saveCompany} style={{
              padding: isMobile ? "14px 28px" : "12px 28px",
              background: COLORS.charcoal,
              border: "none",
              color: COLORS.cream,
              fontFamily: FONT_BODY,
              fontSize: 14,
              fontWeight: 600,
              cursor: "pointer",
              borderRadius: 6,
              minHeight: isMobile ? 48 : 44,
            }}>Save Settings</button>
          </div>
        </div>
      </div>
    );
  }

  // ============ PREVIEW VIEW ============
  if (view === "preview") {
    const availableWidth = Math.max(280, width - 24);
    const previewScale = availableWidth < 794 ? availableWidth / 794 : 1;
    const isInvoice = docType === "invoice";

    return (
      <div style={{ minHeight: "100vh", background: "#2a2a2a", fontFamily: FONT_BODY }}>
        <PrintStyles />
        <div className="ww-toolbar" style={{
          background: COLORS.charcoal,
          borderBottom: "1px solid #333",
          padding: isMobile ? "10px 14px" : "14px 24px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: 10,
          flexWrap: "wrap",
        }}>
          <button onClick={function () { setView("editor"); }} style={{
            background: "transparent",
            border: "1px solid #555",
            color: COLORS.cream,
            padding: isMobile ? "8px 12px" : "8px 16px",
            fontFamily: FONT_BODY,
            fontSize: 13,
            cursor: "pointer",
            borderRadius: 4,
            minHeight: isMobile ? 38 : 36,
          }}>← Edit</button>
          {!isMobile ? (
            <div style={{ color: "#bdb38f", fontFamily: FONT_BODY, fontSize: 12, fontStyle: "italic" }}>
              Choose 'Save as PDF' in the print dialog
            </div>
          ) : null}
          <button onClick={handleExport} style={{
            background: COLORS.gold,
            border: "none",
            color: COLORS.charcoal,
            padding: isMobile ? "8px 14px" : "10px 22px",
            fontFamily: FONT_BODY,
            fontSize: 13,
            fontWeight: 700,
            cursor: "pointer",
            borderRadius: 4,
            letterSpacing: "0.5px",
            textTransform: "uppercase",
            minHeight: isMobile ? 38 : 36,
          }}>Export PDF</button>
        </div>

        {isMobile ? (
          <div style={{
            background: "#3a3a3a",
            color: "#bdb38f",
            fontSize: 11,
            fontStyle: "italic",
            padding: "8px 14px",
            textAlign: "center",
          }}>Tap Export PDF, then choose "Save as PDF"</div>
        ) : null}

        <div className="ww-preview-stage" style={{
          padding: isMobile ? "20px 12px" : "40px 20px",
          display: "flex",
          justifyContent: "center",
          width: "100%",
          boxSizing: "border-box",
          overflow: "hidden",
        }}>
          <div className="ww-scale-wrap" style={{
            width: 794 * previewScale,
            height: 1123 * previewScale,
            position: "relative",
          }}>
            <div className="ww-scale-inner" style={{
              transform: previewScale < 1 ? "scale(" + previewScale + ")" : "none",
              transformOrigin: "top left",
              width: 794,
              position: "absolute",
              top: 0,
              left: 0,
            }}>
              <A4Doc
                docType={docType}
                docNumber={docNumber}
                company={company}
                client={client}
                docDate={docDate}
                dueDate={dueDate}
                validUntil={validUntil}
                items={items}
                subtotal={subtotal}
                total={total}
                notes={notes}
                signature={signature}
                accent={accent}
                isInvoice={isInvoice}
              />
            </div>
          </div>
        </div>
      </div>
    );
  }

  // ============ EDITOR VIEW ============
  return (
    <div style={{ minHeight: "100vh", background: COLORS.cream, fontFamily: FONT_BODY, color: COLORS.charcoal }}>
      <PrintStyles />
      {renderHeader(
        isMobile ? "Invoice Studio" : "Invoice & Quote Studio",
        <React.Fragment>
          <button onClick={function () { setCompanyDraft(company); setView("settings"); }} style={headerBtnGhost}>
            {isMobile ? "⚙" : "⚙ Settings"}
          </button>
          <button onClick={function () { setView("preview"); }} style={headerBtnGold}>
            {isMobile ? "Preview →" : "Preview & Export →"}
          </button>
        </React.Fragment>
      )}

      <div style={containerStyle}>
        {/* Document type */}
        <div style={cardStyle}>
          <div style={cardTitleStyle}>Document</div>
          <div style={{
            display: "flex",
            alignItems: isMobile ? "stretch" : "center",
            gap: isMobile ? 14 : 24,
            flexDirection: isMobile ? "column" : "row",
          }}>
            <div style={{
              display: "inline-flex",
              background: COLORS.cream,
              borderRadius: 999,
              padding: 4,
              border: "1px solid " + COLORS.border,
              alignSelf: isMobile ? "stretch" : "auto",
            }}>
              <button onClick={function () { setDocType("invoice"); }} style={{
                padding: isMobile ? "12px 0" : "10px 24px",
                flex: isMobile ? 1 : "0 0 auto",
                border: "none",
                borderRadius: 999,
                fontFamily: FONT_BODY,
                fontWeight: 600,
                fontSize: 13,
                cursor: "pointer",
                background: docType === "invoice" ? COLORS.gold : "transparent",
                color: docType === "invoice" ? "#fff" : COLORS.charcoal,
                minHeight: isMobile ? 44 : 36,
              }}>INVOICE</button>
              <button onClick={function () { setDocType("quote"); }} style={{
                padding: isMobile ? "12px 0" : "10px 24px",
                flex: isMobile ? 1 : "0 0 auto",
                border: "none",
                borderRadius: 999,
                fontFamily: FONT_BODY,
                fontWeight: 600,
                fontSize: 13,
                cursor: "pointer",
                background: docType === "quote" ? COLORS.forest : "transparent",
                color: docType === "quote" ? "#fff" : COLORS.charcoal,
                minHeight: isMobile ? 44 : 36,
              }}>QUOTE</button>
            </div>
            <div style={{ flex: 1, width: "100%" }}>
              {renderField(docType === "invoice" ? "Invoice Number" : "Quote Number",
                <input style={inputStyle} value={docNumber} onChange={function (e) { setDocNumber(e.target.value); }} />
              )}
            </div>
          </div>
        </div>

        {/* Client */}
        <div style={cardStyle}>
          <div style={cardTitleStyle}>{docType === "invoice" ? "Bill To" : "Prepared For"}</div>
          <div style={grid2}>
            {renderField("Client Name",
              <input style={inputStyle} value={client.name}
                onChange={function (e) { setClient(Object.assign({}, client, { name: e.target.value })); }}
                placeholder="John Doe" />
            )}
            {renderField("Email",
              <input style={inputStyle} type="email" value={client.email}
                onChange={function (e) { setClient(Object.assign({}, client, { email: e.target.value })); }}
                placeholder="client@example.com" />
            )}
          </div>
          <div style={grid2}>
            {renderField("Phone",
              <input style={inputStyle} type="tel" value={client.phone}
                onChange={function (e) { setClient(Object.assign({}, client, { phone: e.target.value })); }}
                placeholder="+27..." />
            )}
            {renderField("Address (optional)",
              <input style={inputStyle} value={client.address}
                onChange={function (e) { setClient(Object.assign({}, client, { address: e.target.value })); }}
                placeholder="North West 2999, ZA" />
            )}
          </div>
        </div>

        {/* Dates */}
        <div style={cardStyle}>
          <div style={cardTitleStyle}>Dates</div>
          <div style={grid2}>
            {renderField("Document Date",
              <input type="date" style={inputStyle} value={docDate} onChange={function (e) { setDocDate(e.target.value); }} />
            )}
            {docType === "invoice" ?
              renderField("Due Date",
                <input type="date" style={inputStyle} value={dueDate} onChange={function (e) { setDueDate(e.target.value); }} />
              ) :
              renderField("Valid Until",
                <input type="date" style={inputStyle} value={validUntil} onChange={function (e) { setValidUntil(e.target.value); }} />
              )
            }
          </div>
        </div>

        {/* Line Items */}
        <div style={cardStyle}>
          <div style={cardTitleStyle}>Line Items</div>

          {isMobile ? (
            <div>
              {items.map(function (it, idx) {
                const lineAmt = (Number(it.qty) || 0) * (Number(it.unitPrice) || 0) - (Number(it.discount) || 0);
                return (
                  <div key={it.id} style={{
                    background: "#fafaf6",
                    border: "1px solid " + COLORS.border,
                    borderRadius: 10,
                    padding: 16,
                    marginBottom: 12,
                  }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
                      <div style={{
                        fontSize: 11,
                        fontWeight: 700,
                        letterSpacing: "1px",
                        color: COLORS.muted,
                        textTransform: "uppercase",
                      }}>Item {idx + 1}</div>
                      {items.length > 1 ? (
                        <button onClick={function () { removeItem(it.id); }} style={{
                          background: "transparent",
                          border: "1px solid " + COLORS.border,
                          color: COLORS.muted,
                          cursor: "pointer",
                          fontSize: 13,
                          padding: "6px 14px",
                          borderRadius: 6,
                          minHeight: 32,
                        }}>Remove</button>
                      ) : null}
                    </div>

                    {renderField("Description",
                      <input style={inputStyle} placeholder="e.g. Growth video production"
                        value={it.description}
                        onChange={function (e) { updateItem(it.id, "description", e.target.value); }} />
                    )}

                    {renderField("Inclusions (optional, one per line)",
                      <textarea
                        placeholder={"- 3 Hour video shoot\n- Content idea planning"}
                        value={it.subDescription}
                        onChange={function (e) { updateItem(it.id, "subDescription", e.target.value); }}
                        style={Object.assign({}, inputStyle, {
                          resize: "vertical",
                          minHeight: 80,
                          fontSize: 14,
                          color: COLORS.muted,
                          fontStyle: "italic",
                        })}
                      />
                    )}

                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 10 }}>
                      {renderField("Qty",
                        <input style={Object.assign({}, inputStyle, { textAlign: "center" })} type="number" inputMode="numeric" min="0"
                          value={it.qty}
                          onChange={function (e) { updateItem(it.id, "qty", e.target.value); }} />
                      )}
                      {renderField("Unit (R)",
                        <input style={Object.assign({}, inputStyle, { textAlign: "right" })} type="number" inputMode="decimal" min="0" step="0.01"
                          value={it.unitPrice}
                          onChange={function (e) { updateItem(it.id, "unitPrice", e.target.value); }} />
                      )}
                      {renderField("Disc. (R)",
                        <input style={Object.assign({}, inputStyle, { textAlign: "right" })} type="number" inputMode="decimal" min="0" step="0.01"
                          value={it.discount}
                          onChange={function (e) { updateItem(it.id, "discount", e.target.value); }} />
                      )}
                    </div>

                    <div style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      paddingTop: 10,
                      borderTop: "1px dashed " + COLORS.border,
                      marginTop: 4,
                    }}>
                      <span style={{ fontSize: 12, color: COLORS.muted, fontWeight: 600 }}>LINE TOTAL</span>
                      <span style={{ fontSize: 17, fontWeight: 700, color: accent }}>{formatMoney(lineAmt)}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div style={{ overflowX: "auto" }}>
              <div style={{
                display: "grid",
                gridTemplateColumns: "1fr 70px 110px 110px 110px 32px",
                gap: 10,
                padding: "0 4px 8px",
                fontSize: 11,
                fontWeight: 700,
                textTransform: "uppercase",
                letterSpacing: "1px",
                color: COLORS.muted,
              }}>
                <div>Description</div>
                <div style={{ textAlign: "center" }}>Qty</div>
                <div style={{ textAlign: "right" }}>Unit (R)</div>
                <div style={{ textAlign: "right" }}>Discount</div>
                <div style={{ textAlign: "right" }}>Amount</div>
                <div></div>
              </div>
              {items.map(function (it, idx) {
                const lineAmt = (Number(it.qty) || 0) * (Number(it.unitPrice) || 0) - (Number(it.discount) || 0);
                return (
                  <div key={it.id} style={{
                    padding: "12px 4px",
                    borderTop: idx === 0 ? "1px solid " + COLORS.border : "none",
                    borderBottom: "1px solid " + COLORS.border,
                  }}>
                    <div style={{
                      display: "grid",
                      gridTemplateColumns: "1fr 70px 110px 110px 110px 32px",
                      gap: 10,
                      alignItems: "center",
                    }}>
                      <input style={inputStyle} placeholder="e.g. Growth video production"
                        value={it.description}
                        onChange={function (e) { updateItem(it.id, "description", e.target.value); }} />
                      <input style={Object.assign({}, inputStyle, { textAlign: "center" })} type="number" min="0"
                        value={it.qty} onChange={function (e) { updateItem(it.id, "qty", e.target.value); }} />
                      <input style={Object.assign({}, inputStyle, { textAlign: "right" })} type="number" min="0" step="0.01"
                        value={it.unitPrice} onChange={function (e) { updateItem(it.id, "unitPrice", e.target.value); }} />
                      <input style={Object.assign({}, inputStyle, { textAlign: "right" })} type="number" min="0" step="0.01"
                        value={it.discount} onChange={function (e) { updateItem(it.id, "discount", e.target.value); }} />
                      <div style={{
                        textAlign: "right",
                        fontWeight: 600,
                        fontSize: 14,
                        color: COLORS.charcoal,
                      }}>{formatMoney(lineAmt)}</div>
                      <button onClick={function () { removeItem(it.id); }} style={{
                        background: "transparent",
                        border: "none",
                        color: COLORS.muted,
                        cursor: "pointer",
                        fontSize: 18,
                        padding: 0,
                      }}>×</button>
                    </div>
                    <div style={{ marginTop: 8 }}>
                      <textarea
                        placeholder="Optional inclusions (one per line)"
                        value={it.subDescription}
                        onChange={function (e) { updateItem(it.id, "subDescription", e.target.value); }}
                        style={Object.assign({}, inputStyle, {
                          resize: "vertical",
                          minHeight: 60,
                          fontSize: 13,
                          color: COLORS.muted,
                          fontStyle: "italic",
                        })}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          <div style={{
            marginTop: 16,
            display: "flex",
            justifyContent: "space-between",
            alignItems: isMobile ? "stretch" : "flex-start",
            flexDirection: isMobile ? "column" : "row",
            gap: 16,
          }}>
            <button onClick={addItem} style={{
              background: "transparent",
              border: "1.5px dashed " + COLORS.gold,
              color: COLORS.charcoal,
              padding: isMobile ? "14px 18px" : "10px 18px",
              fontFamily: FONT_BODY,
              fontSize: 13,
              fontWeight: 600,
              cursor: "pointer",
              borderRadius: 6,
              minHeight: isMobile ? 48 : 40,
            }}>+ Add Line Item</button>

            <div style={{
              minWidth: isMobile ? "auto" : 260,
              width: isMobile ? "100%" : "auto",
              background: COLORS.cream,
              padding: 18,
              borderRadius: 8,
            }}>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
                <span style={{ color: COLORS.muted, fontSize: 13 }}>Subtotal</span>
                <span style={{ fontWeight: 600 }}>{formatMoney(subtotal)}</span>
              </div>
              <div style={{
                display: "flex",
                justifyContent: "space-between",
                paddingTop: 10,
                borderTop: "1px solid " + COLORS.border,
              }}>
                <span style={{ fontWeight: 700, fontSize: 15 }}>Total</span>
                <span style={{ fontWeight: 700, fontSize: 18, color: accent }}>{formatMoney(total)}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Notes */}
        <div style={cardStyle}>
          <div style={cardTitleStyle}>{docType === "invoice" ? "Notes" : "Terms & Conditions"}</div>
          <textarea
            value={notes}
            onChange={function (e) { setNotes(e.target.value); }}
            placeholder={docType === "invoice" ? "Optional notes for the client..." : "Terms, conditions, scope of work..."}
            style={Object.assign({}, inputStyle, { minHeight: 110, resize: "vertical", fontSize: 14 })}
          />
        </div>

        {/* Signature */}
        <div style={cardStyle}>
          <div style={cardTitleStyle}>Authorised Signature</div>
          <div style={{ display: "flex", gap: 8, marginBottom: 14 }}>
            <button onClick={function () { setSigMode("draw"); }} style={{
              padding: isMobile ? "10px 18px" : "8px 18px",
              flex: isMobile ? 1 : "0 0 auto",
              background: sigMode === "draw" ? COLORS.charcoal : "transparent",
              color: sigMode === "draw" ? COLORS.cream : COLORS.charcoal,
              border: "1px solid " + COLORS.charcoal,
              borderRadius: 6,
              fontFamily: FONT_BODY,
              fontSize: 13,
              cursor: "pointer",
              minHeight: isMobile ? 44 : 38,
            }}>Draw</button>
            <button onClick={function () { setSigMode("upload"); }} style={{
              padding: isMobile ? "10px 18px" : "8px 18px",
              flex: isMobile ? 1 : "0 0 auto",
              background: sigMode === "upload" ? COLORS.charcoal : "transparent",
              color: sigMode === "upload" ? COLORS.cream : COLORS.charcoal,
              border: "1px solid " + COLORS.charcoal,
              borderRadius: 6,
              fontFamily: FONT_BODY,
              fontSize: 13,
              cursor: "pointer",
              minHeight: isMobile ? 44 : 38,
            }}>Upload</button>
          </div>

          {sigMode === "draw" ? (
            <SignaturePad onChange={setSignature} />
          ) : (
            <div>
              {signature ? (
                <div style={{
                  border: "1px solid " + COLORS.border,
                  borderRadius: 6,
                  padding: 12,
                  background: "#fff",
                  textAlign: "center",
                }}>
                  <img src={signature} alt="signature" style={{ maxWidth: "100%", maxHeight: 120 }} />
                  <div style={{ marginTop: 10, display: "flex", gap: 8, justifyContent: "center", flexWrap: "wrap" }}>
                    <label style={{
                      padding: "10px 16px",
                      background: COLORS.charcoal,
                      color: COLORS.cream,
                      borderRadius: 4,
                      fontSize: 13,
                      cursor: "pointer",
                      display: "inline-flex",
                      alignItems: "center",
                    }}>
                      Replace
                      <input type="file" accept="image/*" style={{ display: "none" }}
                        onChange={function (e) { handleFile(e.target.files && e.target.files[0]); }} />
                    </label>
                    <button onClick={function () { setSignature(""); }} style={{
                      padding: "10px 16px",
                      background: "transparent",
                      border: "1px solid " + COLORS.border,
                      borderRadius: 4,
                      fontSize: 13,
                      cursor: "pointer",
                    }}>Remove</button>
                  </div>
                </div>
              ) : (
                <label style={{
                  display: "block",
                  border: "1.5px dashed " + COLORS.border,
                  borderRadius: 6,
                  padding: isMobile ? 36 : 28,
                  textAlign: "center",
                  cursor: "pointer",
                  color: COLORS.muted,
                  background: "#fafaf6",
                }}>
                  Tap to upload signature image
                  <input type="file" accept="image/*" style={{ display: "none" }}
                    onChange={function (e) { handleFile(e.target.files && e.target.files[0]); }} />
                </label>
              )}
            </div>
          )}
        </div>

        <div style={{
          display: "flex",
          justifyContent: isMobile ? "stretch" : "flex-end",
          marginTop: 8,
          marginBottom: 60,
        }}>
          <button onClick={function () { setView("preview"); }} style={Object.assign({}, headerBtnGold, {
            padding: isMobile ? "16px 32px" : "14px 32px",
            fontSize: 14,
            width: isMobile ? "100%" : "auto",
            minHeight: isMobile ? 52 : 44,
          })}>Preview & Export →</button>
        </div>
      </div>
    </div>
  );
}

function A4Doc(props) {
  const { docType, docNumber, company, client, docDate, dueDate, validUntil,
    items, subtotal, total, notes, signature, accent, isInvoice } = props;
  const title = isInvoice ? "INVOICE" : "QUOTE";

  function infoRow(label, value) {
    return (
      <div style={{ marginBottom: 10, display: "flex", justifyContent: "space-between", gap: 30, alignItems: "baseline" }}>
        <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: "1.2px", color: COLORS.softGrey }}>{label}</div>
        <div style={{ fontSize: 13, color: COLORS.charcoal, fontWeight: 600 }}>{value}</div>
      </div>
    );
  }

  return (
    <div className="ww-a4" style={{
      width: 794,
      minHeight: 1123,
      background: "#fff",
      color: COLORS.charcoal,
      fontFamily: FONT_BODY,
      padding: "56px 56px 48px",
      boxSizing: "border-box",
      boxShadow: "0 8px 40px rgba(0,0,0,0.4)",
      display: "flex",
      flexDirection: "column",
    }}>
      <div style={{ height: 3, background: accent, width: "100%", marginBottom: 30 }} />

      <div style={{
        fontFamily: FONT_DISPLAY,
        fontWeight: 900,
        fontSize: 38,
        letterSpacing: "-0.5px",
        color: COLORS.charcoal,
        marginBottom: 22,
      }}>{title}</div>

      <div style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "flex-start",
        marginBottom: 36,
        gap: 20,
      }}>
        <div style={{ flex: 1 }}>
          <div style={{ fontWeight: 700, fontSize: 18, marginBottom: 8, color: COLORS.charcoal }}>{company.name}</div>
          <div style={{ fontSize: 12, color: COLORS.softGrey, lineHeight: 1.7 }}>
            <div>{company.address}</div>
            <div>{company.city} {company.province} {company.code}</div>
            <div>{company.country}</div>
            <div>{company.phone}</div>
            <div>Tax Reg No. : {company.taxReg}</div>
          </div>
        </div>
        <div><WLogo /></div>
      </div>

      <div style={{
        background: COLORS.cream,
        borderRadius: 6,
        padding: "22px 26px",
        display: "flex",
        justifyContent: "space-between",
        gap: 30,
        marginBottom: 38,
      }}>
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: "1.4px", color: accent, marginBottom: 10 }}>
            {isInvoice ? "BILL TO" : "PREPARED FOR"}
          </div>
          <div style={{ fontWeight: 700, fontSize: 18, color: COLORS.charcoal, marginBottom: 8 }}>{client.name || "—"}</div>
          <div style={{ fontSize: 12, color: COLORS.charcoal, lineHeight: 1.7 }}>
            {client.address ? <div>{client.address}</div> : null}
            {client.email ? <div>{client.email}</div> : null}
            {client.phone ? <div>{client.phone}</div> : null}
          </div>
        </div>
        <div style={{ textAlign: "right", minWidth: 240 }}>
          {infoRow(isInvoice ? "INVOICE NUMBER" : "QUOTE NUMBER", docNumber)}
          {infoRow("ISSUED", formatDate(docDate))}
          {infoRow(isInvoice ? "DUE" : "VALID UNTIL", formatDate(isInvoice ? dueDate : validUntil))}
        </div>
      </div>

      <div style={{ marginBottom: 14 }}>
        <div style={{
          display: "grid",
          gridTemplateColumns: "1fr 130px 110px 130px",
          background: accent,
          color: "#fff",
          padding: "12px 18px",
          fontSize: 11,
          fontWeight: 700,
          letterSpacing: "1.2px",
          borderRadius: 4,
        }}>
          <div>ITEM</div>
          <div style={{ textAlign: "right" }}>PRICE</div>
          <div style={{ textAlign: "center" }}>QUANTITY</div>
          <div style={{ textAlign: "right" }}>AMOUNT</div>
        </div>

        {items.map(function (it) {
          const lineAmt = (Number(it.qty) || 0) * (Number(it.unitPrice) || 0) - (Number(it.discount) || 0);
          const subLines = (it.subDescription || "")
            .split("\n")
            .map(function (l) { return l.trim(); })
            .filter(function (l) { return l.length > 0; });
          return (
            <div key={it.id} style={{
              display: "grid",
              gridTemplateColumns: "1fr 130px 110px 130px",
              padding: "18px 18px 22px",
              borderBottom: "1px solid " + COLORS.border,
              fontSize: 13,
              alignItems: "start",
            }}>
              <div>
                <div style={{ fontWeight: 700, color: COLORS.charcoal, marginBottom: subLines.length ? 12 : 0 }}>
                  {it.description || "—"}
                </div>
                {subLines.length > 0 ? (
                  <div style={{ color: COLORS.softGrey, fontSize: 12, lineHeight: 1.9 }}>
                    {subLines.map(function (line, i) { return <div key={i}>{line}</div>; })}
                  </div>
                ) : null}
              </div>
              <div style={{ textAlign: "right", color: COLORS.charcoal }}>{formatMoney(it.unitPrice)}</div>
              <div style={{ textAlign: "center", color: COLORS.charcoal }}>{it.qty}</div>
              <div style={{ textAlign: "right", color: COLORS.charcoal, fontWeight: 600 }}>{formatMoney(lineAmt)}</div>
            </div>
          );
        })}
      </div>

      <div style={{ display: "flex", justifyContent: "flex-end", marginTop: 18, marginBottom: 30 }}>
        <div style={{ minWidth: 320 }}>
          <div style={{ display: "flex", justifyContent: "space-between", padding: "10px 18px", fontSize: 13, color: COLORS.softGrey }}>
            <span>Subtotal</span>
            <span style={{ color: COLORS.charcoal }}>{formatMoney(subtotal)}</span>
          </div>
          <div style={{
            display: "flex",
            justifyContent: "space-between",
            padding: "10px 18px",
            fontSize: 13,
            color: COLORS.softGrey,
            borderBottom: "1px solid " + COLORS.border,
          }}>
            <span>Total</span>
            <span style={{ color: COLORS.charcoal }}>{formatMoney(total)}</span>
          </div>
          <div style={{ display: "flex", justifyContent: "space-between", padding: "20px 18px 6px", alignItems: "baseline" }}>
            <span style={{ fontSize: 16, fontWeight: 700, color: COLORS.charcoal }}>Amount due</span>
            <span style={{ fontSize: 22, fontWeight: 700, color: COLORS.charcoal }}>{formatMoney(total)}</span>
          </div>
        </div>
      </div>

      <div style={{ marginTop: "auto", paddingTop: 30 }}>
        {isInvoice ? (
          <div style={{ marginBottom: 36 }}>
            <div style={{ fontSize: 13, fontWeight: 700, color: COLORS.charcoal, marginBottom: 12 }}>Payment instruction</div>
            <div style={{ fontSize: 12, color: COLORS.charcoal, lineHeight: 1.9 }}>
              <div>Payment To</div>
              <div>Beneficiary: {company.beneficiary}</div>
              <div>Account num: {company.account}</div>
              <div>Bank: {company.bank}</div>
            </div>
            {notes ? (
              <div style={{
                marginTop: 18,
                fontSize: 12,
                color: COLORS.softGrey,
                fontStyle: "italic",
                maxWidth: 480,
                lineHeight: 1.7,
                whiteSpace: "pre-wrap",
              }}>{notes}</div>
            ) : null}
          </div>
        ) : (
          <div style={{ marginBottom: 36 }}>
            <div style={{ fontSize: 13, fontWeight: 700, color: COLORS.charcoal, marginBottom: 12 }}>Terms & Conditions</div>
            {notes ? (
              <div style={{
                fontSize: 12,
                color: COLORS.charcoal,
                lineHeight: 1.8,
                maxWidth: 540,
                marginBottom: 14,
                whiteSpace: "pre-wrap",
              }}>{notes}</div>
            ) : null}
            <div style={{ fontSize: 12, color: accent, fontWeight: 600, fontStyle: "italic", marginTop: 8 }}>
              This quote is valid until {formatDate(validUntil)}. Acceptance constitutes agreement to proceed.
            </div>
          </div>
        )}

        <div style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: 50,
          paddingTop: 28,
          borderTop: "1px solid " + COLORS.border,
        }}>
          <div>
            <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: "1.2px", color: COLORS.softGrey, marginBottom: 12 }}>
              AUTHORISED SIGNATORY
            </div>
            <div style={{
              height: 56,
              borderBottom: "1px solid " + COLORS.charcoal,
              display: "flex",
              alignItems: "flex-end",
              paddingBottom: 4,
            }}>
              {signature ? <img src={signature} alt="signature" style={{ maxHeight: 52, maxWidth: "80%" }} /> : null}
            </div>
            <div style={{ fontSize: 12, marginTop: 8, fontWeight: 600 }}>{company.name}</div>
            <div style={{ fontSize: 11, color: COLORS.softGrey }}>{formatDate(docDate)}</div>
          </div>
          <div>
            <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: "1.2px", color: COLORS.softGrey, marginBottom: 12 }}>
              CLIENT ACCEPTANCE
            </div>
            <div style={{ height: 56, borderBottom: "1px solid " + COLORS.charcoal }}></div>
            <div style={{ fontSize: 12, marginTop: 8, fontWeight: 600 }}>{client.name || "Client"}</div>
            <div style={{ fontSize: 11, color: COLORS.softGrey }}>( / / )</div>
          </div>
        </div>
      </div>
    </div>
  );
}

function PrintStyles() {
  const css = "* { box-sizing: border-box; -webkit-tap-highlight-color: transparent; }"
    + " html, body { margin: 0; padding: 0; }"
    + " input, textarea { font-family: inherit; }"
    + " input:focus, textarea:focus { border-color: " + COLORS.gold + " !important; }"
    + " button { font-family: inherit; -webkit-appearance: none; appearance: none; }"
    + " button:active { opacity: 0.85; }"
    + " @page { size: A4; margin: 0; }"
    + " @media print {"
    + "   html, body { margin: 0 !important; padding: 0 !important; background: #fff !important; -webkit-print-color-adjust: exact !important; print-color-adjust: exact !important; }"
    + "   .ww-toolbar, .ww-app-header { display: none !important; }"
    + "   .ww-preview-stage { padding: 0 !important; background: #fff !important; overflow: visible !important; }"
    + "   .ww-scale-wrap { width: auto !important; height: auto !important; }"
    + "   .ww-scale-inner { transform: none !important; position: static !important; width: auto !important; }"
    + "   .ww-a4 { box-shadow: none !important; margin: 0 !important; width: 210mm !important; min-height: 297mm !important; padding: 18mm 16mm !important; }"
    + " }";
  return <style dangerouslySetInnerHTML={{ __html: css }} />;
}
