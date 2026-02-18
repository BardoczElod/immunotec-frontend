import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

type Product = {
  name: string;
  price: number;
  description: string;
  img: string;
  link?: string;
};

const Home: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const apiUrl = process.env.REACT_APP_API_URL || 'http://localhost:4000';
    fetch(`${apiUrl}/products`)
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) {
          setProducts(data);
        } else {
          setError('Failed to load products');
        }
        setLoading(false);
      })
      .catch(() => {
        setError('Failed to load products');
        setLoading(false);
      });
  }, []);

  return (
    <div style={{ maxWidth: 1200, margin: '0 auto', padding: '32px 8px', fontFamily: 'Inter, Arial, Helvetica, sans-serif' }}>
      <style>{`
        @media (max-width: 600px) {
          .products-grid {
            display: flex !important;
            flex-direction: column !important;
            align-items: center !important;
            width: 100% !important;
            margin: 0 auto !important;
            box-sizing: border-box;
          }
          .product-card {
            max-width: 85vw !important;
            width: 85vw !important;
            padding: 8px !important;
            margin-left: auto !important;
            margin-right: auto !important;
            margin-bottom: 20px !important;
            display: flex !important;
            flex-direction: column !important;
            align-items: center !important;
          }
          .product-img {
            width: 75vw !important;
            height: auto !important;
            max-width: 75vw !important;
            margin-bottom: 12px !important;
          }
        }
        @media (min-width: 601px) {
          .products-grid {
            display: grid !important;
            grid-template-columns: repeat(2, 1fr) !important;
            gap: 40px !important;
            justify-content: center !important;
            max-width: 1100px !important;
            margin: 0 auto !important;
          }
        }
      `}</style>
      {loading ? (
        <div style={{ textAlign: 'center', marginTop: 32 }}>Loading products...</div>
      ) : error ? (
        <div style={{ textAlign: 'center', color: 'red', marginTop: 32 }}>{error}</div>
      ) : (
        <div className="products-grid" style={{ width: '100%', maxWidth: 900, margin: '0 auto' }}>
          {products.map((p, idx) => (
            <div
              key={idx}
              className="product-card"
              style={{ background: '#fff', borderRadius: 16, boxShadow: '0 2px 8px #eee', maxWidth: 420, width: '100%', padding: 16, margin: '0 auto 32px auto', display: 'flex', flexDirection: 'column', alignItems: 'center' }}
            >
              <img
                className="product-img"
                src={p.img.startsWith('http') ? p.img : `http://localhost:4000${p.img}`}
                alt={p.name}
                style={{ width: 320, height: 220, objectFit: 'contain', marginBottom: 24, maxWidth: '100%' }}
              />
              <h3 className="product-title" style={{ fontWeight: 700, marginBottom: 12, fontSize: 28 }}>{p.name}</h3>
              <p className="product-desc" style={{ fontSize: 18, color: '#222', marginBottom: 20, textAlign: 'center' }}>{p.description}</p>
              <div className="product-price" style={{ fontWeight: 700, marginBottom: 12, fontSize: 20 }}>
                USD ${p.price.toFixed(2)} <span style={{ fontWeight: 400, fontSize: 14 }}>Retail</span>
              </div>
              <label style={{ marginBottom: 12, fontSize: 16 }}>
                <input type="checkbox" style={{ marginRight: 8 }} /> Subscribe & save 25%
              </label>
              <button
                className="product-btn"
                style={{ width: '100%', padding: '16px 0', borderRadius: 10, border: '1.5px solid #222', background: '#fff', fontWeight: 700, fontSize: 20, cursor: 'pointer', marginTop: 8 }}
                onClick={() => { if (p.link) window.open(p.link, '_blank'); }}
                disabled={!p.link}
              >
                See Product
              </button>
            </div>
          ))}
        </div>
        )}
    </div>
  );
}
export default Home;
