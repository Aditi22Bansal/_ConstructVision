"use client";

import { useState, useRef, useEffect } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import {
  OrbitControls,
  Environment,
  Grid,
  Html,
  Box,
  Cylinder,
} from "@react-three/drei";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import {
  AlertTriangle,
  CheckCircle2,
  Thermometer,
  Wind,
  CloudRain,
} from "lucide-react";
import MockDataGenerator, {
  type MockConstructionData,
} from "@/components/mock-data-generator";
import type * as THREE from "three";
import { redirect } from "next/navigation";



// Simple building model using Three.js primitives
function ConstructionSite({ data }: { data: MockConstructionData }) {
  const siteRef = useRef<THREE.Group>(null);
  const buildingRef = useRef<THREE.Mesh>(null);
  const roofRef = useRef<THREE.Mesh>(null);

  // Rotate the model slowly
  useFrame((state) => {
    if (siteRef.current) {
      siteRef.current.rotation.y += 0.002;
    }
  });

  // Update the model based on the data
  useEffect(() => {
    if (siteRef.current) {
      // Scale the model based on site progress
      const progressScale = 1 + (data.siteProgress / 100) * 0.5;
      siteRef.current.scale.set(progressScale, progressScale, progressScale);
    }

    // Change building color based on safety score
    if (buildingRef.current && buildingRef.current.material) {
      const material = buildingRef.current
        .material as THREE.MeshStandardMaterial;

      // Adjust material color based on safety score
      if (data.safetyScore < 70) {
        material.color.setRGB(1, 0.5, 0.5); // Reddish for low safety
      } else if (data.safetyScore < 85) {
        material.color.setRGB(1, 0.8, 0.2); // Yellowish for medium safety
      } else {
        material.color.setRGB(0.8, 0.8, 0.9); // Blueish for high safety
      }
    }

    // Change roof height based on progress
    if (roofRef.current) {
      roofRef.current.position.y = 2 + (data.siteProgress / 100) * 1.5;
    }
  }, [data.siteProgress, data.safetyScore]);

  // Create alert positions based on active alerts
  const alertPositions = data.alerts.slice(0, 3).map((alert, index) => {
    const angle = (index / 3) * Math.PI * 2;
    const radius = 3;
    return [
      Math.cos(angle) * radius,
      1 + index * 0.5,
      Math.sin(angle) * radius,
    ];
  });

  return (
    <group ref={siteRef} position={[0, 0, 0]}>
      {/* Main building */}
      <Box ref={buildingRef} args={[3, 4, 3]} position={[0, 2, 0]}>
        <meshStandardMaterial color="#8888aa" />
      </Box>

      {/* Roof */}
      <Cylinder
        ref={roofRef}
        args={[0, 2, 2, 4]}
        position={[0, 4, 0]}
        rotation={[0, Math.PI / 4, 0]}
      >
        <meshStandardMaterial color="#aa5555" />
      </Cylinder>

      {/* Foundation */}
      <Box args={[4, 0.5, 4]} position={[0, -0.25, 0]}>
        <meshStandardMaterial color="#555555" />
      </Box>

      {/* Building label */}
      <Html position={[0, 5, 0]}>
        <div className="bg-background/80 backdrop-blur-sm p-2 rounded-md shadow-lg border">
          <Badge variant="outline" className="font-bold">
            Main Building - {data.siteProgress.toFixed(0)}% Complete
          </Badge>
        </div>
      </Html>

      {/* Worker indicators */}
      <group position={[0, 0, 0]}>
        {Array.from({
          length: Math.min(5, Math.floor(data.workerCount / 10)),
        }).map((_, i) => {
          const angle = (i / 5) * Math.PI * 2;
          const radius = 4;
          return (
            <Html
              key={i}
              position={[
                Math.cos(angle) * radius,
                0.5,
                Math.sin(angle) * radius,
              ]}
            >
              <div className="bg-blue-500/80 backdrop-blur-sm p-1 rounded-full shadow-lg w-3 h-3" />
            </Html>
          );
        })}
      </group>

      {/* Alert indicators */}
      {alertPositions.map((position, i) => (
        <Html key={i} position={position as [number, number, number]}>
          <div
            className={`${
              data.alerts[i].severity === "high"
                ? "bg-red-500/80"
                : data.alerts[i].severity === "medium"
                ? "bg-amber-500/80"
                : "bg-blue-500/80"
            } backdrop-blur-sm p-1 rounded-md shadow-lg text-white text-xs`}
          >
            <AlertTriangle className="h-3 w-3 inline mr-1" />
            {data.alerts[i].type.charAt(0).toUpperCase() +
              data.alerts[i].type.slice(1)}
          </div>
        </Html>
      ))}

      {/* Weather indicator */}
      <Html position={[-4, 3, -4]}>
        <div className="bg-background/80 backdrop-blur-sm p-2 rounded-md shadow-lg border">
          <div className="text-xs font-medium">
            {data.weather.temperature}°F | {data.weather.conditions}
          </div>
        </div>
      </Html>

      {/* Additional construction elements based on progress */}
      {data.siteProgress > 30 && (
        <Box args={[1, 3, 1]} position={[2, 1.5, 2]}>
          <meshStandardMaterial color="#888888" />
        </Box>
      )}

      {data.siteProgress > 50 && (
        <Box args={[1, 2, 1]} position={[-2, 1, -2]}>
          <meshStandardMaterial color="#888888" />
        </Box>
      )}

      {data.siteProgress > 75 && (
        <Cylinder args={[0.2, 0.2, 5, 8]} position={[-2, 2.5, 2]}>
          <meshStandardMaterial color="#555555" />
        </Cylinder>
      )}
    </group>
  );
}

// Grid with measurements
function SiteGrid() {
  return (
    <Grid
      infiniteGrid
      cellSize={1}
      cellThickness={0.6}
      cellColor="#6e6e6e"
      sectionSize={5}
      sectionThickness={1.2}
      sectionColor="#9d4b4b"
      fadeDistance={50}
      fadeStrength={1.5}
    />
  );
}

// Weather indicator
function WeatherIndicator({
  weather,
}: {
  weather: MockConstructionData["weather"];
}) {
  return (
    <Card className="w-full">
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-medium">Current Weather</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex justify-between items-center">
          <div className="flex items-center">
            <Thermometer className="h-4 w-4 mr-1 text-orange-500" />
            <span className="text-sm">{weather.temperature}°F</span>
          </div>
          <div className="flex items-center">
            <Wind className="h-4 w-4 mr-1 text-blue-500" />
            <span className="text-sm">{weather.wind} mph</span>
          </div>
          <div className="flex items-center">
            <CloudRain className="h-4 w-4 mr-1 text-blue-400" />
            <span className="text-sm">{weather.precipitation}%</span>
          </div>
        </div>
        <div className="text-xs text-muted-foreground mt-1">
          {weather.conditions}
        </div>
      </CardContent>
    </Card>
  );
}

// Alert component
function AlertItem({ alert }: { alert: MockConstructionData["alerts"][0] }) {
  const severityColors = {
    high: "bg-red-500",
    medium: "bg-amber-500",
    low: "bg-blue-500",
  };

  return (
    <div className="flex items-start space-x-2 mb-2 p-2 rounded-md bg-background border">
      <div
        className={`${
          severityColors[alert.severity]
        } p-1 rounded-full flex-shrink-0`}
      >
        <AlertTriangle className="h-3 w-3 text-white" />
      </div>
      <div className="flex-1">
        <p className="text-sm font-medium">{alert.message}</p>
        <div className="flex justify-between mt-1">
          <span className="text-xs text-muted-foreground">{alert.time}</span>
          <Badge variant="outline" className="text-xs">
            {alert.type}
          </Badge>
        </div>
      </div>
    </div>
  );
}

export default function DigitalTwinViewer() {
  const [viewMode, setViewMode] = useState("3d");
  const [siteData, setSiteData] = useState<MockConstructionData>({
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
  });

  // Handle data updates from the mock data generator
  const handleDataUpdate = (data: MockConstructionData) => {
    setSiteData(data);
  };

  return (
    <div className="h-[calc(100vh-8rem)]">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 h-full">
        <div className="md:col-span-3 h-full flex flex-col">
          <div className="flex justify-between items-center mb-4">
            <div>
              <h2 className="text-2xl font-bold">Site Alpha</h2>
              <p className="text-muted-foreground">
                Digital Twin Visualization
              </p>
            </div>
            <Tabs defaultValue="3d" className="w-[200px]">
              <TabsList>
                <TabsTrigger value="3d" onClick={() => setViewMode("3d")}>
                  3D View
                </TabsTrigger>
                <TabsTrigger value="2d" onClick={() => setViewMode("2d")}>
                  2D Plan
                </TabsTrigger>
                <TabsTrigger value="data" onClick={() => setViewMode("data")}>
                  Data
                </TabsTrigger>
              </TabsList>
            </Tabs>
          </div>

          <div className="bg-muted rounded-lg overflow-hidden border min-h-0 h-auto">
            <Tabs defaultValue={viewMode} value={viewMode}>
              <TabsContent value="3d" className="h-full">
                <Canvas shadows camera={{ position: [10, 10, 10], fov: 50 }}>
                  <ambientLight intensity={0.5} />
                  <directionalLight
                    position={[10, 10, 5]}
                    intensity={1}
                    castShadow
                  />
                  <ConstructionSite data={siteData} />
                  <SiteGrid />
                  <OrbitControls />
                  <Environment preset="city" />
                </Canvas>
              </TabsContent>

              <TabsContent value="2d" className="h-full">
                <div className="h-full flex items-center justify-center">
                  <div className="text-center">
                    <h3 className="text-lg font-medium mb-2">2D Site Plan</h3>
                    <p className="text-muted-foreground">
                      This would display a 2D floor plan or site layout
                    </p>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="data" className="h-full p-4">
                <MockDataGenerator onDataUpdate={handleDataUpdate} />
              </TabsContent>
            </Tabs>
          </div>

          <div className="grid grid-cols-3 gap-4 mt-4">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">
                  Project Progress
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="relative pt-1">
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-xs font-semibold inline-block text-primary">
                        {siteData.siteProgress.toFixed(1)}% Complete
                      </span>
                    </div>
                  </div>
                  <div className="overflow-hidden h-2 mb-4 text-xs flex rounded bg-muted">
                    <div
                      style={{ width: `${siteData.siteProgress}%` }}
                      className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-primary"
                    ></div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">
                  Safety Score
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center">
                  <div className="text-2xl font-bold mr-2">
                    {siteData.safetyScore}
                  </div>
                  <CheckCircle2 className="h-5 w-5 text-green-500" />
                </div>
                <p className="text-xs text-muted-foreground">
                  OSHA Compliance Rating
                </p>
              </CardContent>
            </Card>

            <WeatherIndicator weather={siteData.weather} />
          </div>
        </div>

        <div className="md:col-span-1">
          <Card className="h-full">
            <CardHeader>
              <CardTitle className="text-lg">Live Alerts</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-1">
                {siteData.alerts.map((alert) => (
                  <AlertItem key={alert.id} alert={alert} />
                ))}
              </div>
              <div className="mt-4">
      <Button
        variant="outline"
        className="w-full text-sm"
        onClick={() => redirect("/alerts")}
      >
        View All Alerts
      </Button>
    </div>
              ;
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
