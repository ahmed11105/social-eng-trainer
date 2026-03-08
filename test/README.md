# Medium Difficulty Walkthrough — Cracking a SHA-256 Hash

This documents a complete playthrough of the OSINT Trainer game on **medium difficulty**, following the instructions from the "How to Play" modal.

## The Target Profile

- **Name:** Daisha
- **Username:** @ruth82
- **Bio:** ✨ Wittinghaven University 🔥 🎉 🦋
- **Location:** Reynoldsport
- **Joined:** August 2023
- **SHA-256 Hash:** `9ba1f093a4d4511a101c4b47955d2b5f2ae43bb990f7af3aeba5ffe38b705b00`

## Step 1: Gather Intel (OSINT)

I read through all the tweets and extracted key clue words:

| Clue | Source |
|------|--------|
| **Clinton** (pet name) | "Clinton got me through midterms" + "Clinton is demanding attention while I'm trying to study" |
| **2012** (adoption year) | "Got him 14 years ago in 2012" |
| **Reynoldsport** (location) | Profile location + "Reynoldsport dining hall food never disappoints" |
| **Daisha** (first name) | Profile display name |
| **Ruth** (possible name) | From username ruth82 |

## Step 2: Create words.txt

Based on the clues, I created a words file with one entry per line. I included both full and short year formats as taught in How to Play:

```
clinton
daisha
reynoldsport
ruth
2012
12
```

See: [words.txt](words.txt)

## Step 3: Save the Hash

Copied the SHA-256 hash from the game into `hash.txt`:

```
9ba1f093a4d4511a101c4b47955d2b5f2ae43bb990f7af3aeba5ffe38b705b00
```

See: [hash.txt](hash.txt)

## Step 4: Run the Python Cracker

Medium passwords have two transformations that make them impossible to crack with hashcat or online tools:

1. **Capitalization** — first letter of each word part is uppercase (numbers stay as-is)
2. **Separator** — a `_` or `-` is inserted near the middle of the *entire* string (not between the two parts)

This means the separator can land in unexpected spots. For example:
- `lunaseattle` → `Lunaseattle` → `Lunas_eattle`
- `brian26` → `Brian26` → `Bria_n26`

The Python script (`crack.py`) handles this by:
1. Building all two-word combinations from `words.txt`
2. Applying capitalization (splitting on numbers, capitalizing each word part)
3. Trying `_` and `-` at **every possible position** in the string
4. Hashing each candidate with SHA-256 and comparing to the target

```
$ python crack.py
CRACKED: 2012C_linton
```

See: [crack.py](crack.py)

### Understanding the Result

The password was built from the base `2012 + clinton`:
1. Combined: `2012clinton`
2. Capitalized: `2012Clinton` (splits on numbers → `""`, `"2012"`, `"clinton"` → capitalize "clinton" → `"Clinton"`)
3. Separator inserted at midpoint: `2012C_linton`

Notice how the `_` lands right in the middle of "Clinton" — not between "2012" and "Clinton". This is why you need the script!

## Step 5: Login

- **Username:** `ruth82` (no @, shown on the post-it note)
- **Password:** `2012C_linton` (copied exactly from the script output)

Login succeeded on the first try.

## Step 6: Complete the Round

After logging in, I needed to:

1. **Make a post** — Wrote "Just aced my finals! Time to celebrate 🎉"
2. **Delete sensitive tweets** — Removed tweets that revealed password clues:
   - ❌ "Clinton got me through midterms. Got him 14 years ago in 2012..." (reveals pet name + adoption year)
   - ❌ "Clinton is demanding attention while I'm trying to study." (reveals pet name)
   - ❌ "Reynoldsport dining hall food never disappoints." (reveals location)

## Result

- **Round completed** in 3 minutes 26 seconds
- **Progress:** 3/3 (Hash ✓, Login ✓, Cleanup ✓)
- **Leveled up** to Level 5 (+236 XP)

## Files in this folder

| File | Purpose |
|------|---------|
| `hash.txt` | The target SHA-256 hash copied from the game |
| `words.txt` | Clue words extracted from the profile (names, pet, location, years) |
| `crack.py` | Python script that tries all combinations with capitalization + separator |
| `README.md` | This walkthrough |
