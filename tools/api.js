// Talking to the Studio server (tools/serve.py). Without it the Studio still
// edits everything, but Save is off and Copy/Download are the way out.

const ROOT = new URL('../', import.meta.url);
const url = (path) => new URL(path, ROOT);

let serverPromise = null;

// True when tools/serve.py is running (it answers /api/ping).
export function hasServer() {
  serverPromise ??= fetch(url('api/ping'), { cache: 'no-store' })
    .then(async (response) => response.ok && (await response.json()).ok === true)
    .catch(() => false);
  return serverPromise;
}

// File names in a project folder, or null without the server.
export async function listDir(dir) {
  if (!(await hasServer())) return null;
  try {
    const response = await fetch(url(`api/list?dir=${encodeURIComponent(dir)}`), { cache: 'no-store' });
    const data = await response.json();
    return data.ok ? data.files : null;
  } catch {
    return null;
  }
}

// A project file as text ('' if it can't be read).
export async function readText(path) {
  try {
    const response = await fetch(url(`${path}?t=${Date.now()}`), { cache: 'no-store' });
    return response.ok ? await response.text() : '';
  } catch {
    return '';
  }
}

export async function fileExists(path) {
  try {
    const response = await fetch(url(`${path}?t=${Date.now()}`), { method: 'HEAD', cache: 'no-store' });
    return response.ok;
  } catch {
    return false;
  }
}

// Writes one file through the server. Resolves { ok, path } or { ok: false, error }.
export async function saveFile(path, content) {
  try {
    const response = await fetch(url('api/save'), {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ path, content }),
    });
    return await response.json();
  } catch (error) {
    return { ok: false, error: `The Studio server didn't answer (${error.message}). Is it still running?` };
  }
}

// A fresh copy of a game module (cache-busted), e.g. after the Studio saved it.
export function importFresh(path) {
  return import(url(`${path}?t=${Date.now()}`).href);
}
