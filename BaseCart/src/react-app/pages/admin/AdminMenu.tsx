import { useState, useEffect, useRef } from 'react';
import AdminLayout from '../../components/admin/AdminLayout';

interface MenuItem {
  id: number;
  name: string;
  description: string | null;
  price: number;
  category: string;
  image_url: string | null;
  is_available: boolean;
  sort_order: number;
}

export default function AdminMenu() {
  const [items, setItems] = useState<MenuItem[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [isLoading, setIsLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [showImportModal, setShowImportModal] = useState(false);
  const [importStatus, setImportStatus] = useState<{ importing: boolean; result: { imported: number; errors: string[] } | null }>({ importing: false, result: null });
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [editingItem, setEditingItem] = useState<MenuItem | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    category: '',
    image_url: '',
    is_available: true,
  });

  useEffect(() => {
    fetchItems();
  }, []);

  const fetchItems = async () => {
    try {
      const res = await fetch('/api/menu');
      if (res.ok) {
        const data = await res.json();
        setItems(data);
        const cats = [...new Set(data.map((i: MenuItem) => i.category))];
        setCategories(cats as string[]);
      }
    } catch (error) {
      console.error('Failed to fetch menu items:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const openModal = (item?: MenuItem) => {
    if (item) {
      setEditingItem(item);
      setFormData({
        name: item.name,
        description: item.description || '',
        price: item.price.toString(),
        category: item.category,
        image_url: item.image_url || '',
        is_available: item.is_available,
      });
    } else {
      setEditingItem(null);
      setFormData({
        name: '',
        description: '',
        price: '',
        category: categories[0] || '',
        image_url: '',
        is_available: true,
      });
    }
    setShowModal(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const payload = {
      ...formData,
      price: parseFloat(formData.price),
    };

    try {
      const url = editingItem ? `/api/menu/${editingItem.id}` : '/api/menu';
      const method = editingItem ? 'PUT' : 'POST';
      
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        setShowModal(false);
        fetchItems();
      }
    } catch (error) {
      console.error('Failed to save item:', error);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Delete this item?')) return;
    
    try {
      const res = await fetch(`/api/menu/${id}`, { method: 'DELETE' });
      if (res.ok) {
        fetchItems();
      }
    } catch (error) {
      console.error('Failed to delete item:', error);
    }
  };

  const toggleAvailability = async (item: MenuItem) => {
    try {
      await fetch(`/api/menu/${item.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...item, is_available: !item.is_available }),
      });
      fetchItems();
    } catch (error) {
      console.error('Failed to toggle availability:', error);
    }
  };

  const parseCSV = (text: string): Record<string, string>[] => {
    const lines = text.trim().split('\n');
    if (lines.length < 2) return [];
    
    const headers = lines[0].split(',').map(h => h.trim().toLowerCase().replace(/"/g, ''));
    const items: Record<string, string>[] = [];
    
    for (let i = 1; i < lines.length; i++) {
      const values: string[] = [];
      let current = '';
      let inQuotes = false;
      
      for (const char of lines[i]) {
        if (char === '"') {
          inQuotes = !inQuotes;
        } else if (char === ',' && !inQuotes) {
          values.push(current.trim());
          current = '';
        } else {
          current += char;
        }
      }
      values.push(current.trim());
      
      const item: Record<string, string> = {};
      headers.forEach((header, idx) => {
        item[header] = values[idx] || '';
      });
      items.push(item);
    }
    
    return items;
  };

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    setImportStatus({ importing: true, result: null });
    
    try {
      const text = await file.text();
      const items = parseCSV(text);
      
      if (items.length === 0) {
        setImportStatus({ importing: false, result: { imported: 0, errors: ['No valid data found in file'] } });
        return;
      }
      
      const res = await fetch('/api/menu/import', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ items }),
      });
      
      const data = await res.json();
      setImportStatus({ importing: false, result: data });
      
      if (data.imported > 0) {
        fetchItems();
      }
    } catch (error) {
      console.error('Import failed:', error);
      setImportStatus({ importing: false, result: { imported: 0, errors: ['Failed to parse file'] } });
    }
    
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const downloadTemplate = () => {
    const csv = 'name,description,price,category\n"Example Coffee","A delicious coffee",4.50,drinks\n"Example Pastry","Fresh baked daily",3.25,food';
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'menu-template.csv';
    a.click();
    URL.revokeObjectURL(url);
  };

  const filteredItems = selectedCategory === 'all' 
    ? items 
    : items.filter(i => i.category === selectedCategory);

  return (
    <AdminLayout>
      <div style={{ padding: 30 }}>
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 30 }}>
          <div>
            <h1 style={{ fontSize: 28, fontWeight: 800, color: 'var(--text)', marginBottom: 5 }}>Menu Items</h1>
            <p style={{ color: '#888', fontSize: 14 }}>Manage your store's menu</p>
          </div>
          <div style={{ display: 'flex', gap: 10 }}>
            <button
              onClick={() => { setImportStatus({ importing: false, result: null }); setShowImportModal(true); }}
              style={{
                padding: '12px 24px',
                background: 'var(--card-bg)',
                color: 'var(--text)',
                border: '2px solid var(--grid-line)',
                borderRadius: 10,
                fontWeight: 700,
                cursor: 'pointer',
                fontFamily: 'Nunito',
                display: 'flex',
                alignItems: 'center',
                gap: 8,
              }}
            >
              <i className="fas fa-file-import"></i>
              Import CSV
            </button>
            <button
              onClick={() => openModal()}
              style={{
                padding: '12px 24px',
                background: 'var(--primary)',
                color: 'white',
                border: 'none',
                borderRadius: 10,
                fontWeight: 700,
                cursor: 'pointer',
                fontFamily: 'Nunito',
                display: 'flex',
                alignItems: 'center',
                gap: 8,
              }}
            >
              <i className="fas fa-plus"></i>
              Add Item
            </button>
          </div>
        </div>

        {/* Category Filter */}
        <div style={{ display: 'flex', gap: 10, marginBottom: 20, flexWrap: 'wrap' }}>
          <button
            onClick={() => setSelectedCategory('all')}
            style={{
              padding: '8px 16px',
              borderRadius: 20,
              border: 'none',
              background: selectedCategory === 'all' ? 'var(--primary)' : 'var(--card-bg)',
              color: selectedCategory === 'all' ? 'white' : 'var(--text)',
              fontWeight: 600,
              cursor: 'pointer',
              fontFamily: 'Nunito',
            }}
          >
            All ({items.length})
          </button>
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              style={{
                padding: '8px 16px',
                borderRadius: 20,
                border: 'none',
                background: selectedCategory === cat ? 'var(--primary)' : 'var(--card-bg)',
                color: selectedCategory === cat ? 'white' : 'var(--text)',
                fontWeight: 600,
                cursor: 'pointer',
                fontFamily: 'Nunito',
                textTransform: 'capitalize',
              }}
            >
              {cat} ({items.filter(i => i.category === cat).length})
            </button>
          ))}
        </div>

        {/* Items Grid */}
        {isLoading ? (
          <div style={{ textAlign: 'center', padding: 60 }}>
            <i className="fas fa-spinner fa-spin" style={{ fontSize: 30, color: 'var(--primary)' }}></i>
          </div>
        ) : filteredItems.length === 0 ? (
          <div style={{ textAlign: 'center', padding: 60, background: 'var(--card-bg)', borderRadius: 20 }}>
            <i className="fas fa-utensils" style={{ fontSize: 50, color: '#ccc', marginBottom: 15 }}></i>
            <h3 style={{ color: 'var(--text)', marginBottom: 8 }}>No menu items yet</h3>
            <p style={{ color: '#888', marginBottom: 20 }}>Add your first item to get started</p>
            <button
              onClick={() => openModal()}
              style={{
                padding: '12px 24px',
                background: 'var(--primary)',
                color: 'white',
                border: 'none',
                borderRadius: 10,
                fontWeight: 700,
                cursor: 'pointer',
                fontFamily: 'Nunito',
              }}
            >
              <i className="fas fa-plus" style={{ marginRight: 8 }}></i>
              Add First Item
            </button>
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: 20 }}>
            {filteredItems.map(item => (
              <div
                key={item.id}
                style={{
                  background: 'var(--card-bg)',
                  borderRadius: 15,
                  overflow: 'hidden',
                  opacity: item.is_available ? 1 : 0.6,
                }}
              >
                {item.image_url && (
                  <img
                    src={item.image_url}
                    alt={item.name}
                    style={{ width: '100%', height: 150, objectFit: 'cover' }}
                  />
                )}
                <div style={{ padding: 20 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 8 }}>
                    <h3 style={{ fontWeight: 700, color: 'var(--text)', fontSize: 18 }}>{item.name}</h3>
                    <span style={{ fontWeight: 800, color: 'var(--primary)', fontSize: 18 }}>
                      ${item.price.toFixed(2)}
                    </span>
                  </div>
                  <p style={{ color: '#888', fontSize: 14, marginBottom: 12 }}>
                    {item.description || 'No description'}
                  </p>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{
                      padding: '4px 10px',
                      background: 'var(--secondary)',
                      color: 'white',
                      borderRadius: 12,
                      fontSize: 12,
                      fontWeight: 600,
                      textTransform: 'capitalize',
                    }}>
                      {item.category}
                    </span>
                    <div style={{ display: 'flex', gap: 8 }}>
                      <button
                        onClick={() => toggleAvailability(item)}
                        style={{
                          padding: '6px 10px',
                          background: item.is_available ? '#22c55e' : '#ef4444',
                          color: 'white',
                          border: 'none',
                          borderRadius: 6,
                          cursor: 'pointer',
                          fontSize: 12,
                        }}
                        title={item.is_available ? 'Mark unavailable' : 'Mark available'}
                      >
                        <i className={`fas fa-${item.is_available ? 'check' : 'times'}`}></i>
                      </button>
                      <button
                        onClick={() => openModal(item)}
                        style={{
                          padding: '6px 10px',
                          background: 'var(--primary)',
                          color: 'white',
                          border: 'none',
                          borderRadius: 6,
                          cursor: 'pointer',
                          fontSize: 12,
                        }}
                      >
                        <i className="fas fa-edit"></i>
                      </button>
                      <button
                        onClick={() => handleDelete(item.id)}
                        style={{
                          padding: '6px 10px',
                          background: '#ef4444',
                          color: 'white',
                          border: 'none',
                          borderRadius: 6,
                          cursor: 'pointer',
                          fontSize: 12,
                        }}
                      >
                        <i className="fas fa-trash"></i>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Modal */}
        {showModal && (
          <div
            style={{
              position: 'fixed',
              inset: 0,
              background: 'rgba(0,0,0,0.5)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              zIndex: 1000,
              padding: 20,
            }}
            onClick={() => setShowModal(false)}
          >
            <div
              style={{
                background: 'white',
                borderRadius: 20,
                padding: 30,
                maxWidth: 500,
                width: '100%',
                maxHeight: '90vh',
                overflow: 'auto',
              }}
              onClick={e => e.stopPropagation()}
            >
              <h2 style={{ fontSize: 22, fontWeight: 800, marginBottom: 20, color: 'var(--secondary)' }}>
                {editingItem ? 'Edit Item' : 'Add New Item'}
              </h2>
              <form onSubmit={handleSubmit}>
                <div style={{ marginBottom: 16 }}>
                  <label style={{ display: 'block', marginBottom: 6, fontWeight: 600 }}>Name *</label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={e => setFormData({ ...formData, name: e.target.value })}
                    required
                    style={{
                      width: '100%',
                      padding: '10px 14px',
                      borderRadius: 8,
                      border: '2px solid #e5e5e5',
                      fontSize: 16,
                      fontFamily: 'Nunito',
                    }}
                  />
                </div>
                <div style={{ marginBottom: 16 }}>
                  <label style={{ display: 'block', marginBottom: 6, fontWeight: 600 }}>Description</label>
                  <textarea
                    value={formData.description}
                    onChange={e => setFormData({ ...formData, description: e.target.value })}
                    rows={2}
                    style={{
                      width: '100%',
                      padding: '10px 14px',
                      borderRadius: 8,
                      border: '2px solid #e5e5e5',
                      fontSize: 16,
                      fontFamily: 'Nunito',
                      resize: 'vertical',
                    }}
                  />
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 16 }}>
                  <div>
                    <label style={{ display: 'block', marginBottom: 6, fontWeight: 600 }}>Price *</label>
                    <input
                      type="number"
                      step="0.01"
                      min="0"
                      value={formData.price}
                      onChange={e => setFormData({ ...formData, price: e.target.value })}
                      required
                      style={{
                        width: '100%',
                        padding: '10px 14px',
                        borderRadius: 8,
                        border: '2px solid #e5e5e5',
                        fontSize: 16,
                        fontFamily: 'Nunito',
                      }}
                    />
                  </div>
                  <div>
                    <label style={{ display: 'block', marginBottom: 6, fontWeight: 600 }}>Category *</label>
                    <input
                      type="text"
                      value={formData.category}
                      onChange={e => setFormData({ ...formData, category: e.target.value })}
                      required
                      placeholder="e.g., drinks, food"
                      list="categories"
                      style={{
                        width: '100%',
                        padding: '10px 14px',
                        borderRadius: 8,
                        border: '2px solid #e5e5e5',
                        fontSize: 16,
                        fontFamily: 'Nunito',
                      }}
                    />
                    <datalist id="categories">
                      {categories.map(cat => <option key={cat} value={cat} />)}
                    </datalist>
                  </div>
                </div>
                <div style={{ marginBottom: 16 }}>
                  <label style={{ display: 'block', marginBottom: 6, fontWeight: 600 }}>Image URL</label>
                  <input
                    type="url"
                    value={formData.image_url}
                    onChange={e => setFormData({ ...formData, image_url: e.target.value })}
                    placeholder="https://..."
                    style={{
                      width: '100%',
                      padding: '10px 14px',
                      borderRadius: 8,
                      border: '2px solid #e5e5e5',
                      fontSize: 16,
                      fontFamily: 'Nunito',
                    }}
                  />
                </div>
                <div style={{ marginBottom: 24 }}>
                  <label style={{ display: 'flex', alignItems: 'center', gap: 10, cursor: 'pointer' }}>
                    <input
                      type="checkbox"
                      checked={formData.is_available}
                      onChange={e => setFormData({ ...formData, is_available: e.target.checked })}
                      style={{ width: 18, height: 18 }}
                    />
                    <span style={{ fontWeight: 600 }}>Available for ordering</span>
                  </label>
                </div>
                <div style={{ display: 'flex', gap: 12 }}>
                  <button
                    type="button"
                    onClick={() => setShowModal(false)}
                    style={{
                      flex: 1,
                      padding: '12px',
                      borderRadius: 10,
                      background: '#e5e5e5',
                      border: 'none',
                      fontWeight: 700,
                      cursor: 'pointer',
                      fontFamily: 'Nunito',
                    }}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    style={{
                      flex: 1,
                      padding: '12px',
                      borderRadius: 10,
                      background: 'var(--primary)',
                      color: 'white',
                      border: 'none',
                      fontWeight: 700,
                      cursor: 'pointer',
                      fontFamily: 'Nunito',
                    }}
                  >
                    {editingItem ? 'Save Changes' : 'Add Item'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Import Modal */}
        {showImportModal && (
          <div
            style={{
              position: 'fixed',
              inset: 0,
              background: 'rgba(0,0,0,0.5)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              zIndex: 1000,
              padding: 20,
            }}
            onClick={() => setShowImportModal(false)}
          >
            <div
              style={{
                background: 'white',
                borderRadius: 20,
                padding: 30,
                maxWidth: 500,
                width: '100%',
              }}
              onClick={e => e.stopPropagation()}
            >
              <h2 style={{ fontSize: 22, fontWeight: 800, marginBottom: 20, color: 'var(--secondary)' }}>
                Import Menu Items
              </h2>
              
              <p style={{ color: '#666', marginBottom: 20, lineHeight: 1.6 }}>
                Upload a CSV file with columns: <strong>name</strong>, <strong>description</strong>, <strong>price</strong>, <strong>category</strong>
              </p>
              
              <button
                onClick={downloadTemplate}
                style={{
                  padding: '10px 16px',
                  background: 'var(--secondary)',
                  color: 'white',
                  border: 'none',
                  borderRadius: 8,
                  fontWeight: 600,
                  cursor: 'pointer',
                  fontFamily: 'Nunito',
                  marginBottom: 20,
                  display: 'flex',
                  alignItems: 'center',
                  gap: 8,
                }}
              >
                <i className="fas fa-download"></i>
                Download Template
              </button>
              
              <input
                type="file"
                accept=".csv"
                ref={fileInputRef}
                onChange={handleFileSelect}
                style={{ display: 'none' }}
              />
              
              <div
                onClick={() => fileInputRef.current?.click()}
                style={{
                  border: '2px dashed var(--grid-line)',
                  borderRadius: 12,
                  padding: 40,
                  textAlign: 'center',
                  cursor: 'pointer',
                  marginBottom: 20,
                  background: '#fafafa',
                }}
              >
                {importStatus.importing ? (
                  <>
                    <i className="fas fa-spinner fa-spin" style={{ fontSize: 30, color: 'var(--primary)', marginBottom: 10 }}></i>
                    <p style={{ fontWeight: 600, color: 'var(--text)' }}>Importing...</p>
                  </>
                ) : (
                  <>
                    <i className="fas fa-cloud-upload-alt" style={{ fontSize: 40, color: '#999', marginBottom: 10 }}></i>
                    <p style={{ fontWeight: 600, color: 'var(--text)', marginBottom: 5 }}>Click to upload CSV</p>
                    <p style={{ fontSize: 13, color: '#888' }}>or drag and drop</p>
                  </>
                )}
              </div>
              
              {importStatus.result && (
                <div style={{
                  padding: 15,
                  borderRadius: 10,
                  background: importStatus.result.imported > 0 ? '#dcfce7' : '#fef2f2',
                  marginBottom: 20,
                }}>
                  {importStatus.result.imported > 0 && (
                    <p style={{ color: '#166534', fontWeight: 600, marginBottom: importStatus.result.errors.length > 0 ? 10 : 0 }}>
                      <i className="fas fa-check-circle" style={{ marginRight: 8 }}></i>
                      Successfully imported {importStatus.result.imported} item{importStatus.result.imported !== 1 ? 's' : ''}
                    </p>
                  )}
                  {importStatus.result.errors.length > 0 && (
                    <div>
                      <p style={{ color: '#991b1b', fontWeight: 600, marginBottom: 5 }}>
                        <i className="fas fa-exclamation-circle" style={{ marginRight: 8 }}></i>
                        {importStatus.result.errors.length} error{importStatus.result.errors.length !== 1 ? 's' : ''}:
                      </p>
                      <ul style={{ margin: 0, paddingLeft: 20, color: '#991b1b', fontSize: 13 }}>
                        {importStatus.result.errors.slice(0, 5).map((err, i) => (
                          <li key={i}>{err}</li>
                        ))}
                        {importStatus.result.errors.length > 5 && (
                          <li>...and {importStatus.result.errors.length - 5} more</li>
                        )}
                      </ul>
                    </div>
                  )}
                </div>
              )}
              
              <button
                onClick={() => setShowImportModal(false)}
                style={{
                  width: '100%',
                  padding: '12px',
                  borderRadius: 10,
                  background: '#e5e5e5',
                  border: 'none',
                  fontWeight: 700,
                  cursor: 'pointer',
                  fontFamily: 'Nunito',
                }}
              >
                Close
              </button>
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  );
}
