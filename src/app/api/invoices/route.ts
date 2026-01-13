import { NextResponse } from 'next/server'

// Mock data - replace with actual database calls
const invoices = [
  {
    id: "INV-001",
    clientId: 1,
    client: "Acme Corp",
    amount: 2500.00,
    status: "Paid",
    dueDate: "2024-01-15",
    issueDate: "2024-01-01",
    items: [
      { description: "Web Development", quantity: 1, rate: 2500.00 }
    ],
    createdAt: new Date().toISOString(),
  },
  // Add more mock data as needed
]

export async function GET() {
  try {
    // In a real app, you would fetch from your database
    return NextResponse.json({ invoices })
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch invoices' },
      { status: 500 }
    )
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    
    // In a real app, you would save to your database
    const newInvoice = {
      id: `INV-${String(invoices.length + 1).padStart(3, '0')}`,
      ...body,
      createdAt: new Date().toISOString(),
    }
    
    invoices.push(newInvoice)
    
    return NextResponse.json({ invoice: newInvoice }, { status: 201 })
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to create invoice' },
      { status: 500 }
    )
  }
}
