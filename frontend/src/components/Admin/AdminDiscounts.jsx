import { useState } from "react"

const defaultDiscounts = [
  { id: 1, code: "WELCOME10", discount: 10, type: "percent", minOrder: 100, active: true, usageLimit: 100, used: 23 },
  { id: 2, code: "FLAT50", discount: 50, type: "flat", minOrder: 300, active: true, usageLimit: 50, used: 12 },
  { id: 3, code: "SUMMER20", discount: 20, type: "percent", minOrder: 200, active: false, usageLimit: 200, used: 187 },
  { id: 4, code: "FREE25", discount: 25, type: "flat", minOrder: 0, active: true, usageLimit: 500, used: 45 },
  { id: 5, code: "MEGA30", discount: 30, type: "percent", minOrder: 500, active: true, usageLimit: 100, used: 8 },
]

export default function AdminDiscounts() {
  const [discounts, setDiscounts] = useState(defaultDiscounts)
  const [showForm, setShowForm] = useState(false)
  const [form, setForm] = useState({ code: "", discount: "", type: "percent", minOrder: "", usageLimit: "" })

  function addDiscount(e) {
    e.preventDefault()
    if (!form.code || !form.discount) return
    // TODO: POST /api/admin/discounts
    setDiscounts(prev => [...prev, {
      id: Date.now(),
      code: form.code.toUpperCase(),
      discount: Number(form.discount),
      type: form.type,
      minOrder: Number(form.minOrder || 0),
      active: true,
      usageLimit: Number(form.usageLimit || 100),
      used: 0,
    }])
    setForm({ code: "", discount: "", type: "percent", minOrder: "", usageLimit: "" })
    setShowForm(false)
  }

  function toggleActive(id) {
    // TODO: PATCH /api/admin/discounts/:id
    setDiscounts(prev => prev.map(d => d.id === id ? { ...d, active: !d.active } : d))
  }

  function deleteDiscount(id) {
    // TODO: DELETE /api/admin/discounts/:id
    if (confirm("Delete this discount code?")) {
      setDiscounts(prev => prev.filter(d => d.id !== id))
    }
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-800 dark:text-white">Discount Codes</h1>
        <button
          onClick={() => setShowForm(!showForm)}
          className="bg-green-600 hover:bg-green-700 text-white font-medium px-4 py-2 rounded-lg text-sm"
        >
          {showForm ? "Cancel" : "+ Add Discount"}
        </button>
      </div>

      {showForm && (
        <form onSubmit={addDiscount} className="bg-white dark:bg-gray-800 rounded-xl border dark:border-gray-700 p-5 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <input
              type="text" placeholder="Coupon code *" value={form.code}
              onChange={e => setForm({ ...form, code: e.target.value })}
              className="border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-lg px-3 py-2 text-sm uppercase"
              required
            />
            <div className="flex gap-2">
              <input
                type="number" placeholder="Value *" value={form.discount}
                onChange={e => setForm({ ...form, discount: e.target.value })}
                className="flex-1 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-lg px-3 py-2 text-sm"
                required
              />
              <select
                value={form.type} onChange={e => setForm({ ...form, type: e.target.value })}
                className="border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-lg px-3 py-2 text-sm"
              >
                <option value="percent">%</option>
                <option value="flat">Rs. Flat</option>
              </select>
            </div>
            <input
              type="number" placeholder="Min order amount" value={form.minOrder}
              onChange={e => setForm({ ...form, minOrder: e.target.value })}
              className="border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-lg px-3 py-2 text-sm"
            />
            <input
              type="number" placeholder="Usage limit" value={form.usageLimit}
              onChange={e => setForm({ ...form, usageLimit: e.target.value })}
              className="border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-lg px-3 py-2 text-sm"
            />
          </div>
          <button type="submit" className="mt-4 bg-green-600 hover:bg-green-700 text-white font-medium px-6 py-2 rounded-lg text-sm">
            Create Discount
          </button>
        </form>
      )}

      {/* discount codes table */}
      <div className="bg-white dark:bg-gray-800 rounded-xl border dark:border-gray-700 overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="text-left text-gray-500 dark:text-gray-400 bg-gray-50 dark:bg-gray-900">
              <th className="px-4 py-3">Code</th>
              <th className="px-4 py-3">Discount</th>
              <th className="px-4 py-3">Min Order</th>
              <th className="px-4 py-3">Usage</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {discounts.map(d => (
              <tr key={d.id} className="border-t dark:border-gray-700">
                <td className="px-4 py-3">
                  <span className="font-mono font-bold text-green-700 dark:text-green-400 bg-green-50 dark:bg-green-900/40 px-2 py-0.5 rounded text-xs">
                    {d.code}
                  </span>
                </td>
                <td className="px-4 py-3 text-gray-800 dark:text-gray-200">
                  {d.type === "percent" ? `${d.discount}%` : `Rs.${d.discount}`}
                </td>
                <td className="px-4 py-3 text-gray-500 dark:text-gray-400">
                  {d.minOrder > 0 ? `Rs.${d.minOrder}` : "None"}
                </td>
                <td className="px-4 py-3 text-gray-500 dark:text-gray-400">
                  {d.used}/{d.usageLimit}
                </td>
                <td className="px-4 py-3">
                  <span className={`text-xs font-medium px-2 py-0.5 rounded ${d.active ? "bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-400" : "bg-gray-100 text-gray-500 dark:bg-gray-700 dark:text-gray-400"}`}>
                    {d.active ? "Active" : "Inactive"}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <div className="flex gap-2">
                    <button onClick={() => toggleActive(d.id)} className="text-blue-600 text-xs font-medium hover:underline">
                      {d.active ? "Disable" : "Enable"}
                    </button>
                    <button onClick={() => deleteDiscount(d.id)} className="text-red-500 text-xs font-medium hover:underline">
                      Delete
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
