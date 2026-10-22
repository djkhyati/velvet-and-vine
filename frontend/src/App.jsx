import React, { useEffect, useState } from 'react';
import { fetchProducts } from './services/api';
import './App.css';
import { ShoppingBag } from 'lucide-react';

function App() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [cart, setCart] = useState([]);
  const [isCartOpen, setIsCartOpen] = useState(false);

  // Fetch products from backend API when component loads
  useEffect(() => {
    fetchProducts()
      .then((response) => {
        setProducts(response.data);
        setLoading(false);
      })
      .catch((error) => {
        console.error('Error fetching products:', error);
        setLoading(false);
      });
  }, []);

  // Helper function to get a unique key/id for each product
  const getProductId = (product) => {
    return String(product._id || product.id || product.name || '');
  };

  // Add product to cart logic (handles duplicates correctly)
  const addToCart = (product) => {
    const prodId = getProductId(product);

    const existingIndex = cart.findIndex(
      (item) => getProductId(item) === prodId
    );

    if (existingIndex > -1) {
      const updatedCart = [...cart];
      updatedCart[existingIndex].qty = (updatedCart[existingIndex].qty || 1) + 1;
      setCart(updatedCart);
    } else {
      setCart([...cart, { ...product, qty: 1 }]);
    }
    setIsCartOpen(true); // Open cart drawer automatically
  };

  // Increase quantity
  const increaseQty = (index) => {
    const updatedCart = [...cart];
    updatedCart[index].qty = (updatedCart[index].qty || 1) + 1;
    setCart(updatedCart);
  };

  // Decrease quantity
  const decreaseQty = (index) => {
    const updatedCart = [...cart];
    const currentQty = updatedCart[index].qty || 1;

    if (currentQty > 1) {
      updatedCart[index].qty = currentQty - 1;
      setCart(updatedCart);
    } else {
      removeFromCart(index);
    }
  };

  // Remove item from cart
  const removeFromCart = (index) => {
    const updatedCart = cart.filter((_, i) => i !== index);
    setCart(updatedCart);
  };

  // Handle Checkout
  const handleCheckout = () => {
    if (cart.length === 0) return;
    alert('🎉 Order placed successfully! Thank you for shopping with Velvet & Vine.');
    setCart([]); // Clear cart after successful checkout
    setIsCartOpen(false); // Close cart drawer
  };

  // Total items count in cart
  const totalItems = cart.reduce((total, item) => total + (item.qty || 1), 0);

  // Calculate total price
  const totalPrice = cart.reduce((total, item) => total + (item.price * (item.qty || 1)), 0);

  return (
    <div className="app-container" style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      {/* Header / Navbar */}
      <header className="navbar" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '20px 40px', borderBottom: '1px solid #eee' }}>
        <h2 style={{ margin: 0 }}>Velvet & Vine</h2>
        <button 
          onClick={() => setIsCartOpen(!isCartOpen)} 
          style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '8px 16px', cursor: 'pointer', background: '#000', color: '#fff', border: 'none', borderRadius: '4px' }}
        >
          <ShoppingBag size={18} /> Cart ({totalItems})
        </button>
      </header>

      {/* Main Content / Product List */}
      <main style={{ padding: '40px', flex: 1 }}>
        <h2>Our Collection</h2>
        {loading ? (
          <p>Loading products from backend...</p>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: '20px', marginTop: '20px' }}>
            {products.map((product) => (
              <div key={getProductId(product)} style={{ border: '1px solid #ddd', padding: '15px', borderRadius: '8px', background: '#fff' }}>
                {product.image && (
                  <img src={product.image} alt={product.name} style={{ width: '100%', height: '200px', objectFit: 'cover', borderRadius: '4px' }} />
                )}
                <h3 style={{ margin: '10px 0 5px 0' }}>{product.name}</h3>
                <p style={{ color: '#666', fontSize: '14px' }}>{product.description}</p>
                <p style={{ fontWeight: 'bold', margin: '10px 0' }}>£{product.price}</p>
                <button 
                  onClick={() => addToCart(product)}
                  style={{ width: '100%', padding: '10px', background: '#000', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
                >
                  Add to Cart
                </button>
              </div>
            ))}
          </div>
        )}
      </main>

      {/* Footer */}
      <footer style={{ background: '#111', color: '#fff', textAlign: 'center', padding: '30px', marginTop: 'auto' }}>
        <h3 style={{ margin: '0 0 10px 0' }}>Velvet & Vine</h3>
        <p style={{ margin: 0, color: '#aaa', fontSize: '14px' }}>© 2026 Velvet & Vine. All rights reserved.</p>
      </footer>

      {/* Cart Drawer */}
      {isCartOpen && (
        <div style={{
          position: 'fixed',
          top: 0,
          right: 0,
          width: '350px',
          height: '100vh',
          backgroundColor: '#fff',
          boxShadow: '-2px 0 10px rgba(0,0,0,0.1)',
          padding: '20px',
          zIndex: 1000,
          overflowY: 'auto'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', borderBottom: '1px solid #eee', paddingBottom: '10px' }}>
            <h3>Your Cart</h3>
            <button onClick={() => setIsCartOpen(false)} style={{ cursor: 'pointer', background: 'none', border: 'none', fontSize: '18px', fontWeight: 'bold' }}>✕</button>
          </div>

          {cart.length === 0 ? (
            <p>Your cart is empty.</p>
          ) : (
            <div>
              {cart.map((item, index) => (
                <div key={getProductId(item) + index} style={{ borderBottom: '1px solid #eee', paddingBottom: '12px', marginBottom: '12px' }}>
                  <h4 style={{ margin: '0 0 5px 0' }}>{item.name}</h4>
                  <p style={{ margin: '0 0 8px 0', color: '#555' }}>£{item.price}</p>
                  
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <button onClick={() => decreaseQty(index)} style={{ width: '25px', height: '25px', cursor: 'pointer' }}>-</button>
                    <span>{item.qty || 1}</span>
                    <button onClick={() => increaseQty(index)} style={{ width: '25px', height: '25px', cursor: 'pointer' }}>+</button>
                    
                    <button onClick={() => removeFromCart(index)} style={{ marginLeft: 'auto', color: 'red', border: 'none', background: 'none', cursor: 'pointer', fontSize: '13px' }}>
                      Remove
                    </button>
                  </div>
                </div>
              ))}

              <div style={{ marginTop: '20px', borderTop: '1px solid #eee', paddingTop: '15px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px', fontWeight: 'bold' }}>
                  <span>Total Amount:</span>
                  <span>£{totalPrice.toFixed(2)}</span>
                </div>
                <button 
                  onClick={handleCheckout}
                  style={{ width: '100%', padding: '12px', backgroundColor: '#000', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold' }}
                >
                  Proceed to Checkout
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default App;