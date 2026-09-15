# Obsidian, its CLI, and the obsidian-skills plugin

The moving skills (`vault-promote`, `vault-tidy`, `vault-project close`) move notes only through the
Obsidian CLI, which updates wikilinks. It needs Obsidian **1.12.7 or later, running**, with its CLI
registered ([Obsidian CLI](https://obsidian.md/help/cli)).

## 1. Install Obsidian

- **Linux:** the Flatpak (`flatpak install flathub md.obsidian.Obsidian`) or the AppImage from
  obsidian.md. Check: `flatpak list | grep -i obsidian` shows the version.
- **Windows:** the installer from obsidian.md. Check: Obsidian → Settings → About shows the version.

## 2. Open the vault

Obsidian → Open folder as vault → the `vault/` folder (not the owner folder, not `vault-files/`).

## 3. Settings that the skills rely on

Settings → Files and links:
- **Automatically update internal links: on** (the CLI's moves rewrite links only with this on);
- **Use [[Wikilinks]]: on**; **New link format: shortest path when possible**;
- **Default location for new attachments:** a folder the owner never uses for binaries, as binaries
  belong in `vault-files/`.

Settings → Core plugins: **Templates** on, template folder `X/Templates`.

## 4. Register the CLI

Settings → General → **Command line interface → Register**.
- **Linux:** registration places `obsidian` in `~/.local/bin/`; that folder must be on `PATH`. With the
  Flatpak build, whether registration reaches outside the sandbox is **UNVERIFIED**; if `obsidian`
  is not found afterwards, use the AppImage.
- **Windows:** registration adds the `Obsidian.com` terminal redirector; open a new terminal.

Check, with Obsidian running: `obsidian version` prints a version.

## 5. Install the obsidian-skills plugin (for the user, never into the vault)

The plugin by Obsidian's CEO (MIT) provides `obsidian-markdown`, `obsidian-bases`, `obsidian-cli` and
more ([kepano/obsidian-skills](https://github.com/kepano/obsidian-skills)). Its README suggests copying
it into the vault; **do not**: skills never live in a vault.

- **Claude Code:** `/plugin marketplace add kepano/obsidian-skills`, then
  `/plugin install obsidian@obsidian-skills`.
- **opencode:** clone the repository somewhere outside the vault, then copy each of its
  `skills/<name>/` folders into the user's global skills folder (`~/.config/opencode/skills/<name>/`),
  so each `SKILL.md` sits one level down as opencode expects. **UNVERIFIED** on the pinned opencode.

## 6. Ignore Obsidian's per-machine files in sync

See [`sync.md`](sync.md): `.obsidian/workspace*.json` must not sync between machines.
