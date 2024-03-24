function getTimeAgo(dateString: string) {
    const dateFormat = /^(\d{2})\/(\d{2})\/(\d{4}) (\d{2}):(\d{2}):(\d{2})$/;
    const dateParts = dateString.match(dateFormat);

    if (!dateParts) {
        return "Invalid date format";
    }

    const [, day, month, year, hour, minute, second] = dateParts;
    const pastDate = new Date(Number(year), Number(month) - 1, Number(day), Number(hour), Number(minute), Number(second));
    const currentDate = new Date();
    const diffInSeconds = Math.floor((currentDate.getTime() - pastDate.getTime()) / 1000);

    let timeAgo = "";

    if (diffInSeconds < 60) {
        timeAgo = `${diffInSeconds} seconds ago`;
    } else if (diffInSeconds < 3600) {
        timeAgo = `${Math.floor(diffInSeconds / 60)} minutes ago`;
    } else if (diffInSeconds < 86400) {
        timeAgo = `${Math.floor(diffInSeconds / 3600)} hours ago`;
    } else if (diffInSeconds < 604800) {
        timeAgo = `${Math.floor(diffInSeconds / 86400)} days ago`;
    } else if (diffInSeconds < 2629743) {
        timeAgo = `${Math.floor(diffInSeconds / 604800)} weeks ago`;
    } else {
        timeAgo = `${Math.floor(diffInSeconds / 2629743)} months ago`;
    }

    return timeAgo;
}
export default getTimeAgo;