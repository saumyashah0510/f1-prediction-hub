export const getCircuitMap = (country) => {
    if (!country) return "https://media.formula1.com/image/upload/f_auto/q_auto/content/dam/fom-website/2018-redesign-assets/Circuit%20maps%2016x9/Bahrain_Circuit.png";

    const normalized = country.toLowerCase().trim();
  
    const maps = {
      "bahrain": "https://media.formula1.com/image/upload/f_auto/q_auto/content/dam/fom-website/2018-redesign-assets/Circuit%20maps%2016x9/Bahrain_Circuit.png",
      "saudi arabia": "https://media.formula1.com/image/upload/f_auto/q_auto/content/dam/fom-website/2018-redesign-assets/Circuit%20maps%2016x9/Saudi_Arabia_Circuit.png",
      "australia": "https://media.formula1.com/image/upload/f_auto/q_auto/content/dam/fom-website/2018-redesign-assets/Circuit%20maps%2016x9/Australia_Circuit.png",
      "japan": "https://media.formula1.com/image/upload/f_auto/q_auto/content/dam/fom-website/2018-redesign-assets/Circuit%20maps%2016x9/Japan_Circuit.png",
      "china": "https://media.formula1.com/image/upload/f_auto/q_auto/content/dam/fom-website/2018-redesign-assets/Circuit%20maps%2016x9/China_Circuit.png",
      "usa": "https://media.formula1.com/image/upload/f_auto/q_auto/content/dam/fom-website/2018-redesign-assets/Circuit%20maps%2016x9/USA_Circuit.png",
      "united states": "https://media.formula1.com/image/upload/f_auto/q_auto/content/dam/fom-website/2018-redesign-assets/Circuit%20maps%2016x9/USA_Circuit.png",
      "miami": "https://media.formula1.com/image/upload/f_auto/q_auto/content/dam/fom-website/2018-redesign-assets/Circuit%20maps%2016x9/Miami_Circuit.png",
      "italy": "https://media.formula1.com/image/upload/f_auto/q_auto/content/dam/fom-website/2018-redesign-assets/Circuit%20maps%2016x9/Italy_Circuit.png",
      "monaco": "https://media.formula1.com/image/upload/f_auto/q_auto/content/dam/fom-website/2018-redesign-assets/Circuit%20maps%2016x9/Monaco_Circuit.png",
      "canada": "https://media.formula1.com/image/upload/f_auto/q_auto/content/dam/fom-website/2018-redesign-assets/Circuit%20maps%2016x9/Canada_Circuit.png",
      "spain": "https://media.formula1.com/image/upload/f_auto/q_auto/content/dam/fom-website/2018-redesign-assets/Circuit%20maps%2016x9/Spain_Circuit.png",
      "austria": "https://media.formula1.com/image/upload/f_auto/q_auto/content/dam/fom-website/2018-redesign-assets/Circuit%20maps%2016x9/Austria_Circuit.png",
      "united kingdom": "https://media.formula1.com/image/upload/f_auto/q_auto/content/dam/fom-website/2018-redesign-assets/Circuit%20maps%2016x9/Great_Britain_Circuit.png",
      "great britain": "https://media.formula1.com/image/upload/f_auto/q_auto/content/dam/fom-website/2018-redesign-assets/Circuit%20maps%2016x9/Great_Britain_Circuit.png",
      "hungary": "https://media.formula1.com/image/upload/f_auto/q_auto/content/dam/fom-website/2018-redesign-assets/Circuit%20maps%2016x9/Hungary_Circuit.png",
      "belgium": "https://media.formula1.com/image/upload/f_auto/q_auto/content/dam/fom-website/2018-redesign-assets/Circuit%20maps%2016x9/Belgium_Circuit.png",
      "netherlands": "https://media.formula1.com/image/upload/f_auto/q_auto/content/dam/fom-website/2018-redesign-assets/Circuit%20maps%2016x9/Netherlands_Circuit.png",
      "azerbaijan": "https://media.formula1.com/image/upload/f_auto/q_auto/content/dam/fom-website/2018-redesign-assets/Circuit%20maps%2016x9/Baku_Circuit.png",
      "singapore": "https://media.formula1.com/image/upload/f_auto/q_auto/content/dam/fom-website/2018-redesign-assets/Circuit%20maps%2016x9/Singapore_Circuit.png",
      "mexico": "https://media.formula1.com/image/upload/f_auto/q_auto/content/dam/fom-website/2018-redesign-assets/Circuit%20maps%2016x9/Mexico_Circuit.png",
      "brazil": "https://media.formula1.com/image/upload/f_auto/q_auto/content/dam/fom-website/2018-redesign-assets/Circuit%20maps%2016x9/Brazil_Circuit.png",
      "las vegas": "https://media.formula1.com/image/upload/f_auto/q_auto/content/dam/fom-website/2018-redesign-assets/Circuit%20maps%2016x9/Las_Vegas_Circuit.png",
      "qatar": "https://media.formula1.com/image/upload/f_auto/q_auto/content/dam/fom-website/2018-redesign-assets/Circuit%20maps%2016x9/Qatar_Circuit.png",
      "abu dhabi": "https://media.formula1.com/image/upload/f_auto/q_auto/content/dam/fom-website/2018-redesign-assets/Circuit%20maps%2016x9/Abu_Dhabi_Circuit.png",
      "uae": "https://media.formula1.com/image/upload/f_auto/q_auto/content/dam/fom-website/2018-redesign-assets/Circuit%20maps%2016x9/Abu_Dhabi_Circuit.png"
    };
  
    return maps[normalized] || "https://media.formula1.com/image/upload/f_auto/q_auto/content/dam/fom-website/2018-redesign-assets/Circuit%20maps%2016x9/Bahrain_Circuit.png";
};