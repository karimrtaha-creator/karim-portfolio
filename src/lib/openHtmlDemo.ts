/**
 * Opens a remotely-hosted HTML file as a rendered page, bypassing whatever
 * Content-Type header the host actually serves.
 *
 * Diagnosed against this project's Supabase Storage: the object-serving
 * endpoint (GET /object/public/...) does not derive its Content-Type
 * response header from the same value its own /object/info/... metadata
 * endpoint reports — verified with cache-busted, no-cache-header requests
 * that still returned text/plain from origin (CF-Cache-Status: MISS) while
 * /object/info consistently reported text/html for the identical object.
 * That's a platform-level serving behavior outside this project's control,
 * so no upload-side fix can reach it.
 *
 * Fetching the raw bytes and wrapping them in a Blob with an explicitly-set
 * type sidesteps the broken header entirely — the browser only ever sees
 * the Content-Type we set here, never whatever the origin server returned.
 */
export async function openHtmlDemo(url: string): Promise<void> {
  // Open synchronously, before the async fetch, so browsers don't treat
  // this as an unsolicited popup and block it.
  const tab = window.open('', '_blank')

  try {
    const response = await fetch(url)
    if (!response.ok) throw new Error(`Demo fetch failed: ${response.status}`)
    const html = await response.text()
    const blob = new Blob([html], { type: 'text/html' })
    const blobUrl = URL.createObjectURL(blob)

    if (tab) {
      tab.location.href = blobUrl
    } else {
      // Popup blocked — fall back to the original URL in this tab.
      window.location.href = url
    }
  } catch (error) {
    tab?.close()
    throw error
  }
}
