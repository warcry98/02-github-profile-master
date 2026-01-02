import { githubAPI } from "./api"

class rateLimit {
  static async check () {
    try {
      // const timestampSec: number = Math.floor(Date.now() / 1000)
      const response = await githubAPI.rateLimit()
      if (response.rate.remaining === 0) {
        return true
      }
      return false
    } catch (err) {
      throw err
    }
  }
}

export { rateLimit }