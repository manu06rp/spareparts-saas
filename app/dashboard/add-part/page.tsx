'use client'

import { useState } from 'react'
import { supabase } from '@/src/lib/supabase'

export default function AddPartPage() {

  const [name, setName] = useState('')
  const [sku, setSku] = useState('')
  const [quantity, setQuantity] = useState(0)
  const [warehouse, setWarehouse] = useState('')
  const [minStock, setMinStock] = useState(0)

  const handleAddPart = async () => {
const { data: userData } = await supabase.auth.getUser()
    const { error } = await supabase
      .from('parts')
      .insert([
        {
          name,
          sku,
          quantity,
          warehouse,
          min_stock: minStock,
          user_id: userData.user?.id,
        }
      ])

    if (error) {
      alert(error.message)
    } else {
      alert('Part added successfully')

      setName('')
      setSku('')
      setQuantity(0)
      setWarehouse('')
      setMinStock(0)
    }
  }

  return (
    <main className="min-h-screen bg-gray-100 p-10">

      <div className="max-w-xl mx-auto bg-white p-8 rounded-xl shadow">

        <h1 className="text-3xl font-bold text-blue-600">
          Add Spare Part
        </h1>

        <div className="space-y-4 mt-6">

          <input
            type="text"
            placeholder="Part Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full border p-3 rounded-lg"
          />

          <input
            type="text"
            placeholder="SKU"
            value={sku}
            onChange={(e) => setSku(e.target.value)}
            className="w-full border p-3 rounded-lg"
          />

          <input
            type="number"
            placeholder="Quantity"
            value={quantity}
            onChange={(e) => setQuantity(Number(e.target.value))}
            className="w-full border p-3 rounded-lg"
          />

          <input
            type="text"
            placeholder="Warehouse"
            value={warehouse}
            onChange={(e) => setWarehouse(e.target.value)}
            className="w-full border p-3 rounded-lg"
          />

          <input
            type="number"
            placeholder="Minimum Stock"
            value={minStock}
            onChange={(e) => setMinStock(Number(e.target.value))}
            className="w-full border p-3 rounded-lg"
          />

          <button
            onClick={handleAddPart}
            className="w-full bg-blue-600 text-white py-3 rounded-lg"
          >
            Add Part
          </button>

        </div>
      </div>
    </main>
  )
}