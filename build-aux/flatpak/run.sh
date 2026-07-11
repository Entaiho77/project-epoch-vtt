#!/bin/sh
# Launch Project Epoch VTT inside the Flatpak sandbox.
#
# zypak-wrapper is provided by org.electronjs.Electron2.BaseApp and replaces
# Chrome's built-in sandbox with a Flatpak-compatible one. This is required on
# ostree/immutable distros (Bazzite, Silverblue, Aurora) where unprivileged
# user namespaces are restricted — without it, Chromium's renderer crashes on
# startup. The base app also redirects /dev/shm to $XDG_RUNTIME_DIR so shared
# memory works correctly without --disable-dev-shm-usage.
exec zypak-wrapper /app/epoch-vtt/electron --app-path=/app/epoch-vtt/resources/app "$@"
