import App from "./App"



class Pgyer {

  private apiKey = ''
  public app: App | null = null

  private static instance: Pgyer | null = null

  static getInstance(apiKey: string) {
    if (!this.instance) {
      this.instance = new Pgyer(apiKey)
      this.instance.app = new App(apiKey)
    }
    return this.instance
  }

  private constructor(apiKey: string) {
    this.apiKey = apiKey
  }
}

export default Pgyer