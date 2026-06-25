'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { supabase } from '@/src/lib/supabase'

export default function DashboardPage() {
  const router = useRouter()

  const [parts, setParts] = useState<any[]>([])
  const [totalParts, setTotalParts] = useState(0)
  const [lowStockCount, setLowStockCount] = useState(0)
  const [warehouseCount, setWarehouseCount] = useState(0)
  const [search, setSearch] = useState('')

  useEffect(() => {
  checkUser()
  fetchParts()
}, [])
const checkUser = async () => {

  const { data } = await supabase.auth.getUser()

  if (!data.user) {
    router.push('/login')
  }
}
  const fetchParts = async () => {

    const { data: userData } = await supabase.auth.getUser()

const { data, error } = await supabase
  .from('parts')
  .select('*')
  .eq('user_id', userData.user?.id)

    if (error) {
      console.log(error.message)
    } else {

      setParts(data)

      setTotalParts(data.length)

      const lowStock = data.filter(
        (part) => part.quantity <= part.min_stock
      )

      setLowStockCount(lowStock.length)

      const warehouses = new Set(
        data.map((part) => part.warehouse)
      )

      setWarehouseCount(warehouses.size)
    }
  }

  const handleLogout = async () => {

  await supabase.auth.signOut()

  router.push('/login')
}

const handleDelete = async (id: number) => {

  const { error } = await supabase
    .from('parts')
    .delete()
    .eq('id', id)

  if (error) {
    alert(error.message)
  } else {
    fetchParts()
  }
}

return (
    <main className="min-h-screen bg-gray-100 p-10">

      <div className="flex items-center justify-between">

        <h1 className="text-4xl font-bold text-blue-600">
          Dashboard
        </h1>

        <div className="flex gap-3">

  <Link
    href="/dashboard/add-part"
    className="bg-blue-600 text-white px-5 py-3 rounded-lg"
  >
    Add Part
  </Link>

  <button
    onClick={handleLogout}
    className="bg-red-500 text-white px-5 py-3 rounded-lg"
  >
    Logout
  </button>

</div>

      </div>

      <div className="grid grid-cols-3 gap-6 mt-10">

        <div className="bg-white p-6 rounded-xl shadow">
          <h2 className="text-xl font-semibold">
            Total Parts
          </h2>

          <p className="text-3xl mt-4">
            {totalParts}
          </p>
        </div>

        <div className="bg-white p-6 rounded-xl shadow">
          <h2 className="text-xl font-semibold">
            Low Stock
          </h2>

          <p className="text-3xl mt-4 text-red-500">
            {lowStockCount}
          </p>
        </div>

        <div className="bg-white p-6 rounded-xl shadow">
          <h2 className="text-xl font-semibold">
            Warehouses
          </h2>

          <p className="text-3xl mt-4">
            {warehouseCount}
          </p>
        </div>

      </div>
      <div className="mt-10">

  <input
    type="text"
    placeholder="Search by part name or SKU..."
    value={search}
    onChange={(e) => setSearch(e.target.value)}
    className="w-full border p-4 rounded-xl"
  />

</div>

      <div className="bg-white rounded-xl shadow mt-10 overflow-hidden">

        <table className="w-full">

          <thead className="bg-gray-200">

            <tr>
              <th className="text-left p-4">Name</th>
              <th className="text-left p-4">SKU</th>
              <th className="text-left p-4">Quantity</th>
              <th className="text-left p-4">Warehouse</th>
              <th className="text-left p-4">Min Stock</th>
              <th className="text-left p-4">Action</th>
            </tr>

          </thead>

          <tbody>

            {parts
  .filter((part) => {

    const searchText = search.toLowerCase()

    return (
      part.name.toLowerCase().includes(searchText) ||
      part.sku.toLowerCase().includes(searchText)
    )
  })
  .map((part) => (

              <tr
                key={part.id}
                className={`border-t ${
                  part.quantity <= part.min_stock
                    ? 'bg-red-100'
                    : 'bg-white'
                }`}
              >

                <td className="p-4">{part.name}</td>

                <td className="p-4">{part.sku}</td>

                <td className="p-4">

                  <div className="flex items-center gap-2">

                    <span>
                      {part.quantity}
                    </span>

                    {part.quantity <= part.min_stock && (

                      <span className="bg-red-500 text-white text-xs px-2 py-1 rounded-full">
                        LOW STOCK
                      </span>

                    )}

                  </div>

                </td>

                <td className="p-4">{part.warehouse}</td>

                <td className="p-4">{part.min_stock}</td>

                <td className="p-4">

                  <div className="flex gap-2">

                    <Link
                      href={`/dashboard/edit-part/${part.id}`}
                      className="bg-blue-500 text-white px-4 py-2 rounded-lg"
                    >
                      Edit
                    </Link>

                    <button
                      onClick={() => handleDelete(part.id)}
                      className="bg-red-500 text-white px-4 py-2 rounded-lg"
                    >
                      Delete
                    </button>

                  </div>

                </td>

              </tr>

            ))}

          </tbody>

        </table>

      </div>

    </main>
  )
}