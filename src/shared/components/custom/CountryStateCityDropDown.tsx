"use client";

import React, { useState, useEffect, ChangeEvent } from "react";
import { getCountries, getState, getCity } from "@/hooks/customHooks";

interface DropdownProps {
  handleChange: (e: ChangeEvent<HTMLSelectElement>) => void;
  initialCountry?: string;
  initialState?: string;
  initialCity?: string;
  countryName?: string; // default to "country"
  stateName?: string;   // default to "state"
  cityName?: string;    // default to "city"
}


interface Country {
  iso2: string;
  name: string;
}

interface State {
  iso2: string;
  name: string;
}

interface City {
  name: string;
}

const CountryStateCityDropdown: React.FC<DropdownProps> = ({
  handleChange,
  initialCountry = "",
  initialState = "",
  initialCity = "",
  countryName,
  stateName,
  cityName,
}) => {
  const [countries, setCountries] = useState<Country[]>([]);
  const [states, setStates] = useState<State[]>([]);
  const [cities, setCities] = useState<City[]>([]);

  const [selectedCountry, setSelectedCountry] = useState(initialCountry);
  const [selectedState, setSelectedState] = useState(initialState);
  const [selectedCity, setSelectedCity] = useState(initialCity);

  // Fetch countries on mount
  useEffect(() => {
    const fetchCountries = async () => {
      try {
        const response = await getCountries();
        setCountries(response);
      } catch (err) {
        console.error("Error fetching countries:", err);
      }
    };
    fetchCountries();
  }, []);

  // Fetch states when country changes
  useEffect(() => {
    if (!selectedCountry) {
      setStates([]);
      setCities([]);
      return;
    }
    const fetchStates = async () => {
      try {
        const response = await getState(selectedCountry);
        setStates(response);
      } catch (err) {
        console.error("Error fetching states:", err);
      }
    };
    fetchStates();
  }, [selectedCountry]);

  // Fetch cities when state changes
  useEffect(() => {
    if (!selectedState) {
      setCities([]);
      return;
    }
    const fetchCities = async () => {
      try {
        const response = await getCity(selectedCountry, selectedState);
        setCities(response);
      } catch (err) {
        console.error("Error fetching cities:", err);
      }
    };
    fetchCities();
  }, [selectedState, selectedCountry]);

  return (

    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {/* Country */}
      <div className="flex flex-col">
        <label htmlFor="country" className="mb-1 font-medium">
          Country <span className="text-red-500">*</span>
        </label>
        <select
          id="country"
          name={countryName || "country"}
          value={selectedCountry}
          className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          onChange={(e) => {
            setSelectedCountry(e.target.value);
            setSelectedState("");
            setSelectedCity("");
            handleChange(e);
          }}
        >
          <option value="">Select Country</option>
          {countries.map((country) => (
            <option key={country.iso2} value={country.iso2}>
              {country.name}
            </option>
          ))}
        </select>
      </div>

      {/* State */}
      <div className="flex flex-col">
        <label htmlFor="state" className="mb-1 font-medium">
          State <span className="text-red-500">*</span>
        </label>
        <select
          id="state"
          name={stateName || "state"}
          value={selectedState}
          className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          onChange={(e) => {
            setSelectedState(e.target.value);
            setSelectedCity("");
            handleChange(e);
          }}
        >
          <option value="">Select State</option>
          {states.map((state) => (
            <option key={state.iso2} value={state.iso2}>
              {state.name}
            </option>
          ))}
        </select>
      </div>

      {/* City */}
      <div className="flex flex-col">
        <label htmlFor="city" className="mb-1 font-medium">
          City <span className="text-red-500">*</span>
        </label>
        <select
          id="city"
          name={cityName || "city"}
          value={selectedCity}
          className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          onChange={(e) => {
            setSelectedCity(e.target.value);
            handleChange(e);
          }}
        >
          <option value="">Select City</option>
          {cities.map((city, idx) => (
            <option key={idx} value={city.name}>
              {city.name}
            </option>
          ))}
        </select>
      </div>
    </div>

  );
};

export default CountryStateCityDropdown;
