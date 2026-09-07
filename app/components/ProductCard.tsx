// app/components/ProductCard.tsx
import Image from 'next/image';
import { useState } from 'react';
import { getPricePerKg, type Product } from '../san-pham/data';

interface Props {
  product: Product;
  wished?: boolean;
  onWish?: () => void;
  onQuickAdd?: () => void;
  onDetails?: () => void;
  onAddToCart?: (product: Product, quantity: number) => void;
}

export default function ProductCard({
  product,
  wished = false,
  onWish,
  onQuickAdd,
  onDetails,
  onAddToCart,
}: Props) {
  const [quantity, setQuantity] = useState(1);

  const handleAdd = () => {
    if (onAddToCart) {
      onAddToCart(product, quantity);
    } else {
      if (typeof window !== 'undefined') {
        const stored = window.localStorage.getItem('gao-ngon-cart');
        const items = stored ? JSON.parse(stored) : [];
        const itemWeight = product.weight || '5kg';
        const existing = items.find((item: any) => item.product.id === product.id && item.weight === itemWeight);
        let nextCart;
        if (existing) {
          nextCart = items.map((item: any) => item === existing ? { ...item, quantity: item.quantity + quantity } : item);
        } else {
          nextCart = [...items, { product, quantity, weight: itemWeight }];
        }
        window.localStorage.setItem('gao-ngon-cart', JSON.stringify(nextCart));
        window.dispatchEvent(new Event('gao-ngon-cart-updated'));
        alert(`Đã thêm ${quantity} sản phẩm vào giỏ hàng!`);
      }
    }
  };

  const increase = () => setQuantity((q) => q + 1);
  const decrease = () => setQuantity((q) => (q > 1 ? q - 1 : 1));

  const originStr = product.origin || 'Điện Biên';
  const features = [
    { icon: '🌿', label: 'Hạt dẻo thơm tự nhiên' },
    { icon: '♥', label: 'Giàu dinh dưỡng tốt sức khỏe' },
    { icon: '🏔', label: `Canh tác tại ${originStr}` },
    { icon: '🛡', label: 'An toàn không bảo quản' }
  ];

  return (
    <article className="catalog-card">
      {/* Badge */}
      {product.badge && <span className="catalog-badge">{product.badge}</span>}

      {/* Wishlist Button */}
      {onWish && (
        <button
          className={`wishlist-button ${wished ? 'is-wished' : ''}`}
          onClick={onWish}
          aria-label={wished ? 'Bỏ yêu thích' : 'Thêm vào yêu thích'}
        >
          {wished ? '♥' : '♡'}
        </button>
      )}

      {/* Product Image Wrapper */}
      <button
        type="button"
        className="catalog-image"
        onClick={onDetails}
        aria-label={`Xem ${product.name}`}
      >
        <Image
          src={product.image}
          alt={product.name}
          fill
          sizes="(max-width: 768px) 100vw, 25vw"
          style={{ objectFit: 'contain' }}
        />
        <span className="view-details">Xem chi tiết <b>→</b></span>
      </button>

      {/* Product Info Section */}
      <div className="catalog-info" style={{ display: 'flex', flexDirection: 'column' }}>
        <span className="catalog-category">
          {product.category}{product.weight ? ` · ${product.weight}` : ''}
        </span>
        
        {/* Title and Badge row */}
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '6px', marginTop: '6px' }}>
          <h3 
            onClick={onDetails} 
            className="cursor-pointer hover:text-[#efd889] transition-colors"
            style={{ fontFamily: "'Cormorant Garamond', serif", flex: 1, margin: 0 }}
          >
            {product.name}
          </h3>
          <span style={{ border: '1px solid rgba(216, 180, 90, 0.4)', borderRadius: '4px', padding: '2px 6px', fontSize: '11px', color: '#efd889', backgroundColor: 'rgba(24, 53, 35, 0.5)', display: 'flex', alignItems: 'center', gap: '2px', whiteSpace: 'nowrap', marginTop: '4px' }}>
            🌿 Đặc sản
          </span>
        </div>
        
        {product.note && (
          <p style={{ minHeight: '32px', margin: '8px 0 0', fontSize: '13px', color: 'rgba(255, 255, 255, 0.65)', lineHeight: '1.4' }}>
            {product.note}
          </p>
        )}


        {/* Rating and view reviews row */}
        {product.rating !== undefined && (
          <div className="catalog-review" style={{ display: 'flex', alignItems: 'center', gap: '6px', marginTop: '12px', fontSize: '12.5px', color: 'rgba(255, 255, 255, 0.5)' }}>
            <span className="catalog-stars" aria-label={`${product.rating} trên 5 sao`}>
              ★★★★★ <small style={{ color: 'rgba(255, 255, 255, 0.65)', fontSize: '11px' }}>{product.rating.toFixed(1)}</small>
            </span>
            {product.reviews !== undefined && <span>({product.reviews})</span>}
            <span style={{ color: 'rgba(255, 255, 255, 0.2)', margin: '0 2px' }}>|</span>
            <button 
              type="button" 
              style={{ border: 'none', background: 'transparent', padding: 0, color: 'rgba(255, 255, 255, 0.6)', cursor: 'pointer', textDecoration: 'underline', fontSize: '11.5px', display: 'flex', alignItems: 'center', gap: '2px' }}
              className="hover:text-[#efd889] transition-colors"
            >
              <span>💬</span> <span>Xem đánh giá</span>
            </button>
          </div>
        )}

        {/* Price and Action Section - named to catalog-buy-section to avoid targeting by stylesheet's .catalog-price button selector */}
        <div className="catalog-buy-section" style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginTop: '14px', paddingTop: '14px', borderTop: '1px solid rgba(239, 216, 137, 0.1)' }}>
          <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', width: '100%' }}>
            <strong style={{ fontSize: '24px', fontWeight: 'bold', color: '#efd889', fontFamily: "'Cormorant Garamond', serif" }}>
              {getPricePerKg(product).toLocaleString('vi-VN')}₫
            </strong>
            <span style={{ fontSize: '13px', color: 'rgba(255, 255, 255, 0.6)', marginLeft: '4px' }}>/ kg</span>
          </div>
          
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '8px', width: '100%' }}>
            {/* Quantity Selector */}
            <div style={{ display: 'flex', alignItems: 'center', border: '1px solid rgba(216, 180, 90, 0.5)', borderRadius: '9999px', padding: '4px 10px', backgroundColor: 'rgba(24, 53, 35, 0.3)' }}>
              <button 
                type="button" 
                onClick={decrease} 
                style={{ border: 'none', background: 'transparent', color: '#efd889', cursor: 'pointer', fontWeight: 'bold', fontSize: '15px', width: '18px', height: '18px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
              >
                −
              </button>
              <span style={{ margin: '0 8px', width: '14px', textAlign: 'center', color: '#fff', fontSize: '13px', fontWeight: 'bold' }}>{quantity}</span>
              <button 
                type="button" 
                onClick={increase} 
                style={{ border: 'none', background: 'transparent', color: '#efd889', cursor: 'pointer', fontWeight: 'bold', fontSize: '15px', width: '18px', height: '18px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
              >
                +
              </button>
            </div>
            
            {/* Add to Cart Button */}
            <button
              type="button"
              onClick={handleAdd}
              style={{ flex: 1, background: 'linear-gradient(90deg, #d8b45a 0%, #efd889 100%)', border: 'none', borderRadius: '9999px', color: '#102d1d', fontWeight: 'bold', padding: '8px 16px', fontSize: '12px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px', boxShadow: '0 4px 6px rgba(0,0,0,0.15)' }}
            >
              <span>🛒</span>
              <span>Thêm vào giỏ</span>
            </button>
          </div>
        </div>
      </div>
    </article>
  );
}

