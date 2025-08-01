"use client"

import { useState, useEffect, useRef } from "react"
import { useLocation } from "wouter"
import { ArrowLeft, X, Trash2, Camera } from "lucide-react"
import { CameraCapture } from "@/components/CameraCapture"
import { Button } from "@/components/ui/button"
import { fetchSKUItemsFromShelf } from "@/services/api"
 import { useMemo } from "react"

interface Product {
  id: string
  name: string
  sku: string
  image: string
  totalQuantity: number
  pickedQuantity: number
  status: "GOOD" | "DAMAGED"
  vendor: string
  mrp: number
  mfgDate: string
  color: string
  isPicking?: boolean
}

// API Response interface (what actually comes from the API)
interface APIProduct {
  id: string
  name: string
  sku: string
  quantity: number // ← API uses 'quantity'
  pickedQuantity: number
  status: "GOOD" | "DAMAGED"
  vendor: string
  mrp: number
  mfgDate: string
  color: string
}

export function SKUScannerPage() {
 

const searchParams = useMemo(() => new URLSearchParams(window.location.search), [])
const shelfCode = useMemo(() => searchParams.get("shelfCode"), [searchParams])
const picklistId = useMemo(() => searchParams.get("picklistId") || "1", [searchParams])
  const [, navigate] = useLocation()
  const [activeTab, setActiveTab] = useState<"pending" | "scanned">("pending")
  const [products, setProducts] = useState<Product[]>([])
  const [showBulkPickModal, setShowBulkPickModal] = useState(false)
  const [showActionsModal, setShowActionsModal] = useState(false)
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null)
  const [showShelfEmptyAlert, setShowShelfEmptyAlert] = useState(false)
  const [bulkQuantity, setBulkQuantity] = useState(1)
  const [inventoryType, setInventoryType] = useState("Good")
  const [showCameraCapture, setShowCameraCapture] = useState(false)
  const [capturedImages, setCapturedImages] = useState<string[]>([])
  const [capturedImageData, setCapturedImageData] = useState<string | null>(null)
  const videoRef = useRef<HTMLVideoElement>(null)
  const [cameraStream, setCameraStream] = useState<MediaStream | null>(null)
  const [cameraError, setCameraError] = useState<string>("")
  const [isScanning, setIsScanning] = useState(false)
  const fetchedRef = useRef(false)

useEffect(() => {
  if (fetchedRef.current) return // skip if already fetched
  fetchedRef.current = true

  const getProducts = async () => {
    try {
      const response = await fetchSKUItemsFromShelf(picklistId, shelfCode || "")
      console.log("Fetched products:", response)

      const mappedProducts: Product[] = response[0].skuInputProducts.map((apiProduct: APIProduct) => ({
        ...apiProduct,
        totalQuantity: apiProduct.quantity,
      }))
      setProducts(mappedProducts)
    } catch (error) {
      console.error("Error fetching products:", error)
    }
  }

  getProducts()
}, [shelfCode, picklistId])

  // Camera functionality
  useEffect(() => {
    startCamera()
    return () => {
      stopCamera()
    }
  }, [])

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: "environment",
          width: { ideal: 1280 },
          height: { ideal: 720 },
        },
      })
      if (videoRef.current) {
        videoRef.current.srcObject = stream
        setCameraStream(stream)
        setCameraError("")
      }
    } catch (error) {
      console.error("Error accessing camera:", error)
      setCameraError("Camera access denied. Please allow camera permissions.")
    }
  }

  const stopCamera = () => {
    if (cameraStream) {
      cameraStream.getTracks().forEach((track) => track.stop())
      setCameraStream(null)
    }
  }

  const simulateBarcodeScanner = () => {
    setIsScanning(true)
    setTimeout(() => {
      setIsScanning(false)
      console.log("Barcode scanned successfully")
    }, 1500)
  }

  const handleBack = () => {
    stopCamera()
    navigate(`/shelf-detail/${picklistId}`)
  }

  const handleClose = () => {
    stopCamera()
    navigate("/b2b-packing")
  }

  const pendingProducts = products.filter((p) => p.pickedQuantity < p.totalQuantity)
  const scannedProducts = products.filter((p) => p.pickedQuantity > 0)
  const currentProducts = activeTab === "pending" ? pendingProducts : scannedProducts

  console.log("Products:", products)
  console.log("Pending Products:", pendingProducts)
  console.log("Current Products:", currentProducts)

  const handleProductClick = (product: Product) => {
    if (activeTab === "pending" && product.pickedQuantity < product.totalQuantity && !product.isPicking) {
      setProducts((prev) =>
        prev.map((p) => {
          if (p.id === product.id) {
            const newPickedQuantity = Math.min(p.pickedQuantity + 1, p.totalQuantity)
            return { ...p, pickedQuantity: newPickedQuantity }
          }
          return p
        }),
      )

      const updatedProducts = products.map((p) =>
        p.id === product.id ? { ...p, pickedQuantity: Math.min(p.pickedQuantity + 1, p.totalQuantity) } : p,
      )
      const allPicked = updatedProducts.every((p) => p.pickedQuantity === p.totalQuantity)
      if (allPicked) {
        setTimeout(() => setShowShelfEmptyAlert(true), 500)
      }
    } else if (activeTab === "scanned" && product.pickedQuantity > 0) {
      setProducts((prev) =>
        prev.map((p) => {
          if (p.id === product.id) {
            const newPickedQuantity = Math.max(p.pickedQuantity - 1, 0)
            return { ...p, pickedQuantity: newPickedQuantity, isPicking: false }
          }
          return p
        }),
      )
    }
  }

  const handleQuantityAction = (product: Product) => {
    setSelectedProduct(product)
    setShowActionsModal(true)
  }

  const handlePickInBulk = () => {
    setShowActionsModal(false)
    setBulkQuantity(1)
    setInventoryType("Good")
    setShowBulkPickModal(true)
  }

  const handleMarkDamaged = () => {
    if (!selectedProduct) return
    setProducts((prev) =>
      prev.map((p) => (p.id === selectedProduct.id ? { ...p, status: "DAMAGED" as const, isPicking: false } : p)),
    )
    setShowActionsModal(false)
  }

  const handleMarkNotFound = () => {
    if (!selectedProduct) return
    setProducts((prev) => prev.map((p) => (p.id === selectedProduct.id ? { ...p, isPicking: false } : p)))
    setShowActionsModal(false)
  }

  const handleShortPick = () => {
    if (!selectedProduct) return
    setProducts((prev) => prev.map((p) => (p.id === selectedProduct.id ? { ...p, isPicking: false } : p)))
    setShowActionsModal(false)
  }

  const handleCameraCapture = (imageData: string) => {
    setCapturedImageData(imageData)
    setCapturedImages((prev) => [...prev, imageData])
    setShowCameraCapture(false)
  }

  const handleDeleteImage = () => {
    setCapturedImageData(null)
    setCapturedImages([])
    startCamera()
  }

  const handleAddImage = () => {
    setShowCameraCapture(true)
  }

  const handleClickCapture = () => {
    if (videoRef.current && !capturedImageData) {
      const canvas = document.createElement("canvas")
      const video = videoRef.current
      canvas.width = video.videoWidth
      canvas.height = video.videoHeight
      const ctx = canvas.getContext("2d")
      if (ctx) {
        ctx.drawImage(video, 0, 0)
        const imageData = canvas.toDataURL("image/jpeg", 0.8)
        handleCameraCapture(imageData)
      }
    }
  }

  const handleBulkPickSubmit = () => {
    if (!selectedProduct) return
    setProducts((prev) =>
      prev.map((p) => {
        if (p.id === selectedProduct.id) {
          const newPickedQuantity = Math.min(p.pickedQuantity + bulkQuantity, p.totalQuantity)
          return { ...p, pickedQuantity: newPickedQuantity, isPicking: false }
        }
        return p
      }),
    )
    setShowBulkPickModal(false)

    const updatedProducts = products.map((p) =>
      p.id === selectedProduct.id
        ? { ...p, pickedQuantity: Math.min(p.pickedQuantity + bulkQuantity, p.totalQuantity) }
        : p,
    )
    const allPicked = updatedProducts.every((p) => p.pickedQuantity === p.totalQuantity)
    if (allPicked) {
      setTimeout(() => setShowShelfEmptyAlert(true), 500)
    }
  }

  const handleShelfEmptyConfirm = () => {
    setShowShelfEmptyAlert(false)
    navigate(`/shelf-detail/1`)
  }

  const getShoeColor = (color: string) => {
    const colorLower = color.toLowerCase()
    if (colorLower.includes("red")) return { start: "#dc2626", end: "#b91c1c", bg: "#fef2f2", accent: "#dc2626" }
    if (colorLower.includes("blue")) return { start: "#2563eb", end: "#1d4ed8", bg: "#eff6ff", accent: "#2563eb" }
    if (colorLower.includes("yellow")) return { start: "#eab308", end: "#ca8a04", bg: "#fefce8", accent: "#eab308" }
    return { start: "#1f2937", end: "#111827", bg: "#f9fafb", accent: "#1f2937" }
  }

  const ProductCard = ({ product }: { product: Product }) => {
    const pendingQty = product.totalQuantity - product.pickedQuantity
    const colors = getShoeColor(product.color)

    return (
      <div
        className={`bg-white rounded-lg border p-4 transition-all ${
          product.isPicking
            ? "border-green-500 border-2 bg-green-50"
            : activeTab === "pending" && pendingQty > 0
              ? "border-gray-200 hover:border-gray-300 cursor-pointer"
              : activeTab === "scanned" && product.pickedQuantity > 0
                ? "border-gray-200 hover:border-gray-300 cursor-pointer"
                : "border-gray-200"
        }`}
        onClick={() => handleProductClick(product)}
      >
        {/* Status Badge and Quantity Button */}
        <div className="flex justify-between items-start mb-2">
          {product.isPicking && (
            <span className="px-2 py-1 bg-green-100 text-green-700 text-xs font-medium rounded">• PICKING</span>
          )}
          <div className="flex-1"></div>
          {activeTab === "pending" && pendingQty > 0 && (
            <button
              onClick={(e) => {
                e.stopPropagation()
                handleQuantityAction(product)
              }}
              className="bg-blue-500 text-white px-2 py-1 rounded text-sm font-medium hover:bg-blue-600"
            >
              {pendingQty}
            </button>
          )}
        </div>

        <div className="mb-2">
          <h3 className="text-sm font-medium text-gray-900 leading-tight mb-1">{product.name}</h3>
          <p className="text-xs text-gray-600">{product.sku}</p>
        </div>

        <div className="flex items-start gap-3">
          <div className="w-16 h-16 bg-gray-100 rounded-lg flex items-center justify-center overflow-hidden flex-shrink-0">
            <img
              src={`data:image/svg+xml;base64,${btoa(`
                <svg width="64" height="64" xmlns="http://www.w3.org/2000/svg">
                  <defs>
                    <linearGradient id="shoeGrad${product.id}" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" style="stop-color:${colors.start};stop-opacity:1" />
                      <stop offset="100%" style="stop-color:${colors.end};stop-opacity:1" />
                    </linearGradient>
                  </defs>
                  <rect width="64" height="64" fill="#f8fafc"/>
                  <ellipse cx="32" cy="50" rx="28" ry="8" fill="#e2e8f0"/>
                  <path d="M8 40 Q8 35 12 32 Q16 28 24 26 Q32 24 40 26 Q48 28 52 32 Q56 35 56 40 L54 42 Q52 44 48 45 Q44 46 40 46 L24 46 Q20 46 16 45 Q12 44 10 42 Z" fill="url(#shoeGrad${product.id})"/>
                  <path d="M12 38 Q16 34 24 32 Q32 30 40 32 Q48 34 52 38" stroke="white" strokeWidth="1" fill="none" opacity="0.3"/>
                  <circle cx="20" cy="38" r="1.5" fill="white" opacity="0.6"/>
                  <text x="32" y="18" textAnchor="middle" fill="#64748b" fontSize="6" fontFamily="Arial, sans-serif" fontWeight="bold">NIKE</text>
                </svg>
              `)}`}
              alt="Product"
              className="w-full h-full object-cover"
            />
          </div>

          <div className="flex-1 grid grid-cols-2 gap-x-4 gap-y-1 text-xs">
            <div>
              <span className="text-gray-500">Qty </span>
              <span className="font-medium">{activeTab === "pending" ? pendingQty : product.pickedQuantity}</span>
              {activeTab === "scanned" && <span className="text-xs text-blue-600 ml-1">(click to unpick)</span>}
            </div>
            <div className="text-right">
              <span className="text-gray-500">Vendor </span>
              <span className="font-medium">{product.vendor}</span>
            </div>
            <div>
              <span
                className={`px-2 py-1 rounded text-xs font-medium ${
                  product.status === "GOOD" ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
                }`}
              >
                {product.status}
              </span>
            </div>
            <div className="text-right">
              <span className="text-gray-500">MRP </span>
              <span className="font-medium">₹{product.mrp.toLocaleString()}</span>
            </div>
            <div className="col-span-2">
              <span className="text-gray-500">Mfg </span>
              <span className="font-medium">{product.mfgDate}</span>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button onClick={handleBack} className="p-1">
            <ArrowLeft className="w-5 h-5 text-gray-600" />
          </button>
          <h1 className="text-lg font-semibold text-gray-900">TOTE_01</h1>
        </div>
        <button onClick={handleClose} className="px-3 py-1 text-sm font-medium text-gray-600 bg-gray-100 rounded">
          CLOSE
        </button>
      </div>

      {/* Scanner Section */}
      <div className="bg-black text-white p-4">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-medium">Scan SKU Code</h2>
          <button
            onClick={handleDeleteImage}
            className="w-8 h-8 bg-white rounded-full flex items-center justify-center hover:bg-gray-100 transition-colors"
          >
            <Trash2 className="w-4 h-4 text-gray-600" />
          </button>
        </div>

        {/* Camera Scanner */}
        <div className="bg-gray-800 rounded-lg p-4 mb-4">
          <div className="flex flex-col items-center">
            <div className="relative w-80 h-40 rounded-lg overflow-hidden mb-4">
              {!capturedImageData ? (
                <>
                  <video ref={videoRef} autoPlay playsInline muted className="w-full h-full object-cover" />
                  <div className="absolute inset-0 border-2 border-white border-opacity-60 rounded-lg">
                    <div className="absolute top-1 left-1 w-6 h-6 border-t-2 border-l-2 border-white"></div>
                    <div className="absolute top-1 right-1 w-6 h-6 border-t-2 border-r-2 border-white"></div>
                    <div className="absolute bottom-1 left-1 w-6 h-6 border-b-2 border-l-2 border-white"></div>
                    <div className="absolute bottom-1 right-1 w-6 h-6 border-b-2 border-r-2 border-white"></div>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="w-4/5 h-0.5 bg-red-500 animate-pulse shadow-lg"></div>
                    </div>
                    {!cameraError && (
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="text-white text-xs text-center bg-black bg-opacity-70 px-3 py-1 rounded-full backdrop-blur-sm">
                          Position SKU barcode here
                        </div>
                      </div>
                    )}
                  </div>
                </>
              ) : (
                <img
                  src={capturedImageData || "/placeholder.svg"}
                  alt="Captured"
                  className="w-full h-full object-cover rounded-lg"
                />
              )}
              {cameraError && !capturedImageData && (
                <div className="absolute inset-0 bg-gray-700 flex items-center justify-center rounded-lg">
                  <div className="text-white text-xs text-center px-3">{cameraError}</div>
                </div>
              )}
            </div>

            {!capturedImageData && (
              <Button
                onClick={handleClickCapture}
                className="bg-white text-black hover:bg-gray-100 border border-gray-300 px-6 py-2 rounded-full font-medium"
              >
                <Camera className="w-4 h-4 mr-2" />
                Click Picture
              </Button>
            )}
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white border-b border-gray-200">
        <div className="flex">
          <button
            onClick={() => setActiveTab("pending")}
            className={`flex-1 px-4 py-3 text-sm font-medium border-b-2 ${
              activeTab === "pending" ? "text-blue-600 border-blue-600" : "text-gray-500 border-transparent"
            }`}
          >
            Pending ({pendingProducts.length})
          </button>
          <button
            onClick={() => setActiveTab("scanned")}
            className={`flex-1 px-4 py-3 text-sm font-medium border-b-2 ${
              activeTab === "scanned" ? "text-blue-600 border-blue-600" : "text-gray-500 border-transparent"
            }`}
          >
            Scanned ({scannedProducts.length})
          </button>
        </div>
      </div>

      {/* Product List */}
      <div className="p-4 pb-20">
        {currentProducts.length > 0 ? (
          <div className="space-y-3">
            {currentProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        ) : (
          <div className="text-center py-8">
            <p className="text-gray-500">{activeTab === "pending" ? "No pending items" : "No scanned items yet"}</p>
          </div>
        )}
      </div>

      {/* Actions Modal */}
      {showActionsModal && selectedProduct && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-end z-50">
          <div className="bg-white w-full rounded-t-lg animate-slide-up">
            <div className="flex justify-between items-center p-4 border-b border-gray-200">
              <h3 className="text-lg font-semibold">ACTIONS</h3>
              <button onClick={() => setShowActionsModal(false)} className="p-1">
                <X className="w-5 h-5 text-gray-600" />
              </button>
            </div>
            <div className="p-0">
              <button
                onClick={handlePickInBulk}
                className="w-full p-4 text-left hover:bg-gray-50 border-b border-gray-100"
              >
                Pick in Bulk
              </button>
              <button
                onClick={handleMarkDamaged}
                className="w-full p-4 text-left hover:bg-gray-50 border-b border-gray-100"
              >
                Mark Damaged
              </button>
              <button
                onClick={handleMarkNotFound}
                className="w-full p-4 text-left hover:bg-gray-50 border-b border-gray-100"
              >
                Mark Not Found
              </button>
              <button onClick={handleShortPick} className="w-full p-4 text-left hover:bg-gray-50">
                Short Pick
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Bulk Pick Modal */}
      {showBulkPickModal && selectedProduct && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg w-full max-w-md">
            <div className="flex justify-between items-center p-4 border-b border-gray-200">
              <h3 className="text-lg font-semibold">PICK IN BULK</h3>
              <button onClick={() => setShowBulkPickModal(false)} className="p-1">
                <X className="w-5 h-5 text-gray-600" />
              </button>
            </div>
            <div className="p-4">
              <div className="mb-4">
                <h4 className="font-medium text-gray-900 mb-1">{selectedProduct.name}</h4>
                <p className="text-sm text-gray-600">{selectedProduct.sku}</p>
              </div>

              <div className="bg-gray-100 rounded-lg p-8 mb-4 flex items-center justify-center">
                <div className="w-32 h-32">
                  <img
                    src={`data:image/svg+xml;base64,${btoa(`
                      <svg width="128" height="128" xmlns="http://www.w3.org/2000/svg">
                        <rect width="128" height="128" fill="${getShoeColor(selectedProduct.color).bg}"/>
                        <path d="M20 80 Q30 70 50 75 Q70 80 90 75 Q100 70 108 80 L108 95 Q100 100 90 95 Q70 100 50 95 Q30 100 20 95 Z" fill="${getShoeColor(selectedProduct.color).accent}"/>
                        <path d="M25 85 Q35 75 55 80 Q75 85 95 80 Q105 75 108 85" stroke="white" strokeWidth="2" fill="none"/>
                        <circle cx="95" cy="82" r="3" fill="white"/>
                      </svg>
                    `)}`}
                    alt="Nike Shoe"
                    className="w-full h-full object-contain"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block text-sm text-gray-600 mb-1">* Quantity</label>
                  <div className="flex items-center border border-gray-300 rounded">
                    <input
                      type="number"
                      value={bulkQuantity}
                      onChange={(e) =>
                        setBulkQuantity(
                          Math.max(
                            1,
                            Math.min(
                              Number.parseInt(e.target.value) || 1,
                              selectedProduct.totalQuantity - selectedProduct.pickedQuantity,
                            ),
                          ),
                        )
                      }
                      className="flex-1 px-3 py-2 text-center border-none outline-none"
                      min="1"
                      max={selectedProduct.totalQuantity - selectedProduct.pickedQuantity}
                    />
                    <span className="px-2 text-gray-500">
                      /{selectedProduct.totalQuantity - selectedProduct.pickedQuantity}
                    </span>
                  </div>
                </div>
                <div>
                  <label className="block text-sm text-gray-600 mb-1">* Inventory Type</label>
                  <select
                    value={inventoryType}
                    onChange={(e) => setInventoryType(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded bg-white"
                  >
                    <option value="Good">Good</option>
                    <option value="Damaged">Damaged</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-sm mb-6">
                <div>
                  <span className="text-gray-600">Batch</span>
                  <div className="font-medium">B1001234355</div>
                </div>
                <div>
                  <span className="text-gray-600">MRP</span>
                  <div className="font-medium">₹{selectedProduct.mrp.toLocaleString()}</div>
                </div>
                <div>
                  <span className="text-gray-600">Mfg. Date</span>
                  <div className="font-medium">{selectedProduct.mfgDate}</div>
                </div>
                <div>
                  <span className="text-gray-600">Expiry Date</span>
                  <div className="font-medium">02/05/2035</div>
                </div>
                <div>
                  <span className="text-gray-600">Cost</span>
                  <div className="font-medium">₹6,000</div>
                </div>
                <div>
                  <span className="text-gray-600">MRP</span>
                  <div className="font-medium">₹10,000</div>
                </div>
              </div>

              <button
                onClick={handleBulkPickSubmit}
                className="w-full bg-blue-600 text-white py-3 rounded font-medium hover:bg-blue-700"
              >
                SUBMIT
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Shelf Empty Alert */}
      {showShelfEmptyAlert && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 m-4 text-center">
            <div className="text-green-600 text-4xl mb-4">✓</div>
            <h3 className="text-lg font-semibold mb-2">All items scanned!</h3>
            <p className="text-gray-600 mb-4">All items from this shelf have been picked successfully.</p>
            <button
              onClick={handleShelfEmptyConfirm}
              className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700"
            >
              OK
            </button>
          </div>
        </div>
      )}

      {/* Camera Capture Modal */}
      <CameraCapture
        isActive={showCameraCapture}
        onCapture={handleCameraCapture}
        onClose={() => setShowCameraCapture(false)}
      />
    </div>
  )
}
