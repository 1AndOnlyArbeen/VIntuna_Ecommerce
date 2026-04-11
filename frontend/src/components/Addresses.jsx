import { useState, useEffect } from "react"
import { getAddressesAPI, createAddressAPI, updateAddressAPI, deleteAddressAPI } from "../api"

const ADDRESS_TYPES = [
  { id: "home", label: "Home", icon: "home" },
  { id: "work", label: "Work", icon: "apartment" },
  { id: "other", label: "Other", icon: "location_on" },
]

const emptyForm = { fullName: "", phone: "", street: "", city: "", landmark: "", label: "home" }

export default function Addresses() {
  const [addresses, setAddresses] = useState([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [editingId, setEditingId] = useState(null)
  const [form, setForm] = useState({ ...emptyForm })
  const [errors, setErrors] = useState({})
  const [saving, setSaving] = useState(false)

  useEffect(() => { fetchAddresses() }, [])

  async function fetchAddresses() {
    try { const res = await getAddressesAPI(); setAddresses(res.data || []) }
    catch { setAddresses([]) }
    finally { setLoading(false) }
  }

  function resetForm() { setForm({ ...emptyForm }); setEditingId(null); setShowForm(false); setErrors({}) }

  function startEdit(addr) {
    setForm({ fullName: addr.fullName || "", phone: addr.phone || "", street: addr.street || addr.addressLine || "", city: addr.city || "", landmark: addr.landmark || "", label: addr.label || "home" })
    setEditingId(addr._id || addr.id); setShowForm(true)
  }

  function validate() {
    const e = {}
    if (!form.fullName.trim()) e.fullName = "Required"
    if (!form.phone.trim()) e.phone = "Required"
    if (!form.street.trim()) e.street = "Required"
    if (!form.city.trim()) e.city = "Required"
    setErrors(e); return Object.keys(e).length === 0
  }

  async function handleSubmit(e) {
    e.preventDefault(); if (!validate()) return; setSaving(true)
    try { if (editingId) await updateAddressAPI(editingId, form); else await createAddressAPI(form); await fetchAddresses(); resetForm() }
    catch (err) { setErrors({ submit: err.message }) }
    finally { setSaving(false) }
  }

  async function handleDelete(id) {
    if (!confirm("Delete this address?")) return
    try { await deleteAddressAPI(id); setAddresses(prev => prev.filter(a => (a._id || a.id) !== id)) } catch {}
  }

  const inputClass = "w-full border rounded-xl px-4 py-3 text-sm font-label focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all bg-surface"
  const inputNormal = `${inputClass} border-outline-variant/30`
  const inputError = `${inputClass} border-error dark:border-red-500`

  if (loading) {
    return (
      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-8 min-h-screen">
        <h1 className="text-2xl font-headline font-extrabold text-primary mb-6 tracking-tight">My Addresses</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[1, 2].map(i => (<div key={i} className="bg-surface-container-lowest rounded-xl border border-outline-variant/10 p-5 animate-pulse"><div className="h-4 bg-surface-container-high rounded w-1/3 mb-3" /><div className="h-3 bg-surface-container-high rounded w-2/3 mb-2" /><div className="h-3 bg-surface-container-high rounded w-1/2" /></div>))}
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-8 min-h-screen">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-headline font-extrabold text-primary tracking-tight">My Addresses</h1>
        {!showForm && (
          <button onClick={() => { resetForm(); setShowForm(true) }} className="bg-velvet-gradient text-on-primary font-headline font-bold px-5 py-2.5 rounded-full text-xs cursor-pointer uppercase tracking-widest shadow-lg">+ Add</button>
        )}
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} className="bg-surface-container-lowest rounded-xl border border-outline-variant/10 p-6 mb-6">
          <h3 className="font-headline font-bold text-primary mb-5 uppercase tracking-widest text-sm">{editingId ? "Edit Address" : "Add New Address"}</h3>
          <div className="flex gap-2 mb-5">
            {ADDRESS_TYPES.map(t => (
              <button key={t.id} type="button" onClick={() => setForm({ ...form, label: t.id })}
                className={`px-4 py-2 rounded-full text-xs font-label font-bold border transition-all cursor-pointer capitalize flex items-center gap-1.5 uppercase tracking-widest ${
                  form.label === t.id ? "bg-primary/5 border-primary text-primary" : "border-outline-variant/30 text-on-surface-variant hover:border-primary/30"
                }`}>
                <span className="material-symbols-outlined text-[16px]">{t.icon}</span> {t.label}
              </button>
            ))}
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-label font-bold uppercase tracking-widest text-on-surface-variant mb-2">Full Name *</label>
              <input type="text" placeholder="Full name" value={form.fullName} onChange={e => setForm({ ...form, fullName: e.target.value })} className={errors.fullName ? inputError : inputNormal} />
              {errors.fullName && <p className="text-xs text-error mt-1">{errors.fullName}</p>}
            </div>
            <div>
              <label className="block text-xs font-label font-bold uppercase tracking-widest text-on-surface-variant mb-2">Phone *</label>
              <input type="tel" placeholder="+977 98XXXXXXXX" value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })} className={errors.phone ? inputError : inputNormal} />
              {errors.phone && <p className="text-xs text-error mt-1">{errors.phone}</p>}
            </div>
          </div>
          <div className="mt-3">
            <label className="block text-xs font-label font-bold uppercase tracking-widest text-on-surface-variant mb-2">Street Address *</label>
            <input type="text" placeholder="House no., Street, Area" value={form.street} onChange={e => setForm({ ...form, street: e.target.value })} className={errors.street ? inputError : inputNormal} />
            {errors.street && <p className="text-xs text-error mt-1">{errors.street}</p>}
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-3">
            <div>
              <label className="block text-xs font-label font-bold uppercase tracking-widest text-on-surface-variant mb-2">City *</label>
              <input type="text" placeholder="e.g. Kathmandu" value={form.city} onChange={e => setForm({ ...form, city: e.target.value })} className={errors.city ? inputError : inputNormal} />
              {errors.city && <p className="text-xs text-error mt-1">{errors.city}</p>}
            </div>
            <div>
              <label className="block text-xs font-label font-bold uppercase tracking-widest text-on-surface-variant mb-2">Landmark</label>
              <input type="text" placeholder="Near..." value={form.landmark} onChange={e => setForm({ ...form, landmark: e.target.value })} className={inputNormal} />
            </div>
          </div>
          {errors.submit && <p className="text-sm text-error mt-3 font-label">{errors.submit}</p>}
          <div className="flex gap-3 mt-5">
            <button type="submit" disabled={saving} className="bg-velvet-gradient text-on-primary font-headline font-bold px-8 py-3 rounded-full text-xs cursor-pointer disabled:opacity-50 uppercase tracking-widest shadow-lg">{saving ? "Saving..." : editingId ? "Update" : "Save"}</button>
            <button type="button" onClick={resetForm} className="border border-outline-variant/30 text-primary font-headline font-bold px-6 py-3 rounded-full text-xs hover:bg-surface-container-high cursor-pointer uppercase tracking-widest">Cancel</button>
          </div>
        </form>
      )}

      {addresses.length === 0 && !showForm ? (
        <div className="bg-surface-container-lowest rounded-xl border border-outline-variant/10 p-12 text-center">
          <span className="material-symbols-outlined text-outline text-5xl mb-4 block">location_on</span>
          <h2 className="text-lg font-headline font-bold text-primary mb-2">No saved addresses</h2>
          <p className="text-on-surface-variant text-sm font-label">Add an address to make checkout faster.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {addresses.map(addr => {
            const typeConfig = ADDRESS_TYPES.find(t => t.id === addr.label) || ADDRESS_TYPES[2]
            return (
              <div key={addr._id || addr.id} className="bg-surface-container-lowest rounded-xl border border-outline-variant/10 p-5 hover-lift">
                <div className="flex items-start justify-between mb-3">
                  <span className="inline-flex items-center gap-1.5 text-[10px] font-label font-bold bg-primary/5 text-primary px-3 py-1 rounded-full uppercase tracking-widest">
                    <span className="material-symbols-outlined text-[14px]">{typeConfig.icon}</span> {typeConfig.label}
                  </span>
                  <div className="flex gap-3">
                    <button onClick={() => startEdit(addr)} className="text-secondary text-xs font-label font-bold hover:underline cursor-pointer uppercase tracking-widest">Edit</button>
                    <button onClick={() => handleDelete(addr._id || addr.id)} className="text-error text-xs font-label font-bold hover:underline cursor-pointer uppercase tracking-widest">Delete</button>
                  </div>
                </div>
                <p className="text-sm font-headline font-bold text-primary">{addr.fullName}</p>
                <p className="text-sm text-on-surface-variant font-label mt-0.5">{addr.street || addr.addressLine}</p>
                <p className="text-sm text-on-surface-variant font-label">{addr.city}{addr.landmark ? ` — ${addr.landmark}` : ""}</p>
                <p className="text-sm text-on-surface-variant font-label mt-1">{addr.phone}</p>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
