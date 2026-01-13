// customHooks.ts
import axios from "axios";

// Base API URL
const BASE_URL = "https://api.countrystatecity.in/v1";
const API_TOKEN = process.env.NEXT_PUBLIC_API_TOKEN || "RzhpMjBuRlI0RWdma3ZwOWpmQlV3SlRVWDdXald2d2drSlBpQ25GSA==";

const headers = {
  Accept: "application/json",
  "X-CSCAPI-KEY": API_TOKEN,
};

// Types
export interface Country {
  iso2: string;
  name: string;
}

export interface State {
  iso2: string;
  name: string;
}

export interface City {
  name: string;
}

export interface OrganizationUpdateData {
  [key: string]: any; // adjust fields according to your API
}

// Get countries
export const getCountries = async (): Promise<Country[]> => {
  try {
    const response = await axios.get<Country[]>(`${BASE_URL}/countries`, { headers });
    return response.data;
  } catch (error: any) {
    console.error("Error fetching countries:", error.message);
    return [];
  }
};

// Get states
export const getState = async (countryISO: string): Promise<State[]> => {
  if (!countryISO) return [];
  try {
    const response = await axios.get<State[]>(`${BASE_URL}/countries/${countryISO}/states`, { headers });
    return response.data;
  } catch (error: any) {
    console.error("Error fetching states:", error.message);
    return [];
  }
};

// Get cities
export const getCity = async (countryISO: string, stateISO: string): Promise<City[]> => {
  if (!countryISO || !stateISO) return [];
  try {
    const response = await axios.get<City[]>(`${BASE_URL}/countries/${countryISO}/states/${stateISO}/cities`, { headers });
    return response.data;
  } catch (error: any) {
    console.error("Error fetching cities:", error.message);
    return [];
  }
};

// Update organization
export const updateOrganization = async (data: OrganizationUpdateData, id: string | number) => {
  const url = `https://crm-backend-xb27.onrender.com/api/org/update/${id}`;
  try {
    const response = await axios.patch(url, data, {
      headers: {
        "Content-Type": "application/json",
      },
    });
    return response.status === 201 ? response.data : null;
  } catch (error: any) {
    console.error("Error updating organization:", error.message);
    throw error;
  }
};
