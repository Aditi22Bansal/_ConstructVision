"use client"

import { useState, useEffect, ReactNode } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger } from "@/components/ui/select"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { AlertTriangle, ArrowLeft, Search, Filter, Clock, Calendar, CheckCircle2 } from "lucide-react"
import type { MockConstructionData } from "@/components/mock-data-generator"

// Extended alert type with more details for the alerts page\
type BaseAlert = MockConstructionData["alerts"][0];

interface ExtendedAlert extends BaseAlert {
  type: string
  location?: string
  status: "active" | "acknowledged" | "resolved"
  assignedTo?: string
  details?: string
}

// Sample extended alerts data
const sampleAlerts: ExtendedAlert[] = [
  {
    id: 1,
    type: "safety",
    message: "Worker without helmet detected in Zone B",
    severity: "high",
    time: "10:23 AM",
    location: "Zone B, Section 3",
    status: "active",
    details: "Camera #4 detected a worker without proper PPE. Safety protocol violation code S-112.",
  },
  {
    id: 2,
    type: "inventory",
    message: "Cement stock below threshold (15%)",
    severity: "medium",
    time: "09:45 AM",
    location: "Main Storage Area",
    status: "acknowledged",
    assignedTo: "John Smith",
    details: "Current stock: 120 bags. Minimum required: 200 bags. Reorder has been initiated.",
  },
  {
    id: 3,
    type: "weather",
    message: "Strong winds expected (35mph) at 2:00 PM",
    severity: "medium",
    time: "08:30 AM",
    status: "active",
    details:
      "Weather forecast indicates strong winds developing by early afternoon. Secure all loose materials and equipment.",
  },
  {
    id: 4,
    type: "equipment",
    message: "Crane #2 maintenance overdue by 3 days",
    severity: "high",
    time: "Yesterday, 4:15 PM",
    location: "East Section",
    status: "acknowledged",
    assignedTo: "Maintenance Team",
    details:
      "Regular 200-hour maintenance check is overdue. Equipment should be taken offline until inspection is complete.",
  },
  {
    id: 5,
    type: "safety",
    message: "Unauthorized access to restricted area",
    severity: "high",
    time: "Yesterday, 2:30 PM",
    location: "Zone D, Electrical Room",
    status: "resolved",
    details:
      "Security badge #A-4432 used to access restricted area without proper clearance. Security has been notified.",
  },
  {
    id: 6,
    type: "schedule",
    message: "Foundation inspection delayed by 2 days",
    severity: "medium",
    time: "2 days ago",
    status: "resolved",
    assignedTo: "Project Manager",
    details: "City inspector rescheduled due to backlog. New inspection date set for Friday, 10:00 AM.",
  },
  {
    id: 7,
    type: "inventory",
    message: "Steel rebar delivery incomplete (missing 20%)",
    severity: "medium",
    time: "2 days ago",
    location: "Receiving Dock",
    status: "resolved",
    details: "Supplier confirmed partial shipment due to stock issues. Remaining materials will arrive next Tuesday.",
  },
  {
    id: 8,
    type: "safety",
    message: "Smoke detected in electrical panel",
    severity: "high",
    time: "3 days ago",
    location: "Zone A, Main Building",
    status: "resolved",
    details:
      "Emergency response team found faulty wiring in distribution panel A-3. Panel has been replaced and certified safe.",
  },
  {
    id: 9,
    type: "weather",
    message: "Heavy rain forecast for next 48 hours",
    severity: "low",
    time: "3 days ago",
    status: "resolved",
    details: "Weather protection measures implemented. Drainage systems checked and cleared.",
  },
  {
    id: 10,
    type: "equipment",
    message: "Concrete mixer #3 showing error code E-42",
    severity: "medium",
    time: "4 days ago",
    location: "Mixing Station",
    status: "resolved",
    assignedTo: "Technical Support",
    details: "Error indicates potential motor overheating. Equipment taken offline for inspection and repair.",
  },
  {
    id: 11,
    type: "safety",
    message: "Trip hazard identified near stairwell",
    severity: "medium",
    time: "4 days ago",
    location: "Zone C, Floor 2",
    status: "resolved",
    details: "Exposed wiring creating trip hazard. Area has been cordoned off and scheduled for immediate correction.",
  },
  {
    id: 12,
    type: "schedule",
    message: "Plumbing installation behind schedule by 3 days",
    severity: "low",
    time: "5 days ago",
    location: "Zone B, Floors 1-3",
    status: "resolved",
    assignedTo: "Scheduling Team",
    details: "Delay due to late material delivery. Recovery plan implemented with additional crew assigned.",
  },
]

// Alert detail component
function AlertDetail({ alert, onBack }: { alert: ExtendedAlert | null; onBack: () => void }) {
  if (!alert) return null

  const severityColors = {
    high: "bg-red-500 text-white",
    medium: "bg-amber-500 text-white",
    low: "bg-blue-500 text-white",
  }

  const statusColors = {
    active: "bg-red-100 text-red-800 border-red-200",
    acknowledged: "bg-amber-100 text-amber-800 border-amber-200",
    resolved: "bg-green-100 text-green-800 border-green-200",
  }

  const statusIcons = {
    active: <AlertTriangle className="h-4 w-4 mr-1" />,
    acknowledged: <Clock className="h-4 w-4 mr-1" />,
    resolved: <CheckCircle2 className="h-4 w-4 mr-1" />,
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <Button variant="ghost" size="sm" onClick={onBack}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Alerts
          </Button>
          <Badge className={severityColors[alert.severity]}>{alert.severity.toUpperCase()} PRIORITY</Badge>
        </div>
        <CardTitle className="text-xl mt-4">{alert.message}</CardTitle>
        <CardDescription className="flex items-center mt-1">
          <Calendar className="h-4 w-4 mr-1 text-muted-foreground" />
          {alert.time}
          {alert.location && (
            <>
              <span className="mx-2">•</span>
              <span>{alert.location}</span>
            </>
          )}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center">
          <Badge variant="outline" className={`${statusColors[alert.status]} border`}>
            {statusIcons[alert.status]}
            {alert.status.charAt(0).toUpperCase() + alert.status.slice(1)}
          </Badge>
          <Badge variant="outline" className="ml-2">
            {alert.type.charAt(0).toUpperCase() + alert.type.slice(1)}
          </Badge>
          {alert.assignedTo && (
            <span className="ml-auto text-sm text-muted-foreground">
              Assigned to: <span className="font-medium">{alert.assignedTo}</span>
            </span>
          )}
        </div>

        <div className="bg-muted p-4 rounded-md">
          <h4 className="font-medium mb-2">Details</h4>
          <p className="text-sm">{alert.details}</p>
        </div>

        <div className="flex space-x-2 pt-4">
          <Button variant="default">Mark as Resolved</Button>
          <Button variant="outline">Assign</Button>
          <Button variant="outline">Add Note</Button>
        </div>
      </CardContent>
    </Card>
  )
}

// Alert list item component
function AlertItem({
  alert,
  onClick,
}: {
  alert: ExtendedAlert
  onClick: (alert: ExtendedAlert) => void
}) {
  const severityColors = {
    high: "bg-red-500",
    medium: "bg-amber-500",
    low: "bg-blue-500",
  }

  const statusColors = {
    active: "bg-red-100 text-red-800 border-red-200",
    acknowledged: "bg-amber-100 text-amber-800 border-amber-200",
    resolved: "bg-green-100 text-green-800 border-green-200",
  }

  return (
    <div
      className="flex items-start space-x-3 p-3 rounded-md border hover:bg-muted/50 cursor-pointer transition-colors"
      onClick={() => onClick(alert)}
    >
      <div className={`${severityColors[alert.severity]} p-1.5 rounded-full flex-shrink-0 mt-0.5`}>
        <AlertTriangle className="h-3.5 w-3.5 text-white" />
      </div>
      <div className="flex-1">
        <div className="flex items-start justify-between">
          <p className="font-medium">{alert.message}</p>
          <Badge variant="outline" className={`ml-2 text-xs ${statusColors[alert.status]}`}>
            {alert.status}
          </Badge>
        </div>
        <div className="flex items-center mt-1 text-sm text-muted-foreground">
          <span>{alert.time}</span>
          {alert.location && (
            <>
              <span className="mx-1">•</span>
              <span>{alert.location}</span>
            </>
          )}
        </div>
        <div className="flex items-center mt-2">
          <Badge variant="outline" className="text-xs">
            {alert.type}
          </Badge>
          {alert.assignedTo && (
            <span className="ml-2 text-xs text-muted-foreground">Assigned to: {alert.assignedTo}</span>
          )}
        </div>
      </div>
    </div>
  )
}

export default function AlertsPage() {
  const router = useRouter()
  const [alerts, setAlerts] = useState<ExtendedAlert[]>(sampleAlerts)
  const [filteredAlerts, setFilteredAlerts] = useState<ExtendedAlert[]>(sampleAlerts)
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedAlert, setSelectedAlert] = useState<ExtendedAlert | null>(null)
  const [filterType, setFilterType] = useState<string>("all")
  const [filterSeverity, setFilterSeverity] = useState<string>("all")
  const [filterStatus, setFilterStatus] = useState<string>("all")
  const [activeTab, setActiveTab] = useState<string>("all")

  // Filter alerts based on search query and filters
  useEffect(() => {
    let result = [...alerts]

    // Apply search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      result = result.filter(
        (alert) =>
          alert.message.toLowerCase().includes(query) ||
          alert.type.toLowerCase().includes(query) ||
          (alert.location && alert.location.toLowerCase().includes(query)),
      )
    }

    // Apply type filter
    if (filterType !== "all") {
      result = result.filter((alert) => alert.type === filterType)
    }

    // Apply severity filter
    if (filterSeverity !== "all") {
      result = result.filter((alert) => alert.severity === filterSeverity)
    }

    // Apply status filter
    if (filterStatus !== "all") {
      result = result.filter((alert) => alert.status === filterStatus)
    }

    // Apply tab filter
    if (activeTab === "active") {
      result = result.filter((alert) => alert.status === "active")
    } else if (activeTab === "acknowledged") {
      result = result.filter((alert) => alert.status === "acknowledged")
    } else if (activeTab === "resolved") {
      result = result.filter((alert) => alert.status === "resolved")
    }

    setFilteredAlerts(result)
  }, [alerts, searchQuery, filterType, filterSeverity, filterStatus, activeTab])

  // Handle alert click
  const handleAlertClick = (alert: ExtendedAlert) => {
    setSelectedAlert(alert)
  }

  // Handle back button click
  const handleBackClick = () => {
    setSelectedAlert(null)
  }

  // Navigate back to dashboard
  const handleBackToDashboard = () => {
    router.push("/")
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Site Alerts</h1>
          <p className="text-muted-foreground">View and manage all alerts across the construction site</p>
        </div>
        <Button variant="outline" onClick={handleBackToDashboard}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Dashboard
        </Button>
      </div>

      {selectedAlert ? (
        <AlertDetail alert={selectedAlert} onBack={handleBackClick} />
      ) : (
        <>
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search alerts..."
                className="pl-9"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <div className="flex gap-2">
              <Select value={filterType} onValueChange={setFilterType}>
                <SelectTrigger className="w-[130px]">
                  <Filter className="h-4 w-4 mr-2" />
                  <span>Type</span>
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  <SelectItem value="safety">Safety</SelectItem>
                  <SelectItem value="inventory">Inventory</SelectItem>
                  <SelectItem value="weather">Weather</SelectItem>
                  <SelectItem value="equipment">Equipment</SelectItem>
                  <SelectItem value="schedule">Schedule</SelectItem>
                </SelectContent>
              </Select>

              <Select value={filterSeverity} onValueChange={setFilterSeverity}>
                <SelectTrigger className="w-[130px]">
                  <AlertTriangle className="h-4 w-4 mr-2" />
                  <span>Severity</span>
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Severities</SelectItem>
                  <SelectItem value="high">High</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="low">Low</SelectItem>
                </SelectContent>
              </Select>

              <Select value={filterStatus} onValueChange={setFilterStatus}>
                <SelectTrigger className="w-[130px]">
                  <Clock className="h-4 w-4 mr-2" />
                  <span>Status</span>
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Statuses</SelectItem>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="acknowledged">Acknowledged</SelectItem>
                  <SelectItem value="resolved">Resolved</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab}>
            <TabsList>
              <TabsTrigger value="all">
                All
                <Badge variant="secondary" className="ml-2">
                  {alerts.length}
                </Badge>
              </TabsTrigger>
              <TabsTrigger value="active">
                Active
                <Badge variant="secondary" className="ml-2">
                  {alerts.filter((a) => a.status === "active").length}
                </Badge>
              </TabsTrigger>
              <TabsTrigger value="acknowledged">
                Acknowledged
                <Badge variant="secondary" className="ml-2">
                  {alerts.filter((a) => a.status === "acknowledged").length}
                </Badge>
              </TabsTrigger>
              <TabsTrigger value="resolved">
                Resolved
                <Badge variant="secondary" className="ml-2">
                  {alerts.filter((a) => a.status === "resolved").length}
                </Badge>
              </TabsTrigger>
            </TabsList>

            <TabsContent value="all" className="mt-4">
              <Card>
                <CardContent className="p-4">
                  {filteredAlerts.length > 0 ? (
                    <div className="space-y-2">
                      {filteredAlerts.map((alert) => (
                        <AlertItem key={alert.id} alert={alert} onClick={handleAlertClick} />
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <p className="text-muted-foreground">No alerts match your filters</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="active" className="mt-4">
              <Card>
                <CardContent className="p-4">
                  {filteredAlerts.length > 0 ? (
                    <div className="space-y-2">
                      {filteredAlerts.map((alert) => (
                        <AlertItem key={alert.id} alert={alert} onClick={handleAlertClick} />
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <p className="text-muted-foreground">No active alerts match your filters</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="acknowledged" className="mt-4">
              <Card>
                <CardContent className="p-4">
                  {filteredAlerts.length > 0 ? (
                    <div className="space-y-2">
                      {filteredAlerts.map((alert) => (
                        <AlertItem key={alert.id} alert={alert} onClick={handleAlertClick} />
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <p className="text-muted-foreground">No acknowledged alerts match your filters</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="resolved" className="mt-4">
              <Card>
                <CardContent className="p-4">
                  {filteredAlerts.length > 0 ? (
                    <div className="space-y-2">
                      {filteredAlerts.map((alert) => (
                        <AlertItem key={alert.id} alert={alert} onClick={handleAlertClick} />
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <p className="text-muted-foreground">No resolved alerts match your filters</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </>
      )}
    </div>
  )
}