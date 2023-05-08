export function checkApiKey(apiKey: string) {
  if (!apiKey) {
    throw new Error('请先配置apiKey')
  }
}