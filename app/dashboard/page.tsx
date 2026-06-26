'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { supabase } from '@/src/lib/supabase'
import ThemeToggle from '@/src/components/theme-toggle'

import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer
} from 'recharts'

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

    const { data: userData } =
      await supabase.auth.getUser()

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

  const exportCSV = () => {

    const headers = [
      'Name',
      'SKU',
      'Quantity',
      'Warehouse',
      'Min Stock'
    ]

    const rows = parts.map((part) => [
      part.name,
      part.sku,
      part.quantity,
      part.warehouse,
      part.min_stock
    ])

    const csvContent = [
      headers.join(','),
      ...rows.map((row) => row.join(','))
    ].join('\n')

    const blob = new Blob(
      [csvContent],
      { type: 'text/csv;charset=utf-8;' }
    )

    const url = URL.createObjectURL(blob)

    const link = document.createElement('a')

    link.href = url

    link.setAttribute(
      'download',
      'inventory.csv'
    )

    document.body.appendChild(link)

    link.click()

    document.body.removeChild(link)
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

  const chartData = [
    {
      name: 'Safe Stock',
      value: totalParts - lowStockCount
    },
    {
      name: 'Low Stock',
      value: lowStockCount
    }
  ]

  return (

    <main className="min-h-screen bg-gray-100 dark:bg-gray-900 p-10">

      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">

        <h1 className="text-4xl font-bold text-blue-600 dark:text-blue-400">
          Dashboard
        </h1>
    <div className="flex items-center justify-end md:flex-1">
  <ThemeToggle />
</div>
        <div className="flex flex-wrap gap-3 items-center">

          <Link
            href="/dashboard/add-part"
            className="bg-blue-600 text-white px-5 py-3 rounded-lg"
          >
            Add Part
          </Link>

          <button
            onClick={exportCSV}
            className="bg-green-600 text-white px-5 py-3 rounded-lg"
          >
            Export CSV
          </button>

          <button
            onClick={handleLogout}
            className="bg-red-500 text-white px-5 py-3 rounded-lg"
          >
            Logout
          </button>

        </div>

      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-10">

        <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow">

          <h2 className="text-xl font-semibold dark:text-white">
            Total Parts
          </h2>

          <p className="text-3xl mt-4 dark:text-white">
            {totalParts}
          </p>

        </div>

        <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow">

          <h2 className="text-xl font-semibold dark:text-white">
            Low Stock
          </h2>

          <p className="text-3xl mt-4 text-red-500">
            {lowStockCount}
          </p>

        </div>

        <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow">

          <h2 className="text-xl font-semibold dark:text-white">
            Warehouses
          </h2>

          <p className="text-3xl mt-4 dark:text-white">
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
          className="w-full border p-4 rounded-xl dark:bg-gray-800 dark:text-white dark:border-gray-700"
        />

      </div>

      <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow mt-10">

        <h2 className="text-2xl font-bold mb-6 dark:text-white">
          Inventory Analytics
        </h2>

        <div className="w-full h-[300px]">

          <ResponsiveContainer width="100%" height="100%">

            <PieChart>

              <Pie
                data={chartData}
                dataKey="value"
                nameKey="name"
                outerRadius={100}
                label
              >

                <Cell fill="#22c55e" />
                <Cell fill="#ef4444" />

              </Pie>

              <Tooltip />

            </PieChart>

          </ResponsiveContainer>

        </div>

      </div>

      <div className="bg-white dark:bg-gray-800 rounded-xl shadow mt-10 overflow-x-auto">

        <table className="min-w-full">

          <thead className="bg-gray-200 dark:bg-gray-700">

            <tr>

              <th className="text-left p-4 dark:text-white">
                Name
              </th>

              <th className="text-left p-4 dark:text-white">
                SKU
              </th>

              <th className="text-left p-4 dark:text-white">
                Quantity
              </th>

              <th className="text-left p-4 dark:text-white">
                Warehouse
              </th>

              <th className="text-left p-4 dark:text-white">
                Min Stock
              </th>

              <th className="text-left p-4 dark:text-white">
                Action
              </th>

            </tr>

          </thead>

          <tbody>

            {parts
              .filter((part) => {

                const searchText =
                  search.toLowerCase()

                return (
                  part.name
                    .toLowerCase()
                    .includes(searchText) ||

                  part.sku
                    .toLowerCase()
                    .includes(searchText)
                )
              })
              .map((part) => (

                <tr
  key={part.id}
  className={`border-t ${
    part.quantity <= part.min_stock
      ? 'bg-red-100 text-black'
      : 'bg-white dark:bg-gray-800 text-black dark:text-white'
  }`}
>

                  <td className="p-4">
                    {part.name}
                  </td>

                  <td className="p-4">
                    {part.sku}
                  </td>

                  <td className="p-4">

                    <div className="flex items-center gap-2">

                      <span
  className={
    part.quantity <= part.min_stock
      ? 'text-black'
      : 'dark:text-white'
  }
>
  {part.quantity}
</span>

                      {part.quantity <= part.min_stock && (

                        <span className="bg-red-500 text-white text-xs px-2 py-1 rounded-full">
                          LOW STOCK
                        </span>

                      )}

                    </div>

                  </td>

                  <td className="p-4">
                    {part.warehouse}
                  </td>

                  <td className="p-4">
                    {part.min_stock}
                  </td>

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