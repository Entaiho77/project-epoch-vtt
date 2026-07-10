import { useRef, useState } from 'react';
import { prepareTokenImage } from '../../data/images';

/**
 * Reusable round token-art control: shows the current image (circular) and lets the user
 * pick a file → upload to Storage → report the URL back. Used for bestiary creatures,
 * saved creatures, and characters. Presentation matches the round board tokens.
 */
export function TokenArtUpload({
  scope,
  imageUrl,
  onChange,
  onClear,
  label = 'token art',
  size = 56,
}: {
  /** Storage path segment so uploads don't collide (uid, creatureId, …). */
  scope: string;
  imageUrl?: string;
  onChange: (url: string) => void | Promise<void>;
  onClear?: () => void;
  label?: string;
  size?: number;
}) {
  const inputRef = useRef<HTMLInputElement | null>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function onFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    e.target.value = ''; // allow re-picking the same file
    if (!file) return;
    setBusy(true);
    setError(null);
    try {
      const url = await prepareTokenImage(scope, file);
      await onChange(url);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Upload failed.');
    } finally {
      setBusy(false);
    }
  }

  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)' }}>
      <div
        style={{
          width: size,
          height: size,
          borderRadius: '50%',
          flexShrink: 0,
          overflow: 'hidden',
          border: '1px solid var(--border-hairline)',
          background: 'var(--surface-raised)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: 'var(--text-muted)',
          fontSize: 'var(--text-xs)',
        }}
      >
        {imageUrl ? (
          <img
            src={imageUrl}
            alt={label}
            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
          />
        ) : (
          'None'
        )}
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-1)', minWidth: 0 }}>
        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          onChange={onFile}
          disabled={busy}
          style={{ display: 'none' }}
        />
        <div style={{ display: 'flex', gap: 'var(--space-2)', flexWrap: 'wrap' }}>
          <button
            type="button"
            className="" /* uses inherited button reset; styled inline to match ghost buttons */
            onClick={() => inputRef.current?.click()}
            disabled={busy}
            style={{
              fontSize: 'var(--text-xs)',
              padding: '4px 8px',
              borderRadius: 'var(--radius-sm)',
              border: '1px solid var(--border-hairline)',
              background: 'transparent',
              color: 'var(--text-primary)',
              cursor: busy ? 'default' : 'pointer',
            }}
          >
            {busy ? 'Uploading…' : imageUrl ? `Replace ${label}` : `Upload ${label}`}
          </button>
          {imageUrl && onClear && (
            <button
              type="button"
              onClick={onClear}
              disabled={busy}
              style={{
                fontSize: 'var(--text-xs)',
                padding: '4px 8px',
                borderRadius: 'var(--radius-sm)',
                border: '1px solid var(--border-hairline)',
                background: 'transparent',
                color: 'var(--text-muted)',
                cursor: 'pointer',
              }}
            >
              Remove
            </button>
          )}
        </div>
        {error && <span style={{ color: 'var(--accent-red)', fontSize: 'var(--text-xs)' }}>{error}</span>}
      </div>
    </div>
  );
}
