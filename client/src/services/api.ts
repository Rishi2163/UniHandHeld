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
export const fetchShelfInPicklist = async (picklistId: string, shelfId: string) => {
  const picklist = await fetchPicklistById(picklistId);
  return picklist?.shelfItems.find((shelf:any) => shelf.id === shelfId);
};

export const fetchSKUItemsFromShelf = async (picklistId: string, shelfId: string) => {
  const picklist = await fetchPicklistById(picklistId);
  const shelf = picklist?.shelfItems.find((shelf:any) => shelf.id === shelfId);
  return shelf?.skuInputProducts || [];
};