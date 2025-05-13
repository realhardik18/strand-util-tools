"use client"

import { useState, useRef } from "react"
import { Info, Download, Share } from "lucide-react"
import { Slider } from "@/components/ui/slider"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import html2canvas from "html2canvas"

export default function HairHealthAnalyzer() {
    const [scalpHealth, setScalpHealth] = useState(84.66)
    const [splitEnds, setSplitEnds] = useState("Minimal")
    const [breakage, setBreakage] = useState("Minimal")
    const [frizz, setFrizz] = useState("Mild")
    const [dandruff, setDandruff] = useState("None")

    const [splitEndsValue, setSplitEndsValue] = useState(20)
    const [breakageValue, setBreakageValue] = useState(15)
    const [frizzValue, setFrizzValue] = useState(30)
    const [dandruffValue, setDandruffValue] = useState(0)

    const [activeSection, setActiveSection] = useState("Hair Health")
    const [images, setImages] = useState([
        "/placeholder.svg?height=60&width=60",
        "/placeholder.svg?height=60&width=60",
        "/placeholder.svg?height=60&width=60",
        "/placeholder.svg?height=60&width=60",
    ])

    const phoneRef = useRef(null)
    const fileInputRef = useRef(null)
    const [gender, setGender] = useState({ male: false, female: false })

    const getConditionText = (value) => {
        if (value === 0) return "None"
        if (value <= 25) return "Minimal"
        if (value <= 50) return "Mild"
        if (value <= 75) return "Moderate"
        return "Severe"
    }

    const handleSplitEndsChange = (value) => {
        setSplitEndsValue(value[0])
        setSplitEnds(getConditionText(value[0]))
    }

    const handleBreakageChange = (value) => {
        setBreakageValue(value[0])
        setBreakage(getConditionText(value[0]))
    }

    const handleFrizzChange = (value) => {
        setFrizzValue(value[0])
        setFrizz(getConditionText(value[0]))
    }

    const handleDandruffChange = (value) => {
        setDandruffValue(value[0])
        setDandruff(getConditionText(value[0]))
    }

    const handleScalpHealthChange = (value) => {
        setScalpHealth(value[0])
    }

    const handleCopy = async () => {
        if (!phoneRef.current) return

        try {
            const canvas = await html2canvas(phoneRef.current)
            canvas.toBlob(async (blob) => {
                if (!blob) return

                try {
                    const item = new ClipboardItem({ "image/png": blob })
                    await navigator.clipboard.write([item])
                    alert("Image copied to clipboard!")
                } catch (err) {
                    console.error("Failed to copy: ", err)
                    alert("Failed to copy to clipboard. Your browser may not support this feature.")
                }
            })
        } catch (err) {
            console.error("Error generating image: ", err)
        }
    }

    const handleDownload = async () => {
        if (!phoneRef.current) return

        try {
            const canvas = await html2canvas(phoneRef.current)
            const image = canvas.toDataURL("image/png")
            const link = document.createElement("a")
            link.href = image
            link.download = "hair-health-analysis.png"
            link.click()
        } catch (err) {
            console.error("Error generating image: ", err)
        }
    }

    const handleImageUpload = (e, index) => {
        const file = e.target.files?.[0]
        if (!file) return

        const reader = new FileReader()
        reader.onload = (event) => {
            if (event.target?.result) {
                const newImages = [...images]
                newImages[index] = event.target.result
                setImages(newImages)
            }
        }
        reader.readAsDataURL(file)
    }

    const triggerFileInput = (index) => {
        const input = document.createElement("input")
        input.type = "file"
        input.accept = "image/*"
        input.onchange = (e) => handleImageUpload(e, index)
        input.click()
    }

    return (
        <div className="flex flex-col lg:flex-row h-screen bg-gray-100 overflow-hidden">
            {/* Left Side - Controls */}
            <div className="w-full lg:w-2/5 p-4 overflow-auto">
                <h1 className="text-xl font-bold mb-4">Settings</h1>

                {/* Settings Panel */}
                <div className="bg-white p-4 rounded-lg shadow-sm mb-4">
                    <div className="mb-4">
                        <h2 className="text-sm text-gray-500 mb-2">Screen Type</h2>
                        <Select 
                            value={activeSection} 
                            onValueChange={setActiveSection}
                        >
                            <SelectTrigger className="w-full">
                                <SelectValue placeholder="Select screen type" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="Hair Attributes">Hair Attributes</SelectItem>
                                <SelectItem value="Hair Health">Hair Health</SelectItem>
                                <SelectItem value="Recession Analysis">Recession Analysis</SelectItem>
                                <SelectItem value="Hair Style">Hair Style</SelectItem>
                                <SelectItem value="Action Plan">Action Plan</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    <div>
                        <h2 className="text-sm text-gray-500 mb-2">Gender</h2>
                        <div className="flex gap-4">
                            <div className="flex items-center space-x-2">
                                <Checkbox 
                                    id="male" 
                                    checked={gender.male}
                                    onCheckedChange={(checked) => 
                                        setGender(prev => ({...prev, male: checked}))
                                    }
                                />
                                <label 
                                    htmlFor="male" 
                                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                                >
                                    Male
                                </label>
                            </div>
                            <div className="flex items-center space-x-2">
                                <Checkbox 
                                    id="female" 
                                    checked={gender.female}
                                    onCheckedChange={(checked) => 
                                        setGender(prev => ({...prev, female: checked}))
                                    }
                                />
                                <label 
                                    htmlFor="female" 
                                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                                >
                                    Female
                                </label>
                            </div>
                        </div>
                    </div>
                </div>

                <Tabs defaultValue="content" className="w-full">
                    <TabsList className="mb-4 w-full">
                        <TabsTrigger value="content" className="flex-1">
                            Content
                        </TabsTrigger>
                        <TabsTrigger value="images" className="flex-1">
                            Images
                        </TabsTrigger>
                    </TabsList>

                    <TabsContent value="content" className="space-y-4">
                        <div className="bg-white p-4 rounded-lg shadow-sm">
                            <h2 className="text-md font-semibold mb-3">Hair Health Metrics</h2>

                            <div className="space-y-4">
                                <div className="space-y-2">
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-2">
                                            <Switch checked={true} />
                                            <Label>Scalp Health</Label>
                                        </div>
                                        <span className="text-sm text-gray-500">{scalpHealth.toFixed(2)}%</span>
                                    </div>

                                    <div className="flex items-center gap-2">
                                        <Input
                                            type="text"
                                            value={scalpHealth.toFixed(2)}
                                            onChange={(e) => setScalpHealth(Number.parseFloat(e.target.value) || 0)}
                                            className="w-20 text-sm"
                                        />
                                        <Slider
                                            value={[scalpHealth]}
                                            min={0}
                                            max={100}
                                            step={0.01}
                                            onValueChange={handleScalpHealthChange}
                                            className="flex-1"
                                        />
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-2">
                                            <Switch checked={true} />
                                            <Label>Split Ends</Label>
                                        </div>
                                        <span className="text-sm text-gray-500">{splitEndsValue.toFixed(0)}%</span>
                                    </div>

                                    <div className="flex items-center gap-2">
                                        <Input
                                            type="text"
                                            value={splitEnds}
                                            onChange={(e) => setSplitEnds(e.target.value)}
                                            className="w-20 text-sm"
                                        />
                                        <Slider
                                            value={[splitEndsValue]}
                                            min={0}
                                            max={100}
                                            step={1}
                                            onValueChange={handleSplitEndsChange}
                                            className="flex-1"
                                        />
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-2">
                                            <Switch checked={true} />
                                            <Label>Breakage</Label>
                                        </div>
                                        <span className="text-sm text-gray-500">{breakageValue.toFixed(0)}%</span>
                                    </div>

                                    <div className="flex items-center gap-2">
                                        <Input
                                            type="text"
                                            value={breakage}
                                            onChange={(e) => setBreakage(e.target.value)}
                                            className="w-20 text-sm"
                                        />
                                        <Slider
                                            value={[breakageValue]}
                                            min={0}
                                            max={100}
                                            step={1}
                                            onValueChange={handleBreakageChange}
                                            className="flex-1"
                                        />
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-2">
                                            <Switch checked={true} />
                                            <Label>Frizz</Label>
                                        </div>
                                        <span className="text-sm text-gray-500">{frizzValue.toFixed(0)}%</span>
                                    </div>

                                    <div className="flex items-center gap-2">
                                        <Input
                                            type="text"
                                            value={frizz}
                                            onChange={(e) => setFrizz(e.target.value)}
                                            className="w-20 text-sm"
                                        />
                                        <Slider
                                            value={[frizzValue]}
                                            min={0}
                                            max={100}
                                            step={1}
                                            onValueChange={handleFrizzChange}
                                            className="flex-1"
                                        />
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-2">
                                            <Switch checked={true} />
                                            <Label>Dandruff</Label>
                                        </div>
                                        <span className="text-sm text-gray-500">{dandruffValue.toFixed(0)}%</span>
                                    </div>

                                    <div className="flex items-center gap-2">
                                        <Input
                                            type="text"
                                            value={dandruff}
                                            onChange={(e) => setDandruff(e.target.value)}
                                            className="w-20 text-sm"
                                        />
                                        <Slider
                                            value={[dandruffValue]}
                                            min={0}
                                            max={100}
                                            step={1}
                                            onValueChange={handleDandruffChange}
                                            className="flex-1"
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </TabsContent>

                    <TabsContent value="images">
                        <div className="bg-white p-4 rounded-lg shadow-sm">
                            <h2 className="text-md font-semibold mb-3">Upload Images</h2>
                            <p className="text-gray-500 text-sm mb-3">Upload hair images for analysis</p>

                            <div className="grid grid-cols-2 gap-3 mb-4">
                                {images.map((image, index) => (
                                    <div
                                        key={index}
                                        className="aspect-square border rounded-lg overflow-hidden relative cursor-pointer hover:opacity-90 transition-opacity"
                                        onClick={() => triggerFileInput(index)}
                                    >
                                        <img
                                            src={image || "/placeholder.svg"}
                                            alt={`Hair sample ${index + 1}`}
                                            className="w-full h-full object-cover"
                                        />
                                        <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-30 opacity-0 hover:opacity-100 transition-opacity">
                                            <span className="text-white text-xs font-medium">Click to change</span>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            <Button
                                variant="outline"
                                className="w-full h-12 flex items-center justify-center gap-2"
                                onClick={() => fileInputRef.current?.click()}
                            >
                                <span className="i-lucide-upload h-4 w-4" />
                                <span className="text-sm">Upload new image</span>
                            </Button>
                            <input
                                ref={fileInputRef}
                                type="file"
                                accept="image/*"
                                className="hidden"
                                onChange={(e) => {
                                    // Find the first empty slot or use the last one
                                    const emptyIndex = images.findIndex((img) => img.includes("placeholder.svg"))
                                    handleImageUpload(e, emptyIndex >= 0 ? emptyIndex : 3)
                                }}
                            />
                        </div>
                    </TabsContent>
                </Tabs>
            </div>

            {/* Right Side - Preview */}
            <div className="w-full lg:w-3/5 bg-white p-4 flex flex-col">
                <div className="flex justify-between mb-4">
                    <h2 className="text-xl font-bold">Preview</h2>
                    <div className="flex gap-2">
                        <Button variant="outline" size="sm" onClick={handleCopy}>
                            Copy
                        </Button>
                        <Button variant="outline" size="sm" onClick={handleDownload}>
                            Download
                        </Button>
                    </div>
                </div>

                <div className="flex-1 flex items-center justify-center">
                    <div
                        ref={phoneRef}
                        className="relative w-[280px] h-[580px] bg-black rounded-[36px] overflow-hidden shadow-xl border-[8px] border-black"
                    >
                        {/* Phone Status Bar */}
                        <div className="h-6 w-full bg-black text-white flex justify-between items-center px-4 text-xs">
                            <span>20:34</span>
                            <div className="flex items-center gap-1">
                                <div className="w-3 h-3 rounded-full bg-white"></div>
                                <div className="w-3 h-3 rounded-full bg-white"></div>
                            </div>
                        </div>

                        {/* App Content */}
                        <div className="h-[calc(100%-24px)] bg-black text-white p-4 flex flex-col">
                            {/* Header */}
                            <div className="flex justify-between items-center mb-4">
                                <div className="w-7 h-7 rounded-full bg-zinc-800 flex items-center justify-center">
                                    <span className="i-lucide-home h-3.5 w-3.5" />
                                </div>
                                <div className="flex items-center gap-2">
                                    <span className="i-lucide-activity h-4 w-4" />
                                    <span className="font-medium text-sm">Hair Health</span>
                                </div>
                                <div className="w-7"></div>
                            </div>

                            {/* Image Gallery */}
                            <div className="flex gap-1.5 mb-4">
                                {images.map((image, index) => (
                                    <div
                                        key={index}
                                        className="w-[60px] h-[60px] flex-shrink-0 rounded-lg border border-zinc-700 overflow-hidden"
                                    >
                                        <img
                                            src={image || "/placeholder.svg"}
                                            alt={`Hair sample ${index + 1}`}
                                            className="w-full h-full object-cover"
                                        />
                                    </div>
                                ))}
                            </div>

                            {/* Metrics */}
                            <div className="space-y-3 flex-1">
                                {/* Scalp Health */}
                                <div className="bg-zinc-900 rounded-lg p-3">
                                    <div className="flex justify-between items-center mb-1">
                                        <span className="text-xs">Scalp Health</span>
                                        <Info className="h-3 w-3 text-zinc-500" />
                                    </div>
                                    <div className="text-xl font-bold">{scalpHealth.toFixed(2)}%</div>
                                    <div className="w-full h-1.5 bg-zinc-800 rounded-full mt-1.5 overflow-hidden">
                                        <div className="h-full bg-green-500 rounded-full" style={{ width: `${scalpHealth}%` }}></div>
                                    </div>
                                </div>

                                {/* Split Ends & Breakage */}
                                <div className="flex gap-3">
                                    <div className="bg-zinc-900 rounded-lg p-3 flex-1">
                                        <div className="flex justify-between items-center mb-1">
                                            <span className="text-xs">Split Ends</span>
                                            <Info className="h-3 w-3 text-zinc-500" />
                                        </div>
                                        <div className="text-base font-bold">{splitEnds}</div>
                                        <div className="w-full h-1 bg-zinc-800 rounded-full mt-1 overflow-hidden">
                                            <div className="h-full bg-orange-500 rounded-full" style={{ width: `${splitEndsValue}%` }}></div>
                                        </div>
                                    </div>

                                    <div className="bg-zinc-900 rounded-lg p-3 flex-1">
                                        <div className="flex justify-between items-center mb-1">
                                            <span className="text-xs">Breakage</span>
                                            <Info className="h-3 w-3 text-zinc-500" />
                                        </div>
                                        <div className="text-base font-bold">{breakage}</div>
                                        <div className="w-full h-1 bg-zinc-800 rounded-full mt-1 overflow-hidden">
                                            <div className="h-full bg-orange-500 rounded-full" style={{ width: `${breakageValue}%` }}></div>
                                        </div>
                                    </div>
                                </div>

                                {/* Frizz & Dandruff */}
                                <div className="flex gap-3">
                                    <div className="bg-zinc-900 rounded-lg p-3 flex-1">
                                        <div className="flex justify-between items-center mb-1">
                                            <span className="text-xs">Frizz</span>
                                            <Info className="h-3 w-3 text-zinc-500" />
                                        </div>
                                        <div className="text-base font-bold">{frizz}</div>
                                        <div className="w-full h-1 bg-zinc-800 rounded-full mt-1 overflow-hidden">
                                            <div className="h-full bg-orange-500 rounded-full" style={{ width: `${frizzValue}%` }}></div>
                                        </div>
                                    </div>

                                    <div className="bg-zinc-900 rounded-lg p-3 flex-1">
                                        <div className="flex justify-between items-center mb-1">
                                            <span className="text-xs">Dandruff</span>
                                            <Info className="h-3 w-3 text-zinc-500" />
                                        </div>
                                        <div className="text-base font-bold">{dandruff}</div>
                                        <div className="w-full h-1 bg-zinc-800 rounded-full mt-1 overflow-hidden">
                                            <div className="h-full bg-red-500 rounded-full" style={{ width: `${dandruffValue}%` }}></div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Pagination Dots */}
                            <div className="flex justify-center my-3">
                                <div className="flex gap-1">
                                    <div className="w-1.5 h-1.5 rounded-full bg-zinc-500"></div>
                                    <div className="w-1.5 h-1.5 rounded-full bg-zinc-500"></div>
                                    <div className="w-1.5 h-1.5 rounded-full bg-zinc-500"></div>
                                </div>
                            </div>

                            {/* Brand */}
                            <div className="flex justify-center my-2">
                                <div className="flex items-center gap-1 text-sm">
                                    <span className="font-semibold">Strand</span>
                                    <span className="i-lucide-zap h-3.5 w-3.5" />
                                </div>
                            </div>

                            {/* Bottom Buttons */}
                            <div className="flex gap-3 mt-auto">
                                <Button variant="outline" className="flex-1 bg-zinc-900 border-zinc-700 hover:bg-zinc-800 h-9 text-sm">
                                    <Download className="h-3.5 w-3.5 mr-1.5" />
                                    Save
                                </Button>
                                <Button className="flex-1 bg-purple-600 hover:bg-purple-700 h-9 text-sm">
                                    <Share className="h-3.5 w-3.5 mr-1.5" />
                                    Share
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
