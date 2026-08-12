function serveApplicationShell({ request, env }) {
  const assetUrl = new URL(request.url)
  assetUrl.pathname = '/'
  assetUrl.search = ''

  return env.ASSETS.fetch(new Request(assetUrl, request))
}

export const onRequestGet = serveApplicationShell
export const onRequestHead = serveApplicationShell
