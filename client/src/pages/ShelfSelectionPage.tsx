/**
 * ShelfSelectionPage Component
 * 
 * Purpose: Displays shelf selection interface when barcode mode is OFF
 * - Shows available shelves with SKU counts and quantities
 * - Allows filtering and searching shelf codes
 * - Provides input box interface instead of camera scanning
 * 
 * Flow: Start Picking (when barcode OFF) → Shelf Selection → SKU Input Page
 */

// import React, { useState } from 'react';
// import { ArrowLeft, Search, Filter, ChevronUp, ChevronDown } from 'lucide-react';
// import { useLocation, useParams } from 'wouter';
// import { Button } from '@/components/ui/button';
// import { Input } from '@/components/ui/input';

// export const ShelfSelectionPage: React.FC = () => {
//   const [, setLocation] = useLocation();
//   const { id } = useParams<{ id: string }>();
//   const [searchCode, setSearchCode] = useState('');
//   const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
//   const [activeTab, setActiveTab] = useState<'pending' | 'scanned'>('pending');

//   // Mock shelf data matching the screenshots
//   const shelves = [
//     {
//       code: 'SHELF_001',
//       skuCount: 5,
//       pendingQty: 120,
//       scannedQty: 0,
//     },
//     {
//       code: 'SHELF_002', 
//       skuCount: 3,
//       pendingQty: 80,
//       scannedQty: 0,
//     },
//     {
//       code: 'SHELF_003',
//       skuCount: 8,
//       pendingQty: 200,
//       scannedQty: 0,
//     },
//     {
//       code: 'SHELF_004',
//       skuCount: 2,
//       pendingQty: 45,
//       scannedQty: 0,
//     },
//   ];

//   // Filter and sort shelves
//   const filteredShelves = shelves
//     .filter(shelf => 
//       shelf.code.toLowerCase().includes(searchCode.toLowerCase())
//     )
//     .sort((a, b) => {
//       if (sortOrder === 'asc') {
//         return a.code.localeCompare(b.code);
//       } else {
//         return b.code.localeCompare(a.code);
//       }
//     });

//   const handleBack = () => {
//     setLocation(`/picklist/${id}`);
//   };

//   const handleShelfSelect = (shelfCode: string) => {
//     // Navigate to SKU input page for selected shelf
//     setLocation(`/sku-input/${id}/${shelfCode}`);
//   };

//   const handleScanShelfCode = () => {
//     if (searchCode.trim()) {
//       // Navigate to SKU input page with scanned code
//       setLocation(`/sku-input/${id}/${searchCode.trim()}`);
//     }
//   };

//   return (
//     <div className="bg-white min-h-screen w-full">
//       <div className="bg-white w-full max-w-md mx-auto min-h-screen relative">
//         {/* Header */}
//         <header className="flex h-12 items-center justify-between w-full bg-white border-b border-[#e0e0e0] px-4">
//           <div className="flex items-center gap-3">
//             <button 
//               className="flex items-center justify-center w-8 h-8 hover:bg-gray-100 rounded transition-colors duration-200"
//               onClick={handleBack}
//             >
//               <ArrowLeft className="h-5 w-5 text-text-elementsprimary" />
//             </button>
//             <h1 className="font-semibold text-text-elementsprimary text-lg">
//               PK1000
//             </h1>
//           </div>
//         </header>

//         {/* Scan Shelf Code Input */}
//         <div className="px-4 py-4">
//           <div className="relative">
//             <div className="absolute left-3 top-1/2 transform -translate-y-1/2">
//               <Search className="h-4 w-4 text-gray-400" />
//             </div>
//             <Input
//               placeholder="Scan Shelf Code"
//               value={searchCode}
//               onChange={(e) => setSearchCode(e.target.value)}
//               className="pl-10 pr-4 py-3 border border-gray-300 rounded-lg text-base"
//               onKeyPress={(e) => {
//                 if (e.key === 'Enter') {
//                   handleScanShelfCode();
//                 }
//               }}
//             />
//           </div>
//         </div>

//         {/* Tabs */}
//         <div className="px-4">
//           <div className="flex border-b border-gray-200">
//             <button
//               className={`flex-1 py-3 text-sm font-medium border-b-2 transition-colors ${
//                 activeTab === 'pending'
//                   ? 'border-blue-500 text-blue-600'
//                   : 'border-transparent text-gray-500 hover:text-gray-700'
//               }`}
//               onClick={() => setActiveTab('pending')}
//             >
//               Pending Shelf <span className="ml-1 bg-blue-100 text-blue-600 px-2 py-1 rounded-full text-xs">2</span>
//             </button>
//             <button
//               className={`flex-1 py-3 text-sm font-medium border-b-2 transition-colors ${
//                 activeTab === 'scanned'
//                   ? 'border-blue-500 text-blue-600'
//                   : 'border-transparent text-gray-500 hover:text-gray-700'
//               }`}
//               onClick={() => setActiveTab('scanned')}
//             >
//               Scanned Shelf <span className="ml-1 bg-gray-100 text-gray-600 px-2 py-1 rounded-full text-xs">0</span>
//             </button>
//           </div>
//         </div>

//         {/* Filters and Sort */}
//         <div className="px-4 py-3 flex items-center justify-between bg-gray-50">
//           <button className="flex items-center gap-2 text-gray-600 text-sm">
//             <Filter className="h-4 w-4" />
//             FILTERS
//           </button>
//           <button 
//             className="flex items-center gap-2 text-gray-600 text-sm"
//             onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
//           >
//             Picklist Code
//             {sortOrder === 'asc' ? (
//               <ChevronUp className="h-4 w-4" />
//             ) : (
//               <ChevronDown className="h-4 w-4" />
//             )}
//           </button>
//         </div>

//         {/* Shelf List */}
//         <div className="px-4 py-2 space-y-3">
//           {filteredShelves.map((shelf) => (
//             <div
//               key={shelf.code}
//               className="bg-white border border-gray-200 rounded-lg p-4 cursor-pointer hover:bg-gray-50 transition-colors"
//               onClick={() => handleShelfSelect(shelf.code)}
//             >
//               <div className="flex justify-between items-start mb-2">
//                 <h3 className="font-semibold text-lg text-gray-900">
//                   {shelf.code}
//                 </h3>
//               </div>
              
//               <div className="flex justify-between items-center text-sm text-gray-600">
//                 <div>
//                   <span className="text-gray-500">SKU Count </span>
//                   <span className="font-medium">{shelf.skuCount}</span>
//                 </div>
//                 <div>
//                   <span className="text-gray-500">Pending Qty </span>
//                   <span className="font-medium">{shelf.pendingQty}</span>
//                 </div>
//               </div>
//             </div>
//           ))}
//         </div>
//       </div>
//     </div>
//   );
// };
import React, { useEffect, useState } from 'react';
import {
  ArrowLeft,
  Search,
  Filter,
  ChevronUp,
  ChevronDown,
} from 'lucide-react';
import { useLocation, useParams } from 'wouter';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { fetchShelvesInPicklist } from '@/services/api';

type Shelf = {
  id: string;
  code: string;
  skuCount: number;
  pendingQty: number;
  scannedQty: number;
};

export const ShelfSelectionPage: React.FC = () => {
  const [, setLocation] = useLocation();
  const { id } = useParams<{ id: string }>();
  const [searchCode, setSearchCode] = useState('');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
  const [activeTab, setActiveTab] = useState<'pending' | 'scanned'>('pending');
  const [shelves, setShelves] = useState<Shelf[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // useEffect(() => {
  //   const fetchShelves = async () => {
  //     try {
  //       //setLoading(true);
  //       const data = await fetchShelvesInPicklist(id);
  //       setShelves(data || []);
  //     } catch (err) {
  //       setError('Failed to load shelves');
  //     } finally {
  //       setLoading(false);
  //     }
  //   };

  //   fetchShelves();
  // }, [id]);
//   useEffect(() => {
//   const fetchShelves = async () => {
//     try {
//       const data = await fetchShelvesInPicklist(id);
//       console.log("🚀 Raw shelf data:", data);

//       const transformed = (data || []).map((shelf: any) => ({
//         id: shelf.id || shelf.shelfId,
//         code: shelf.code || shelf.codeId || shelf.shelfId,
//         skuCount: shelf.skuCount || shelf.skuInputProducts?.length || 0,
//         pendingQty: shelf.pendingQty ?? 0,
//         scannedQty: shelf.scannedQty ?? 0,
//       }));

//       console.log("✅ Transformed shelves:", transformed);
//       setShelves(transformed);
//     } catch (err) {
//       setError('Failed to load shelves');
//     } finally {
//       setLoading(false);
//     }
//   };

//   fetchShelves();
// }, [id]);
useEffect(() => {
  const fetchShelves = async () => {
    try {
      const data = await fetchShelvesInPicklist(id);
      console.log("Raw shelf data:", data);

      const transformed = (data || []).map((shelf: any) => ({
        id: shelf.id,
        code: shelf.shelfCode || `SHELF_${shelf.id}`, // ✅ fallback to "SHELF_1", etc.
        skuCount: shelf.skuCount ?? shelf.skuInputProducts?.length ?? 0,
        pendingQty: shelf.pendingQty ?? 0,
        scannedQty: shelf.scannedQty ?? 0,
      }));

      console.log("Transformed shelf data:", transformed);
      setShelves(transformed);
    } catch (err) {
      setError('Failed to load shelves');
    } finally {
      setLoading(false);
    }
  };

  fetchShelves();
}, [id]);


console.log("here is the shelves",shelves[0]);
  const filteredShelves = shelves
    .filter((shelf) =>
      (shelf?.code ?? '').toLowerCase().includes(searchCode.toLowerCase())
    )
    .sort((a, b) =>
      sortOrder === 'asc'
        ? (a.code ?? '').localeCompare(b.code ?? '')
        : (b.code ?? '').localeCompare(a.code ?? '')
    );

  const handleBack = () => {
    setLocation(`/picklist/${id}`);
  };

  const handleShelfSelect = (shelfCode: string) => {
    setLocation(`/sku-input/${id}/${shelfCode}`);
  };

  const handleScanShelfCode = () => {
    if (searchCode.trim()) {
      setLocation(`/sku-input/${id}/${searchCode.trim()}`);
    }
  };

  return (
    <div className="bg-white min-h-screen w-full">
      <div className="bg-white w-full max-w-md mx-auto min-h-screen relative">
        {/* Header */}
        <header className="flex h-12 items-center justify-between w-full bg-white border-b border-[#e0e0e0] px-4">
          <div className="flex items-center gap-3">
            <button
              className="flex items-center justify-center w-8 h-8 hover:bg-gray-100 rounded transition-colors duration-200"
              onClick={handleBack}
            >
              <ArrowLeft className="h-5 w-5 text-text-elementsprimary" />
            </button>
            <h1 className="font-semibold text-text-elementsprimary text-lg">
              PK{id}
            </h1>
          </div>
        </header>

        {/* Scan Shelf Code Input */}
        <div className="px-4 py-4">
          <div className="relative">
            <div className="absolute left-3 top-1/2 transform -translate-y-1/2">
              <Search className="h-4 w-4 text-gray-400" />
            </div>
            <Input
              placeholder="Scan Shelf Code"
              value={searchCode}
              onChange={(e) => setSearchCode(e.target.value)}
              className="pl-10 pr-4 py-3 border border-gray-300 rounded-lg text-base"
              onKeyPress={(e) => {
                if (e.key === 'Enter') {
                  handleScanShelfCode();
                }
              }}
            />
          </div>
        </div>

        {/* Tabs */}
        <div className="px-4">
          <div className="flex border-b border-gray-200">
            <button
              className={`flex-1 py-3 text-sm font-medium border-b-2 transition-colors ${
                activeTab === 'pending'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
              onClick={() => setActiveTab('pending')}
            >
              Pending Shelf{' '}
              <span className="ml-1 bg-blue-100 text-blue-600 px-2 py-1 rounded-full text-xs">
                {shelves.filter((shelf) => shelf.pendingQty > 0).length}
              </span>
            </button>
            <button
              className={`flex-1 py-3 text-sm font-medium border-b-2 transition-colors ${
                activeTab === 'scanned'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
              onClick={() => setActiveTab('scanned')}
            >
              Scanned Shelf{' '}
              <span className="ml-1 bg-gray-100 text-gray-600 px-2 py-1 rounded-full text-xs">
                {shelves.filter((shelf) => shelf.scannedQty > 0).length}
              </span>
            </button>
          </div>
        </div>

        {/* Filters and Sort */}
        <div className="px-4 py-3 flex items-center justify-between bg-gray-50">
          <button className="flex items-center gap-2 text-gray-600 text-sm">
            <Filter className="h-4 w-4" />
            FILTERS
          </button>
          <button
            className="flex items-center gap-2 text-gray-600 text-sm"
            onClick={() =>
              setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')
            }
          >
            Picklist Code
            {sortOrder === 'asc' ? (
              <ChevronUp className="h-4 w-4" />
            ) : (
              <ChevronDown className="h-4 w-4" />
            )}
          </button>
        </div>

        {/* Shelf List */}
        <div className="px-4 py-2 space-y-3">
          {loading ? (
            <p className="text-center text-gray-500 py-10">Loading shelves...</p>
          ) : error ? (
            <p className="text-center text-red-500 py-10">{error}</p>
          ) : filteredShelves.length === 0 ? (
            <p className="text-center text-gray-400 py-10">No shelves found</p>
          ) : (
            filteredShelves.map((shelf) => (
              <div
                key={shelf.code}
                className="bg-white border border-gray-200 rounded-lg p-4 cursor-pointer hover:bg-gray-50 transition-colors"
                onClick={() => handleShelfSelect(shelf.code)}
              >
                <div className="flex justify-between items-start mb-2">
                  <h3 className="font-semibold text-lg text-gray-900">
                    {shelf.code}
                  </h3>
                </div>

                <div className="flex justify-between items-center text-sm text-gray-600">
                  <div>
                    <span className="text-gray-500">SKU Count </span>
                    <span className="font-medium">{shelf.skuCount}</span>
                  </div>
                  <div>
                    <span className="text-gray-500">Pending Qty </span>
                    <span className="font-medium">{shelf.pendingQty}</span>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};
