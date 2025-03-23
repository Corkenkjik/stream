const apiKey = () => {
  const api_key = Deno.env.get("API_KEY")
  if (!api_key) throw new Error("API_KEY is not set")
  return api_key
}

const environment = (): "dev" | "prod" => {
  const environ = Deno.env.get("ENV")
  if (!environ) {
    return "dev"
  }
  return environ as "dev" | "prod"
}

export const env = {
  api_key: apiKey(),
  environment: environment(),
}
