import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { translatePropertyName } from "./propertyTranslations";

// Map of English country names to translation keys
const countryKeyMap: Record<string, string> = {
  "Brazil": "brasil",
  "Peru": "peru",
  "Bolivia": "bolivia",
  "Argentina": "argentina",
  "Colombia": "colombia",
  "Chile": "chile",
  "Ecuador": "ecuador",
  "Venezuela": "venezuela",
  "Paraguay": "paraguay",
  "Uruguay": "uruguay",
  "Guyana": "guyana",
  "Suriname": "suriname",
  "French Guiana": "frenchGuiana",
  "Panama": "panama",
  "Costa Rica": "costaRica",
  "Nicaragua": "nicaragua",
  "Honduras": "honduras",
  "El Salvador": "elSalvador",
  "Guatemala": "guatemala",
  "Belize": "belize",
  "Cuba": "cuba",
  "Jamaica": "jamaica",
  "Haiti": "haiti",
  "Dominican Republic": "dominicanRepublic",
  "Puerto Rico": "puertoRico",
  "Bahamas": "bahamas",
  "Trinidad and Tobago": "trinidadAndTobago",
  "United States": "unitedStates",
  "USA": "unitedStates"
};

export const translateCountry = (countryName: string, translations: any): string => {
  if (!countryName) return "";
  
  const normalized = countryName.trim();
  const key = countryKeyMap[normalized] || normalized.toLowerCase().replace(/\s+/g, '');
  
  if (translations?.countries && translations.countries[key]) {
    return translations.countries[key];
  }
  
  return normalized;
};

export const generatePDF = (
  data: any[],
  fields: string[],
  title: string,
  translations: any
) => {
  const doc = new jsPDF();
  
  // Add title
  doc.setFontSize(18);
  doc.text(title, 14, 22);
  
  // Prepare headers
  // Translate fields to readable headers
  const headers = fields.map(field => {
    // Special cases for common fields if translatePropertyName doesn't cover them
    if (field === 'countryName' || field === 'country') return translations.filters?.country || 'País';
    if (field === 'initiativeName' || field === 'policyName' || field === 'factorName' || field === 'name') return translations.properties?.label || 'Nome';
    
    return translatePropertyName(field);
  });
  
  // Prepare data
  const tableData = data.map(item => {
    return fields.map(field => {
      const value = item[field];
      
      // Translate country values
      if (field === 'countryName' || field === 'country' || field === 'created_in' || field === 'located_in' || field === 'analyzed_in') {
        return translateCountry(value, translations);
      }
      
      return value || "";
    });
  });
  
  autoTable(doc, {
    head: [headers],
    body: tableData,
    startY: 30,
    styles: { fontSize: 10, cellPadding: 2 },
    headStyles: { fillColor: [74, 43, 78] }, // ELLAS purple
  });
  
  doc.save("ellas_data.pdf");
};

// Helper to organize fields: name and country first, then others
export const organizeFields = (fields: string[]): string[] => {
    const priorityFields = ['initiativeName', 'policyName', 'factorName', 'name', 'countryName', 'country'];
    
    const sorted = [...fields].sort((a, b) => {
        const idxA = priorityFields.indexOf(a);
        const idxB = priorityFields.indexOf(b);
        
        if (idxA !== -1 && idxB !== -1) return idxA - idxB;
        if (idxA !== -1) return -1;
        if (idxB !== -1) return 1;
        
        return a.localeCompare(b);
    });
    
    return sorted;
};

