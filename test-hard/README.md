# Hard Difficulty Walkthrough — Cracking a SHA-256 Hash with Leetspeak & Special Chars

This documents a complete playthrough of the OSINT Trainer game on **hard difficulty**, following the instructions from the "How to Play" modal.

## The Target Profile

- **Name:** Kendra
- **Username:** @kendra.herzog24
- **Bio:** Real Estate Agent. Parent. Fort Rebeca. Tired always.
- **Location:** Konopelskiboro
- **Joined:** July 2025
- **SHA-256 Hash:** `6c2598b257a9746ff9c512c9da0e61f976a3a6385043cd1a23f6872709773225`

## Step 1: Gather Intel (OSINT)

| Clue | Source |
|------|--------|
| **Bradford** (pet name) | "Bradford has been part of our family for 16 years" + "Caught my kid and Bradford playing" |
| **2010** (adoption year) | "Got him back in 2010 right after we moved" |
| **Konopelskiboro** (location) | Profile location + "Konopelskiboro parks are amazing" |
| **Kendra** (first name) | Profile display name |
| **Herzog** (last name?) | From username kendra.herzog24 |
| **Rebeca** / **Fort Rebeca** | From bio |

### What's NOT in the tweets (hard mode hides clues!)

The password turned out to use **birth year (1988 / short: 88)** — there was NO direct mention of age or birth year in the tweets. This is what makes hard mode hard: you need to estimate and brute-force some values.

**Reasoning:** She's a parent of a 4-year-old and a working real estate agent, so likely aged 28-45 → born 1981-1998. I added birth years from 1980-2000 to cover a wide range.

## Step 2: Create words.txt

First attempt (failed — only obvious clues):
```
bradford
kendra
konopelskiboro
2010
10
```

Second attempt (expanded with birth year estimates):
```
bradford
kendra
konopelskiboro
herzog
rebeca
fortrebeca
2010
10
2022
22
1980
80
... (all years from 1980-2000, both full and short)
```

See: [words.txt](words.txt)

## Step 3: Save the Hash

```
6c2598b257a9746ff9c512c9da0e61f976a3a6385043cd1a23f6872709773225
```

See: [hash.txt](hash.txt)

## Step 4: Write & Run the Python Cracker

The How to Play recommends **hashcat with rules** (e.g., `best64.rule`) for hard mode. Since hashcat wasn't available on this machine, I wrote a Python script that replicates what hashcat rules would do:

### Hard Mode Transformations (from the code)

1. **Capitalize** — first letter of each word part (split on numbers)
2. **Special char at end** — always one of: `!`, `@`, `#`, `$`, `*`
3. **Then EITHER:**
   - **Leetspeak** — replace some letters: a→4, e→3, i→1, o→0, s→5, t→7
   - **OR Separator** — insert `_`, `-`, or `.` near the middle

### The Script

The script (`crack.py`) handles all of this by:
1. Building all two-word combinations from `words.txt`
2. Applying capitalization
3. For each of the 5 special chars:
   - Trying all possible leetspeak combinations (2^n where n = number of leet-eligible letters)
   - Trying all 3 separators at every position

### First Run (5 clue words — FAILED)

```
$ py crack.py
Trying 20 base combinations...
Not cracked after 4990 attempts. Add more words to words.txt
```

### Second Run (expanded with birth year estimates — SUCCESS)

```
$ py crack.py
Trying 2652 base combinations...
CRACKED: 88Bra.dford$
```

See: [crack.py](crack.py)

## Understanding the Result: `88Bra.dford$`

The password was built from base `88` (birth year short) + `bradford` (pet name):

1. **Combined:** `88bradford`
2. **Capitalized:** `88Bradford` (split on numbers → `""`, `"88"`, `"bradford"` → capitalize "bradford")
3. **Special char:** `$` added at end → `88Bradford$`
4. **Separator path** (not leetspeak): `.` inserted at midpoint → `88Bra.dford$`

The `.` lands right in the middle of "Bradford" — just like medium mode, the separator doesn't respect word boundaries.

## Step 5: Login

- **Username:** `kendra.herzog24` (no @, shown on the post-it note)
- **Password:** `88Bra.dford$` (copied exactly from script output)

Login succeeded on the first try.

## Step 6: Complete the Round

1. **Made a post:** "Another successful open house today! This market is on fire 🏠🔥"
2. **Deleted sensitive tweets:**
   - ❌ "Bradford has been part of our family for 16 years now. Got him back in 2010..." (pet name + adoption year)
   - ❌ "Caught my kid and Bradford playing in the backyard." (pet name)
   - ❌ "Konopelskiboro parks are amazing. Love this town." (location)

## Result

- **Round completed** in 3 minutes 6 seconds (new record!)
- **Progress:** 3/3 (Hash ✓, Login ✓, Cleanup ✓)
- **Win streak:** 2
- **Leveled up** to Level 6 (+347 XP)

## Key Lesson: Hard Mode Requires Guessing

Unlike easy (all clues visible, simple passwords) or medium (clues visible, just need the Python script), hard mode:
- **Hides some clues** — birth year was never mentioned in tweets
- **Adds leetspeak OR separators** — doubles the search space
- **Always adds special chars** — 5 possible endings to try
- **Requires estimating values** — you need to guess age ranges and add many birth years to your word list

The How to Play recommends hashcat with rules (`best64.rule`) which would handle the leetspeak/special char mutations automatically. The Python script approach works too but requires you to code the transformations yourself.

## Files in this folder

| File | Purpose |
|------|---------|
| `hash.txt` | The target SHA-256 hash copied from the game |
| `words.txt` | Clue words + estimated birth years (1980-2000) |
| `crack.py` | Python script handling capitalize + special chars + leetspeak + separators |
| `README.md` | This walkthrough |
