import { NextResponse } from 'next/server'

// Mock data - replace with actual database calls
const projects = [
  {
    id: 1,
    name: "Website Redesign",
    description: "Complete overhaul of company website",
    status: "In Progress",
    progress: 65,
    dueDate: "2024-02-15",
    team: ["JD", "SM", "AB"],
    priority: "High",
    createdAt: new Date().toISOString(),
  },
  // Add more mock data as needed
]

export async function GET() {
  try {
    // In a real app, you would fetch from your database
    return NextResponse.json({ projects })
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch projects' },
      { status: 500 }
    )
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    
    // In a real app, you would save to your database
    const newProject = {
      id: projects.length + 1,
      ...body,
      createdAt: new Date().toISOString(),
    }
    
    projects.push(newProject)
    
    return NextResponse.json({ project: newProject }, { status: 201 })
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to create project' },
      { status: 500 }
    )
  }
}
