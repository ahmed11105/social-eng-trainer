# 🕵️ Social Engineering Training Simulator

A realistic Twitter/X clone for practicing OSINT (Open Source Intelligence) and password cracking techniques.

## 🎯 Your Mission

**Crack the password and gain authenticated access!**

The profile belongs to **Marcus Rivera (@marcus_shoots)**, a photographer from Miami. Hidden in his bio, tweets, and profile are clues that will help you discover his password.

## 🚀 Quick Start

### 1. Install Dependencies
```bash
npm install
```

### 2. Start the Development Server
```bash
npm run dev
```

Then open http://localhost:3000 in your browser.

### 3. Analyze the Profile

Look at Marcus's profile carefully:
- Read his bio
- Check his tweets
- Note dates, names, locations, interests
- Look for patterns

### 4. Build Your Wordlist

Based on the clues, create a wordlist with possible passwords. Common patterns:
- `petname + year`
- `name + date`
- `location + number`
- `hobby + year`

Example wordlist (`wordlist.txt`):
```
marcus1995
atlas
miami2015
photography
atlas2015
marcus
```

### 5. Get the Hash

Visit http://localhost:3000/login

You'll see the target MD5 hash displayed on the login page.

### 6. Crack with Hashcat

```bash
# Save the hash to a file
echo "HASH_FROM_LOGIN_PAGE" > hash.txt

# Run hashcat with your wordlist
hashcat -m 0 -a 0 hash.txt wordlist.txt --potfile-disable --quiet

# If successful, you'll see:
# HASH:PASSWORD
```

### 7. Login

Enter the cracked credentials:
- **Username:** `marcus_shoots`
- **Password:** `[what you cracked]`

### 8. Authenticated Access! 🎉

Once logged in, you can:
- ✅ Add new tweets
- ✅ Delete tweets
- ✅ See the "Logout" button

## 📚 What You'll Learn

- **OSINT Techniques:** Gathering intelligence from public profiles
- **Password Patterns:** How humans create weak passwords
- **Dictionary Attacks:** Using hashcat for password cracking
- **Social Engineering:** Why personal information is dangerous

## 🔐 Technical Details

- **Framework:** Next.js 15 + TypeScript
- **Styling:** Tailwind CSS
- **Hashing:** MD5 (intentionally weak for educational purposes)
- **Auth:** Client-side localStorage (demo only, not production-grade)

## ⚠️ Educational Use Only

This is a training simulator for learning security concepts. The techniques demonstrated should only be used:
- On systems you own
- In authorized penetration tests
- For educational purposes
- In controlled environments

**Never attempt to crack real passwords or access systems without authorization!**

## 🎬 Perfect for Mr. Robot-Style Training

This simulator demonstrates the same techniques you've learned for your film research:
1. Intelligence gathering (OSINT)
2. Pattern recognition
3. Dictionary attacks with hashcat
4. Social engineering concepts

## 🛠️ Development

```bash
# Run development server
npm run dev

# Build for production
npm run build

# Start production server
npm start
```

## 📝 Hints

**Stuck?** Here are some hints (no spoilers!):

<details>
<summary>Hint 1: Where to look</summary>
Check the tweets carefully - especially ones about Atlas!
</details>

<details>
<summary>Hint 2: Important dates</summary>
Look for years mentioned in tweets, especially related to adoption or account creation.
</details>

<details>
<summary>Hint 3: Common pattern</summary>
People often use: `pet_name + important_year`
</details>

---

**Good luck, and happy hacking! 🔐**
