export const getTeamColor = (teamName) => {
  // Normalize strings to handle slight variations
  const name = teamName?.toLowerCase() || '';
  
  if (name.includes('red bull')) return '#3671C6';
  if (name.includes('ferrari')) return '#E8002D';
  if (name.includes('mercedes')) return '#27F4D2';
  if (name.includes('mclaren')) return '#FF8000';
  if (name.includes('aston martin')) return '#229971';
  if (name.includes('alpine')) return '#FF87BC';
  if (name.includes('williams')) return '#64C4FF';
  if (name.includes('rb') || name.includes('alpha')) return '#6692FF';
  if (name.includes('sauber') || name.includes('alfa')) return '#52E252';
  if (name.includes('haas')) return '#B6BABD';
  
  return '#38383F'; // Default Gray
};