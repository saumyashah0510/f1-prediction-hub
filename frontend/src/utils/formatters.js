// Cleans PostgreSQL interval strings (e.g. "0 days 00:01:23.456") -> "1:23.456"
export const formatLapTime = (timeStr) => {
    if (!timeStr) return "N/A";
    
    // Check if it's a gap (starts with +)
    if (timeStr.startsWith("+")) return timeStr;
  
    // Remove "0 days" and extra zeros
    let clean = timeStr.replace(/0 days\s+/i, "").trim();
    
    // Remove leading "00:" if present (hours)
    if (clean.startsWith("00:")) {
        clean = clean.substring(3);
    }
    
    // Remove leading "0" from minutes (e.g. 01:23 -> 1:23)
    if (clean.startsWith("0")) {
        clean = clean.substring(1);
    }
    
    // Truncate microseconds to 3 digits if too long
    if (clean.includes(".") && clean.split(".")[1].length > 3) {
        const parts = clean.split(".");
        clean = `${parts[0]}.${parts[1].substring(0, 3)}`;
    }
  
    return clean;
  };
  
  // Static data for 2025 Calendar to fill gaps in DB
  export const getCircuitDetails = (country) => {
      const c = country?.toLowerCase().trim();
      const data = {
          "bahrain": { laps: 57, length: "5.412" },
          "saudi arabia": { laps: 50, length: "6.174" },
          "australia": { laps: 58, length: "5.278" },
          "japan": { laps: 53, length: "5.807" },
          "china": { laps: 56, length: "5.451" },
          "miami": { laps: 57, length: "5.412" },
          "italy": { laps: 63, length: "4.909" }, // Imola
          "monaco": { laps: 78, length: "3.337" },
          "canada": { laps: 70, length: "4.361" },
          "spain": { laps: 66, length: "4.657" },
          "austria": { laps: 71, length: "4.318" },
          "united kingdom": { laps: 52, length: "5.891" },
          "great britain": { laps: 52, length: "5.891" },
          "hungary": { laps: 70, length: "4.381" },
          "belgium": { laps: 44, length: "7.004" },
          "netherlands": { laps: 72, length: "4.259" },
          "italy_monza": { laps: 53, length: "5.793" }, // Monza
          "azerbaijan": { laps: 51, length: "6.003" },
          "singapore": { laps: 62, length: "4.940" },
          "usa": { laps: 56, length: "5.513" },
          "mexico": { laps: 71, length: "4.304" },
          "brazil": { laps: 71, length: "4.309" },
          "las vegas": { laps: 50, length: "6.201" },
          "qatar": { laps: 57, length: "5.419" },
          "abu dhabi": { laps: 58, length: "5.281" },
          "uae": { laps: 58, length: "5.281" }
      };
      
      // Default fallback
      return data[c] || { laps: "??", length: "?.???" };
  };