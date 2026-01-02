export const timeAgo = (dateString: string) => {
  const pastDate = new Date(dateString)
  const now = new Date()

  const differenceInMilliseconds = now.getTime() - pastDate.getTime()

  const minute = 60 * 1000
  const hour = 60 * minute
  const day = 24 * hour
  const month = 30 * day
  const year = 365 * day

  if (differenceInMilliseconds < minute) {
    return "updated just now"
  } else if (differenceInMilliseconds < hour) {
    const minutes = Math.round(differenceInMilliseconds / minute)
    return `updated ${minutes} minute${minutes > 1 ? 's' : ''} ago`
  } else if (differenceInMilliseconds < day) {
    const hours = Math.round(differenceInMilliseconds / hour)
    return `updated ${hours} hour${hours > 1 ? 's' : ''} ago`
  } else if (differenceInMilliseconds < month) {
    const days = Math.round(differenceInMilliseconds / day)
    return `updated ${days} day${days > 1 ? 's' : ''} ago`
  } else if (differenceInMilliseconds < year) {
    const months = Math.round(differenceInMilliseconds / month)
    return `updated ${months} month${months > 1 ? 's' : ''} ago`
  } else {
    const years = Math.round(differenceInMilliseconds / year)
    return `updated ${years} year${years > 1 ? 's' : ''} ago`
  }
}