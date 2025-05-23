// This file contains utility functions for geocoding and distance calculation.
// It includes functions to geocode an address, reverse geocode coordinates, and calculate the distance between two geographical points.
// The functions use the Google Maps Geocoding API to perform these tasks.
// The geocodeAddress function takes an address string and returns the latitude and longitude of that address.
// The reverseGeocode function takes latitude and longitude and returns the formatted address.
// The getDistanceInMeters function calculates the distance in meters between two geographical points using the Haversine formula.
 export async function geocodeAddress(address: string): Promise<{lat: number, lng: number} | null> {
    const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY
    const url = `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(address)}&key=${apiKey}`;
  
    try {
      const response = await fetch(url);
      const data = await response.json();
  
      if (data.status === "OK") {
        const location = data.results[0].geometry.location;
        return { lat: location.lat, lng: location.lng };
      } else {
        console.error("Geocoding error:", data.status);
        return null;
      }
    } catch (error) {
      console.error("Geocoding fetch error:", error);
      return null;
    }
  }
  
  export async function reverseGeocode(lat: number, lng: number): Promise<string | null> {
    try {
      const response = await fetch(`/api/geocode/reverse?lat=${lat}&lng=${lng}`)
  
      const contentType = response.headers.get("content-type")
  
      // Check if the response is not ok or if the content type is not JSON
      if (!response.ok || !contentType?.includes("application/json")) {
        const text = await response.text()
        console.error("Backend returned unexpected response:", text)
        return null
      }
  
      const data = await response.json()
  
      if (data.address) {
        return data.address
      } else {
        console.warn("Address not found in backend response:", data)
        return null
      }
    } catch (error) {
      console.error("Reverse geocoding via backend failed:", error)
      return null
    }
  }
  
  
  
  export function getDistanceInMeters(
    coord1: { lat: number; lng: number },
    coord2: { lat: number; lng: number }
  ): number {
    const R = 6371e3; // Radius of the Earth in meters
    const φ1 = (coord1.lat * Math.PI) / 180;
    const φ2 = (coord2.lat * Math.PI) / 180;
    const Δφ = ((coord2.lat - coord1.lat) * Math.PI) / 180;
    const Δλ = ((coord2.lng - coord1.lng) * Math.PI) / 180;
  
    const a =
      Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
      Math.cos(φ1) * Math.cos(φ2) *
      Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
  
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  
    return R * c;
  }
  
  