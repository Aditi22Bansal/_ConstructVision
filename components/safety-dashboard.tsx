"use client"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import {
  HardHat,
  AlertTriangle,
  CheckCircle2,
  Camera,
  User,
  Users,
  Clock,
  Calendar,
  ArrowUpRight,
  ArrowDownRight,
} from "lucide-react"

// Mock data for safety incidents
const safetyData = {
  score: 92,
  complianceRate: 96,
  ppeCompliance: 89,
  incidents: [
    {
      id: 1,
      type: "Missing PPE",
      zone: "Zone B",
      time: "10:23 AM",
      worker: "Worker #1042",
      status: "Resolved",
      severity: "high",
    },
    {
      id: 2,
      type: "Unauthorized Access",
      zone: "Zone A",
      time: "09:15 AM",
      worker: "Unknown",
      status: "Investigating",
      severity: "medium",
    },
    {
      id: 3,
      type: "Unsafe Scaffolding",
      zone: "Zone C",
      time: "08:45 AM",
      worker: "N/A",
      status: "Resolved",
      severity: "high",
    },
    {
      id: 4,
      type: "Missing PPE",
      zone: "Zone D",
      time: "Yesterday",
      worker: "Worker #3301",
      status: "Resolved",
      severity: "medium",
    },
  ],
  zones: [
    { id: "A", name: "Foundation", workers: 12, compliance: 98, trend: "up" },
    { id: "B", name: "Structural Frame", workers: 15, compliance: 87, trend: "down" },
    { id: "C", name: "Electrical", workers: 8, compliance: 95, trend: "up" },
    { id: "D", name: "Plumbing", workers: 6, compliance: 92, trend: "stable" },
  ],
  cameras: 12,
  activeWorkers: 41,
  safetyChecks: 24,
  lastUpdate: "2 minutes ago",
}

// Safety incident component
function SafetyIncident({ incident }) {
  const severityColors = {
    high: "bg-red-500",
    medium: "bg-amber-500",
    low: "bg-blue-500",
  }

  const statusColors = {
    Resolved: "bg-green-500/10 text-green-500 border-green-500/20",
    Investigating: "bg-amber-500/10 text-amber-500 border-amber-500/20",
    Pending: "bg-blue-500/10 text-blue-500 border-blue-500/20",
  }

  return (
    <div className="flex items-start space-x-3 p-3 rounded-md border mb-3">
      <div className={`${severityColors[incident.severity]} p-1.5 rounded-full flex-shrink-0`}>
        <AlertTriangle className="h-4 w-4 text-white" />
      </div>
      <div className="flex-1">
        <div className="flex justify-between">
          <h4 className="font-medium">{incident.type}</h4>
          <Badge className={statusColors[incident.status]}>{incident.status}</Badge>
        </div>
        <div className="grid grid-cols-2 gap-x-4 mt-2 text-sm">
          <div className="flex items-center text-muted-foreground">
            <Clock className="h-3.5 w-3.5 mr-1" />
            {incident.time}
          </div>
          <div className="flex items-center text-muted-foreground">
            <User className="h-3.5 w-3.5 mr-1" />
            {incident.worker}
          </div>
        </div>
      </div>
    </div>
  )
}

// Zone compliance component
function ZoneCompliance({ zone }) {
  return (
    <div className="flex items-center justify-between p-3 border rounded-md mb-2">
      <div>
        <div className="font-medium">
          Zone {zone.id}: {zone.name}
        </div>
        <div className="flex items-center text-sm text-muted-foreground">
          <Users className="h-3.5 w-3.5 mr-1" />
          {zone.workers} workers
        </div>
      </div>
      <div className="text-right">
        <div className="flex items-center">
          <span className="font-medium mr-1">{zone.compliance}%</span>
          {zone.trend === "up" && <ArrowUpRight className="h-4 w-4 text-green-500" />}
          {zone.trend === "down" && <ArrowDownRight className="h-4 w-4 text-red-500" />}
        </div>
        <div className="w-24 mt-1">
          <Progress value={zone.compliance} className="h-1.5" />
        </div>
      </div>
    </div>
  )
}

export default function SafetyDashboard() {
  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold">Safety Monitoring</h1>
          <p className="text-muted-foreground">Real-time safety compliance tracking</p>
        </div>
        <div className="flex items-center space-x-2">
          <Button variant="outline" size="sm">
            <Calendar className="h-4 w-4 mr-2" />
            View History
          </Button>
          <Button size="sm">
            <Camera className="h-4 w-4 mr-2" />
            Live Camera Feed
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Safety Score</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center">
              <div className="text-3xl font-bold mr-2">{safetyData.score}</div>
              <CheckCircle2 className="h-6 w-6 text-green-500" />
            </div>
            <p className="text-xs text-muted-foreground">OSHA Compliance Rating</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">PPE Compliance</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center">
              <div className="text-3xl font-bold mr-2">{safetyData.ppeCompliance}%</div>
              <HardHat className="h-6 w-6 text-amber-500" />
            </div>
            <Progress value={safetyData.ppeCompliance} className="h-2 mt-2" />
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Active Workers</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center">
              <div className="text-3xl font-bold mr-2">{safetyData.activeWorkers}</div>
              <Users className="h-6 w-6 text-blue-500" />
            </div>
            <p className="text-xs text-muted-foreground">Across {safetyData.zones.length} zones</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Safety Checks</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center">
              <div className="text-3xl font-bold mr-2">{safetyData.safetyChecks}</div>
              <CheckCircle2 className="h-6 w-6 text-green-500" />
            </div>
            <p className="text-xs text-muted-foreground">Completed today</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>Safety Incidents</CardTitle>
            <CardDescription>Recent safety violations and incidents</CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="active">
              <TabsList className="mb-4">
                <TabsTrigger value="active">Active</TabsTrigger>
                <TabsTrigger value="resolved">Resolved</TabsTrigger>
                <TabsTrigger value="all">All Incidents</TabsTrigger>
              </TabsList>
              <TabsContent value="active">
                {safetyData.incidents
                  .filter((incident) => incident.status !== "Resolved")
                  .map((incident) => (
                    <SafetyIncident key={incident.id} incident={incident} />
                  ))}
              </TabsContent>
              <TabsContent value="resolved">
                {safetyData.incidents
                  .filter((incident) => incident.status === "Resolved")
                  .map((incident) => (
                    <SafetyIncident key={incident.id} incident={incident} />
                  ))}
              </TabsContent>
              <TabsContent value="all">
                {safetyData.incidents.map((incident) => (
                  <SafetyIncident key={incident.id} incident={incident} />
                ))}
              </TabsContent>
            </Tabs>

            <div className="text-xs text-muted-foreground mt-4 text-right">Last updated: {safetyData.lastUpdate}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Zone Compliance</CardTitle>
            <CardDescription>Safety compliance by construction zone</CardDescription>
          </CardHeader>
          <CardContent>
            {safetyData.zones.map((zone) => (
              <ZoneCompliance key={zone.id} zone={zone} />
            ))}

            <Button variant="outline" className="w-full mt-4 text-sm">
              View Detailed Report
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

