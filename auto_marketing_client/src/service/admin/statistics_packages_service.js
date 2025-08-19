import axios from "axios";

export async function getAllServicePackages() {
    try {
        const response = await axios.get("http://localhost:8080/api/plans");
        const plans = response.data?.data || response.data;
        return Array.isArray(plans) ? plans : [];
    } catch (e) {
        console.error("Error fetching plans:", e);
        return [];
    }
}