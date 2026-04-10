import { useState, useEffect } from "react"
import { getAddressesAPI, createAddressAPI, updateAddressAPI, deleteAddressAPI } from "../api"

const ADDRESS_TYPES = [
  { id: "home", label: "Home", icon: "\u{1F3E0}" },
  { id: "work", label: "Work", icon: "\u{1F3E2}" },
  { id: "other", label: "Other", icon: "\u{1F4CD}" },
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

  useEffect(() => {
    fetchAddresses()
  }, [])

  async function fetchAddresses() {
    try {
      const res = await getAddressesAPI()
      setAddresses(res.data || [])
    } catch {
      setAddresses([])
    } finally {
      setLoading(false)
    }
  }

  function resetForm() {
    setForm({ ...emptyForm })
    setEditingId(null)
    setShowForm(false)
    setErrors({})
  }

  function startEdit(addr) {
    setForm({
      fullName: addr.fullName || "",
      phone: addr.phone || "",
      street: addr.street || addr.addressLine || "",
      city: addr.city || "",
      landmark: addr.landmark || "",
      label: addr.label || "home",
    })
    setEditingId(addr._id || addr.id)
    setShowForm(true)
  }

  function validate() {
    const e = {}
    if (!form.fullName.trim()) e.fullName = "Required"
    if (!form.phone.trim()) e.phone = "Required"
    if (!form.street.trim()) e.street = "Required"
    if (!form.city.trim()) e.city = "Required"
    setErrors(e)
    return Object.keys(e).length === 0
  }

  async function handleSubmit(e) {
    e.preventDefault()
    if (!validate()) return
    setSaving(true)
    try {
      if (editingId) {
        await updateAddressAPI(editingId, form)
      } else {
        await createAddressAPI(form)
      }
      await fetchAddresses()
      resetForm()
    } catch (err) {
      setErrors({ submit: err.message })
    } finally {
      setSaving(false)
    }
  }

  async function handleDelete(id) {
    if (!confirm("Delete this address?")) return
    try {
      await deleteAddressAPI(id)
      setAddresses(prev => prev.filter(a => (a._id || a.id) !== id))
    } catch {}
  }

  const inputClass = "w-full border rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
  const inputNormal = `${inputClass} border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white`
  const inputError = `${inputClass} border-red-400 dark:border-red-500 dark:bg-gray-700 dark:text-white`

  if (loading) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-8 dark:bg-gray-900 min-h-screen">
        <h1 className="text-2xl font-bold text-gray-800 dark:text-white mb-6">My Addresses</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[1, 2].map(i => (
            <div key={i} className="bg-white dark:bg-gray-800 rounded-xl border border-gray-100 dark:border-gray-700 p-4 animate-pulse">
              <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/3 mb-3" />
              <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-2/3 mb-2" />
              <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-1/2" />
            </div>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-3xl mx-auto px-4 py-8 dark:bg-gray-900 min-h-screen">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-800 dark:text-white">My Addresses</h1>
        {!showForm && (
          <button
            onClick={() => { resetForm(); setShowForm(true) }}
            className="bg-green-600 hover:bg-green-700 text-white font-medium px-4 py-2 rounded-lg text-sm cursor-pointer"
          >
            + Add Address
          </button>
        )}
      </div>

      {/* Add/Edit Form */}
      {showForm && (
        <form onSubmit={handleSubmit} className="bg-white dark:bg-gray-800 rounded-xl border border-gray-100 dark:border-gray-700 p-5 mb-6">
          <h3 className="font-bold text-gray-800 dark:text-white mb-4">
            {editingId ? "Edit Address" : "Add New Address"}
          </h3>

          {/* Address type */}
          <div className="flex gap-2 mb-4">
            {ADDRESS_TYPES.map(t => (
              <button
                key={t.id}
                type="button"
                onClick={() => setForm({ ...form, label: t.id })}
                className={`px-4 py-2 rounded-full text-xs font-medium border transition-all cursor-pointer ${
                  form.label === t.id
                    ? "bg-green-100 dark:bg-green-900/40 border-green-500 text-green-700 dark:text-green-400"
                    : "border-gray-200 dark:border-gray-600 text-gray-500 dark:text-gray-400 hover:border-gray-300"
                }`}
              >
                {t.icon} {t.label}
              </button>
            ))}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">Full Name *</label>
              <input type="text" placeholder="Full name" value={form.fullName} onChange={e => setForm({ ...form, fullName: e.target.value })} className={errors.fullName ? inputError : inputNormal} />
              {errors.fullName && <p className="text-xs text-red-500 mt-0.5">{errors.fullName}</p>}
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">Phone *</label>
              <input type="tel" placeholder="+977 98XXXXXXXX" value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })} className={errors.phone ? inputError : inputNormal} />
              {errors.phone && <p className="text-xs text-red-500 mt-0.5">{errors.phone}</p>}
            </div>
          </div>

          <div className="mt-3">
            <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">Street Address *</label>
            <input type="text" placeholder="House no., Street, Area" value={form.street} onChange={e => setForm({ ...form, street: e.target.value })} className={errors.street ? inputError : inputNormal} />
            {errors.street && <p className="text-xs text-red-500 mt-0.5">{errors.street}</p>}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-3">
            <div>
              <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">City *</label>
              <input type="text" placeholder="e.g. Kathmandu" value={form.city} onChange={e => setForm({ ...form, city: e.target.value })} className={errors.city ? inputError : inputNormal} />
              {errors.city && <p className="text-xs text-red-500 mt-0.5">{errors.city}</p>}
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">Landmark</label>
              <input type="text" placeholder="Near..." value={form.landmark} onChange={e => setForm({ ...form, landmark: e.target.value })} className={inputNormal} />
            </div>
          </div>

          {errors.submit && <p className="text-sm text-red-500 mt-3">{errors.submit}</p>}

          <div className="flex gap-3 mt-4">
            <button type="submit" disabled={saving} className="bg-green-600 hover:bg-green-700 disabled:opacity-50 text-white font-medium px-6 py-2.5 rounded-lg text-sm cursor-pointer">
              {saving ? "Saving..." : editingId ? "Update Address" : "Save Address"}
            </button>
            <button type="button" onClick={resetForm} className="border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 px-4 py-2.5 rounded-lg text-sm hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer">
              Cancel
            </button>
          </div>
        </form>
      )}

      {/* Address cards */}
      {addresses.length === 0 && !showForm ? (
        <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-100 dark:border-gray-700 p-8 sm:p-12 text-center">
          <div className="text-5xl mb-4">{"\u{1F4CD}"}</div>
          <h2 className="text-lg font-bold text-gray-800 dark:text-white mb-2">No saved addresses</h2>
          <p className="text-gray-500 dark:text-gray-400 text-sm">Add an address to make checkout faster.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {addresses.map(addr => {
            const typeConfig = ADDRESS_TYPES.find(t => t.id === addr.label) || ADDRESS_TYPES[2]
            return (
              <div key={addr._id || addr.id} className="bg-white dark:bg-gray-800 rounded-xl border border-gray-100 dark:border-gray-700 p-4 relative">
                <div className="flex items-start justify-between mb-2">
                  <span className="inline-flex items-center gap-1 text-xs font-semibold bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 px-2.5 py-1 rounded-full">
                    {typeConfig.icon} {typeConfig.label}
                  </span>
                  <div className="flex gap-2">
                    <button onClick={() => startEdit(addr)} className="text-blue-600 text-xs font-medium hover:underline cursor-pointer">Edit</button>
                    <button onClick={() => handleDelete(addr._id || addr.id)} className="text-red-500 text-xs font-medium hover:underline cursor-pointer">Delete</button>
                  </div>
                </div>
                <p className="text-sm font-semibold text-gray-800 dark:text-gray-200">{addr.fullName}</p>
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-0.5">{addr.street || addr.addressLine}</p>
                <p className="text-sm text-gray-600 dark:text-gray-400">{addr.city}{addr.landmark ? ` - ${addr.landmark}` : ""}</p>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">{addr.phone}</p>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
