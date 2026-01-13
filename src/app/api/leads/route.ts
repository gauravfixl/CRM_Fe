import { NextResponse } from 'next/server'

// Mock data - replace with actual database calls
const leads = [
  {
    id: 1,
    name: "John Smith",
    email: "john@example.com",
    company: "Tech Corp",
    status: "New",
    value: 5000,
    source: "Website",
    createdAt: new Date().toISOString(),
  },
  // Add more mock data as needed
]

export async function GET() {
  try {
    // In a real app, you would fetch from your database
    return NextResponse.json({ leads })
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch leads' },
      { status: 500 }
    )
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    
    // In a real app, you would save to your database
    const newLead = {
      id: leads.length + 1,
      ...body,
      createdAt: new Date().toISOString(),
    }
    
    leads.push(newLead)
    
    return NextResponse.json({ lead: newLead }, { status: 201 })
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to create lead' },
      { status: 500 }
    )
  }
}
