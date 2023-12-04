export function transformAxiosResponse<T>(data: string): T {
  try {
    return JSON.parse(data)
  } catch (error) {
    throw Error(
      `[requestClient] Error parsing response JSON data - ${JSON.stringify(
        error,
      )}`,
    )
  }
}
