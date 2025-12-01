# 🎨 SoReL Logo Pack - Social Media Guide

## 📦 Logo Files Created

All logos are in `/app/nextjs-app/public/` directory

### 6 Logo Variations:

1. **logo-icon.svg** (200x200) - Icon only
2. **logo-full.svg** (600x200) - Horizontal with text
3. **logo-square.svg** (400x400) - Square format
4. **logo-banner.svg** (1200x400) - Wide banner
5. **logo-profile.svg** (500x500) - Profile picture
6. **logo-minimal.svg** (300x300) - Clean minimal

---

## 📱 Social Media Usage Guide

### Twitter/X
- **Profile Picture**: Use `logo-profile.svg` or `logo-square.svg`
- **Header Banner**: Use `logo-banner.svg`
- **Post Images**: Use `logo-square.svg` or `logo-full.svg`
- **Recommended Size**: 400x400 (profile), 1500x500 (banner)

### Instagram
- **Profile Picture**: Use `logo-profile.svg`
- **Posts**: Use `logo-square.svg`
- **Stories**: Use `logo-profile.svg` (centered)
- **Recommended Size**: 1080x1080

### Facebook
- **Profile Picture**: Use `logo-profile.svg`
- **Cover Photo**: Use `logo-banner.svg`
- **Post Images**: Use `logo-square.svg`
- **Recommended Size**: 180x180 (profile), 820x312 (cover)

### LinkedIn
- **Profile Picture**: Use `logo-profile.svg`
- **Banner**: Use `logo-banner.svg`
- **Post Images**: Use `logo-full.svg`
- **Recommended Size**: 400x400 (profile), 1584x396 (banner)

### Discord
- **Server Icon**: Use `logo-icon.svg` or `logo-minimal.svg`
- **Banner**: Use `logo-banner.svg`
- **Recommended Size**: 512x512 (icon)

### Telegram
- **Group Icon**: Use `logo-icon.svg`
- **Channel Cover**: Use `logo-square.svg`
- **Recommended Size**: 512x512

### YouTube
- **Channel Icon**: Use `logo-profile.svg`
- **Channel Banner**: Use `logo-banner.svg`
- **Thumbnail**: Use `logo-square.svg`
- **Recommended Size**: 800x800 (icon), 2560x1440 (banner)

---

## 🎨 Design Features

### Color Scheme
- **Primary**: Purple to Green gradient (#9945FF → #14F195)
- **Inspired by**: Solana brand colors
- **Meaning**: Trust, security, blockchain

### Symbol
- **Shield**: Represents trust and security
- **Checkmark**: Indicates verification and reputation
- **Clean Lines**: Modern, professional

### Typography
- **Main Font**: Space Grotesk (bold, modern)
- **Tagline Font**: Inter (clean, readable)

---

## 📐 Logo Specifications

### 1. Icon Only (logo-icon.svg)
```
Size: 200x200
Use for: App icons, favicons, small spaces
Format: SVG (scalable)
Background: Gradient with white shield
```

### 2. Full Logo (logo-full.svg)
```
Size: 600x200
Use for: Headers, footers, horizontal spaces
Format: SVG
Elements: Icon + "SoReL" text + tagline
```

### 3. Square Logo (logo-square.svg)
```
Size: 400x400
Use for: Social media posts, profile pictures
Format: SVG
Background: Full gradient
Text: Centered below icon
```

### 4. Banner (logo-banner.svg)
```
Size: 1200x400
Use for: Twitter header, YouTube banner, website hero
Format: SVG
Layout: Icon left, text right, gradient background
```

### 5. Profile Picture (logo-profile.svg)
```
Size: 500x500
Use for: Profile pictures on all platforms
Format: SVG
Design: Circular, prominent icon, text below
```

### 6. Minimal (logo-minimal.svg)
```
Size: 300x300
Use for: Clean, simple contexts
Format: SVG
Style: White background, gradient elements
```

---

## 🖼️ Converting SVG to PNG

### For High-Quality Images:

**Method 1: Using ImageMagick (Command Line)**
```bash
# Install ImageMagick
sudo apt-get install imagemagick

# Convert to PNG
convert logo-profile.svg -resize 1024x1024 logo-profile-1024.png
convert logo-square.svg -resize 1080x1080 logo-square-1080.png
convert logo-banner.svg -resize 1500x500 logo-banner-1500x500.png
```

**Method 2: Using Inkscape**
```bash
# Install Inkscape
sudo apt-get install inkscape

# Convert
inkscape logo-profile.svg --export-png=logo-profile.png --export-width=1024
```

**Method 3: Online Converters**
- CloudConvert: https://cloudconvert.com/svg-to-png
- SVG2PNG: https://svgtopng.com
- Convertio: https://convertio.co/svg-png/

---

## 📋 Quick Reference Table

| Platform | Logo File | Size | Format |
|----------|-----------|------|--------|
| Twitter Profile | logo-profile.svg | 400x400 | PNG |
| Twitter Banner | logo-banner.svg | 1500x500 | PNG |
| Instagram Profile | logo-profile.svg | 320x320 | PNG |
| Instagram Post | logo-square.svg | 1080x1080 | PNG |
| Facebook Profile | logo-profile.svg | 180x180 | PNG |
| Facebook Cover | logo-banner.svg | 820x312 | PNG |
| LinkedIn Profile | logo-profile.svg | 400x400 | PNG |
| LinkedIn Banner | logo-banner.svg | 1584x396 | PNG |
| Discord Server | logo-icon.svg | 512x512 | PNG |
| Telegram Group | logo-icon.svg | 512x512 | PNG |
| YouTube Channel | logo-profile.svg | 800x800 | PNG |
| YouTube Banner | logo-banner.svg | 2560x1440 | PNG |
| Website Favicon | logo-icon.svg | 32x32 | PNG/ICO |
| App Store | logo-profile.svg | 1024x1024 | PNG |

---

## 🎯 Usage Tips

### Do's ✅
- Use on colored backgrounds (logo has white elements)
- Maintain aspect ratios when resizing
- Use SVG format when possible (scalable)
- Keep clear space around logo (minimum 20px)
- Use original gradient colors

### Don'ts ❌
- Don't distort or stretch
- Don't change gradient colors
- Don't add drop shadows or effects
- Don't rotate or flip
- Don't use on busy backgrounds

---

## 🚀 Social Media Launch Kit

### Week 1: Profile Setup
1. Upload `logo-profile.svg` as profile picture (all platforms)
2. Upload `logo-banner.svg` as cover/banner
3. Ensure logo is visible and clear

### Week 2: Content Posts
Use `logo-square.svg` for:
- Product announcements
- Feature highlights
- Tutorial thumbnails
- Quote graphics

### Week 3: Engagement
Use `logo-full.svg` for:
- Blog post headers
- Email newsletters
- Partnership announcements

---

## 📁 File Locations

All logos are in:
```
/app/nextjs-app/public/
├── logo-icon.svg       (Icon only)
├── logo-full.svg       (Horizontal)
├── logo-square.svg     (Square)
├── logo-banner.svg     (Wide banner)
├── logo-profile.svg    (Profile pic)
└── logo-minimal.svg    (Minimal)
```

Access in browser:
```
http://localhost:3000/logo-profile.svg
http://localhost:3000/logo-square.svg
etc.
```

---

## 🎨 Customization

Want to modify logos? Edit the SVG files:
```bash
cd /app/nextjs-app/public/
nano logo-profile.svg
```

Change:
- Colors (stop-color values)
- Sizes (viewBox dimensions)
- Text (update text elements)
- Gradients (adjust gradient stops)

---

## 📊 Brand Guidelines

### Color Palette
```
Primary Gradient:
#9945FF (Purple) → #14F195 (Green)

Secondary:
#7928CA (Mid-purple)

Accent:
White (#FFFFFF)
Dark (#1A1A1A)
```

### Spacing
- Minimum clear space: 20px all sides
- Logo + text spacing: 15px

### Typography
- Primary: Space Grotesk Bold
- Secondary: Inter Regular
- Fallback: Arial, sans-serif

---

## 🌟 Sample Social Posts

### Launch Post Template
```
🚀 Introducing SoReL - Your Trust Layer on Solana!

✓ Wallet Reputation Scoring
✓ AI-Powered Risk Assessment  
✓ Real-time Fraud Detection
✓ Open Source & Transparent

Join the trust revolution 🛡️

[Use logo-square.svg as image]
```

### Feature Highlight
```
🤖 NEW: AI-Powered Wallet Analysis

Get instant insights powered by:
• Llama 3 & Mistral AI
• Real-time risk scoring
• Fraud detection
• Smart recommendations

Try it now! 👉 [link]

[Use logo-full.svg as banner]
```

---

## ✅ Checklist for Social Media

- [ ] Downloaded all logo files
- [ ] Converted SVG to PNG (for uploads)
- [ ] Uploaded profile pictures (all platforms)
- [ ] Uploaded banners/covers
- [ ] Created 5 posts with logo-square.svg
- [ ] Saved logo files to cloud storage
- [ ] Shared with team members
- [ ] Added to brand guidelines doc

---

## 🔗 Resources

- **SVG Editors**: Figma, Adobe Illustrator, Inkscape
- **PNG Converters**: CloudConvert, SVGOMG
- **Social Media Sizes**: https://sproutsocial.com/insights/social-media-image-sizes/

---

## 🎉 Ready to Launch!

Your SoReL logo pack is complete and ready for social media engagement!

All logos feature:
✅ Professional Solana-inspired design
✅ Trust & security symbolism
✅ Scalable vector format
✅ Multiple variations for all platforms
✅ Easy to customize

**Start building your brand presence today!** 🚀
