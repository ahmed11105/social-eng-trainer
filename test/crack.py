import hashlib, sys, re

# Load your target hash
target = open("hash.txt").read().strip()

# Load clue words (names, pets, locations, years)
words = open("words.txt").read().strip().split("\n")

def capitalize(pw):
    # Split on numbers, capitalize first letter of each word part
    # e.g. "luna2020" -> "Luna2020", "2020luna" -> "2020Luna"
    parts = re.split(r'(\d+)', pw)
    result = ""
    for part in parts:
        if part.isdigit() or len(part) == 0:
            result += part
        else:
            result += part[0].upper() + part[1:]
    return result

# Build all two-part combinations
bases = []
for a in words:
    for b in words:
        if a != b:
            bases.append(a.lower() + b.lower())

# Try each base with capitalization + separator
for base in bases:
    cap = capitalize(base)
    for sep in ["_", "-"]:
        for i in range(1, len(cap)):
            candidate = cap[:i] + sep + cap[i:]
            h = hashlib.sha256(candidate.encode()).hexdigest()
            if h == target:
                print(f"CRACKED: {candidate}")
                sys.exit(0)

print("Not cracked - add more words to words.txt")
