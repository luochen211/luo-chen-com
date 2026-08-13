function serveApplicationShell({ request, env }) {
  const requestUrl = new URL(request.url)
  if (requestUrl.pathname.startsWith('/articles/') && requestUrl.pathname.endsWith('.md')) {
    return env.ASSETS.fetch(request)
  }

  const assetUrl = requestUrl
  assetUrl.pathname = '/'
  assetUrl.search = ''

  return env.ASSETS.fetch(new Request(assetUrl, request))
}

export const onRequestGet = serveApplicationShell
export const onRequestHead = serveApplicationShell
