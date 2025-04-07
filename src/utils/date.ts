export function formatDateString(dateString: string): string {
    if (!dateString) return '';

    try {
        const date = new Date(dateString);

        // Format: DD-MM-YYYY HH:MM
        const day = String(date.getDate()).padStart(2, '0');
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const year = date.getFullYear();
        const hours = String(date.getHours()).padStart(2, '0');
        const minutes = String(date.getMinutes()).padStart(2, '0');

        return `${day}-${month}-${year} ${hours}:${minutes}`;
    } catch (e) {
        console.error("Error formatting date:", e);
        return dateString;
    }
}