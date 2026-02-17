# Deploy to Bluehost (getbeseen.com) via Terminal

## Where credentials live in this project

| Script | Site | Host / User / Path |
|--------|------|--------------------|
| **deploy-no-assets.sh** | **getbeseen.com** (main) | `ftp.getbeseen.com`, `FTP_USER` (set below), `/public_html/` |
| deploy-staging-ftp.sh | staging.beseensignshop.com | ftp.beseensignshop.com, bezcursor@staging... |
| deploy-dist.sh / quick-upload.sh | shop.getbeseen.com | beseensignshop.com, shop path |

For **getbeseen.com** (this project), use **deploy-no-assets.sh**.

---

## One-time setup

1. **Install lftp** (if you don’t have it):
   ```bash
   brew install lftp
   ```

2. **Set your Bluehost FTP username** (one of these):

   **Option A – in the script**  
   Edit `production stuff/build/deploy-no-assets.sh` and set:
   ```bash
   FTP_USER="yourusername@getbeseen.com"
   ```
   (Bluehost often uses `cpanelusername@getbeseen.com` or similar.)

   **Option B – in a .env file (recommended, not committed)**  
   In `production stuff/` create a file named `.env` (copy from `.env copy.example` if you like) and add:
   ```
   FTP_HOST=ftp.getbeseen.com
   FTP_USER=yourusername@getbeseen.com
   FTP_PATH=/public_html/
   ```
   The deploy script will use these if the file exists.

3. **Confirm the path on Bluehost**  
   In Cyberduck, note the remote folder that is your site root. It’s often `/public_html/` or `/home1/youruser/public_html/`. Set `FTP_PATH` in the script or `.env` to that path.

---

## Deploy (code only – no assets)

From the **project root** (realestate1-clone):

```bash
cd "production stuff"
node build/build.js
cd build
./deploy-no-assets.sh
```

Or from **production stuff/build/** after you’ve already run the build:

```bash
./deploy-no-assets.sh
```

- You’ll be prompted for your **FTP password** (unless you set it in `.env`; keep `.env` out of git).
- The script uploads the **contents of `generated/`** to the server **except** the `assets/` folder (faster, good for HTML/includes/data changes).

---

## Full deploy (code + assets)

1. Create deployment folders (from project root):
   ```bash
   cd "/path/to/realestate1-clone"
   rm -rf smart_deployment
   mkdir -p smart_deployment/code_only smart_deployment/assets_only
   rsync -av --exclude 'assets' generated/ smart_deployment/code_only/
   rsync -av generated/assets/ smart_deployment/assets_only/
   ```

2. Upload via Cyberduck (or lftp):
   - **code_only** contents → server **root** (same as `/public_html/` or whatever you use).
   - **assets_only** contents → server **/assets/** folder.

There is no single script in the repo that does full FTP deploy for getbeseen.com; the terminal option is **deploy-no-assets.sh** (code only). For full deploy with assets, use the steps above and Cyberduck or your own lftp commands.

---

## Security note

- **quick-upload.sh** (for shop.getbeseen.com) contains a **plaintext FTP password**. Do not commit real passwords. Prefer:
  - Prompt: `read -s FTP_PASS` in the script, or  
  - Loading from a local `.env` that is in `.gitignore`.
- Use a strong, unique FTP password and change it if it was ever committed.
