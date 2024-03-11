const dateFormatter = (dateString: string): string => {  
    const date = new Date(dateString);
    const month = date.toLocaleString('en', { month: 'long' });
    const day = date.getDate();
    const year = date.getFullYear();
    return `${month} ${day}, ${year}`;
}

export default dateFormatter;

