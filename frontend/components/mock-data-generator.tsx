"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Slider } from "@/components/ui/slider"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Play, Pause, RefreshCw, AlertTriangle, CheckCircle2 } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

// Define the types for our mock data
export interface MockConstructionData {
  siteProgress: number
  safetyScore: number
  workerCount: number
  activeZones: string[]
  alerts: {
    id: number
    type: string
    message: string
    severity: "high" | "medium" | "low"
    time: string
  }[]
  weather: {
    temperature: number
    conditions: string
    wind: number
    precipitation: number
  }
  materialLevels: {
    [key: string]: number // Percentage of stock remaining
  }
}

// Initial mock data
const initialData: MockConstructionData = {
  siteProgress: 68,
  safetyScore: 92,
  workerCount: 41,
  activeZones: ["Zone A", "Zone B", "Zone C"],
  alerts: [
    {
      id: 1,
      type: "safety",
      message: "Worker without helmet detected in Zone B",
      severity: "high",
      time: "10:23 AM",
    },
    {
      id: 2,
      type: "inventory",
      message: "Cement stock below threshold (15%)",
      severity: "medium",
      time: "09:45 AM",
    },
    {
      id: 3,
      type: "weather",
      message: "Strong winds expected (35mph) at 2:00 PM",
      severity: "medium",
      time: "08:30 AM",
    },
  ],
  weather: {
    temperature: 72,
    conditions: "Partly Cloudy",
    wind: 12,
    precipitation: 20,
  },
  materialLevels: {
    cement: 15,
    steel: 65,
    bricks: 85,
    concrete: 42,
    timber: 78,
    glass: 24,
  },
}

// Scenarios for quick simulation
const scenarios = {
  normal: "Normal Operations",
  weatherEvent: "Weather Event",
  safetyIncident: "Safety Incident",
  materialShortage: "Material Shortage",
  highActivity: "High Activity",
}

export default function MockDataGenerator({
  onDataUpdate,
}: {
  onDataUpdate: (data: MockConstructionData) => void
}) {
  const [mockData, setMockData] = useState<MockConstructionData>(initialData)
  const [isSimulating, setIsSimulating] = useState(false)
  const [simulationSpeed, setSimulationSpeed] = useState(1) // Updates per second
  const [selectedScenario, setSelectedScenario] = useState<string>("normal")
  const [autoGenerateAlerts, setAutoGenerateAlerts] = useState(true)
  const { toast } = useToast()

  // Function to generate random data changes
  const generateRandomChanges = () => {
    setMockData((prevData) => {
      // Create a copy of the previous data
      const newData = { ...prevData }

      // Apply different changes based on the selected scenario
      switch (selectedScenario) {
        case "weatherEvent":
          newData.weather = {
            temperature: Math.max(32, Math.min(100, prevData.weather.temperature + randomChange(10))),
            conditions: ["Stormy", "Heavy Rain", "Thunderstorms", "High Winds"][Math.floor(Math.random() * 4)],
            wind: Math.max(15, Math.min(45, prevData.weather.wind + randomChange(8))),
            precipitation: Math.max(40, Math.min(90, prevData.weather.precipitation + randomChange(15))),
          }
          if (autoGenerateAlerts && Math.random() > 0.7) {
            addAlert(newData, "weather", "high")
          }
          break

        case "safetyIncident":
          newData.safetyScore = Math.max(50, Math.min(100, prevData.safetyScore + randomChange(8)))
          if (autoGenerateAlerts && Math.random() > 0.6) {
            addAlert(newData, "safety", "high")
          }
          break

        case "materialShortage":
          // Reduce material levels
          Object.keys(newData.materialLevels).forEach((material) => {
            if (Math.random() > 0.5) {
              newData.materialLevels[material] = Math.max(
                5,
                newData.materialLevels[material] - Math.floor(Math.random() * 10),
              )
            }
          })
          if (autoGenerateAlerts && Math.random() > 0.7) {
            addAlert(newData, "inventory", "medium")
          }
          break

        case "highActivity":
          newData.workerCount = Math.min(80, prevData.workerCount + randomChange(5))
          newData.siteProgress = Math.min(100, prevData.siteProgress + Math.random() * 0.5)
          break

        default: // normal operations
          // Make small random changes to all values
          newData.siteProgress = Math.min(100, prevData.siteProgress + Math.random() * 0.2)
          newData.safetyScore = Math.max(70, Math.min(100, prevData.safetyScore + randomChange(2)))
          newData.workerCount = Math.max(20, Math.min(60, prevData.workerCount + randomChange(3)))

          // Randomly update material levels
          Object.keys(newData.materialLevels).forEach((material) => {
            if (Math.random() > 0.7) {
              newData.materialLevels[material] = Math.max(
                5,
                Math.min(100, newData.materialLevels[material] + randomChange(5)),
              )
            }
          })

          // Weather changes
          newData.weather = {
            temperature: Math.max(50, Math.min(95, prevData.weather.temperature + randomChange(3))),
            conditions: prevData.weather.conditions,
            wind: Math.max(0, Math.min(25, prevData.weather.wind + randomChange(2))),
            precipitation: Math.max(0, Math.min(50, prevData.weather.precipitation + randomChange(5))),
          }

          // Occasionally change weather conditions
          if (Math.random() > 0.9) {
            newData.weather.conditions = ["Sunny", "Partly Cloudy", "Cloudy", "Light Rain"][
              Math.floor(Math.random() * 4)
            ]
          }

          // Occasionally generate alerts
          if (autoGenerateAlerts && Math.random() > 0.85) {
            const alertTypes = ["safety", "inventory", "weather"]
            const alertType = alertTypes[Math.floor(Math.random() * alertTypes.length)]
            addAlert(newData, alertType, Math.random() > 0.7 ? "medium" : "low")
          }
          break
      }

      return newData
    })
  }

  // Helper function to generate random changes (positive or negative)
  const randomChange = (magnitude: number) => {
    return Math.random() * magnitude * 2 - magnitude
  }

  // Helper function to add an alert
  const addAlert = (data: MockConstructionData, type: string, severity: "high" | "medium" | "low") => {
    const alertMessages = {
      safety: [
        "Worker without helmet detected in Zone B",
        "Unauthorized access to restricted area",
        "Safety barrier breach in Zone C",
        "Worker too close to edge without harness",
        "Equipment operating without proper clearance",
      ],
      inventory: [
        "Cement stock below threshold (15%)",
        "Steel rebar supply running low",
        "Timber delivery delayed by 2 days",
        "Concrete mix quality below standards",
        "Brick inventory count mismatch detected",
      ],
      weather: [
        "Strong winds expected (35mph) at 2:00 PM",
        "Heavy rain forecast for tomorrow",
        "Temperature will exceed 95°F this afternoon",
        "Lightning risk increased for next 3 hours",
        "Visibility reduced due to fog",
      ],
    }

    const messages = alertMessages[type as keyof typeof alertMessages] || alertMessages.safety
    const message = messages[Math.floor(Math.random() * messages.length)]

    const now = new Date()
    const timeString = now.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })

    const newAlert = {
      id: Date.now(),
      type,
      message,
      severity,
      time: timeString,
    }

    data.alerts = [newAlert, ...data.alerts.slice(0, 9)] // Keep only the 10 most recent alerts

    // Show a toast notification for high severity alerts
    if (severity === "high") {
      toast({
        title: `${type.charAt(0).toUpperCase() + type.slice(1)} Alert`,
        description: message,
        variant: "destructive",
      })
    }
  }

  // Reset data to initial state
  const resetData = () => {
    setMockData(initialData)
    toast({
      title: "Data Reset",
      description: "Mock data has been reset to initial values",
    })
  }

  // Apply a specific scenario
  const applyScenario = (scenario: string) => {
    setSelectedScenario(scenario)

    // Immediately apply some changes based on the scenario
    const scenarioData = { ...mockData }

    switch (scenario) {
      case "weatherEvent":
        scenarioData.weather = {
          temperature: 62,
          conditions: "Stormy",
          wind: 28,
          precipitation: 75,
        }
        addAlert(scenarioData, "weather", "high")
        break

      case "safetyIncident":
        scenarioData.safetyScore = 68
        addAlert(scenarioData, "safety", "high")
        break

      case "materialShortage":
        scenarioData.materialLevels = {
          ...scenarioData.materialLevels,
          cement: 8,
          steel: 12,
        }
        addAlert(scenarioData, "inventory", "high")
        break

      case "highActivity":
        scenarioData.workerCount = 72
        scenarioData.siteProgress += 2
        break
    }

    setMockData(scenarioData)

    toast({
      title: "Scenario Applied",
      description: `Applied scenario: ${scenarios[scenario as keyof typeof scenarios]}`,
    })
  }

  // Toggle simulation
  const toggleSimulation = () => {
    setIsSimulating(!isSimulating)

    if (!isSimulating) {
      toast({
        title: "Simulation Started",
        description: `Generating data at ${simulationSpeed}x speed`,
      })
    } else {
      toast({
        title: "Simulation Paused",
        description: "Data generation has been paused",
      })
    }
  }

  // Run the simulation
  useEffect(() => {
    let interval: NodeJS.Timeout

    if (isSimulating) {
      interval = setInterval(() => {
        generateRandomChanges()
      }, 1000 / simulationSpeed)
    }

    return () => {
      if (interval) clearInterval(interval)
    }
  }, [isSimulating, simulationSpeed, selectedScenario])

  // Notify parent component when data changes
  useEffect(() => {
    onDataUpdate(mockData)
  }, [mockData, onDataUpdate])

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex justify-between items-center">
          <span>Mock Data Generator</span>
          <Badge variant={isSimulating ? "default" : "outline"}>{isSimulating ? "Simulating" : "Paused"}</Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center justify-between">
          <Button onClick={toggleSimulation} variant={isSimulating ? "destructive" : "default"}>
            {isSimulating ? <Pause className="mr-2 h-4 w-4" /> : <Play className="mr-2 h-4 w-4" />}
            {isSimulating ? "Pause Simulation" : "Start Simulation"}
          </Button>
          <Button onClick={resetData} variant="outline">
            <RefreshCw className="mr-2 h-4 w-4" />
            Reset Data
          </Button>
        </div>

        <div className="space-y-4 pt-4">
          <div className="space-y-2">
            <Label>Simulation Speed</Label>
            <div className="flex items-center space-x-2">
              <Slider
                value={[simulationSpeed]}
                min={0.1}
                max={5}
                step={0.1}
                onValueChange={(value) => setSimulationSpeed(value[0])}
              />
              <span className="w-12 text-right">{simulationSpeed.toFixed(1)}x</span>
            </div>
          </div>

          <div className="space-y-2">
            <Label>Scenario</Label>
            <Select value={selectedScenario} onValueChange={applyScenario}>
              <SelectTrigger>
                <SelectValue placeholder="Select a scenario" />
              </SelectTrigger>
              <SelectContent>
                {Object.entries(scenarios).map(([key, value]) => (
                  <SelectItem key={key} value={key}>
                    {value}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="flex items-center space-x-2">
            <Switch id="auto-alerts" checked={autoGenerateAlerts} onCheckedChange={setAutoGenerateAlerts} />
            <Label htmlFor="auto-alerts">Auto-generate alerts</Label>
          </div>

          <div className="space-y-2 pt-2">
            <div className="flex justify-between">
              <span className="text-sm font-medium">Current Values:</span>
            </div>
            <div className="grid grid-cols-2 gap-2 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Progress:</span>
                <span>{mockData.siteProgress.toFixed(1)}%</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Safety Score:</span>
                <span>{mockData.safetyScore}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Workers:</span>
                <span>{mockData.workerCount}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Temperature:</span>
                <span>{mockData.weather.temperature}°F</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Wind:</span>
                <span>{mockData.weather.wind} mph</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Precipitation:</span>
                <span>{mockData.weather.precipitation}%</span>
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium">Latest Alert:</span>
              {mockData.alerts.length > 0 && (
                <Badge
                  variant="outline"
                  className={
                    mockData.alerts[0].severity === "high"
                      ? "text-red-500 border-red-500"
                      : mockData.alerts[0].severity === "medium"
                        ? "text-amber-500 border-amber-500"
                        : "text-blue-500 border-blue-500"
                  }
                >
                  {mockData.alerts[0].severity}
                </Badge>
              )}
            </div>
            {mockData.alerts.length > 0 ? (
              <div className="p-2 rounded-md border text-sm">
                <div className="flex items-start space-x-2">
                  <AlertTriangle className="h-4 w-4 text-amber-500 mt-0.5 flex-shrink-0" />
                  <div>
                    <p>{mockData.alerts[0].message}</p>
                    <div className="flex justify-between mt-1">
                      <span className="text-xs text-muted-foreground">{mockData.alerts[0].time}</span>
                      <span className="text-xs font-medium">{mockData.alerts[0].type}</span>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="p-2 rounded-md border text-sm flex items-center justify-center text-muted-foreground">
                <CheckCircle2 className="h-4 w-4 mr-2" />
                No active alerts
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

