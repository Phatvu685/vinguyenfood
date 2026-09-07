export default function BrandLogo({ compact = false }: { compact?: boolean }) {
  return (
    <span className={`brand-logo${compact ? " is-compact" : ""}`}>
      <img className="brand-logo-image" src="/images/logo.png" alt="" />
      <span className="brand-logo-copy">
        <strong>VỊ NGUYÊN FOOD</strong>
        <small>Từ giọt phù sa đến bàn ăn người Việt</small>
      </span>
    </span>
  );
}
