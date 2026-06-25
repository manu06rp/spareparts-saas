'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { supabase } from '@/src/lib/supabase'

export default function EditPartPage() {

  const params = useParams()
  const router = useRouter()

  const [name, setName] = useState('')
  const [sku, setSku] = useState('')
  const [quantity, setQuantity] = useState(0)
  const [warehouse, setWarehouse] = useState('')
  const [minStock, setMinStock] = useState(0)

  useEffect(() => {
    fetchPart()
  }, [])

  const fetchPart = async () => {

    const { data, error } = await supabase
      .from('parts')
      .select('*')
      .eq('id', params.id)
      .single()

    if (error) {
      alert(error.message)
    } else {

      setName(data.name)
      setSku(data.sku)
      setQuantity(data.quantity)
      setWarehouse(data.warehouse)
      setMinStock(data.min_stock)
    }
  }

  const handleUpdate = async () => {

    const { error } = await supabase
      .from('parts')
      .update({
        name,
        sku,
        quantity,
        warehouse,
        min_stock: minStock,
      })
      .eq('id', params.id)

    if (error) {
      alert(error.message)
    } else {
      alert('Part updated successfully')
      router.push('/dashboard')
    }
  }

  return (
    <main className="min-h-screen bg-gray-100 p-10">

      <div className="max-w-xl mx-auto bg-white p-8 rounded-xl shadow">

        <h1 className="text-3xl font-bold text-blue-600">
          Edit Spare Part
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
            onClick={handleUpdate}
            className="w-full bg-blue-600 text-white py-3 rounded-lg"
          >
            Update Part
          </button>

        </div>

      </div>

    </main>
  )
}