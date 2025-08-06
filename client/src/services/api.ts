// src/services/api.ts
import axios from "axios";

const apiUrl = "https://dummyjson.com/c/1e96-9cba-4ca2-b9d7"; // your mock data URL

export const fetchAllPicklists = async () => {
  const response = await axios.get(apiUrl, {
    headers: {
      Accept: "application/json",
    },
  });
  return response.data.picklistItems;
};

// Get picklist by ID
export const fetchPicklistById = async (picklistId: string) => {
  const picklists = await fetchAllPicklists();
  return picklists.find((item:any) => item.id === picklistId);
};

// Get shelf by ID within a picklist

export const fetchShelvesInPicklist = async (picklistCode: string) => {
  const picklists = await fetchAllPicklists();
  const found = picklists.find((item: any) => item.picklistCode === picklistCode);
  return found?.shelfItems || []; // ⬅ return shelfItems directly
};

// export const fetchSKUItemsFromShelf = async (picklistId: string, shelfId: string) => {
//   const picklist = await fetchPicklistById(picklistId);
//   const shelf = picklist?.shelfItems.find((shelf:any) => shelf.id === shelfId);
//   return shelf?.skuInputProducts || [];
// };
export const fetchSKUItemsFromShelf = async (picklistId:any,shelfId: string) => {
  const shelfItems = await fetchShelvesInPicklist(picklistId);
  const skuItems = shelfItems.filter((item:any)=> item.shelfCode === shelfId);
  return skuItems;
};