const fs = require('fs');
const path = require('path');

// Cache the medicine data
let medicineCache = null;
let genericCache = null;

const loadMedicines = () => {
    if (medicineCache) {
        return medicineCache;
    }
    try {
        const filePath = path.join(__dirname, '../datasets/medicine.json');
        const data = fs.readFileSync(filePath, 'utf8');
        medicineCache = JSON.parse(data);
        return medicineCache;
    } catch (error) {
        console.error('Error loading medicines:', error);
        return [];
    }
};

const loadGenerics = () => {
    if (genericCache) {
        return genericCache;
    }
    try {
        const filePath = path.join(__dirname, '../datasets/generic.json');
        const data = fs.readFileSync(filePath, 'utf8');
        genericCache = JSON.parse(data);
        return genericCache;
    } catch (error) {
        console.error('Error loading generics:', error);
        return [];
    }
};

// Search medicines by brand name or generic name
const searchMedicines = async (req, res) => {
    try {
        const { query, dosageFilter } = req.query;
        
        // If there's a dosage filter, allow empty query (to show all of that type)
        // Otherwise, require at least 2 characters
        if (!dosageFilter && (!query || query.trim().length < 2)) {
            return res.json([]);
        }

        const medicines = loadMedicines();
        const generics = loadGenerics();
        const searchTerm = (query || '').toLowerCase().trim();

        // Helper function to check if dosage form matches filter
        const matchesDosageFilter = (dosageForm) => {
            if (!dosageFilter) return true;
            const form = (dosageForm || '').toLowerCase();
            const filter = dosageFilter.toLowerCase();
            
            if (filter === 'tablet') return form.includes('tablet');
            if (filter === 'liquid') return form.includes('syrup') || form.includes('liquid') || form.includes('suspension') || form.includes('solution');
            if (filter === 'capsule') return form.includes('capsule');
            if (filter === 'injection') return form.includes('injection') || form.includes('injectable') || form.includes('iv injection');
            if (filter === 'topical') return form.includes('cream') || form.includes('ointment') || form.includes('gel');
            if (filter === 'drop') return form.includes('drop');
            if (filter === 'spray') return form.includes('spray');
            return false;
        };

        // Search in medicine dataset (brand name and generic name)
        const medicineResults = medicines
            .filter(med => {
                // If there's a search term, check name matches
                const nameMatches = searchTerm.length === 0 || 
                    (med['brand name'] || '').toLowerCase().includes(searchTerm) ||
                    (med.generic || '').toLowerCase().includes(searchTerm);
                
                // Check dosage form filter
                const dosageMatches = matchesDosageFilter(med['dosage form']);
                
                return nameMatches && dosageMatches;
            })
            .map(med => ({
                brandName: med['brand name'] || '',
                generic: med.generic || '',
                strength: med.strength || '',
                dosageForm: med['dosage form'] || '',
                manufacturer: med.manufacturer || '',
                source: 'brand'
            }));

        // Search in generic dataset (generic name)
        const genericResults = generics
            .filter(gen => {
                const genericName = (gen['generic name'] || '').toLowerCase();
                return genericName.includes(searchTerm);
            })
            .map(gen => ({
                brandName: gen['generic name'] || '',
                generic: gen['generic name'] || '',
                strength: '',
                dosageForm: gen['drug class'] || '',
                manufacturer: '',
                source: 'generic',
                indication: gen.indication || '',
                drugClass: gen['drug class'] || ''
            }));

        // Combine and deduplicate results (prioritize brand matches)
        const combinedResults = [...medicineResults, ...genericResults];
        
        // Remove duplicates based on brandName/generic name
        const uniqueResults = [];
        const seen = new Set();
        
        for (const result of combinedResults) {
            const key = result.brandName.toLowerCase();
            if (!seen.has(key)) {
                seen.add(key);
                uniqueResults.push(result);
            }
        }

        // Sort: exact matches first, then by source (brand first), then alphabetically
        uniqueResults.sort((a, b) => {
            const aExact = a.brandName.toLowerCase().startsWith(searchTerm);
            const bExact = b.brandName.toLowerCase().startsWith(searchTerm);
            if (aExact && !bExact) return -1;
            if (!aExact && bExact) return 1;
            
            if (a.source === 'brand' && b.source !== 'brand') return -1;
            if (a.source !== 'brand' && b.source === 'brand') return 1;
            
            return a.brandName.localeCompare(b.brandName);
        });

        // Limit to 20 results
        const finalResults = uniqueResults.slice(0, 20);

        res.json(finalResults);
    } catch (err) {
        console.error('Error searching medicines:', err);
        res.status(500).json({ message: 'Server Error', error: err.message });
    }
};

module.exports = {
    searchMedicines
};


