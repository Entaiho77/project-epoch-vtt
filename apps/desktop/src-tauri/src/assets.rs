//! Image files (maps, token art) stored on disk instead of inside the save file.
//!
//! Each image is saved once under a name derived from its contents (SHA-256),
//! so the same image uploaded twice is stored once and a name never changes
//! meaning. The save file only holds a short reference like
//! `epoch-asset:3fa9…c2.png`; the renderer turns that into a URL served by the
//! `epoch-asset` protocol registered in main.rs.

use std::fs;
use std::path::{Path, PathBuf};

use base64::Engine;
use sha2::{Digest, Sha256};

/// Prefix for references stored in the save file. Platform-neutral on purpose:
/// the same game data may be opened on Windows, macOS or Linux, which each
/// spell custom-protocol URLs differently.
pub const REF_PREFIX: &str = "epoch-asset:";

/// Largest image we accept (matches the renderer's limit).
pub const MAX_BYTES: usize = 50 * 1024 * 1024;

pub struct Assets {
    dir: PathBuf,
}

/// File extension for a supported image MIME type.
fn ext_for_mime(mime: &str) -> Option<&'static str> {
    match mime.split(';').next().unwrap_or("").trim().to_ascii_lowercase().as_str() {
        "image/png" => Some("png"),
        "image/jpeg" | "image/jpg" => Some("jpg"),
        "image/webp" => Some("webp"),
        "image/gif" => Some("gif"),
        "image/avif" => Some("avif"),
        "image/bmp" => Some("bmp"),
        "image/svg+xml" => Some("svg"),
        _ => None,
    }
}

pub fn mime_for_name(name: &str) -> &'static str {
    match name.rsplit('.').next().unwrap_or("") {
        "png" => "image/png",
        "jpg" => "image/jpeg",
        "webp" => "image/webp",
        "gif" => "image/gif",
        "avif" => "image/avif",
        "bmp" => "image/bmp",
        "svg" => "image/svg+xml",
        _ => "application/octet-stream",
    }
}

/// Only `<64 hex chars>.<known ext>` is a valid asset name. This is what keeps
/// the protocol from ever serving anything outside the assets folder.
pub fn is_valid_name(name: &str) -> bool {
    let Some((hash, ext)) = name.split_once('.') else { return false };
    hash.len() == 64
        && hash.bytes().all(|b| b.is_ascii_digit() || (b'a'..=b'f').contains(&b))
        && matches!(ext, "png" | "jpg" | "webp" | "gif" | "avif" | "bmp" | "svg")
}

impl Assets {
    pub fn open(dir: &Path) -> std::io::Result<Self> {
        fs::create_dir_all(dir)?;
        Ok(Self { dir: dir.to_path_buf() })
    }

    /// Save image bytes (if not already saved) and return the reference to store.
    pub fn put(&self, bytes: &[u8], mime: &str) -> Result<String, String> {
        if bytes.is_empty() {
            return Err("That file is empty.".into());
        }
        if bytes.len() > MAX_BYTES {
            return Err("Image too large (max 50 MB).".into());
        }
        let ext = ext_for_mime(mime).ok_or_else(|| format!("Unsupported image type: {mime}"))?;
        let hash = Sha256::digest(bytes);
        let name = format!("{}.{ext}", hex(&hash));
        let path = self.dir.join(&name);
        if !path.exists() {
            // Write to a temp file then rename, so a crash mid-write never
            // leaves a truncated image under the final name.
            let tmp = self.dir.join(format!("{name}.part"));
            fs::write(&tmp, bytes).map_err(|e| e.to_string())?;
            fs::rename(&tmp, &path).map_err(|e| e.to_string())?;
        }
        Ok(format!("{REF_PREFIX}{name}"))
    }

    /// Read a stored image by name, for the protocol handler.
    pub fn read(&self, name: &str) -> Option<Vec<u8>> {
        if !is_valid_name(name) {
            return None;
        }
        fs::read(self.dir.join(name)).ok()
    }

    /// Convert a `data:image/...;base64,...` string (the old inline format)
    /// into a stored file. Returns None if it isn't one we can convert.
    pub fn put_data_url(&self, data_url: &str) -> Option<String> {
        let rest = data_url.strip_prefix("data:")?;
        let (meta, payload) = rest.split_once(',')?;
        let mime = meta.strip_suffix(";base64")?;
        let bytes = base64::engine::general_purpose::STANDARD.decode(payload.trim()).ok()?;
        self.put(&bytes, mime).ok()
    }
}

fn hex(bytes: &[u8]) -> String {
    bytes.iter().map(|b| format!("{b:02x}")).collect()
}

#[cfg(test)]
mod tests {
    use super::*;

    fn tmp() -> PathBuf {
        std::env::temp_dir().join(format!("epoch-assets-{}", uuid::Uuid::new_v4()))
    }

    #[test]
    fn same_bytes_same_reference_and_one_file() {
        let a = Assets::open(&tmp()).unwrap();
        let r1 = a.put(b"fake png bytes", "image/png").unwrap();
        let r2 = a.put(b"fake png bytes", "image/png").unwrap();
        assert_eq!(r1, r2);
        assert!(r1.starts_with(REF_PREFIX) && r1.ends_with(".png"));
        assert_eq!(fs::read_dir(&a.dir).unwrap().count(), 1);
        let name = r1.strip_prefix(REF_PREFIX).unwrap();
        assert_eq!(a.read(name).unwrap(), b"fake png bytes");
    }

    #[test]
    fn rejects_unsafe_names() {
        let a = Assets::open(&tmp()).unwrap();
        assert!(a.read("../epoch.db").is_none());
        assert!(a.read("..\\epoch.db").is_none());
        assert!(a.read(&format!("{}.exe", "a".repeat(64))).is_none());
        assert!(a.read(&format!("{}.png", "G".repeat(64))).is_none());
    }

    #[test]
    fn rejects_non_images_and_empty() {
        let a = Assets::open(&tmp()).unwrap();
        assert!(a.put(b"x", "application/pdf").is_err());
        assert!(a.put(b"", "image/png").is_err());
    }

    #[test]
    fn converts_data_urls() {
        let a = Assets::open(&tmp()).unwrap();
        let b64 = base64::engine::general_purpose::STANDARD.encode(b"jpeg!");
        let r = a.put_data_url(&format!("data:image/jpeg;base64,{b64}")).unwrap();
        assert!(r.ends_with(".jpg"));
        assert_eq!(a.read(r.strip_prefix(REF_PREFIX).unwrap()).unwrap(), b"jpeg!");
        assert!(a.put_data_url("https://example.com/x.png").is_none());
    }
}
