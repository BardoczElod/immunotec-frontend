import React, { useEffect, useState } from 'react';

type Product = {
  name: string;
  price: number;
  description: string;
  img: string;
  link?: string;
};

const Admin: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [token, setToken] = useState('changeme');
  const [saving, setSaving] = useState(false);
  const [saveMsg, setSaveMsg] = useState<string | null>(null);
  const [isAuth, setIsAuth] = useState(false);
  const [authInput, setAuthInput] = useState('');

  // State for new product
  const [newProduct, setNewProduct] = useState<Product>({
    name: '',
    price: 0,
    description: '',
    img: '',
    link: ''
  });
  const [adding, setAdding] = useState(false);
  const [addMsg, setAddMsg] = useState<string | null>(null);

  useEffect(() => {
    fetch('http://localhost:4000/products')
      .then(res => res.json())
      .then(data => {
        setProducts(data);
        setLoading(false);
      })
      .catch(() => {
        setError('Failed to load products');
        setLoading(false);
      });
  }, []);

  const handleChange = (idx: number, field: keyof Product, value: string | number) => {
    setProducts(prev => prev.map((p, i) => i === idx ? { ...p, [field]: value } : p));
  };

  const handleSave = async () => {
    setSaving(true);
    setSaveMsg(null);
    try {
      const res = await fetch('http://localhost:4000/products', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(products)
      });
      if (!res.ok) throw new Error('Save failed');
      setSaveMsg('Products updated!');
    } catch {
      setSaveMsg('Failed to update products.');
    }
    setSaving(false);
  };

  const handleImageUpload = async (idx: number, file: File) => {
    const formData = new FormData();
    formData.append('image', file);
    formData.append('description', products[idx].description || '');
    try {
      const res = await fetch('http://localhost:4000/upload', {
        method: 'POST',
        body: formData
      });
      const data = await res.json();
      if (data.file && data.file.path) {
        // Update the product's img field with the uploaded file path
        setProducts(prev => prev.map((p, i) => i === idx ? { ...p, img: `/uploads/${data.file.filename}` } : p));
      }
    } catch {
      alert('Image upload failed');
    }
  };

  // Image upload for new product
  const handleNewImageUpload = async (file: File) => {
    const formData = new FormData();
    formData.append('image', file);
    formData.append('description', newProduct.description || '');
    try {
      const res = await fetch('http://localhost:4000/upload', {
        method: 'POST',
        body: formData
      });
      const data = await res.json();
      if (data.file && data.file.path) {
        setNewProduct(prev => ({ ...prev, img: `/uploads/${data.file.filename}` }));
      }
    } catch {
      alert('Image upload failed');
    }
  };

  const handleAuth = () => {
    if (authInput === token) {
      setIsAuth(true);
    } else {
      setSaveMsg('Invalid token');
    }
  };

  if (!isAuth) {
    return (
      <div style={{ maxWidth: 400, margin: '100px auto', padding: 32, border: '1px solid #ccc', borderRadius: 8 }}>
        <h2>Admin Login</h2>
        <input
          type="password"
          placeholder="Enter admin token"
          value={authInput}
          onChange={e => setAuthInput(e.target.value)}
          style={{ width: '100%', marginBottom: 16, padding: 8 }}
        />
        <button onClick={handleAuth} style={{ width: '100%', padding: 8 }}>Login</button>
        {saveMsg && <div style={{ color: 'red', marginTop: 12 }}>{saveMsg}</div>}
      </div>
    );
  }

  if (loading) return <div>Loading...</div>;
  if (error) return <div style={{ color: 'red' }}>{error}</div>;

  return (
    <div style={{ maxWidth: 900, margin: '0 auto', padding: 32 }}>
      <h2>Admin: Edit Products</h2>
      <div style={{ marginBottom: 16 }}>
        <label>Auth Token: <input value={token} onChange={e => setToken(e.target.value)} style={{ width: 200 }} /></label>
      </div>

      {/* Add New Product Section */}
      <div style={{ border: '2px solid #4caf50', borderRadius: 8, padding: 16, marginBottom: 32, background: '#f6fff6' }}>
        <h3>Add New Product</h3>
        <div>
          <label>Name: <input value={newProduct.name} onChange={e => setNewProduct(p => ({ ...p, name: e.target.value }))} style={{ width: 300 }} /></label>
        </div>
        <div>
          <label>Price: <input type="number" value={newProduct.price} onChange={e => setNewProduct(p => ({ ...p, price: Number(e.target.value) }))} style={{ width: 100 }} /></label>
        </div>
        <div>
          <label>Description:<br />
            <textarea value={newProduct.description} onChange={e => setNewProduct(p => ({ ...p, description: e.target.value }))} style={{ width: 400, height: 60 }} />
          </label>
        </div>
        <div>
          <label>Image URL: <input value={newProduct.img} onChange={e => setNewProduct(p => ({ ...p, img: e.target.value }))} style={{ width: 400 }} /></label>
          <input type="file" accept="image/*" onChange={e => {
            if (e.target.files && e.target.files[0]) handleNewImageUpload(e.target.files[0]);
          }} />
          <div>{newProduct.img && <img src={newProduct.img} alt="preview" style={{ maxWidth: 200, marginTop: 8 }} />}</div>
        </div>
        <div>
          <label>Product Link: <input value={newProduct.link || ''} onChange={e => setNewProduct(p => ({ ...p, link: e.target.value }))} style={{ width: 400 }} /></label>
        </div>
        <button
          onClick={async () => {
            setAdding(true);
            setAddMsg(null);
            try {
              const res = await fetch('http://localhost:4000/products/add', {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json',
                  'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(newProduct)
              });
              if (!res.ok) throw new Error('Add failed');
              setAddMsg('Product added!');
              setNewProduct({ name: '', price: 0, description: '', img: '', link: '' });
              // Optionally reload products
              fetch('http://localhost:4000/products')
                .then(res => res.json())
                .then(data => setProducts(data));
            } catch {
              setAddMsg('Failed to add product.');
            }
            setAdding(false);
          }}
          disabled={adding}
          style={{ padding: '8px 24px', fontSize: 16, background: '#4caf50', color: '#fff', border: 'none', borderRadius: 6, marginTop: 8 }}
        >
          {adding ? 'Adding...' : 'Add Product'}
        </button>
        {addMsg && <div style={{ marginTop: 12, color: addMsg.includes('Failed') ? 'red' : 'green' }}>{addMsg}</div>}
      </div>
      {products.map((p, idx) => (
        <div key={idx} style={{ border: '1px solid #ccc', borderRadius: 8, padding: 16, marginBottom: 16, position: 'relative' }}>
          <div style={{ position: 'absolute', top: 8, right: 8 }}>
            <button
              style={{ background: '#f44336', color: '#fff', border: 'none', borderRadius: 4, padding: '4px 10px', cursor: 'pointer', fontWeight: 700 }}
              onClick={async () => {
                if (!window.confirm('Are you sure you want to remove this product?')) return;
                try {
                  const res = await fetch(`http://localhost:4000/products/${idx}`, {
                    method: 'DELETE',
                    headers: {
                      'Authorization': `Bearer ${token}`
                    }
                  });
                  if (!res.ok) throw new Error('Remove failed');
                  setProducts(prev => prev.filter((_, i) => i !== idx));
                } catch {
                  alert('Failed to remove product.');
                }
              }}
            >Remove</button>
          </div>
          <div>
            <label>Name: <input value={p.name} onChange={e => handleChange(idx, 'name', e.target.value)} style={{ width: 300 }} /></label>
          </div>
          <div>
            <label>Price: <input type="number" value={p.price} onChange={e => handleChange(idx, 'price', Number(e.target.value))} style={{ width: 100 }} /></label>
          </div>
          <div>
            <label>Description:<br />
              <textarea value={p.description} onChange={e => handleChange(idx, 'description', e.target.value)} style={{ width: 400, height: 60 }} />
            </label>
          </div>
          <div>
            <label>Image URL: <input value={p.img} onChange={e => handleChange(idx, 'img', e.target.value)} style={{ width: 400 }} /></label>
            <input type="file" accept="image/*" onChange={e => {
              if (e.target.files && e.target.files[0]) handleImageUpload(idx, e.target.files[0]);
            }} />
            <div><img src={p.img} alt="preview" style={{ maxWidth: 200, marginTop: 8 }} /></div>
          </div>
          <div>
            <label>Product Link: <input value={p.link || ''} onChange={e => handleChange(idx, 'link', e.target.value)} style={{ width: 400 }} /></label>
          </div>
          <button
            style={{ padding: '8px 24px', fontSize: 16, background: '#2196f3', color: '#fff', border: 'none', borderRadius: 6, marginTop: 12 }}
            onClick={async () => {
              try {
                const updatedProducts = [...products];
                // Save only the current product
                updatedProducts[idx] = p;
                const res = await fetch('http://localhost:4000/products', {
                  method: 'POST',
                  headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                  },
                  body: JSON.stringify(updatedProducts)
                });
                if (!res.ok) throw new Error('Save failed');
                setSaveMsg('Product updated!');
              } catch {
                setSaveMsg('Failed to update product.');
              }
            }}
          >Save Changes</button>
        </div>
      ))}
      <button onClick={handleSave} disabled={saving} style={{ padding: '8px 24px', fontSize: 16 }}>
        {saving ? 'Saving...' : 'Save Changes'}
      </button>
      {saveMsg && <div style={{ marginTop: 16, color: saveMsg.includes('Failed') ? 'red' : 'green' }}>{saveMsg}</div>}
    </div>
  );
};

export default Admin;